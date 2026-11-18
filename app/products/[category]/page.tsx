"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Filter,
  Flame,
  Home,
  Layers,
  MessageCircle,
  RotateCcw,
  Search,
  Sparkles,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { PhoneFinderModal } from "../../../components/ai-finder/PhoneFinderModal";
import { ProductCard } from "../../../components/catalog/ProductCard";
import { WishlistDrawer } from "../../../components/catalog/WishlistDrawer";
import { CartDrawer } from "../../../components/cart/CartDrawer";
import { FloatingWhatsApp } from "../../../components/layout/FloatingWhatsApp";
import { Footer } from "../../../components/layout/Footer";
import { Navbar } from "../../../components/layout/Navbar";
import { ProductDetailsModal } from "../../../components/product/ProductDetailsModal";
import { INITIAL_CATEGORIES } from "../../../lib/seed-data";
import { useDubaiStore } from "../../../lib/store";
import { CategoryId, Product } from "../../../lib/types";
import { DUBAI_STORE_PHONE_DISPLAY, getGeneralWhatsAppUrl } from "../../../lib/whatsapp";

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryParam = (params?.category as string) || "iphone";

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

  // Active Category resolution
  const currentCategory = useMemo(() => {
    const list = categories.length > 0 ? categories : INITIAL_CATEGORIES;
    return (
      list.find((c) => c.id === categoryParam) || {
        id: categoryParam as CategoryId,
        name: "منتجات القسم",
        nameEnglish: categoryParam,
        description: "تصفح أحدث الموبايلات والإكسسوارات الأصلية بضمان دبي ستور المعتمد.",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
        itemCount: 0,
      }
    );
  }, [categories, categoryParam]);

  // Modals & Drawers State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAIFinderOpen, setIsAIFinderOpen] = useState(false);

  // In-Category Filters
  const [inCatSearch, setInCatSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("الكل");
  const [selectedStorage, setSelectedStorage] = useState("الكل");
  const [maxPrice, setMaxPrice] = useState<number>(90000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");

  // Reset Filters
  const resetFilters = () => {
    setInCatSearch("");
    setSelectedBrand("الكل");
    setSelectedStorage("الكل");
    setMaxPrice(90000);
    setInStockOnly(false);
    setDiscountedOnly(false);
    setSortBy("popularity");
  };

  // Products belonging to this category
  const categoryBaseProducts = useMemo(() => {
    return products.filter((p) => p.category === categoryParam);
  }, [products, categoryParam]);

  // Dynamic filter lists based on available products in this category
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    categoryBaseProducts.forEach((p) => {
      if (p.brand) set.add(p.brand);
    });
    return ["الكل", ...Array.from(set)];
  }, [categoryBaseProducts]);

  const availableStorages = useMemo(() => {
    const set = new Set<string>();
    categoryBaseProducts.forEach((p) => {
      if (p.storageOptions) {
        p.storageOptions.forEach((opt) => set.add(opt));
      }
    });
    return ["الكل", ...Array.from(set)];
  }, [categoryBaseProducts]);

  // Filtered & Sorted products within this category
  const filteredProducts = useMemo(() => {
    return categoryBaseProducts
      .filter((p) => {
        // Search inside category
        if (inCatSearch.trim()) {
          const q = inCatSearch.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchDesc) return false;
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

        // Price
        if (p.price > maxPrice) {
          return false;
        }

        // In Stock
        if (inStockOnly && (!p.isAvailable || p.stock <= 0)) {
          return false;
        }

        // Discounted
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
        return b.rating * b.reviewCount - a.rating * a.reviewCount;
      });
  }, [
    categoryBaseProducts,
    inCatSearch,
    selectedBrand,
    selectedStorage,
    maxPrice,
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-[#00C2CB] selection:text-slate-950 font-sans">
      {/* 1. Header */}
      <Navbar
        cartCount={cartItemCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAIFinder={() => setIsAIFinderOpen(true)}
        onSearchChange={(q) => router.push(`/?search=${encodeURIComponent(q)}#catalog-section`)}
        searchQuery=""
        selectedCategory={categoryParam}
        onSelectCategory={(catId) => {
          if (catId === "all") router.push("/#catalog-section");
          else router.push(`/products/${catId}`);
        }}
        onSelectDealsOnly={() => router.push("/#catalog-section")}
      />

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {/* Breadcrumb Bar */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link href="/" className="hover:text-[#00C2CB] flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/#catalog-section" className="hover:text-[#00C2CB] transition-colors">
              الأقسام
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#00C2CB] font-black">{currentCategory.name}</span>
          </div>
        </div>

        {/* Category Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#032B30] via-slate-900 to-slate-950 text-white py-10 sm:py-14 border-b border-slate-800">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00C2CB]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl text-right">
              {currentCategory.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C2CB]/20 text-[#A5F3FC] text-xs font-black mb-3 border border-[#00C2CB]/30">
                  <Sparkles className="w-3.5 h-3.5 text-[#00C2CB]" />
                  <span>{currentCategory.badge}</span>
                </div>
              )}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {currentCategory.name}
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {currentCategory.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs font-bold text-[#A5F3FC]">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10">
                  متوفر {categoryBaseProducts.length} منتج في هذا القسم
                </span>
                <span>•</span>
                <span className="text-slate-300">أجهزة أصلية معتمدة 100%</span>
              </div>
            </div>

            {/* Quick WhatsApp Assistance */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2.5">
              <a
                href={getGeneralWhatsAppUrl(`مساء الخير، بتواصل بخصوص قسم ${currentCategory.name} على دبي ستور وعايز استفسر عن الموديلات المتاحة.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>استفسر عن قسم {currentCategory.name} على واتساب</span>
              </a>

              <button
                onClick={() => setIsAIFinderOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00C2CB]" />
                <span>مش عارف تختار؟ اسأل الذكاء الاصطناعي</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick Switcher Pills for Other Categories */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 overflow-x-auto scrollbar-none flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 ml-2 whitespace-nowrap">
              الأقسام:
            </span>
            <Link
              href="/#catalog-section"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors"
            >
              كل المنتجات
            </Link>
            {(categories.length > 0 ? categories : INITIAL_CATEGORIES).map((cat) => {
              const isActive = cat.id === categoryParam;
              return (
                <Link
                  key={cat.id}
                  href={`/products/${cat.id}`}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#00C2CB] text-white shadow-xs font-black"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Category Catalog & In-Category Filters */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Controls Bar: In-Category Search, Sorting, In-Stock & Deals */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-xs mb-8 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search within this category */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`ابحث داخل ${currentCategory.name}...`}
                  value={inCatSearch}
                  onChange={(e) => setInCatSearch(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-[#00C2CB] transition-all"
                />
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">الترتيب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#00C2CB]"
                >
                  <option value="popularity">الأكثر شهرة</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                  <option value="newest">أحدث الموديلات</option>
                  <option value="discount">أكبر الخصومات</option>
                </select>
              </div>
            </div>

            {/* Filter Pills: Brand, Storage, Toggles */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Brand Selector */}
                {availableBrands.length > 2 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500">الماركة:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {availableBrands.map((b) => (
                        <button
                          key={b}
                          onClick={() => setSelectedBrand(b)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                            selectedBrand === b
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Storage Selector if applicable */}
                {availableStorages.length > 2 && (
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="text-[11px] font-bold text-slate-500">المساحة:</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {availableStorages.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedStorage(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                            selectedStorage === s
                              ? "bg-[#00C2CB] text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Toggles & Reset */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border ${
                    inStockOnly
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  المتوفر فقط
                </button>

                <button
                  onClick={() => setDiscountedOnly(!discountedOnly)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors border ${
                    discountedOnly
                      ? "bg-rose-50 text-rose-700 border-rose-300"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  عروض وخصومات فقط
                </button>

                {(inCatSearch || selectedBrand !== "الكل" || selectedStorage !== "الكل" || inStockOnly || discountedOnly) && (
                  <button
                    onClick={resetFilters}
                    className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors"
                    title="مسح الفلاتر"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product Count & Status */}
          <div className="mb-4 flex items-center justify-between text-xs font-bold text-slate-500">
            <span>
              عرض {filteredProducts.length} من أصل {categoryBaseProducts.length} منتج في قسم {currentCategory.name}
            </span>
            <span className="text-emerald-600 font-extrabold">جميع الأسعار محدثة وشاملة الفاتورة</span>
          </div>

          {/* Product Cards Grid: 4 columns desktop, 2 columns mobile */}
          {filteredProducts.length === 0 ? (
            <div className="p-12 sm:p-16 rounded-3xl bg-white border border-slate-200 text-center flex flex-col items-center justify-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-800">مفيش منتجات متطابقة مع اختياراتك في هذا القسم</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm font-medium">
                جرب تغير الماركة أو المساحة أو مسح البحث عشان تشوف باقي المنتجات المتاحة.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-[#00C2CB] text-white font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة ضبط فلاتر القسم</span>
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
      </main>

      {/* Footer */}
      <Footer
        onOpenAIFinder={() => setIsAIFinderOpen(true)}
        onSelectCategory={(catId) => router.push(`/products/${catId}`)}
      />

      {/* Floating WhatsApp */}
      <FloatingWhatsApp />

      {/* Product Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, color, storage, qty) => addToCart(p, color, storage, qty)}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={toggleWishlist}
        allProducts={products}
        onOpenProduct={(p) => setSelectedProduct(p)}
      />

      {/* Cart Drawer */}
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

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        allProducts={products}
        onAddToCart={(p) => addToCart(p)}
        onRemoveFromWishlist={toggleWishlist}
        onOpenProduct={handleOpenProduct}
      />

      {/* AI Phone Finder Modal */}
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
