# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os

app = FastAPI(
    title="দামদেখি (DamDekhi) API",
    description="বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের সরকারি ও স্থানীয় বাজারদর তুলনা প্ল্যাটফর্ম",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase config
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://pcjzpdopjmgjtvaqpedw.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY", "")

# Sample Initial Dataset (Syncable with Supabase)
CATEGORIES = [
    {"id": "c1", "slug": "vegetables", "name_bn": "শাকসবজি", "name_en": "Vegetables", "icon": "Carrot", "count": 28},
    {"id": "c2", "slug": "rice-pulses", "name_bn": "চাল ও ডাল", "name_en": "Rice & Pulses", "icon": "Wheat", "count": 16},
    {"id": "c3", "slug": "oil-spices", "name_bn": "তেল ও মসলা", "name_en": "Oil & Spices", "icon": "Flame", "count": 22},
    {"id": "c4", "slug": "groceries", "name_bn": "মুদি পণ্য", "name_en": "Groceries", "icon": "ShoppingBag", "count": 19},
    {"id": "c5", "slug": "toiletries", "name_bn": "সাবান ও শ্যাম্পু", "name_en": "Toiletries", "icon": "Sparkles", "count": 14},
    {"id": "c6", "slug": "gas-fuel", "name_bn": "গ্যাস ও জ্বালানি", "name_en": "Gas & Fuel", "icon": "Cylinder", "count": 6},
    {"id": "c7", "slug": "meat-fish", "name_bn": "মাছ ও মাংস", "name_en": "Meat & Fish", "icon": "Fish", "count": 20},
    {"id": "c8", "slug": "eggs-dairy", "name_bn": "ডিম ও দুধ", "name_en": "Eggs & Dairy", "icon": "Egg", "count": 8},
]

MARKETS = [
    {"id": "m1", "name_bn": "কারওয়ান বাজার", "district": "ঢাকা", "area": "তেজগাঁও", "type": "wholesale"},
    {"id": "m2", "name_bn": "মিরপুর ১ কাঁচাবাজার", "district": "ঢাকা", "area": "মিরপুর", "type": "retail"},
    {"id": "m3", "name_bn": "মোহাম্মদপুর টাউন হল", "district": "ঢাকা", "area": "মোহাম্মদপুর", "type": "retail"},
    {"id": "m4", "name_bn": "যাত্রাবাড়ী আড়ৎ", "district": "ঢাকা", "area": "যাত্রাবাড়ী", "type": "wholesale"},
    {"id": "m5", "name_bn": "স্বপ্ন সুপারশপ", "district": "ঢাকা", "area": "ধানমন্ডি", "type": "superstore"},
    {"id": "m6", "name_bn": "খাতুনগঞ্জ পাইকারি বাজার", "district": "চট্টগ্রাম", "area": "কোতোয়ালী", "type": "wholesale"},
    {"id": "m7", "name_bn": "সাহেব বাজার", "district": "রাজশাহী", "area": "বোয়ালিয়া", "type": "retail"},
]

PRODUCTS = [
    {
        "id": "p1",
        "name_bn": "সয়াবিন তেল (বোতলজাত)",
        "name_en": "Soybean Oil (Bottled)",
        "category_slug": "oil-spices",
        "unit": "১ লিটার বোতল",
        "govt_price": 167.0,
        "govt_source": "বাণিজ্য মন্ত্রণালয় / কৃষি বিপণন অধিদপ্তর (DAM)",
        "govt_effective_date": "২০২৬-১০-০১",
        "avg_market_price": 168.0,
        "min_market_price": 165.0,
        "max_market_price": 172.0,
        "change_percent": 0.0,
        "is_govt_monitored": True,
        "verified_badge": "সরকারি উৎস",
        "updated_at": "আজ সকাল ০৯:৩০",
        "shops": [
            {"shop_name": "কারওয়ান বাজার পাইকারি", "market": "কারওয়ান বাজার", "price": 165.0, "type": "পাইকারি", "verified": "রসিদ যাচাইকৃত"},
            {"shop_name": "আল-মদিনা স্টোর", "market": "মিরপুর ১ কাঁচাবাজার", "price": 168.0, "type": "মুদি দোকান", "verified": "ব্যবহারকারী রিপোর্ট"},
            {"shop_name": "স্বপ্ন সুপারশপ", "market": "ধানমন্ডি", "price": 167.0, "type": "সুপারশপ", "verified": "দোকান প্রতিনিধি"},
            {"shop_name": "বিসমিল্লাহ জেনারেল স্টোর", "market": "মোহাম্মদপুর টাউন হল", "price": 170.0, "type": "মুদি দোকান", "verified": "যাচাই অপেক্ষমাণ"},
        ]
    },
    {
        "id": "p2",
        "name_bn": "দেশি পেঁয়াজ (নতুন)",
        "name_en": "Local Onion",
        "category_slug": "vegetables",
        "unit": "১ কেজি",
        "govt_price": 75.0,
        "govt_source": "কৃষি বিপণন অধিদপ্তর (DAM)",
        "govt_effective_date": "২০২৬-১০-১০",
        "avg_market_price": 85.0,
        "min_market_price": 78.0,
        "max_market_price": 90.0,
        "change_percent": 13.3,
        "is_govt_monitored": True,
        "verified_badge": "সরকারি হারের চেয়ে বেশি",
        "updated_at": "আজ সকাল ১০:০০",
        "shops": [
            {"shop_name": "আড়ত নং ১২", "market": "কারওয়ান বাজার", "price": 78.0, "type": "পাইকারি", "verified": "রসিদ যাচাইকৃত"},
            {"shop_name": "করিম স্টোর", "market": "মিরপুর ১ কাঁচাবাজার", "price": 85.0, "type": "কাঁচাবাজার", "verified": "একাধিক রিপোর্ট"},
            {"shop_name": "মায়ের দোয়া ট্রেডার্স", "market": "যাত্রাবাড়ী আড়ৎ", "price": 80.0, "type": "পাইকারি", "verified": "বাজার প্রতিনিধি"},
        ]
    },
    {
        "id": "p3",
        "name_bn": "আলু (ডায়মন্ড / সাদা)",
        "name_en": "Potato (Diamond)",
        "category_slug": "vegetables",
        "unit": "১ কেজি",
        "govt_price": 50.0,
        "govt_source": "কৃষি বিপণন অধিদপ্তর (DAM)",
        "govt_effective_date": "২০২৬-১০-০৮",
        "avg_market_price": 55.0,
        "min_market_price": 48.0,
        "max_market_price": 58.0,
        "change_percent": 10.0,
        "is_govt_monitored": True,
        "verified_badge": "সরকারি উৎস",
        "updated_at": "আজ সকাল ০৮:৪৫",
        "shops": [
            {"shop_name": "পাইকারি পাইকারি ডিপো", "market": "কারওয়ান বাজার", "price": 48.0, "type": "পাইকারি", "verified": "রসিদ যাচাইকৃত"},
            {"shop_name": "সবজি বিতান", "market": "মোহাম্মদপুর টাউন হল", "price": 55.0, "type": "কাঁচাবাজার", "verified": "ব্যবহারকারী রিপোর্ট"},
        ]
    },
    {
        "id": "p4",
        "name_bn": "মিনিকেট চাল (উন্নত মান)",
        "name_en": "Miniket Rice (Premium)",
        "category_slug": "rice-pulses",
        "unit": "১ কেজি (খোলা)",
        "govt_price": 72.0,
        "govt_source": "কৃষি বিপণন অধিদপ্তর (DAM)",
        "govt_effective_date": "২০২৬-১০-০৫",
        "avg_market_price": 74.0,
        "min_market_price": 70.0,
        "max_market_price": 78.0,
        "change_percent": 2.7,
        "is_govt_monitored": True,
        "verified_badge": "যাচাইকৃত তথ্য",
        "updated_at": "আজ দুপুর ১২:১০",
        "shops": [
            {"shop_name": "রাইস ট্রেডার্স", "market": "বাবুবাজার", "price": 70.0, "type": "পাইকারি", "verified": "বাজার প্রতিনিধি"},
            {"shop_name": "ভাই ভাই স্টোর", "market": "মিরপুর ১ কাঁচাবাজার", "price": 74.0, "type": "মুদি দোকান", "verified": "রসিদ যাচাইকৃত"},
        ]
    },
    {
        "id": "p5",
        "name_bn": "ফার্মের মুরগির লাল ডিম",
        "name_en": "Farm Brown Eggs",
        "category_slug": "eggs-dairy",
        "unit": "১ ডজন (১২টি)",
        "govt_price": 145.0,
        "govt_source": "কৃষি বিপণন অধিদপ্তর (DAM)",
        "govt_effective_date": "২০২৬-১০-০৯",
        "avg_market_price": 150.0,
        "min_market_price": 144.0,
        "max_market_price": 155.0,
        "change_percent": 3.4,
        "is_govt_monitored": True,
        "verified_badge": "সরকারি উৎস",
        "updated_at": "আজ সকাল ০৯:১৫",
        "shops": [
            {"shop_name": "তেজগাঁও ডিম আড়ৎ", "market": "তেজগাঁও", "price": 144.0, "type": "পাইকারি", "verified": "রসিদ যাচাইকৃত"},
            {"shop_name": "জনতা স্টোর", "market": "মিরপুর ১ কাঁচাবাজার", "price": 150.0, "type": "মুদি দোকান", "verified": "ব্যবহারকারী রিপোর্ট"},
        ]
    },
    {
        "id": "p6",
        "name_bn": "লাক্স সাবান (Lux Beauty Soap)",
        "name_en": "Lux Soap",
        "category_slug": "toiletries",
        "unit": "১০০ গ্রাম প্যাকেট",
        "govt_price": None,
        "govt_source": "স্থানীয় বাজার ও এমআরপি",
        "govt_effective_date": None,
        "avg_market_price": 60.0,
        "min_market_price": 58.0,
        "max_market_price": 60.0,
        "change_percent": 0.0,
        "is_govt_monitored": False,
        "verified_badge": "রসিদ যাচাইকৃত",
        "updated_at": "গতকাল বিকাল ০৫:০০",
        "shops": [
            {"shop_name": "স্বপ্ন সুপারশপ", "market": "ধানমন্ডি", "price": 60.0, "type": "সুপারশপ", "verified": "এমআরপি যাচাইকৃত"},
            {"shop_name": "মেসার্স রফিক স্টোর", "market": "মিরপুর ১ কাঁচাবাজার", "price": 58.0, "type": "মুদি দোকান", "verified": "রসিদ যাচাইকৃত"},
        ]
    },
    {
        "id": "p7",
        "name_bn": "এলপিজি গ্যাস সিলিন্ডার (১২ কেজি)",
        "name_en": "LPG Cylinder (12 Kg)",
        "category_slug": "gas-fuel",
        "unit": "১২ কেজি বোতল",
        "govt_price": 1455.0,
        "govt_source": "বাংলাদেশ এনার্জি রেগুলেটরি কমিশন (BERC)",
        "govt_effective_date": "২০২৬-১০-০১",
        "avg_market_price": 1550.0,
        "min_market_price": 1480.0,
        "max_market_price": 1600.0,
        "change_percent": 6.5,
        "is_govt_monitored": True,
        "verified_badge": "সরকারি হারের চেয়ে বেশি (BERC)",
        "updated_at": "আজ সকাল ১১:২০",
        "shops": [
            {"shop_name": "ওমেরা ডিলার পয়েন্ট", "market": "মিরপুর", "price": 1490.0, "type": "ডিলার পয়েন্ট", "verified": "রসিদ যাচাইকৃত"},
            {"shop_name": "হোম ডেলিভারি সার্ভিস", "market": "মোহাম্মদপুর", "price": 1580.0, "type": "মুদি দোকান", "verified": "ব্যবহারকারী রিপোর্ট"},
        ]
    },
    {
        "id": "p8",
        "name_bn": "খোলা চিনি (সাদা)",
        "name_en": "White Sugar",
        "category_slug": "groceries",
        "unit": "১ কেজি",
        "govt_price": 130.0,
        "govt_source": "বাণিজ্য মন্ত্রণালয় / টিসিবি",
        "govt_effective_date": "২০২৬-১০-০২",
        "avg_market_price": 135.0,
        "min_market_price": 132.0,
        "max_market_price": 140.0,
        "change_percent": 3.8,
        "is_govt_monitored": True,
        "verified_badge": "সরকারি উৎস",
        "updated_at": "আজ সকাল ০৯:৫০",
        "shops": [
            {"shop_name": "মেসার্স জামান ট্রেডার্স", "market": "কারওয়ান বাজার", "price": 132.0, "type": "পাইকারি", "verified": "রসিদ যাচাইকৃত"},
            {"shop_name": "আল-ফালাহ মুদি দোকান", "market": "মিরপুর ১ কাঁচাবাজার", "price": 135.0, "type": "মুদি দোকান", "verified": "একাধিক রিপোর্ট"},
        ]
    }
]

USER_REPORTS = [
    {
        "id": "rep-1",
        "product_id": "p2",
        "product_name": "দেশি পেঁয়াজ (নতুন)",
        "market_name": "মিরপুর ১ কাঁচাবাজার",
        "shop_name": "করিম স্টোর",
        "price": 85.0,
        "unit": "১ কেজি",
        "user_name": "তানভীর আহমেদ",
        "status": "approved",
        "receipt_url": "receipt_sample_1.jpg",
        "notes": "আজ সকালে ৮৫ টাকায় কিনেছি। ক্যাশ মেমো রয়েছে।",
        "created_at": "আজ সকাল ১০:১৫",
        "upvotes": 12
    },
    {
        "id": "rep-2",
        "product_id": "p7",
        "product_name": "এলপিজি গ্যাস সিলিন্ডার (১২ কেজি)",
        "market_name": "মোহাম্মদপুর টাউন হল",
        "shop_name": "নিউ গ্যাস কর্নার",
        "price": 1550.0,
        "unit": "১২ কেজি বোতল",
        "user_name": "রাকিব হাসান",
        "status": "pending",
        "receipt_url": None,
        "notes": "সরকারি দাম ১৪৫৫ টাকা হলেও দোকানে ১৫৫০ নিচ্ছে।",
        "created_at": "আজ দুপুর ০১:৩০",
        "upvotes": 5
    }
]

class PriceReportInput(BaseModel):
    product_id: str
    market_name: str
    shop_name: str
    price: float
    unit: str
    user_name: Optional[str] = "সচেতন ক্রেতা"
    user_id: Optional[str] = None
    user_phone: Optional[str] = None
    receipt_image_url: Optional[str] = None
    notes: Optional[str] = None

USER_PROFILES = {
    "sample-user-1": {
        "id": "sample-user-1",
        "full_name": "তানভীর আহমেদ",
        "phone": "+8801712345678",
        "reputation_points": 65,
        "badge": "বিশ্বস্ত রিপোর্টার",
        "total_reports": 8,
        "verified_reports": 6
    }
}

@app.get("/")
def home():
    return {
        "app": "DamDekhi (দামদেখি) API",
        "status": "active",
        "version": "1.0.0",
        "slogan": "কেনার আগে দাম দেখুন। আপনার এলাকার বাজারদর জানুন, তুলনা করুন, সচেতনভাবে কিনুন।",
        "supabase_project": SUPABASE_URL,
        "helpline": "জাতীয় ভোক্তা-অধিকার সংরক্ষণ অধিদপ্তর: ১৬১২১"
    }

@app.get("/api/categories")
def get_categories():
    return {"categories": CATEGORIES}

@app.get("/api/markets")
def get_markets(district: Optional[str] = None):
    if district:
        filtered = [m for m in MARKETS if m["district"] == district]
        return {"markets": filtered}
    return {"markets": MARKETS}

@app.get("/api/products")
def get_products(category: Optional[str] = None, search: Optional[str] = None, market: Optional[str] = None):
    results = PRODUCTS
    if category and category != "all":
        results = [p for p in results if p["category_slug"] == category]
    if search:
        s = search.lower()
        results = [p for p in results if s in p["name_bn"].lower() or s in p["name_en"].lower()]
    return {"products": results, "total": len(results)}

@app.get("/api/products/{product_id}")
def get_product(product_id: str):
    for p in PRODUCTS:
        if p["id"] == product_id:
            return {"product": p}
    raise HTTPException(status_code=404, detail="Product not found")

@app.get("/api/reports")
def get_reports(status: Optional[str] = None, product_id: Optional[str] = None):
    results = USER_REPORTS
    if status:
        results = [r for r in results if r["status"] == status]
    if product_id:
        results = [r for r in results if r["product_id"] == product_id]
    return {"reports": results, "total": len(results)}

@app.post("/api/reports")
def submit_report(report: PriceReportInput):
    target_product = next((p for p in PRODUCTS if p["id"] == report.product_id), None)
    product_name = target_product["name_bn"] if target_product else "অজ্ঞাত পণ্য"
    govt_price = target_product.get("govt_price") if target_product else None

    status = "pending"
    flag_reason = None
    consensus_count = 1

    # 1. Outlier Detection (সরকারি মূল্যের চেয়ে ৫০%+ অস্বাভাবিক বেশি বা কম)
    if govt_price and govt_price > 0:
        if report.price > (govt_price * 1.50):
            status = "flagged"
            flag_reason = f"সরকারি মূল্যের (৳ {govt_price}) চেয়ে ৫০%+ বেশি অস্বাভাবিক দর। এডমিন রিভিউ প্রয়োজন।"
        elif report.price < (govt_price * 0.50):
            status = "flagged"
            flag_reason = f"সরকারি মূল্যের (৳ {govt_price}) চেয়ে ৫০%+ কম অস্বাভাবিক দর। ভুল রিপোর্টের আশঙ্কা।"

    # 2. Consensus Averaging (একই পণ্য ও বাজারের কাছাকাছি মূল্যের রিপোর্ট মিলানো)
    if status != "flagged":
        matching_reports = [
            r for r in USER_REPORTS
            if r["product_id"] == report.product_id
            and (r["market_name"] == report.market_name or not report.market_name)
            and r["status"] in ["pending", "approved", "verified"]
            and (r["price"] * 0.90 <= report.price <= r["price"] * 1.10)
        ]
        if len(matching_reports) + 1 >= 3:
            status = "verified"
            consensus_count = len(matching_reports) + 1
        elif report.receipt_image_url:
            status = "pending"  # রসিদ আছে, তাই দ্রুত রিভিউ হবে

    new_report = {
        "id": f"rep-{len(USER_REPORTS) + 1}",
        "product_id": report.product_id,
        "product_name": product_name,
        "market_name": report.market_name,
        "shop_name": report.shop_name,
        "price": report.price,
        "unit": report.unit,
        "user_name": report.user_name or "সচেতন ক্রেতা",
        "user_id": report.user_id,
        "status": status,
        "flag_reason": flag_reason,
        "consensus_count": consensus_count,
        "receipt_url": report.receipt_image_url,
        "notes": report.notes,
        "created_at": "মাত্র এইমাত্র",
        "upvotes": 0
    }
    USER_REPORTS.insert(0, new_report)

    # Reputation update if user_id given
    reputation_message = ""
    if report.user_id and report.user_id in USER_PROFILES:
        prof = USER_PROFILES[report.user_id]
        prof["total_reports"] += 1
        points_earned = 15 if status == "verified" else (10 if report.receipt_image_url else 5)
        prof["reputation_points"] += points_earned
        if prof["reputation_points"] >= 50:
            prof["badge"] = "বিশ্বস্ত রিপোর্টার"
        elif prof["reputation_points"] >= 20:
            prof["badge"] = "সচেতন নাগরিক"
        reputation_message = f"আপনি {points_earned} কন্ট্রিবিউটর পয়েন্ট অর্জন করেছেন!"

    return {
        "status": "success",
        "verification_status": status,
        "flag_reason": flag_reason,
        "consensus_count": consensus_count,
        "message": (
            "দামে অস্বাভাবিক ব্যবধান থাকায় এটি পর্যালোচনার জন্য পাঠানো হয়েছে।" if status == "flagged"
            else "৩টি রিপোর্টের মিল থাকায় এটি স্বয়ংক্রিয়ভাবে 'যাচাইকৃত' হিসেবে অনুমোদিত হয়েছে!" if status == "verified"
            else "দামের রিপোর্ট সফলভাবে জমা হয়েছে। যাচাই শেষে এটি প্রকাশিত হবে।"
        ),
        "reputation_message": reputation_message,
        "report": new_report
    }

@app.post("/api/reports/{report_id}/verify")
def verify_report(report_id: str):
    for r in USER_REPORTS:
        if r["id"] == report_id:
            r["status"] = "verified"
            r["flag_reason"] = None
            return {"status": "success", "message": "রিপোর্টটি সফলভাবে যাচাইকৃত (Verified) করা হয়েছে।", "report": r}
    raise HTTPException(status_code=404, detail="Report not found")

@app.post("/api/reports/{report_id}/reject")
def reject_report(report_id: str):
    for r in USER_REPORTS:
        if r["id"] == report_id:
            r["status"] = "rejected"
            return {"status": "success", "message": "রিপোর্টটি বাতিল (Rejected) করা হয়েছে।", "report": r}
    raise HTTPException(status_code=404, detail="Report not found")

@app.get("/api/govt-circulars")
def get_govt_circulars():
    return {
        "source": "কৃষি বিপণন অধিদপ্তর (DAM), কৃষি মন্ত্রণালয়",
        "authority": "গণপ্রজাতন্ত্রী বাংলাদেশ সরকার",
        "helpline": "জাতীয় ভোক্তা-অধিকার সংরক্ষণ অধিদপ্তর (DNCRP): ১৬১২১",
        "latest_update": "১২ অক্টোবর ২০২৬",
        "circulars": [
            {
                "title": "নিত্যপ্রয়োজনীয় ২৯টি কৃষিপণ্যের যৌক্তিক খুচরা ও পাইকারি মূল্য নির্ধারণ",
                "date": "২০২৬-১০-০১",
                "department": "কৃষি বিপণন অধিদপ্তর (DAM)",
                "link": "http://dam.gov.bd"
            },
            {
                "title": "এলপিজি (LPG) গ্যাসের প্রতি কেজি ও ১২ কেজি সিলিন্ডারের ভোক্তা পর্যায় মূল্য",
                "date": "২০২৬-১০-০১",
                "department": "বাংলাদেশ এনার্জি রেগুলেটরি কমিশন (BERC)",
                "link": "http://berc.org.bd"
            }
        ]
    }
