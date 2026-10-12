import React, { useState } from 'react';
import {
  Search,
  MapPin,
  ShieldCheck,
  PlusCircle,
  PhoneCall,
  X,
  Bookmark,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

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
  shops: ShopPrice[];
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
    verified_badge: 'সরকারি তালিকাভুক্ত',
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
    updated_at: 'আজ সকাল ০৯:৫০',
    shops: [
      { shop_name: 'মেসার্স জামান ট্রেডার্স', market: 'কারওয়ান বাজার', price: 132, type: 'পাইকারি', verified: 'রসিদ যাচাইকৃত' },
      { shop_name: 'আল-ফালাহ স্টোর', market: 'মিরপুর ১ কাঁচাবাজার', price: 135, type: 'মুদি দোকান', verified: 'একাধিক রিপোর্ট' },
    ]
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('ঢাকা — কারওয়ান বাজার');
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'govt' | 'policy' | 'watchlist'>('home');
  const [watchlist, setWatchlist] = useState<string[]>(['p1', 'p2']);
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  // Form State
  const [reportProductId, setReportProductId] = useState<string>(INITIAL_PRODUCTS[0].id);
  const [reportMarket, setReportMarket] = useState<string>('মিরপুর ১ কাঁচাবাজার');
  const [reportShop, setReportShop] = useState<string>('');
  const [reportPrice, setReportPrice] = useState<string>('');

  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === 'all' || p.category_slug === selectedCategory;
    const matchSearch =
      p.name_bn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name_en.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportPrice) return;

    const newShopEntry: ShopPrice = {
      shop_name: reportShop || 'ক্রেতার রিপোর্টকৃত দোকান',
      market: reportMarket,
      price: Number(reportPrice),
      type: 'মুদি দোকান',
      verified: 'যাচাই অপেক্ষমাণ'
    };

    setProducts(products.map(p => p.id === reportProductId ? { ...p, shops: [newShopEntry, ...p.shops] } : p));
    setReportSuccess(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSuccess(false);
      setReportPrice('');
      setReportShop('');
    }, 1800);
  };

  const toggleWatchlist = (id: string) => {
    setWatchlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="app-wrapper">
      {/* 1. Clean Header */}
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
            <button className="btn-primary-action" onClick={() => setShowReportModal(true)}>
              <PlusCircle size={16} />
              <span>দাম জানান</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Clean Hero */}
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
        {/* Micro Info Banner */}
        <div className="micro-banner">
          <div className="micro-banner-left">
            <ShieldCheck size={18} color="#047857" />
            <span>
              কৃষি বিপণন অধিদপ্তর (DAM) ও স্থানীয় বাজারের যাচাইকৃত দর <strong>স্বচ্ছতার সাথে প্রকাশিত</strong>
            </span>
          </div>
          <div className="micro-banner-helpline">
            <PhoneCall size={14} />
            <span>ভোক্তা অধিকার: ১৬১২১</span>
          </div>
        </div>

        {/* Tab 1: Clean Products Grid */}
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
                          isOver ? 'amber' : product.is_govt_monitored ? 'govt' : 'blue'
                        }`}
                      >
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

        {/* Tab 2: Govt Price Portal */}
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

        {/* Tab 3: Watchlist */}
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

        {/* Tab 4: Policy */}
        {activeTab === 'policy' && (
          <div style={{ background: '#fff', borderRadius: '14px', padding: '2rem', border: '1px solid #e2e8f0', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#064e3b', marginBottom: '0.85rem' }}>
              তথ্যনীতি ও স্বচ্ছতা
            </h3>
            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              <strong>দামদেখি (DamDekhi)</strong> একটি উন্মুক্ত ও নিরপেক্ষ প্ল্যাটফর্ম। এটি কোনো বাণিজ্যিক বা মুনাফাভোগী সংস্থা নয়। কৃষি বিপণন অধিদপ্তর (DAM)-এর ঘোষিত দাম এবং স্থানীয় সাধারণ ক্রেতাদের বাস্তব অভিজ্ঞতার মধ্যে সেতুবন্ধন তৈরি করাই আমাদের মূল উদ্দেশ্য।
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

      {/* 5. Report Price Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-clean">
              <h3 className="modal-title-clean">বাজারদর জানান</h3>
              <button className="modal-close-icon" onClick={() => setShowReportModal(false)}>
                <X size={18} />
              </button>
            </div>

            {reportSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={40} color="#047857" style={{ margin: '0 auto 0.5rem auto' }} />
                <p style={{ fontWeight: 600, color: '#064e3b' }}>ধন্যবাদ! আপনার রিপোর্টটি জমা হয়েছে।</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <div className="form-item">
                  <label className="form-label-clean">পণ্য</label>
                  <select
                    className="form-input-clean"
                    value={reportProductId}
                    onChange={(e) => setReportProductId(e.target.value)}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name_bn} ({p.unit})</option>
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
                  <label className="form-label-clean">দাম (টাকা)</label>
                  <input
                    type="number"
                    className="form-input-clean"
                    placeholder="যেমন: ৮৫"
                    value={reportPrice}
                    onChange={(e) => setReportPrice(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-submit-clean">জমা দিন</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. Product Details Modal */}
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

      {/* 7. Footer Clean */}
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
