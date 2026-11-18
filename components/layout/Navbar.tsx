"use client";

import {
  Compass,
  Heart,
  Menu,
  MessageCircle,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
  X
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { DUBAI_STORE_PHONE_DISPLAY, getGeneralWhatsAppUrl } from "../../lib/whatsapp";
import { DubaiStoreLogo } from "../ui/Logo";

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAIFinder: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectDealsOnly: () => void;
  onReopenEntrance?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAIFinder,
  onSearchChange,
  searchQuery,
  selectedCategory,
  onSelectCategory,
  onSelectDealsOnly,
  onReopenEntrance,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navCategories = [
    { id: "all", label: "كل المنتجات" },
    { id: "iphone", label: "آيفون" },
    { id: "samsung", label: "سامسونج" },
    { id: "smartphones", label: "موبايلات تانية" },
    { id: "smartwatches", label: "ساعات سمارت" },
    { id: "earbuds", label: "سماعات وإيربودز" },
    { id: "chargers", label: "شواحن وكابلات" },
    { id: "cases", label: "جرابات" },
    { id: "protection", label: "اسكرينات وحماية" },
    { id: "accessories", label: "إكسسوارات متنوعة" },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#0F172A] text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00C2CB] animate-pulse" />
            <span className="text-slate-200 font-medium">
              توصيل سريع لجميع المحافظات • أجهزة أصلية بضمان معتمد
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#00C2CB] flex items-center gap-1.5 transition-colors font-bold text-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#00C2CB]" />
              <span>واتساب المبيعات: {DUBAI_STORE_PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-200 ${scrolled ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md" : "bg-white/90 backdrop-blur-sm border-b border-slate-200 shadow-xs"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Mobile Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 hover:text-[#00C2CB] hover:bg-slate-100 transition-colors"
                aria-label="القائمة"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <DubaiStoreLogo size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-bold text-slate-700">
              <Link
                href="/"
                className="px-3.5 py-2 rounded-xl hover:text-[#00C2CB] hover:bg-slate-50 transition-colors"
              >
                الرئيسية
              </Link>

              <button
                onClick={() => onSelectCategory("all")}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#F0FDFA] text-[#00C2CB] border border-[#00C2CB]/30"
                    : "hover:text-[#00C2CB] hover:bg-slate-50"
                }`}
              >
                كل المنتجات
              </button>

              <button
                onClick={() => onSelectCategory("iphone")}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  selectedCategory === "iphone"
                    ? "bg-[#F0FDFA] text-[#00C2CB] border border-[#00C2CB]/30"
                    : "hover:text-[#00C2CB] hover:bg-slate-50"
                }`}
              >
                آيفون
              </button>

              <button
                onClick={() => onSelectCategory("samsung")}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  selectedCategory === "samsung"
                    ? "bg-[#F0FDFA] text-[#00C2CB] border border-[#00C2CB]/30"
                    : "hover:text-[#00C2CB] hover:bg-slate-50"
                }`}
              >
                سامسونج
              </button>

              <button
                onClick={onSelectDealsOnly}
                className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
              >
                <Tag className="w-4 h-4" />
                <span>عروضنا</span>
              </button>

              {/* AI Phone Finder Prominent Pill */}
              <button
                onClick={onOpenAIFinder}
                className="mr-2 px-4 py-2 rounded-xl text-xs font-extrabold text-[#0891B2] bg-[#F0FDFA] border-2 border-[#00C2CB]/50 hover:border-[#00C2CB] hover:shadow-xs transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#00C2CB]" />
                <span>ساعدني أختار موبايل</span>
              </button>

              {/* 3D Storefront Entrance Button */}
              {onReopenEntrance && (
                <button
                  onClick={onReopenEntrance}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-[#00C2CB]/10 hover:text-[#00C2CB] border border-slate-200 transition-all flex items-center gap-1.5"
                  title="عرض واجهة المحل ثلاثية الأبعاد"
                >
                  <Compass className="w-3.5 h-3.5 text-[#00C2CB]" />
                  <span>مدخل 3D</span>
                </button>
              )}
            </nav>

            {/* Left Action Icons: Search, Wishlist, Cart, WhatsApp */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Toggle */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2.5 rounded-xl text-slate-700 hover:text-[#00C2CB] hover:bg-slate-100 transition-colors"
                  aria-label="بحث في المنتجات"
                  title="بحث"
                >
                  <Search className="w-5 h-5" />
                </button>

                {searchOpen && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 top-14 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-[#00C2CB]">
                      <Search className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="بتدور على موبايل، شاحن، جراب؟"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        autoFocus
                        className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => onSearchChange("")}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={onOpenWishlist}
                className="relative p-2.5 rounded-xl text-slate-700 hover:text-rose-500 hover:bg-slate-100 transition-colors"
                aria-label="المفضلة"
                title="المفضلة"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={onOpenCart}
                className="relative p-2.5 px-3.5 rounded-xl bg-[#F0FDFA] text-[#0891B2] hover:bg-[#CCFBF1] border border-[#00C2CB]/30 transition-all flex items-center gap-2"
                aria-label="سلة المشتريات"
                title="سلة المشتريات"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="hidden sm:inline text-xs font-extrabold">السلة</span>
                {cartCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#00C2CB] text-white text-xs font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Direct WhatsApp Button */}
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all"
                title="كلمنا على واتساب"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>واتساب</span>
              </a>

              {/* Admin Dashboard shortcut */}
              <Link
                href="/admin"
                className="hidden xl:inline-flex px-2 py-1 text-xs text-slate-400 hover:text-slate-700"
              >
                لوحة الإدارة
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="bg-slate-50 border-t border-slate-200/80 px-4 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2 max-w-7xl mx-auto">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 flex-shrink-0 pl-2">
            <Compass className="w-3.5 h-3.5 text-[#00C2CB]" />
            الأقسام:
          </span>
          {navCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`text-xs px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 font-bold ${
                selectedCategory === cat.id
                  ? "bg-[#00C2CB] text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <DubaiStoreLogo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* AI Assistant Banner */}
              <div className="mt-6 mb-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAIFinder();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-[#F0FDFA] border-2 border-[#00C2CB] text-[#0891B2] font-black text-sm flex items-center justify-between shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#00C2CB]" />
                    <span>مش عارف تختار؟ سيبها علينا!</span>
                  </span>
                  <span>←</span>
                </button>
              </div>

              {/* Category Links */}
              <div className="space-y-1.5 mt-2 max-h-[50vh] overflow-y-auto">
                <p className="text-xs font-bold text-slate-400 px-3 py-1">أقسام المتجر</p>
                {navCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? "bg-[#F0FDFA] text-[#00C2CB]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-xs text-slate-300">←</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Bottom Contact */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              {onReopenEntrance && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onReopenEntrance();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-800 hover:bg-[#00C2CB]/10 hover:text-[#00C2CB] font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-colors"
                >
                  <Compass className="w-4 h-4 text-[#00C2CB]" />
                  <span>زيارة واجهة المحل 3D</span>
                </button>
              )}

              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>كلمنا واتساب: {DUBAI_STORE_PHONE_DISPLAY}</span>
              </a>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-xs text-slate-400 hover:text-slate-600 py-1"
              >
                لوحة تحكم صاحب المحل ←
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
