# Dubai Store – Premium 3D E-Commerce Experience 📱✨

A world-class, immersive 3D e-commerce platform and complete store management system designed for **Dubai Store**, Egypt's premier mobile phone and smart accessories boutique.

Inspired by the authentic Dubai Store storefront aesthetic: luminous neon turquoise typography, modern bronze glass facade, Apple-inspired minimalism, high-performance retail 3D entrance, AI-powered phone recommendation expert, and seamless WhatsApp ordering integration.

---

## 🌟 Key Features

### 1. 🚪 Signature 3D Storefront Entrance
- **Faithful Architectural Facade**: Accurately recreated from the real Dubai Store shopfront reference photo.
  - Luminous neon cyan cursive **"Dubai Store"** sign with overhead spotlight fixtures.
  - Transparent sliding glass doors with cyan **"Entrance"** and **"Welcome to our store"** vertical lettering.
  - Interior retail tunnel with illuminated turquoise accessory display cases, LED light strips, central reception counter, and potted greenery.
- **Three.js WebGL Volumetric Scene**: Ambient particles and subtle camera parallax responsive to mouse / gyro movement.
- **Cinematic Entry Transition**: Clicking **"ENTER STORE"** smoothly slides open the automatic glass doors, plays an ambient audio chime, and accelerates the camera through into the main e-commerce storefront.
- **Quick Skip**: Instant bypass option for returning visitors.
- **Persistent Access**: Can be re-entered at any time from the top navigation bar or footer.

---

### 2. 🧠 AI Smart Phone Finder ("Find Your Perfect Phone")
- **Conversational 6-Step Buying Assistant**:
  1. **Budget**: Under 5,000 EGP to Above 40,000 EGP.
  2. **Priority**: Camera quality, Gaming performance, Battery life, Social media, Overall performance, Premium design.
  3. **Brand**: Apple (iOS), Samsung (Galaxy), Any brand, No preference.
  4. **Storage**: 128 GB, 256 GB, 512 GB, 1 TB, Not sure.
  5. **Battery Importance**: Very important, Moderately important, Not a priority.
  6. **Primary Usage**: Photography & videos, Gaming, Work & productivity, Entertainment, Everyday use.
- **Intelligent Multi-Factor Scoring Algorithm**: Matches user answers against genuine in-stock products in the Dubai Store catalog.
- **Top 3 Recommendations**: Displays match percentage (e.g., *98% Match*), personalized feature breakdown, and direct WhatsApp order button.
- **"Complete Your Setup" Smart Upselling**: Automatically suggests compatible cases, screen protectors, high-speed fast chargers, wireless earbuds, and smart watches for the recommended device with 1-click cart addition.

---

### 3. 💬 WhatsApp Conversion Suite (+201008135160)
- **Direct Single Product Inquiries**:
  Every product card and details modal includes a WhatsApp button that generates a pre-filled, URL-encoded message containing:
  - Product Name
  - Selected Color & Storage capacity
  - Current Price in EGP
  - Direct Product Link
- **Multi-Item Shopping Cart Checkout**:
  The **"Complete Order via WhatsApp"** button formats an organized order summary with itemized quantities, variant choices, unit prices, subtotal, and total estimated EGP amount.
- **Persistent Floating WhatsApp Widget**:
  Bottom-right floating action button with live status indicator (*"Online • Usually replies in minutes"*).

---

### 4. 🛍️ Dynamic Product Catalog & Shopping Experience
- **Departments & Categories**:
  - 🍏 Apple iPhones (iPhone 16 Pro Max, 16 Pro, 16, 15)
  - 🌌 Samsung Galaxy (Galaxy S25 Ultra, S24 Ultra, A55 5G)
  - 📱 Other Flagships (Google Pixel 9 Pro)
  - ⌚ Smart Watches (Apple Watch Ultra 2, Series 10, Galaxy Watch Ultra)
  - 🎧 AirPods & Audio (AirPods Pro 2, AirPods Max, Galaxy Buds3 Pro)
  - ⚡ Chargers & GaN Plugs (Apple 20W, Samsung 45W, Anker 67W GaN)
  - 🛡️ Cases & 9H Glass Protection (MagSafe Silicone, Spigen EZ Fit)
  - 🧲 Lifestyle Accessories (MOFT MagSafe Wallet & Stand)
- **Filtering & Search**:
  - Live instant search by title, brand, or specs.
  - Filter by Brand, Category, Max Price slider, In-Stock only, On-Sale only.
  - Sorting: Popularity, Newest arrivals, Price (Low to High / High to Low), Highest discount.
- **Product Details Modal**:
  - High-res image gallery with thumbnail preview.
  - Color swatches & storage capacity selector.
  - Complete technical specifications table.
  - Frequently Bought Together accessory recommendations.
  - Wishlist toggle.

---

### 5. 👑 Owner Admin Dashboard (`/admin`)
- **Access Route**: `http://localhost:3000/admin`
- **Manager Passcode**: `dubai2026` (or `admin123`)
- **Analytics KPI Cards**:
  - Total Products in catalog
  - Total Available Stock units
  - Out of Stock count
  - Active Categories count
  - Active Sale items
  - Estimated Catalog Valuation in EGP
- **Inventory Alerts**:
  - Automated alert banner when stock is low (5 or fewer units).
- **Product Management (Full CRUD)**:
  - Add new product with image preview, specs builder, and variant selectors.
  - Edit existing product details, prices, discounts, and inventory counts.
  - 1-Click stock availability toggle (In Stock / Out of Stock).
  - Delete product with safety confirmation.
- **Bulk Tools & Data Backup**:
  - Apply bulk store-wide or category-wide discount promotions.
  - Export catalog to CSV (Excel) or JSON.
  - Import catalog from JSON.
  - Reset to original factory sample catalog.
- **Department Manager**:
  - Add, edit, or delete store departments and categories.
- **Instant Persistence**:
  - Changes save permanently to database state and immediately reflect on the public website.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS 4 + Custom Neon Glassmorphism System
- **3D & Graphics**: Three.js WebGL (Interactive Particle System & Volumetric Lighting) + CSS 3D Matrix Perspective Engine
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **State Management**: Central reactive event store with local persistence & Supabase client bridge
- **Backend & Database**: Supabase (ready with schema reference and offline local fallback)

---

## 🚀 Getting Started

### 1. Installation
All dependencies are already installed in `C:\Users\alizb\.gemini\antigravity\scratch\dubai-store`.

To install or reinstall dependencies:
```bash
npm install
```

### 2. Development Mode
To start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Start
```bash
npm run build
npm run start
```

---

## 🗄️ Supabase Database Configuration (Optional)

Dubai Store is fully functional with real-time local persistence. To connect your live Supabase cloud database:

1. Create a project at [supabase.com](https://supabase.com).
2. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
3. Run the SQL schema in the Supabase SQL Editor (found in `lib/supabase.ts`):
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_arabic TEXT,
  description TEXT,
  image TEXT,
  badge TEXT,
  item_count INT DEFAULT 0
);

CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT REFERENCES categories(id),
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount_percentage NUMERIC,
  description TEXT,
  short_description TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  images TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]'::jsonb,
  storage_options TEXT[] DEFAULT '{}',
  stock INT DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_new_arrival BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 5.0,
  review_count INT DEFAULT 0,
  compatible_accessories TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 📱 WhatsApp Order Verification

All order inquiries are directed to the official Dubai Store business line:
- **WhatsApp**: `+201008135160`
- **Display**: `+20 100 813 5160`
