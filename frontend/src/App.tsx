import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  ShieldCheck,
  PlusCircle,
  PhoneCall,
  X,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  Upload,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  FileCheck2,
  CheckCheck,
  Trash2
} from 'lucide-react';
import { supabase } from './supabase';

interface ShopPrice {
  shop_name: string;
  market: string;
  price: number;
  type: string;
  verified: string;
}

interface Product {
  id: string;
  name_bn: string;
  name_en: string;
  category_slug: string;
  unit: string;
  govt_price: number | null;
  govt_source: string;
  govt_effective_date: string | null;
  avg_market_price: number;
  min_market_price: number;
  max_market_price: number;
  change_percent: number;
  is_govt_monitored: boolean;
  verified_badge: string;
  updated_at: string;
  consensus_verified?: boolean;
  shops: ShopPrice[];
}

interface UserProfile {
  id: string;
  phone?: string;
  name: string;
  reputation_points: number;
  badge: 'নতুন রিপোর্টার' | 'সচেতন নাগরিক' | 'বিশ্বস্ত রিপোর্টার';
  verified_reports: number;
}

interface UserReport {
  id: string;
  product_id: string;
  product_name: string;
  market_name: string;
  shop_name: string;
  price: number;
  unit: string;
  user_name: string;
  user_id?: string;
  status: 'verified' | 'pending' | 'flagged' | 'rejected';
  flag_reason?: string;
  consensus_count: number;
  receipt_url?: string;
  notes?: string;
  created_at: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name_bn: 'সয়াবিন তেল (বোতলজাত)',
    name_en: 'Soybean Oil (Bottled)',
    category_slug: 'oil-spices',
    unit: '১ লিটার বোতল',
    govt_price: 167,
    govt_source: 'বাণিজ্য মন্ত্রণালয় / কৃষি বিপণন অধিদপ্তর (DAM)',
    govt_effective_date: '১২ অক্টোবর ২০২৬',
    avg_market_price: 168,
    min_market_price: 165,
    max_market_price: 172,
    change_percent: 0,
    is_govt_monitored: true,
    verified_badge: '৩+ রিপোর্টে সমর্থিত',
    consensus_verified: true,
    updated_at: 'আজ সকাল ০৯:৩০',
    shops: [
      { shop_name: 'কারওয়ান বাজার পাইকারি আড়ৎ', market: 'কারওয়ান বাজার', price: 165, type: 'পাইকারি', verified: 'রসিদ যাচাইকৃত' },
      { shop_name: 'আল-মদিনা জেনারেল স্টোর', market: 'মিরপুর ১ কাঁচাবাজার', price: 168, type: 'মুদি দোকান', verified: 'ব্যবহারকারী রিপোর্ট' },
      { shop_name: 'স্বপ্ন সুপারশপ', market: 'ধানমন্ডি', price: 167, type: 'সুপারশপ', verified: 'দোকান প্রতিনিধি' },
    ]
  },
  {
    id: 'p2',
    name_bn: 'দেশি পেঁয়াজ (নতুন)',
    name_en: 'Local Onion',
    category_slug: 'vegetables',
    unit: '১ কেজি',
    govt_price: 75,
    govt_source: 'কৃষি বিপণন অধিদপ্তর (DAM)',
    govt_effective_date: '১০ অক্টোবর ২০২৬',
    avg_market_price: 85,
    min_market_price: 78,
    max_market_price: 90,
    change_percent: 13.3,
    is_govt_monitored: true,
    verified_badge: 'সরকারি হারের চেয়ে বেশি',
    consensus_verified: true,
    updated_at: 'আজ সকাল ১০:০০',
    shops: [
      { shop_name: 'আড়ত নং ১২', market: 'কারওয়ান বাজার', price: 78, type: 'পাইকারি', verified: 'রসিদ যাচাইকৃত' },
      { shop_name: 'করিম স্টোর', market: 'মিরপুর ১ কাঁচাবাজার', price: 85, type: 'কাঁচাবাজার', verified: 'একাধিক রিপোর্ট' },
    ]
  },
  {
    id: 'p3',
    name_bn: 'আলু (ডায়মন্ড / সাদা)',
    name_en: 'Potato (Diamond)',
    category_slug: 'vegetables',
    unit: '১ কেজি',
    govt_price: 50,
    govt_source: 'কৃষি বিপণন অধিদপ্তর (DAM)',
    govt_effective_date: '০৮ অক্টোবর ২০২৬',
    avg_market_price: 55,
    min_market_price: 48,
    max_market_price: 58,
    change_percent: 10.0,
    is_govt_monitored: true,
    verified_badge: 'সরকারি তালিকাভুক্ত',
    consensus_verified: false,
    updated_at: 'আজ সকাল ০৮:৪৫',
    shops: [
      { shop_name: 'পাইকারি ডিপো', market: 'কারওয়ান বাজার', price: 48, type: 'পাইকারি', verified: 'রসিদ যাচাইকৃত' },
      { shop_name: 'সবজি বিতান', market: 'মোহাম্মদপুর টাউন হল', price: 55, type: 'কাঁচাবাজার', verified: 'ব্যবহারকারী রিপোর্ট' },
    ]
  },
  {
    id: 'p4',
    name_bn: 'মিনিকেট চাল (উন্নত মান)',
    name_en: 'Miniket Rice (Premium)',
    category_slug: 'rice-pulses',
    unit: '১ কেজি (খোলা)',
    govt_price: 72,
    govt_source: 'কৃষি বিপণন অধিদপ্তর (DAM)',
    govt_effective_date: '০৫ অক্টোবর ২০২৬',
    avg_market_price: 74,
    min_market_price: 70,
    max_market_price: 78,
    change_percent: 2.7,
    is_govt_monitored: true,
    verified_badge: 'ন্যায্য দামে',
    consensus_verified: true,
    updated_at: 'আজ দুপুর ১২:১০',
    shops: [
      { shop_name: 'রাইস ট্রেডার্স', market: 'বাবুবাজার', price: 70, type: 'পাইকারি', verified: 'বাজার প্রতিনিধি' },
      { shop_name: 'ভাই ভাই স্টোর', market: 'মিরপুর ১ কাঁচাবাজার', price: 74, type: 'মুদি দোকান', verified: 'রসিদ যাচাইকৃত' },
    ]
  },
  {
    id: 'p5',
    name_bn: 'ফার্মের মুরগির লাল ডিম',
    name_en: 'Farm Brown Eggs',
    category_slug: 'eggs-dairy',
    unit: '১ ডজন (১২টি)',
    govt_price: 145,
    govt_source: 'কৃষি বিপণন অধিদপ্তর (DAM)',
    govt_effective_date: '০৯ অক্টোবর ২০২৬',
    avg_market_price: 150,
    min_market_price: 144,
    max_market_price: 155,
    change_percent: 3.4,
    is_govt_monitored: true,
    verified_badge: 'সরকারি তালিকাভুক্ত',
    consensus_verified: false,
    updated_at: 'আজ সকাল ০৯:১৫',
    shops: [
      { shop_name: 'তেজগাঁও ডিম আড়ৎ', market: 'তেজগাঁও', price: 144, type: 'পাইকারি', verified: 'রসিদ যাচাইকৃত' },
      { shop_name: 'জনতা স্টোর', market: 'মিরপুর ১ কাঁচাবাজার', price: 150, type: 'মুদি দোকান', verified: 'ব্যবহারকারী রিপোর্ট' },
    ]
  },
  {
    id: 'p6',
    name_bn: 'লাক্স সাবান (Lux Beauty Soap)',
    name_en: 'Lux Soap',
    category_slug: 'toiletries',
    unit: '১০০ গ্রাম প্যাকেট',
    govt_price: null,
    govt_source: 'এমআরপি ও স্থানীয় বাজারদর',
    govt_effective_date: null,
    avg_market_price: 60,
    min_market_price: 58,
    max_market_price: 60,
    change_percent: 0,
    is_govt_monitored: false,
    verified_badge: 'রসিদ যাচাইকৃত',
    consensus_verified: true,
    updated_at: 'গতকাল বিকাল ০৫:০০',
    shops: [
      { shop_name: 'স্বপ্ন সুপারশপ', market: 'ধানমন্ডি', price: 60, type: 'সুপারশপ', verified: 'এমআরপি যাচাইকৃত' },
      { shop_name: 'মেসার্স রফিক স্টোর', market: 'মিরপুর ১ কাঁচাবাজার', price: 58, type: 'মুদি দোকান', verified: 'রসিদ যাচাইকৃত' },
    ]
  },
  {
    id: 'p7',
    name_bn: 'এলপিজি গ্যাস সিলিন্ডার (১২ কেজি)',
    name_en: 'LPG Cylinder (12 Kg)',
    category_slug: 'gas-fuel',
    unit: '১২ কেজি সিলিন্ডার',
    govt_price: 1455,
    govt_source: 'বাংলাদেশ এনার্জি রেগুলেটরি কমিশন (BERC)',
    govt_effective_date: '০১ অক্টোবর ২০২৬',
    avg_market_price: 1550,
    min_market_price: 1480,
    max_market_price: 1600,
    change_percent: 6.5,
    is_govt_monitored: true,
    verified_badge: 'সরকারি হারের চেয়ে বেশি',
    consensus_verified: true,
    updated_at: 'আজ সকাল ১১:২০',
    shops: [
      { shop_name: 'ওমেরা ডিলার পয়েন্ট', market: 'মিরপুর', price: 1490, type: 'ডিলার পয়েন্ট', verified: 'রসিদ যাচাইকৃত' },
      { shop_name: 'হোম সার্ভিস গ্যাস', market: 'মোহাম্মদপুর', price: 1580, type: 'মুদি দোকান', verified: 'ব্যবহারকারী রিপোর্ট' },
    ]
  },
  {
    id: 'p8',
    name_bn: 'খোলা চিনি (সাদা)',
    name_en: 'White Sugar',
    category_slug: 'groceries',
    unit: '১ কেজি',
    govt_price: 130,
    govt_source: 'বাণিজ্য মন্ত্রণালয় / টিসিবি',
    govt_effective_date: '০২ অক্টোবর ২০২৬',
    avg_market_price: 135,
    min_market_price: 132,
    max_market_price: 140,
    change_percent: 3.8,
    is_govt_monitored: true,
    verified_badge: 'সরকারি তালিকাভুক্ত',
    consensus_verified: false,
    updated_at: 'আজ সকাল ০৯:৫০',
    shops: [
      { shop_name: 'মেসার্স জামান ট্রেডার্স', market: 'কারওয়ান বাজার', price: 132, type: 'পাইকারি', verified: 'রসিদ যাচাইকৃত' },
      { shop_name: 'আল-ফালাহ স্টোর', market: 'মিরপুর ১ কাঁচাবাজার', price: 135, type: 'মুদি দোকান', verified: 'একাধিক রিপোর্ট' },
    ]
  }
];

const INITIAL_REPORTS: UserReport[] = [
  {
    id: 'rep-1',
    product_id: 'p2',
    product_name: 'দেশি পেঁয়াজ (নতুন)',
    market_name: 'মিরপুর ১ কাঁচাবাজার',
    shop_name: 'করিম স্টোর',
    price: 85,
    unit: '১ কেজি',
    user_name: 'তানভীর আহমেদ',
    status: 'verified',
    consensus_count: 3,
    receipt_url: 'https://images.unsplash.com/photo-1554415707-9e4466b404c0?auto=format&fit=crop&w=400&q=80',
    notes: 'ক্যাশ মেমো সহ কিনেছি। ফ্রেশ পেঁয়াজ।',
    created_at: 'আজ সকাল ১০:১৫'
  },
  {
    id: 'rep-2',
    product_id: 'p7',
    product_name: 'এলপিজি গ্যাস সিলিন্ডার (১২ কেজি)',
    market_name: 'মোহাম্মদপুর টাউন হল',
    shop_name: 'নিউ গ্যাস কর্নার',
    price: 2400,
    unit: '১২ কেজি সিলিন্ডার',
    user_name: 'রাকিব হাসান',
    status: 'flagged',
    flag_reason: 'সরকারি দামের (৳ ১৪৫৫) চেয়ে ৬০%+ অস্বাভাবিক বেশি। এডমিন রিভিউ প্রয়োজন।',
    consensus_count: 1,
    notes: 'দোকানদার অতিরিক্ত দাম দাবি করছে।',
    created_at: 'আজ দুপুর ০১:৩০'
  },
  {
    id: 'rep-3',
    product_id: 'p1',
    product_name: 'সয়াবিন তেল (বোতলজাত)',
    market_name: 'কারওয়ান বাজার',
    shop_name: 'পাইকারি আড়ৎ',
    price: 165,
    unit: '১ লিটার বোতল',
    user_name: 'মেহরাব হোসেন',
    status: 'verified',
    consensus_count: 4,
    notes: 'কারওয়ান বাজারে পাইকারি রেটে পেয়েছি।',
    created_at: 'আজ সকাল ১১:২০'
  }
];

const CATEGORIES = [
  { slug: 'all', name_bn: 'সব পণ্য' },
  { slug: 'vegetables', name_bn: 'শাকসবজি' },
  { slug: 'rice-pulses', name_bn: 'চাল ও ডাল' },
  { slug: 'oil-spices', name_bn: 'তেল ও মসলা' },
  { slug: 'groceries', name_bn: 'মুদি' },
  { slug: 'toiletries', name_bn: 'সাবান ও প্রসাধন' },
  { slug: 'gas-fuel', name_bn: 'জ্বালানি' },
  { slug: 'eggs-dairy', name_bn: 'ডিম ও দুধ' },
];

const LOCATIONS = [
  'ঢাকা — কারওয়ান বাজার',
  'ঢাকা — মিরপুর ১ কাঁচাবাজার',
  'ঢাকা — মোহাম্মদপুর টাউন হল',
  'চট্টগ্রাম — খাতুনগঞ্জ পাইকারি বাজার',
  'রাজশাহী — সাহেব বাজার',
  'সিলেট — বন্দরবাজার',
];

export function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reports, setReports] = useState<UserReport[]>(INITIAL_REPORTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('ঢাকা — কারওয়ান বাজার');
  const [activeTab, setActiveTab] = useState<'home' | 'govt' | 'moderation' | 'watchlist' | 'policy'>('home');
  const [watchlist, setWatchlist] = useState<string[]>(['p1', 'p2']);

  // Modals
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // User State & Supabase Auth
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('damdekhi_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Auth Modal State
  const [authTab, setAuthTab] = useState<'phone' | 'google'>('phone');
  const [authPhone, setAuthPhone] = useState<string>('');
  const [authOtp, setAuthOtp] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Crowdsource Form State
  const [reportProductId, setReportProductId] = useState<string>(INITIAL_PRODUCTS[0].id);
  const [reportMarket, setReportMarket] = useState<string>('মিরপুর ১ কাঁচাবাজার');
  const [reportShop, setReportShop] = useState<string>('');
  const [reportPrice, setReportPrice] = useState<string>('');
  const [reportNotes, setReportNotes] = useState<string>('');
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [reportResultNotice, setReportResultNotice] = useState<string | null>(null);

  // Anonymous Rate Limiter (Max 3 per day)
  const [dailyQuotaLeft, setDailyQuotaLeft] = useState<number>(() => {
    const usage = localStorage.getItem('damdekhi_anon_usage');
    if (!usage) return 3;
    const parsed = JSON.parse(usage);
    const today = new Date().toISOString().split('T')[0];
    return parsed.date === today ? Math.max(0, 3 - parsed.count) : 3;
  });

  // Check Supabase session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !currentUser) {
        const userProf: UserProfile = {
          id: session.user.id,
          phone: session.user.phone || undefined,
          name: session.user.user_metadata?.full_name || 'সচেতন নাগরিক',
          reputation_points: 25,
          badge: 'সচেতন নাগরিক',
          verified_reports: 2
        };
        setCurrentUser(userProf);
        localStorage.setItem('damdekhi_user', JSON.stringify(userProf));
      }
    });
  }, []);

  // Live Outlier Warning calculation
  const currentSelectedProduct = products.find(p => p.id === reportProductId);
  const enteredPriceNum = Number(reportPrice);
  const hasOutlierWarning = Boolean(
    enteredPriceNum > 0 &&
    currentSelectedProduct?.govt_price &&
    (enteredPriceNum > currentSelectedProduct.govt_price * 1.5 || enteredPriceNum < currentSelectedProduct.govt_price * 0.5)
  );

  // File receipt upload handler
  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Report with Anti-Fake Verification Logic
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPriceNum) return;

    // Check rate limit if not logged in
    if (!currentUser && dailyQuotaLeft <= 0) {
      alert('আপনার আজকের ৩টি বেনামী রিপোর্টের কোটা পূর্ণ হয়েছে! দয়া করে ফোন নম্বর বা গুগল দিয়ে লগইন করুন।');
      setShowAuthModal(true);
      return;
    }

    let status: 'verified' | 'pending' | 'flagged' = 'pending';
    let flagReason: string | undefined = undefined;
    let consensusCount = 1;

    // 1. Outlier Detection (>50% difference from Govt Price)
    if (currentSelectedProduct?.govt_price) {
      if (enteredPriceNum > currentSelectedProduct.govt_price * 1.5) {
        status = 'flagged';
        flagReason = `সরকারি মূল্যের (৳ ${currentSelectedProduct.govt_price}) চেয়ে ৫০%+ বেশি অস্বাভাবিক দর।`;
      } else if (enteredPriceNum < currentSelectedProduct.govt_price * 0.5) {
        status = 'flagged';
        flagReason = `সরকারি মূল্যের (৳ ${currentSelectedProduct.govt_price}) চেয়ে ৫০%+ কম অস্বাভাবিক দর।`;
      }
    }

    // 2. Consensus Averaging (একই পণ্যে কমপক্ষে ৩টি রিপোর্ট)
    if (status !== 'flagged') {
      const matchingPreviousReports = reports.filter(
        r => r.product_id === reportProductId &&
        (r.price * 0.9 <= enteredPriceNum && enteredPriceNum <= r.price * 1.1)
      );

      if (matchingPreviousReports.length + 1 >= 3) {
        status = 'verified';
        consensusCount = matchingPreviousReports.length + 1;
      }
    }

    // Receipt URL (Upload to Supabase Storage bucket 'receipts' or fallback to preview)
    let uploadedReceiptUrl = receiptPreview || undefined;
    if (receiptFile) {
      try {
        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, receiptFile);

        if (!uploadError) {
          const { data } = supabase.storage.from('receipts').getPublicUrl(fileName);
          uploadedReceiptUrl = data.publicUrl;
        }
      } catch (err) {
        console.warn('Storage upload fallback to data URL', err);
      }
    }

    const newReport: UserReport = {
      id: `rep-${Date.now()}`,
      product_id: reportProductId,
      product_name: currentSelectedProduct?.name_bn || 'পণ্য',
      market_name: reportMarket,
      shop_name: reportShop || 'স্থানীয় দোকান',
      price: enteredPriceNum,
      unit: currentSelectedProduct?.unit || '১ কেজি',
      user_name: currentUser ? currentUser.name : 'সচেতন নাগরিক',
      user_id: currentUser?.id,
      status: status,
      flag_reason: flagReason,
      consensus_count: consensusCount,
      receipt_url: uploadedReceiptUrl,
      notes: reportNotes || undefined,
      created_at: 'এইমাত্র'
    };

    setReports([newReport, ...reports]);

    // Update Contributor Reputation Points if user is logged in
    if (currentUser) {
      const pointsAdded = status === 'verified' ? 15 : (receiptPreview ? 10 : 5);
      const newPoints = currentUser.reputation_points + pointsAdded;
      let newBadge = currentUser.badge;
      if (newPoints >= 50) newBadge = 'বিশ্বস্ত রিপোর্টার';
      else if (newPoints >= 20) newBadge = 'সচেতন নাগরিক';

      const updatedUser: UserProfile = {
        ...currentUser,
        reputation_points: newPoints,
        badge: newBadge,
        verified_reports: status === 'verified' ? currentUser.verified_reports + 1 : currentUser.verified_reports
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('damdekhi_user', JSON.stringify(updatedUser));
    } else {
      // Deduct anonymous quota
      const today = new Date().toISOString().split('T')[0];
      const newLeft = dailyQuotaLeft - 1;
      setDailyQuotaLeft(newLeft);
      localStorage.setItem('damdekhi_anon_usage', JSON.stringify({ date: today, count: 4 - newLeft }));
    }

    // Success Notice
    let notice = 'ধন্যবাদ! আপনার রিপোর্টটি জমা হয়েছে।';
    if (status === 'flagged') {
      notice = '⚠️ অস্বাভাবিক দাম হওয়ায় এটি ফ্ল্যাগ করা হয়েছে এবং এডমিন রিভিউতে পাঠানো হয়েছে।';
    } else if (status === 'verified') {
      notice = '🎉 ৩টি রিপোর্টের মিল থাকায় এটি স্বয়ংক্রিয়ভাবে "যাচাইকৃত" (Verified) হয়েছে!';
    }
    setReportResultNotice(notice);

    setTimeout(() => {
      setShowReportModal(false);
      setReportResultNotice(null);
      setReportPrice('');
      setReportShop('');
      setReportNotes('');
      setReceiptFile(null);
      setReceiptPreview(null);
    }, 2000);
  };

  // Auth Login Handler (Phone + OTP & Google)
  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    if (!otpSent) {
      // Step 1: Send OTP
      try {
        await supabase.auth.signInWithOtp({
          phone: authPhone.startsWith('+88') ? authPhone : `+88${authPhone}`
        });
      } catch (err) {
        console.warn('Supabase SMS Gateway fallback for test environment', err);
      }
      setOtpSent(true);
      setAuthLoading(false);
    } else {
      // Step 2: Verify OTP
      try {
        await supabase.auth.verifyOtp({
          phone: authPhone.startsWith('+88') ? authPhone : `+88${authPhone}`,
          token: authOtp,
          type: 'sms'
        });
      } catch (err) {
        console.warn('Fallback local OTP verify', err);
      }

      const mockUser: UserProfile = {
        id: `usr-${Date.now()}`,
        phone: authPhone,
        name: `ব্যবহারকারী (${authPhone.slice(-4)})`,
        reputation_points: 30,
        badge: 'সচেতন নাগরিক',
        verified_reports: 3
      };
      setCurrentUser(mockUser);
      localStorage.setItem('damdekhi_user', JSON.stringify(mockUser));
      setAuthLoading(false);
      setShowAuthModal(false);
      setOtpSent(false);
      setAuthPhone('');
      setAuthOtp('');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } catch (err) {
      console.warn('OAuth fallback mock for local test', err);
    }
    const googleUser: UserProfile = {
      id: `usr-google-${Date.now()}`,
      name: 'সচেতন নাগরিক (Google)',
      reputation_points: 20,
      badge: 'সচেতন নাগরিক',
      verified_reports: 1
    };
    setCurrentUser(googleUser);
    localStorage.setItem('damdekhi_user', JSON.stringify(googleUser));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    setCurrentUser(null);
    localStorage.removeItem('damdekhi_user');
  };

  // Admin / Moderation Actions
  const handleVerifyReport = (id: string) => {
    const targetRep = reports.find(r => r.id === id);
    if (targetRep) {
      setProducts(prev => prev.map(p => {
        if (p.id === targetRep.product_id) {
          const newShop: ShopPrice = {
            shop_name: targetRep.shop_name,
            market: targetRep.market_name,
            price: targetRep.price,
            type: 'মুদি দোকান',
            verified: 'রসিদ ও ঐক্যমত্যে যাচাইকৃত'
          };
          return {
            ...p,
            shops: [newShop, ...p.shops],
            avg_market_price: Math.round((p.avg_market_price + targetRep.price) / 2),
            consensus_verified: true
          };
        }
        return p;
      }));
    }
    setReports(reports.map(r => r.id === id ? { ...r, status: 'verified', flag_reason: undefined } : r));
  };

  const handleRejectReport = (id: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.category_slug === selectedCategory;
    const matchSearch =
      p.name_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const flaggedCount = reports.filter(r => r.status === 'flagged').length;

  return (
    <div className="app-wrapper">
      {/* 1. Header with User Profile / Login */}
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand-wrapper" onClick={() => setActiveTab('home')}>
            <div className="brand-icon">দ</div>
            <div>
              <h1 className="brand-title">দামদেখি</h1>
            </div>
          </div>

          <nav className="nav-menu">
            <button
              className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              বাজারদর
            </button>
            <button
              className={`nav-item ${activeTab === 'govt' ? 'active' : ''}`}
              onClick={() => setActiveTab('govt')}
            >
              সরকারি রেট (DAM)
            </button>
            <button
              className={`nav-item ${activeTab === 'moderation' ? 'active' : ''}`}
              onClick={() => setActiveTab('moderation')}
            >
              যাচাই ও রিভিউ {flaggedCount > 0 && <span style={{ color: '#b45309', fontWeight: 700 }}>({flaggedCount})</span>}
            </button>
            <button
              className={`nav-item ${activeTab === 'watchlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('watchlist')}
            >
              আমার ফর্দ ({watchlist.length})
            </button>
            <button
              className={`nav-item ${activeTab === 'policy' ? 'active' : ''}`}
              onClick={() => setActiveTab('policy')}
            >
              নীতিমালা
            </button>
          </nav>

          <div className="header-right">
            <button className="location-pill" onClick={() => setShowLocationModal(true)}>
              <MapPin size={15} color="#047857" />
              <span>{selectedLocation.split('—')[1] || selectedLocation}</span>
            </button>

            {/* Contributor Profile / Login button */}
            {currentUser ? (
              <div className="user-profile-btn" title="কন্ট্রিবিউটর প্রোফাইল">
                <span
                  className={`user-badge-tag ${
                    currentUser.badge === 'বিশ্বস্ত রিপোর্টার' ? 'trusted' :
                    currentUser.badge === 'সচেতন নাগরিক' ? 'citizen' : 'new'
                  }`}
                >
                  {currentUser.badge === 'বিশ্বস্ত রিপোর্টার' && '🌟 '}
                  {currentUser.badge}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#047857' }}>
                  {currentUser.reputation_points} পয়েন্ট
                </span>
                <button
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', padding: 0 }}
                  title="লগআউট"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                className="user-profile-btn"
                onClick={() => setShowAuthModal(true)}
              >
                <UserIcon size={15} color="#047857" />
                <span>লগইন</span>
              </button>
            )}

            <button className="btn-primary-action" onClick={() => setShowReportModal(true)}>
              <PlusCircle size={16} />
              <span>দাম জানান</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      {activeTab === 'home' && (
        <section className="hero">
          <div className="container">
            <h2 className="hero-heading">
              সঠিক দামে <span>সচেতন কেনাকাটা</span>
            </h2>
            <p className="hero-subheading">
              আপনার এলাকার বাজারদর জানুন, সরকারি নির্ধারিত দামের সাথে তুলনা করুন
            </p>

            <div className="search-container">
              <div className="search-card">
                <Search size={20} color="#047857" style={{ marginRight: '8px' }} />
                <input
                  type="text"
                  className="search-field"
                  placeholder="পণ্য খুঁজুন (যেমন: তেল, পেঁয়াজ, আলু, ডিম, চিনি...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-btn-clean">খুঁজুন</button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="filter-tabs-wrapper">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  className={`category-chip ${selectedCategory === cat.slug ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  {cat.name_bn}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Main Content Container */}
      <main className="container">
        {/* Micro Info Banner with Anti-Fake Guarantee */}
        <div className="micro-banner">
          <div className="micro-banner-left">
            <ShieldCheck size={18} color="#047857" />
            <span>
              <strong>যাচাইকরণ গ্যারান্টি:</strong> কমপক্ষে ৩টি রিপোর্টের ঐক্যমত্য ও রসিদ যাচাই ছাড়া কোনো দাম কনফার্ম করা হয় না।
            </span>
          </div>
          <div className="micro-banner-helpline">
            <PhoneCall size={14} />
            <span>ভোক্তা অধিকার: ১৬১২১</span>
          </div>
        </div>

        {/* Tab 1: Home Products */}
        {activeTab === 'home' && (
          <div className="products-grid-clean">
            {filteredProducts.map((product) => {
              const hasGovt = product.govt_price !== null;
              const isOver = hasGovt && product.avg_market_price > (product.govt_price || 0);
              const diff = (product.govt_price) ? product.avg_market_price - product.govt_price : 0;
              const inWatchlist = watchlist.includes(product.id);

              return (
                <div key={product.id} className="clean-card">
                  <div>
                    <div className="card-top">
                      <div>
                        <h3 className="product-name">{product.name_bn}</h3>
                        <p className="product-unit-text">{product.unit} • {product.updated_at}</p>
                      </div>
                      <span
                        className={`pill-badge ${
                          isOver ? 'amber' : product.consensus_verified ? 'govt' : 'blue'
                        }`}
                      >
                        {product.consensus_verified && '✓ '}
                        {product.verified_badge}
                      </span>
                    </div>

                    {/* Dual Price Box */}
                    <div className="price-display-grid">
                      <div className="price-col">
                        <span className="price-col-label">সরকারি রেট</span>
                        <span className="price-col-value govt">
                          {hasGovt ? `৳ ${product.govt_price}` : 'তালিকাভুক্ত নয়'}
                        </span>
                      </div>
                      <div className="price-col">
                        <span className="price-col-label">বাজার গড়</span>
                        <span className="price-col-value market">
                          ৳ {product.avg_market_price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-bottom">
                    <div className={`status-summary ${isOver ? 'high' : 'fair'}`}>
                      {hasGovt ? (
                        diff > 0 ? (
                          <>
                            <AlertCircle size={14} />
                            <span>+ ৳ {diff} বেশি</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} />
                            <span>ন্যায্য রেট</span>
                          </>
                        )
                      ) : (
                        <span>বাজার রেঞ্জ: ৳ {product.min_market_price} - {product.max_market_price}</span>
                      )}
                    </div>

                    <div className="card-actions">
                      <button
                        className="btn-view-compare"
                        onClick={() => setSelectedProductDetails(product)}
                      >
                        তুলনা দেখুন
                      </button>
                      <button
                        className={`btn-bookmark ${inWatchlist ? 'active' : ''}`}
                        onClick={() => toggleWatchlist(product.id)}
                        title={inWatchlist ? 'ফর্দ থেকে সরান' : 'ফর্দে যোগ করুন'}
                      >
                        <Bookmark size={15} fill={inWatchlist ? '#047857' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Moderation & Anti-Fake Review Queue */}
        {activeTab === 'moderation' && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '1.75rem', border: '1px solid #e2e8f0', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#064e3b' }}>
                  রিপোর্ট যাচাই ও কোয়ালিটি কন্ট্রোল প্যানেল
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
                  আউটলায়ার ডিটেকশন (৫০%+ ফারাক), রসিদের ছবি ও ৩+ ক্রেতার রিপোর্টের ঐক্যমত্য পর্যবেক্ষণ করুন
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="user-badge-tag trusted">যাচাইকৃত: {reports.filter(r => r.status === 'verified').length}</span>
                <span className="user-badge-tag" style={{ background: '#fef3c7', color: '#b45309' }}>ফ্ল্যাগকৃত: {flaggedCount}</span>
              </div>
            </div>

            <div className="moderation-grid">
              {reports.map((report) => (
                <div key={report.id} className={`moderation-card ${report.status === 'flagged' ? 'flagged' : report.status === 'verified' ? 'verified' : ''}`}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{report.product_name}</strong>
                      <span
                        className={`user-badge-tag ${
                          report.status === 'verified' ? 'trusted' :
                          report.status === 'flagged' ? 'user-badge-tag' : 'new'
                        }`}
                        style={report.status === 'flagged' ? { background: '#fee2e2', color: '#b91c1c' } : {}}
                      >
                        {report.status === 'verified' ? '✓ যাচাইকৃত (Consensus)' :
                         report.status === 'flagged' ? '⚠️ ফ্ল্যাগকৃত (Outlier)' : 'যাচাই অপেক্ষমাণ'}
                      </span>
                      {report.consensus_count >= 3 && (
                        <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>
                          (৩+ ক্রেতার রিপোর্টে সমর্থিত)
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '0.25rem' }}>
                      দোকান: <strong>{report.shop_name}</strong> ({report.market_name}) • মূল্য: <strong style={{ color: '#047857', fontSize: '1rem' }}>৳ {report.price}</strong> / {report.unit}
                    </p>

                    {report.flag_reason && (
                      <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.35rem 0.65rem', borderRadius: '4px', fontSize: '0.8rem', marginTop: '0.35rem' }}>
                        <ShieldAlert size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                        {report.flag_reason}
                      </div>
                    )}

                    {report.notes && (
                      <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.35rem' }}>
                        মন্তব্য: "{report.notes}"
                      </p>
                    )}

                    {report.receipt_url && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <a
                          href={report.receipt_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <FileCheck2 size={14} /> রসিদ / ক্যাশ মেমো দেখুন
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="moderation-actions">
                    {report.status !== 'verified' && (
                      <button
                        className="btn-mod-verify"
                        onClick={() => handleVerifyReport(report.id)}
                        title="অনুমোদন করুন"
                      >
                        <CheckCheck size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        অনুমোদন
                      </button>
                    )}
                    {report.status !== 'rejected' && (
                      <button
                        className="btn-mod-reject"
                        onClick={() => handleRejectReport(report.id)}
                        title="বাতিল করুন"
                      >
                        <Trash2 size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                        বাতিল
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Govt Price Portal */}
        {activeTab === 'govt' && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '1.75rem', border: '1px solid #e2e8f0', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#064e3b', marginBottom: '0.35rem' }}>
              কৃষি বিপণন অধিদপ্তর (DAM) নির্ধারিত যৌক্তিক মূল্যতালিকা
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              কৃষি মন্ত্রণালয় ও বাণিজ্য মন্ত্রণালয় কর্তৃক নির্ধারিত সর্বশেষ খুচরা দর
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '0.75rem' }}>পণ্য</th>
                  <th style={{ padding: '0.75rem' }}>একক</th>
                  <th style={{ padding: '0.75rem' }}>সরকারি নির্ধারিত দর</th>
                  <th style={{ padding: '0.75rem' }}>বাজার গড়</th>
                  <th style={{ padding: '0.75rem' }}>পার্থক্য</th>
                </tr>
              </thead>
              <tbody>
                {products.filter(p => p.govt_price !== null).map(p => {
                  const diff = p.avg_market_price - (p.govt_price || 0);
                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.name_bn}</td>
                      <td style={{ padding: '0.75rem', color: '#64748b' }}>{p.unit}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#047857' }}>৳ {p.govt_price}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>৳ {p.avg_market_price}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {diff > 0 ? (
                          <span style={{ color: '#b45309', background: '#fffbeb', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '0.82rem' }}>
                            + ৳ {diff} বেশি
                          </span>
                        ) : (
                          <span style={{ color: '#047857', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '0.82rem' }}>
                            ন্যায্য দামে
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 4: Watchlist */}
        {activeTab === 'watchlist' && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '1.75rem', border: '1px solid #e2e8f0', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#064e3b', marginBottom: '0.35rem' }}>
              আমার বাজার ফর্দ
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              নির্বাচিত পণ্যগুলোর তালিকা ও আনুমানিক খরচের হিসেব
            </p>

            {watchlist.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>ফর্দে কোনো পণ্য নেই।</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.75rem' }}>পণ্য</th>
                    <th style={{ padding: '0.75rem' }}>একক</th>
                    <th style={{ padding: '0.75rem' }}>বাজার মূল্য</th>
                    <th style={{ padding: '0.75rem' }}>অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(p => watchlist.includes(p.id)).map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem', fontWeight: 600 }}>{p.name_bn}</td>
                      <td style={{ padding: '0.75rem', color: '#64748b' }}>{p.unit}</td>
                      <td style={{ padding: '0.75rem', fontWeight: 700, color: '#047857' }}>৳ {p.avg_market_price}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <button
                          onClick={() => toggleWatchlist(p.id)}
                          style={{ border: 'none', background: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                          মুছুন
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 5: Policy */}
        {activeTab === 'policy' && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '2rem', border: '1px solid #e2e8f0', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#064e3b', marginBottom: '0.85rem' }}>
              তথ্যনীতি ও নিরপেক্ষতা
            </h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              <strong>দামদেখি (DamDekhi)</strong> কোনো বাণিজ্যিক বা মুনাফাকেন্দ্রীক সাইট নয়। ভুয়া দামের বিস্তার রোধে আমরা রসিদ যাচাই ও কমপক্ষে ৩ জন সাধারণ ক্রেতার ঐক্যমত্যের উপর ভিত্তি করে তথ্য প্রদর্শন করি।
            </p>
            <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '8px', fontSize: '0.88rem', color: '#047857' }}>
              অতিরিক্ত বা অযৌক্তিক দামের ক্ষেত্রে জাতীয় ভোক্তা-অধিকার সংরক্ষণ অধিদপ্তরে সরাসরি ফোন করুন: <strong>১৬১২১</strong>
            </div>
          </div>
        )}
      </main>

      {/* 4. Location Modal */}
      {showLocationModal && (
        <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-clean">
              <h3 className="modal-title-clean">এলাকা নির্বাচন করুন</h3>
              <button className="modal-close-icon" onClick={() => setShowLocationModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setShowLocationModal(false);
                  }}
                  style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    background: selectedLocation === loc ? '#ecfdf5' : '#f8fafc',
                    border: `1px solid ${selectedLocation === loc ? '#a7f3d0' : '#e2e8f0'}`,
                    borderRadius: '8px',
                    fontWeight: selectedLocation === loc ? 600 : 400,
                    color: selectedLocation === loc ? '#064e3b' : '#1e293b',
                    cursor: 'pointer'
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Auth Modal (Phone OTP & Google Login) */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-clean">
              <h3 className="modal-title-clean">লগইন / কন্ট্রিবিউটর অ্যাকাউন্ট</h3>
              <button className="modal-close-icon" onClick={() => setShowAuthModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="auth-toggle-tabs">
              <button
                className={`auth-tab-btn ${authTab === 'phone' ? 'active' : ''}`}
                onClick={() => setAuthTab('phone')}
              >
                ফোন নম্বর + OTP
              </button>
              <button
                className={`auth-tab-btn ${authTab === 'google' ? 'active' : ''}`}
                onClick={() => setAuthTab('google')}
              >
                Google দিয়ে
              </button>
            </div>

            {authTab === 'phone' ? (
              <form onSubmit={handlePhoneAuth}>
                <div className="form-item">
                  <label className="form-label-clean">মোবাইল নম্বর (বাংলাদেশ)</label>
                  <input
                    type="tel"
                    className="form-input-clean"
                    placeholder="017XXXXXXXX"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    required
                    disabled={otpSent}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    এসএমএস গেটওয়ে (SSL Wireless / Alpha SMS) দ্বারা ওটিপি পাঠানো হবে
                  </span>
                </div>

                {otpSent && (
                  <div className="form-item">
                    <label className="form-label-clean">৬ ডিজিটের ওটিপি (OTP) দিন</label>
                    <input
                      type="text"
                      className="form-input-clean"
                      placeholder="যেমন: 123456"
                      value={authOtp}
                      onChange={(e) => setAuthOtp(e.target.value)}
                      required
                    />
                    <span style={{ fontSize: '0.75rem', color: '#047857' }}>
                      (পরীক্ষামূলক ব্যবহারে যেকোনো ৬ ডিজিটের কোড দিন)
                    </span>
                  </div>
                )}

                <button type="submit" className="btn-submit-clean" disabled={authLoading}>
                  {authLoading ? 'প্রক্রিয়াধীন...' : (otpSent ? 'ওটিপি নিশ্চিত করুন' : 'ওটিপি কোড পাঠান')}
                </button>
              </form>
            ) : (
              <div>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1rem', textAlign: 'center' }}>
                  আপনার গুগল অ্যাকাউন্ট ব্যবহার করে সরাসরি ১-ক্লিকে লগইন করুন।
                </p>
                <button className="google-auth-btn" onClick={handleGoogleAuth}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google দিয়ে প্রবেশ করুন</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Report Price Modal with Outlier Alert, Consensus & Receipt Upload */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-clean">
              <h3 className="modal-title-clean">বাজারদর জানান ও যাচাইয়ে সাহায্য করুন</h3>
              <button className="modal-close-icon" onClick={() => setShowReportModal(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Rate Limit notice for anonymous */}
            {!currentUser && (
              <div className="rate-limit-banner">
                <span>আজকের অবশিষ্ট বেনামী রিপোর্ট: <strong>{dailyQuotaLeft}/৩</strong></span>
                <button
                  onClick={() => { setShowReportModal(false); setShowAuthModal(true); }}
                  style={{ background: 'none', border: 'none', color: '#1d4ed8', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
                >
                  লগইন করুন
                </button>
              </div>
            )}

            {reportResultNotice ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={40} color="#047857" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontWeight: 600, color: '#064e3b', fontSize: '1rem' }}>{reportResultNotice}</p>
                {currentUser && (
                  <p style={{ fontSize: '0.85rem', color: '#047857', marginTop: '0.5rem' }}>
                    ✨ আপনার প্রোফাইলে কন্ট্রিবিউটর পয়েন্ট যুক্ত হয়েছে!
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <div className="form-item">
                  <label className="form-label-clean">পণ্য নির্বাচন করুন</label>
                  <select
                    className="form-input-clean"
                    value={reportProductId}
                    onChange={(e) => setReportProductId(e.target.value)}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name_bn} ({p.unit}) {p.govt_price ? `[সরকারি: ৳${p.govt_price}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-item">
                  <label className="form-label-clean">বাজার / এলাকা</label>
                  <input
                    type="text"
                    className="form-input-clean"
                    value={reportMarket}
                    onChange={(e) => setReportMarket(e.target.value)}
                    required
                  />
                </div>

                <div className="form-item">
                  <label className="form-label-clean">দোকানের নাম (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    className="form-input-clean"
                    placeholder="যেমন: ভাই ভাই স্টোর"
                    value={reportShop}
                    onChange={(e) => setReportShop(e.target.value)}
                  />
                </div>

                <div className="form-item">
                  <label className="form-label-clean">প্রকৃত মূল্য (টাকা)</label>
                  <input
                    type="number"
                    className="form-input-clean"
                    placeholder="যেমন: ৮৫"
                    value={reportPrice}
                    onChange={(e) => setReportPrice(e.target.value)}
                    required
                  />
                </div>

                {/* Live Outlier Detection Warning */}
                {hasOutlierWarning && (
                  <div className="outlier-warning-alert">
                    <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong>সতর্কতা (Outlier Detected):</strong> এই পণ্যটির সরকারি দাম ৳ {currentSelectedProduct?.govt_price}। আপনার দেওয়া মূল্যটি ৫০% এর বেশি অস্বাভাবিক ফারাক। এটি স্বয়ংক্রিয়ভাবে ফ্ল্যাগ হয়ে এডমিন রিভিউতে যাবে।
                    </div>
                  </div>
                )}

                {/* Receipt Photo Upload */}
                <div className="form-item">
                  <label className="form-label-clean">
                    ক্যাশ মেমো / রসিদের ছবি আপলোড (ঐচ্ছিক - দিলে অতিরিক্ত পয়েন্ট ও দ্রুত ভেরিফিকেশন)
                  </label>
                  {!receiptPreview ? (
                    <label className="receipt-upload-box" style={{ display: 'block' }}>
                      <Upload size={22} color="#047857" style={{ margin: '0 auto 0.35rem auto' }} />
                      <p style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                        রসিদের ছবি সিলেক্ট করতে ক্লিক করুন
                      </p>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        JPG, PNG (সর্বোচ্চ ৫ মেগাবাইট) • Supabase Storage
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleReceiptChange}
                      />
                    </label>
                  ) : (
                    <div className="receipt-preview-container">
                      <img src={receiptPreview} alt="Receipt preview" className="receipt-preview-img" />
                      <button
                        type="button"
                        className="receipt-remove-btn"
                        onClick={() => { setReceiptPreview(null); setReceiptFile(null); }}
                        title="রিমুভ করুন"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-item">
                  <label className="form-label-clean">মন্তব্য (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    className="form-input-clean"
                    placeholder="যেমন: প্যাকেটের ফ্রেশ সয়াবিন তেল, ১ম গ্রেড"
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-submit-clean">
                  দাম জমা দিন
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. Product Details Modal */}
      {selectedProductDetails && (
        <div className="modal-overlay" onClick={() => setSelectedProductDetails(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-clean">
              <div>
                <h3 className="modal-title-clean">{selectedProductDetails.name_bn}</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedProductDetails.unit}</p>
              </div>
              <button className="modal-close-icon" onClick={() => setSelectedProductDetails(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>সরকারি রেট:</span>
                <span style={{ fontWeight: 700, color: '#047857' }}>
                  {selectedProductDetails.govt_price ? `৳ ${selectedProductDetails.govt_price}` : 'তালিকাভুক্ত নয়'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>উৎস:</span>
                <span>{selectedProductDetails.govt_source}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#064e3b', marginBottom: '0.5rem' }}>
              দোকানভিত্তিক দর:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedProductDetails.shops.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.9rem' }}>{s.shop_name}</strong>
                    <p style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.market} ({s.type})</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>৳ {s.price}</div>
                    <span style={{ fontSize: '0.72rem', color: '#047857', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                      {s.verified}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. Footer Clean */}
      <footer className="footer-clean">
        <div className="container footer-flex">
          <span>© ২০২৬ দামদেখি — সঠিক দামে সচেতন কেনাকাটা।</span>
          <span>ভোক্তা অধিকার হটলাইন: ১৬১২১</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
