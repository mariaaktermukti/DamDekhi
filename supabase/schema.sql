-- ====================================================================
-- দামদেখি (DamDekhi) - Supabase Database Schema
-- Project: https://supabase.com/dashboard/project/pcjzpdopjmgjtvaqpedw
-- Description: বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের সরকারি ও স্থানীয় বাজারদর প্ল্যাটফর্ম
-- Features: Anti-Fake Crowdsourcing, Outlier Detection, Consensus Averaging,
--           Receipt Storage, Contributor Reputation, Supabase Auth & RLS
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table (কন্ট্রিবিউটর প্রোফাইল ও পয়েন্ট সিস্টেম)
-- Linked to Supabase Auth auth.users
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT,
    full_name TEXT DEFAULT 'সচেতন নাগরিক',
    avatar_url TEXT,
    reputation_points INT DEFAULT 10,
    badge TEXT DEFAULT 'নতুন রিপোর্টার' CHECK (badge IN ('নতুন রিপোর্টার', 'সচেতন নাগরিক', 'বিশ্বস্ত রিপোর্টার', 'বাজার প্রতিনিধি')),
    total_reports INT DEFAULT 0,
    verified_reports INT DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create profile on auth.users sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, phone, full_name, avatar_url, reputation_points, badge)
    VALUES (
        NEW.id,
        NEW.phone,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'সচেতন নাগরিক'),
        NEW.raw_user_meta_data->>'avatar_url',
        10,
        'নতুন রিপোর্টার'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Categories Table (পণ্যের ক্যাটাগরি)
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Markets / Bazaars Table (বাজার ও এলাকা)
CREATE TABLE IF NOT EXISTS markets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    district TEXT NOT NULL DEFAULT 'ঢাকা',
    area TEXT NOT NULL,
    market_type TEXT DEFAULT 'retail' CHECK (market_type IN ('wholesale', 'retail', 'superstore', 'online')),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Products Table (পণ্যসমূহ)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT '১ কেজি',
    pack_size TEXT,
    is_govt_monitored BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Government Daily Prices Table (কৃষি বিপণন অধিদপ্তর DAM ও সরকারি মূল্যতালিকা)
CREATE TABLE IF NOT EXISTS govt_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    farmer_price NUMERIC(10, 2),
    wholesale_price NUMERIC(10, 2),
    retail_price NUMERIC(10, 2),
    source_name TEXT DEFAULT 'কৃষি বিপণন অধিদপ্তর (DAM)',
    circular_no TEXT,
    effective_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. User Crowdsourced Price Reports (যাচাইকরণ, আউটলায়ার ও ঐক্যমত্য সিস্টেম)
CREATE TABLE IF NOT EXISTS price_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    market_id UUID REFERENCES markets(id) ON DELETE SET NULL,
    shop_name TEXT NOT NULL,
    reported_price NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL,
    user_name TEXT DEFAULT 'সচেতন ক্রেতা',
    user_phone TEXT,
    receipt_image_url TEXT,
    notes TEXT,
    -- Statuses: pending, verified, rejected, flagged
    status TEXT DEFAULT 'pending' CHECK (status IN ('verified', 'pending', 'rejected', 'flagged')),
    flag_reason TEXT,
    consensus_count INT DEFAULT 1,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Shop & Market Live Prices Table (দোকান ও বাজারভিত্তিক বর্তমান দাম)
CREATE TABLE IF NOT EXISTS shop_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    market_id UUID REFERENCES markets(id) ON DELETE SET NULL,
    shop_name TEXT NOT NULL,
    shop_type TEXT DEFAULT 'মুদি দোকান' CHECK (shop_type IN ('কাঁচাবাজার', 'মুদি দোকান', 'সুপারশপ', 'অনলাইন', 'ডিলার পয়েন্ট')),
    price NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT '১ কেজি',
    condition_notes TEXT,
    verified_status TEXT DEFAULT 'community_verified' CHECK (verified_status IN ('govt', 'receipt_verified', 'community_verified', 'pending')),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Automated Outlier Detection & Consensus Verification Trigger
CREATE OR REPLACE FUNCTION public.check_report_outlier_and_consensus()
RETURNS TRIGGER AS $$
DECLARE
    v_govt_price NUMERIC(10, 2);
    v_matching_reports_count INT;
    v_avg_reported_price NUMERIC(10, 2);
BEGIN
    -- ১. আউটলায়ার ডিটেকশন (Outlier Detection: সরকারি মূল্যের চেয়ে ৫০%+ বেশি বা কম)
    SELECT retail_price INTO v_govt_price
    FROM govt_prices
    WHERE product_id = NEW.product_id
    ORDER BY date DESC LIMIT 1;

    IF v_govt_price IS NOT NULL AND v_govt_price > 0 THEN
        IF NEW.reported_price > (v_govt_price * 1.50) THEN
            NEW.status := 'flagged';
            NEW.flag_reason := 'সরকারি দামের চেয়ে ৫০%+ অস্বাভাবিক বেশি (এডমিন রিভিউ প্রয়োজন)';
            RETURN NEW;
        ELSIF NEW.reported_price < (v_govt_price * 0.50) THEN
            NEW.status := 'flagged';
            NEW.flag_reason := 'সরকারি দামের চেয়ে ৫০%+ অস্বাভাবিক কম (ভুল রিপোর্টের আশঙ্কা)';
            RETURN NEW;
        END IF;
    END IF;

    -- ২. একাধিক রিপোর্টের গড় ও ঐক্যমত্য (Consensus Verification: কমপক্ষে ৩টি রিপোর্ট)
    -- একই পণ্য ও বাজারের কাছাকাছি দাম (±১০%) চেক করা
    SELECT COUNT(*), AVG(reported_price)
    INTO v_matching_reports_count, v_avg_reported_price
    FROM price_reports
    WHERE product_id = NEW.product_id
      AND (market_id = NEW.market_id OR market_id IS NULL)
      AND status IN ('pending', 'verified')
      AND reported_price BETWEEN (NEW.reported_price * 0.90) AND (NEW.reported_price * 1.10)
      AND created_at >= NOW() - INTERVAL '7 days';

    -- যদি এই রিপোর্ট সহ ৩ বা ততোধিক রিপোর্ট মিলে যায়
    IF (v_matching_reports_count + 1) >= 3 THEN
        NEW.status := 'verified';
        NEW.consensus_count := v_matching_reports_count + 1;

        -- ইউজার যদি লগইন করা থাকে তবে রেপুটেশন পয়েন্ট বাড়িয়ে দেওয়া
        IF NEW.user_id IS NOT NULL THEN
            UPDATE profiles
            SET reputation_points = reputation_points + 10,
                verified_reports = verified_reports + 1,
                badge = CASE
                    WHEN (reputation_points + 10) >= 50 THEN 'বিশ্বস্ত রিপোর্টার'
                    WHEN (reputation_points + 10) >= 20 THEN 'সচেতন নাগরিক'
                    ELSE badge
                END
            WHERE id = NEW.user_id;
        END IF;
    ELSE
        -- রশিদের ছবি থাকলে দ্রুত রিভিউ এর জন্য pending হিসেবে রাখা
        IF NEW.status IS NULL OR NEW.status = '' THEN
            NEW.status := 'pending';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_check_report ON price_reports;
CREATE TRIGGER trigger_check_report
    BEFORE INSERT ON price_reports
    FOR EACH ROW EXECUTE FUNCTION public.check_report_outlier_and_consensus();

-- 10. Supabase Storage Bucket for Receipts (রসিদের ছবি আপলোড)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Anyone can read receipt images
CREATE POLICY "Public Receipt Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'receipts');

-- Storage Policy: Authenticated & Anonymous can upload receipt images
CREATE POLICY "Allow Receipt Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'receipts');

-- 11. Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE govt_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Public can read profile badges/points; Users can only update their own profile
CREATE POLICY "Public profiles read" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories, Markets, Products, Govt Prices: Public Read
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public markets read" ON markets FOR SELECT USING (true);
CREATE POLICY "Public products read" ON products FOR SELECT USING (true);
CREATE POLICY "Public govt_prices read" ON govt_prices FOR SELECT USING (true);
CREATE POLICY "Public shop_prices read" ON shop_prices FOR SELECT USING (true);

-- Price Reports RLS:
-- 1) Anyone can read verified or pending reports
CREATE POLICY "Public read reports" ON price_reports
    FOR SELECT USING (status IN ('verified', 'pending') OR auth.uid() = user_id);

-- 2) Logged-in or Anonymous can insert reports
CREATE POLICY "Allow report submission" ON price_reports
    FOR INSERT WITH CHECK (true);

-- 3) Users can only edit or delete their own reports while pending
CREATE POLICY "Users edit own pending reports" ON price_reports
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users delete own pending reports" ON price_reports
    FOR DELETE USING (auth.uid() = user_id AND status = 'pending');

-- 12. Seed Data
INSERT INTO categories (slug, name_bn, name_en, icon, description, display_order) VALUES
('vegetables', 'শাকসবজি', 'Vegetables', 'Carrot', 'দৈনন্দিন তরকারি ও আলু, পেঁয়াজ, কাঁচামরিচ', 1),
('rice-pulses', 'চাল ও ডাল', 'Rice & Pulses', 'Wheat', 'নাজিরশাইল, মিনিকেট, আটাশ, মসুর ডাল', 2),
('oil-spices', 'তেল ও মসলা', 'Oil & Spices', 'Flame', 'সয়াবিন তেল, সরিষার তেল, হলুদ, মরিচ ও আদা-রসুন', 3),
('groceries', 'মুদি পণ্য', 'Groceries', 'ShoppingBag', 'চিনি, লবণ, আটা, ময়দা, চা পাতা', 4),
('toiletries', 'সাবান ও শ্যাম্পু', 'Toiletries', 'Sparkles', 'গায়ে মাখার সাবান, কাপড় কাচার গুঁড়া, টুথপেস্ট', 5),
('gas-fuel', 'গ্যাস ও জ্বালানি', 'Gas & Fuel', 'Cylinder', '১২ কেজি এলপিজি সিলিন্ডার ও জ্বালানি কাঠ', 6),
('meat-fish', 'মাছ ও মাংস', 'Meat & Fish', 'Fish', 'ব্রয়লার মুরগি, সোনালি, গরুর মাংস, রুই, তেলাপিয়া', 7),
('eggs-dairy', 'ডিম ও দুধ', 'Eggs & Dairy', 'Egg', 'ফার্মের লাল ডিম, দেশি ডিম, তরল দুধ', 8)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO markets (name_bn, name_en, district, area, market_type) VALUES
('কারওয়ান বাজার', 'Karwan Bazar', 'ঢাকা', 'তেজগাঁও', 'wholesale'),
('মিরপুর ১ কাঁচাবাজার', 'Mirpur 1 Bazar', 'ঢাকা', 'মিরপুর', 'retail'),
('মোহাম্মদপুর টাউন হল মার্কেট', 'Mohammadpur Town Hall', 'ঢাকা', 'মোহাম্মদপুর', 'retail'),
('যাত্রাবাড়ী আড়ৎ', 'Jatrabari Arat', 'ঢাকা', 'যাত্রাবাড়ী', 'wholesale'),
('স্বপ্ন সুপারশপ (ধানমন্ডি)', 'Shwapno Dhanmondi', 'ঢাকা', 'ধানমন্ডি', 'superstore'),
('খাতুনগঞ্জ পাইকারি বাজার', 'Khatunganj', 'চট্টগ্রাম', 'কোতোয়ালী', 'wholesale'),
('সাহেব বাজার', 'Shaheb Bazar', 'রাজশাহী', 'বোয়ালিয়া', 'retail')
ON CONFLICT DO NOTHING;
