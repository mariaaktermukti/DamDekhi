# দামদেখি — DamDekhi
> **সঠিক দামে সচেতন কেনাকাটা**
> কেনার আগে দাম দেখুন। আপনার এলাকার বাজারদর জানুন, সরকারি রেট (DAM) ও দোকানের দাম তুলনা করুন।

---

## 📌 ওভারভিউ (Overview)
**দামদেখি (DamDekhi)** হলো বাংলাদেশের প্রথম সমন্বিত উন্মুক্ত বাজারদর ও ভোক্তা-তথ্য প্ল্যাটফর্ম। এটি মূলত:
1. **কৃষি বিপণন অধিদপ্তর (DAM)** ও বাণিজ্য মন্ত্রণালয়ের সরকারি নির্ধারিত যৌক্তিক কৃষকপ্রাপ্ত, পাইকারি ও খুচরা মূল্য সরাসরি প্রদর্শন করে।
2. সাবান, শ্যাম্পু, গ্যাস সিলিন্ডার, আটা-ময়দা সহ দৈনন্দিন সব পণ্যের **স্থানীয় দোকানভিত্তিক বাস্তব দাম** তুলে ধরে।
3. সাধারণ সচেতন ক্রেতা ও বাজার প্রতিনিধিদের মাধ্যমে **রসিদ ও ক্যাশ মেমোসহ মূল্যের ক্রাউডসোর্সড রিপোর্ট** গ্রহণ করে।
4. **জাতীয় ভোক্তা-অধিকার সংরক্ষণ অধিদপ্তর (DNCRP)**-এর হেল্পলাইন (১৬১২১) সংযুক্ত করে বাজার মনিটরিংয়ে স্বচ্ছতা আনে।

---

## 🛠️ টেকনোলজি স্ট্যাক (Tech Stack)
- **Frontend**: React (Vite) + TypeScript + Lucide Icons
- **Design System**: Responsive Green + White Bengali UI (Bangla Typography: `Hind Siliguri`)
- **Backend API**: Python FastAPI (Scalable, Type-safe with auto OpenAPI `/docs`)
- **Database & Auth & Storage**: Supabase (PostgreSQL with RLS)
  - Supabase Project: [`pcjzpdopjmgjtvaqpedw`](https://supabase.com/dashboard/project/pcjzpdopjmgjtvaqpedw)

---

## 🗄️ ডেটাবেজ সেটআপ (Supabase SQL)
১. আপনার Supabase ড্যাশবোর্ডে প্রবেশ করুন:  
   👉 [https://supabase.com/dashboard/project/pcjzpdopjmgjtvaqpedw/sql](https://supabase.com/dashboard/project/pcjzpdopjmgjtvaqpedw/sql)
২. `supabase/schema.sql` ফাইলের সম্পূর্ণ কোড কপি করে **SQL Editor**-এ রান (Run) করুন।
৩. এটি প্রয়োজনীয় সব টেবিল (`categories`, `markets`, `products`, `govt_prices`, `shop_prices`, `price_reports`) তৈরি করবে এবং প্রাথমিক বীজ তথ্য (Seed Data) যুক্ত করবে।
৪. আপনার **Project Settings > API** থেকে `anon` public key কপি করে `frontend/.env` ফাইলে বসিয়ে দিন:
   ```env
   VITE_SUPABASE_URL=https://pcjzpdopjmgjtvaqpedw.supabase.co
   VITE_SUPABASE_ANON_KEY=আপনার_সুভাব্যাস_অ্যানন_কি
   ```

---

## 🚀 কীভাবে চালাবেন (How to Run Locally)

### ১. Frontend (React + Vite) চালানো:
```bash
cd frontend
npm run dev
```
ব্রাউজারে ওপেন করুন: `http://localhost:5173`

### ২. Backend (FastAPI) চালানো:
```bash
cd backend
uvicorn main:app --reload --port 8000
```
- API হোমপেজ: `http://localhost:8000`
- Swagger Interactive API Docs: `http://localhost:8000/docs`

---

## 🎨 ব্র্যান্ডিং ও রঙের নীতিমালা (Brand Palette)
- **সাদা (White `#ffffff`)**: তথ্য পরিষ্কার রাখা, এক নজরে দাম ও টেবিল পড়ার সুবিধা।
- **গাঢ় সবুজ (Dark Green `#047857`)**: ব্র্যান্ডের পরিচয়, শিরোনাম ও প্রধান অ্যাকশন বাটন।
- **হালকা সবুজ (Light Green `#ecfdf5` / `#d1fae5`)**: যাচাইকৃত তথ্য, সরকারি রেট ও নির্বাচিত ফিল্টার।
- **অ্যাম্বার/কমলা (Amber `#fef3c7` / `#b45309`)**: সরকারি হারের চেয়ে বেশি দাম বা যাচাই অপেক্ষমাণ সতর্কবার্তা।
- **লাল (Red `#fee2e2` / `#b91c1c`)**: চরম মাত্রার মূল্য বৃদ্ধি ও ভোক্তা অধিকারের অভিযোগ।
