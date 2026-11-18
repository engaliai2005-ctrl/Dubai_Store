"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Filter,
  Flame,
  MessageCircle,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap
} from "lucide-react";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { PhoneFinderModal } from "../components/ai-finder/PhoneFinderModal";
import { withBasePath } from "../lib/site";

function StorefrontEntranceLoading() {
  return (
    <div
      className="fixed inset-0 z-50 h-[100dvh] overflow-hidden bg-slate-950 text-white"
      role="status"
      aria-live="polite"
    >
      <div
        className="absolute inset-[-24px] scale-110 bg-cover bg-center opacity-75 blur-2xl"
        style={{
          backgroundImage: `url("${withBasePath("/storefront-enhanced-2k.jpg")}")`,
        }}
      />
      <div className="absolute inset-0 bg-slate-950/40" />
      <img
        src={withBasePath("/storefront-enhanced-2k.jpg")}
        alt="واجهة دبي ستور والمدخل بالكامل"
        className="absolute left-1/2 top-1/2 z-[1] max-h-[48dvh] w-[94vw] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-cyan-100/70 object-contain shadow-2xl sm:max-h-[66dvh] sm:w-[min(90vw,1200px)]"
      />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src={withBasePath("/logo.jpg")}
            alt="Dubai Store"
            className="h-11 w-11 rounded-xl border border-cyan-300/40 bg-slate-900/70 object-contain p-1"
          />
          <div>
            <p className="font-black">دبي ستور</p>
            <p className="text-xs text-slate-200">موبايلات وإكسسوارات أصلية</p>
          </div>
        </div>
        <span className="rounded-full border border-white/25 bg-slate-950/50 px-3 py-2 text-xs font-bold backdrop-blur">
          جاري تجهيز المدخل...
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-5 pb-10 text-center sm:pb-14">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-white/25 border-t-cyan-400" />
        <h1 className="text-2xl font-black drop-shadow sm:text-4xl">
          أهلاً بيك في <span className="text-cyan-300">دبي ستور</span>
        </h1>
      </div>
    </div>
  );
}

const StorefrontEntrance3D = dynamic(
  () => import("../components/storefront/StorefrontEntrance3D"),
  { ssr: false, loading: StorefrontEntranceLoading }
);
import { ProductCard } from "../components/catalog/ProductCard";
import { ProductFilters } from "../components/catalog/ProductFilters";
import { WishlistDrawer } from "../components/catalog/WishlistDrawer";
import { CartDrawer } from "../components/cart/CartDrawer";
import { CategoryGrid } from "../components/home/CategoryGrid";
import { Hero } from "../components/home/Hero";
import { FloatingWhatsApp } from "../components/layout/FloatingWhatsApp";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { ProductDetailsModal } from "../components/product/ProductDetailsModal";
import { useDubaiStore } from "../lib/store";
import { CategoryId, Product } from "../lib/types";
import { DUBAI_STORE_PHONE_DISPLAY, getGeneralWhatsAppUrl } from "../lib/whatsapp";

export default function HomePage() {
  const {
    products,
    categories,
    cart,
    wishlist,
    cartTotalAmount,
    cartItemCount,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    toggleWishlist,
  } = useDubaiStore();

  // Modals & Drawers State
  const [showEntrance, setShowEntrance] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAIFinderOpen, setIsAIFinderOpen] = useState(false);

  // Catalog Filter State
  const [searchQuery, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("الكل");
  const [selectedStorage, setSelectedStorage] = useState("الكل");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 90000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedBrand("الكل");
    setSelectedStorage("الكل");
    setPriceRange([0, 90000]);
    setInStockOnly(false);
    setDiscountedOnly(false);
    setSortBy("popularity");
  };

  const handleScrollToCatalog = () => {
    const el = document.getElementById("catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filtered & Sorted Products computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchDesc) return false;
        }

        // Category
        if (selectedCategory !== "all" && p.category !== selectedCategory) {
          return false;
        }

        // Brand
        if (selectedBrand !== "الكل" && p.brand !== selectedBrand) {
          return false;
        }

        // Storage
        if (selectedStorage !== "الكل") {
          if (!p.storageOptions || !p.storageOptions.includes(selectedStorage)) {
            return false;
          }
        }

        // Price range
        if (p.price > priceRange[1]) {
          return false;
        }

        // In stock only
        if (inStockOnly && (!p.isAvailable || p.stock <= 0)) {
          return false;
        }

        // Discounted only
        if (discountedOnly && (!p.discountPercentage || p.discountPercentage <= 0)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "discount") {
          return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        }
        // popularity (default)
        return b.rating * b.reviewCount - a.rating * a.reviewCount;
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedStorage,
    priceRange,
    inStockOnly,
    discountedOnly,
    sortBy,
  ]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleOpenProductById = (productId: string) => {
    const p = products.find((item) => item.id === productId);
    if (p) setSelectedProduct(p);
  };

  const currentCategoryTitle = useMemo(() => {
    if (selectedCategory === "all") return "كل المنتجات";
    const cat = categories.find((c) => c.id === selectedCategory);
    return cat ? cat.name : "المنتجات";
  }, [selectedCategory, categories]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-[#00C2CB] selection:text-slate-950 font-sans">
      {/* 3D Cinematic Storefront Entrance */}
      {showEntrance && (
        <StorefrontEntrance3D onEnter={() => setShowEntrance(false)} />
      )}

      {/* 1. Header & Navigation */}
      <Navbar
        cartCount={cartItemCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAIFinder={() => setIsAIFinderOpen(true)}
        onSearchChange={setSearchTerm}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          handleScrollToCatalog();
        }}
        onSelectDealsOnly={() => {
          setDiscountedOnly(true);
          setSelectedCategory("all");
          handleScrollToCatalog();
        }}
        onReopenEntrance={() => setShowEntrance(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onExploreClick={handleScrollToCatalog}
          onOpenAIFinder={() => setIsAIFinderOpen(true)}
          onReopenEntrance={() => setShowEntrance(true)}
        />

        {/* 3. Shopping Categories Grid */}
        <CategoryGrid
          categories={categories}
          products={products}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            handleScrollToCatalog();
          }}
        />

        {/* 4. Main Product Catalog & Filter Section */}
        <section id="catalog-section" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDFA] text-[#00C2CB] text-xs font-black mb-2 border border-[#00C2CB]/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>أجهزة أصلية وأسعار حقيقية بالجنيه المصري</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {currentCategoryTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                متوفر {filteredProducts.length} منتج أصلي وجديد بالضمان الفوري.
              </p>
            </div>

            {/* AI Assistant Quick Pill */}
            <button
              onClick={() => setIsAIFinderOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white border-2 border-[#00C2CB]/40 hover:border-[#00C2CB] text-[#00C2CB] hover:bg-[#F0FDFA] text-xs font-black flex items-center gap-2 shadow-xs transition-all self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-[#00C2CB]" />
              <span>مش عارف تختار موبايل؟ سيبها علينا!</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="mb-8">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
              selectedStorage={selectedStorage}
              onSelectStorage={setSelectedStorage}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              inStockOnly={inStockOnly}
              onToggleInStockOnly={() => setInStockOnly(!inStockOnly)}
              discountedOnly={discountedOnly}
              onToggleDiscountedOnly={() => setDiscountedOnly(!discountedOnly)}
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchQuery={searchQuery}
              onSearchChange={setSearchTerm}
              onResetFilters={resetFilters}
              totalProductsCount={filteredProducts.length}
            />
          </div>

          {/* Product Cards Grid: 4 columns desktop, 2 columns mobile */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-800">مفيش منتجات متطابقة مع اختياراتك</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm font-medium">
                جرب تبحث باسم تاني أو وسّع مدى السعر عشان تلاقي اللي بتدور عليه.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-[#00C2CB] text-white font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>مسح كل الفلاتر</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={handleOpenProduct}
                  onAddToCart={(p) => addToCart(p)}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={toggleWishlist}
                />
              ))}
            </div>
          )}
        </section>

        {/* 5. Promotional WhatsApp Banner in Egyptian Arabic */}
        <section className="my-12 sm:my-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-l from-slate-950 via-slate-900 to-[#032B30] p-7 sm:p-12 text-white overflow-hidden shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 left-0 w-80 h-80 bg-[#00C2CB]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-xl text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#00C2CB]/20 text-[#A5F3FC] border border-[#00C2CB]/30 mb-3">
                <Flame className="w-3.5 h-3.5 text-[#00C2CB]" />
                <span>عروض وخدمة فورية</span>
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                عايز تسأل عن أي موبايل أو تطلب فوراً؟ <br />
                <span className="text-[#00C2CB]">كلمنا دلوقتي على واتساب</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed font-medium">
                فريق دبي ستور معاك طول اليوم للرد على كل استفساراتك، ومعرفة الألوان ومساحات التخزين المتوفرة في المحل، والتوصيل السريع لباب بيتك.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3.5">
                <a
                  href={getGeneralWhatsAppUrl("مساء الخير، بتواصل معاكم من موقع دبي ستور وعايز استفسر عن الأجهزة المتاحة والعروض الحالية.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>تواصل عبر واتساب: {DUBAI_STORE_PHONE_DISPLAY}</span>
                </a>

                <button
                  onClick={() => setIsAIFinderOpen(true)}
                  className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-[#00C2CB]" />
                  <span>ساعدني أختار موبايل بالذكاء الاصطناعي</span>
                </button>
              </div>
            </div>

            {/* Direct Contact Card */}
            <div className="relative z-10 w-full md:w-auto p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-lg flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Phone className="w-7 h-7" />
              </div>
              <span className="text-xs text-slate-300 font-bold">رقم الطلبات والاستفسارات</span>
              <span className="text-lg font-black text-white dir-ltr mt-1">{DUBAI_STORE_PHONE_DISPLAY}</span>
              <span className="text-[11px] text-emerald-300 mt-1 font-semibold">متاح طوال اليوم 10 ص - 11:30 م</span>
            </div>
          </div>
        </section>

        {/* 6. Why Customers Trust Dubai Store (Egyptian Arabic) */}
        <section className="py-14 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ليه تشتري موبايلك وإكسسواراتك من دبي ستور؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto font-medium">
              بنقدملك تجربة شراء واضحة، أجهزة أصلية معتمدة، وتواصل سريع ومباشر في كل خطوة.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10 text-right">
              <div className="p-6 rounded-2xl bg-[#F0FDFA]/50 border border-slate-200/80 hover:border-[#00C2CB]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#00C2CB]/10 text-[#00C2CB] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-900">أجهزة أصلية بالكرتونة والضمان</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                  كل أجهزة آبل، سامسونج، والإكسسوارات أصلية 100% بسيريال معتمد تقدر تكشف عليه قبل الاستلام.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F0FDFA]/50 border border-slate-200/80 hover:border-[#00C2CB]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-900">تواصل مباشر وسريع على واتساب</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                  فريق مبيعات متخصص بيجاوبك في ثواني، ويبعتلك صور وفيديوهات للمنتجات والألوان قبل ما تشتري.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F0FDFA]/50 border border-slate-200/80 hover:border-[#00C2CB]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#00C2CB]/10 text-[#00C2CB] flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-900">شحن آمن وسريع لجميع المحافظات</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                  توصيل سريع ومؤمّن لحد باب بيتك في القاهرة والجيزة وكل محافظات مصر مع إمكانية المعاينة.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F0FDFA]/50 border border-slate-200/80 hover:border-[#00C2CB]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-900">مواعيد عمل يومية</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                  شغالين يومياً من 10 صباحاً حتى 11:30 مساءً لمتابعة كل استفساراتكم وشحن طلباتكم بدون تأخير.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 7. Egyptian Arabic Footer */}
      <Footer
        onOpenAIFinder={() => setIsAIFinderOpen(true)}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          handleScrollToCatalog();
        }}
      />

      {/* 8. Floating WhatsApp Widget */}
      <FloatingWhatsApp />

      {/* 9. Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, color, storage, qty) => addToCart(p, color, storage, qty)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
        allProducts={products}
        onOpenProduct={(p) => setSelectedProduct(p)}
      />

      {/* 10. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        totalAmount={cartTotalAmount}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onOpenProduct={handleOpenProductById}
      />

      {/* 11. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        allProducts={products}
        onAddToCart={(p) => addToCart(p)}
        onRemoveFromWishlist={toggleWishlist}
        onOpenProduct={handleOpenProduct}
      />

      {/* 12. AI Phone Finder Modal */}
      <PhoneFinderModal
        isOpen={isAIFinderOpen}
        onClose={() => setIsAIFinderOpen(false)}
        catalog={products}
        onOpenProduct={handleOpenProduct}
        onAddToCart={(p) => addToCart(p)}
      />
    </div>
  );
}
