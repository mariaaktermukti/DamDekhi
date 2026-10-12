-- ====================================================================
-- দামদেখি (DamDekhi) - Supabase Database Schema
-- Project: https://supabase.com/dashboard/project/pcjzpdopjmgjtvaqpedw
-- Description: বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের সরকারি ও স্থানীয় বাজারদর প্ল্যাটফর্ম
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Categories Table (পণ্যের ক্যাটাগরি)
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

-- 3. Markets / Bazaars Table (বাজার ও এলাকা)
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

-- 4. Products Table (পণ্যসমূহ)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name_bn TEXT NOT NULL,
    name_en TEXT NOT NULL,
    unit TEXT NOT NULL DEFAULT '১ কেজি', -- যেমন: ১ কেজি, ১ লিটার, ১ ডজন, ১২ কেজি সিলিন্ডার, ১ প্যাকেট
    pack_size TEXT,
    is_govt_monitored BOOLEAN DEFAULT FALSE, -- কৃষি বিপণন অধিদপ্তর (DAM) তালিকাভুক্ত কি না
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Government Daily Prices Table (কৃষি বিপণন অধিদপ্তর DAM ও সরকারি মূল্যতালিকা)
CREATE TABLE IF NOT EXISTS govt_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    farmer_price NUMERIC(10, 2),     -- কৃষকপ্রাপ্ত মূল্য (টাকা)
    wholesale_price NUMERIC(10, 2),  -- পাইকারি মূল্য (টাকা)
    retail_price NUMERIC(10, 2),     -- সরকারি নির্ধারিত/সংগৃহীত খুচরা মূল্য (টাকা)
    source_name TEXT DEFAULT 'কৃষি বিপণন অধিদপ্তর (DAM)',
    circular_no TEXT,
    effective_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Shop & Market Live Prices Table (দোকান ও বাজারভিত্তিক বর্তমান দাম)
CREATE TABLE IF NOT EXISTS shop_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    market_id UUID REFERENCES markets(id) ON DELETE SET NULL,
    shop_name TEXT NOT NULL,
    shop_type TEXT DEFAULT 'মুদি দোকান' CHECK (shop_type IN ('কাঁচাবাজার', 'মুদি দোকান', 'সুপারশপ', 'অনলাইন', 'ডিলার পয়েন্ট')),
    price NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL DEFAULT '১ কেজি',
    condition_notes TEXT, -- যেমন: 'খোলা', 'ব্র্যান্ডেড বোতল', '১ম গ্রেড'
    verified_status TEXT DEFAULT 'community_verified' CHECK (verified_status IN ('govt', 'receipt_verified', 'community_verified', 'pending')),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. User Crowdsourced Price Reports (ব্যবহারকারীদের জমা দেওয়া দাম ও রসিদ)
CREATE TABLE IF NOT EXISTS price_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    market_id UUID REFERENCES markets(id) ON DELETE SET NULL,
    shop_name TEXT NOT NULL,
    reported_price NUMERIC(10, 2) NOT NULL,
    unit TEXT NOT NULL,
    user_name TEXT DEFAULT 'সচেতন ক্রেতা',
    user_phone TEXT,
    receipt_image_url TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
    upvotes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Price History for Charts (মূল্য প্রবণতার ইতিহাস)
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    recorded_date DATE NOT NULL,
    govt_retail_price NUMERIC(10, 2),
    avg_market_price NUMERIC(10, 2),
    min_market_price NUMERIC(10, 2),
    max_market_price NUMERIC(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Sample Seed Data
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

-- RLS (Row Level Security) Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE govt_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public markets read" ON markets FOR SELECT USING (true);
CREATE POLICY "Public products read" ON products FOR SELECT USING (true);
CREATE POLICY "Public govt_prices read" ON govt_prices FOR SELECT USING (true);
CREATE POLICY "Public shop_prices read" ON shop_prices FOR SELECT USING (true);
CREATE POLICY "Public price_history read" ON price_history FOR SELECT USING (true);
CREATE POLICY "Public reports read approved" ON price_reports FOR SELECT USING (true);
CREATE POLICY "Public insert reports" ON price_reports FOR INSERT WITH CHECK (true);
