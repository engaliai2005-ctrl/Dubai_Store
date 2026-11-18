"use client";

import { ArrowUpDown, Check, Filter, RotateCcw, Search, SlidersHorizontal, Tag, X } from "lucide-react";
import React, { useState } from "react";
import { Category } from "../../lib/types";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  selectedStorage: string;
  onSelectStorage: (storage: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  inStockOnly: boolean;
  onToggleInStockOnly: () => void;
  discountedOnly: boolean;
  onToggleDiscountedOnly: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
  totalProductsCount: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  selectedStorage,
  onSelectStorage,
  priceRange,
  onPriceRangeChange,
  inStockOnly,
  onToggleInStockOnly,
  discountedOnly,
  onToggleDiscountedOnly,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  onResetFilters,
  totalProductsCount,
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const brands = ["الكل", "Apple", "Samsung", "Google", "Anker", "Spigen"];
  const storages = ["الكل", "128 جيجا", "256 جيجا", "512 جيجا", "1 تيرا"];

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedBrand !== "الكل" ? 1 : 0) +
    (selectedStorage !== "الكل" ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (discountedOnly ? 1 : 0) +
    (priceRange[1] < 90000 ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Search & Sort Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Prominent Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بتدور على موبايل، ماركة، إكسسوار؟"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pr-10 pl-8 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#00C2CB] focus:bg-white text-slate-900 placeholder-slate-400 transition-all font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls: Sort & Mobile Filter */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2.5">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#00C2CB]" />
            <span>فلترة المنتجات</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#00C2CB] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            <span className="hidden sm:inline font-bold">الترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#00C2CB]"
            >
              <option value="popularity">الأكثر مبيعاً</option>
              <option value="newest">وصل حديثاً</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
              <option value="discount">أعلى نسبة خصم</option>
            </select>
          </div>

          {/* Reset Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors flex items-center gap-1"
              title="إعادة تعيين الفلاتر"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">مسح الفلاتر</span>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden md:block bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {/* Row 1: Brands */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black text-slate-700 pl-2">
            الماركة:
          </span>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => onSelectBrand(brand)}
              className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all ${
                selectedBrand === brand
                  ? "bg-[#00C2CB] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Row 2: Storage & Quick Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3.5 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black text-slate-700 pl-2">
              المساحة:
            </span>
            {storages.map((storage) => (
              <button
                key={storage}
                onClick={() => onSelectStorage(storage)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedStorage === storage
                    ? "bg-[#00C2CB] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {storage}
              </button>
            ))}
          </div>

          {/* In Stock & Sale Toggles */}
          <div className="flex items-center gap-5 text-xs font-bold text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={onToggleInStockOnly}
                className="w-4 h-4 rounded text-[#00C2CB] focus:ring-[#00C2CB] border-slate-300"
              />
              <span>المتاح حاليًا فقط</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={discountedOnly}
                onChange={onToggleDiscountedOnly}
                className="w-4 h-4 rounded text-[#00C2CB] focus:ring-[#00C2CB] border-slate-300"
              />
              <span>العروض والخصومات فقط</span>
            </label>
          </div>
        </div>

        {/* Row 3: Price Slider & Count */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <span className="text-xs font-black text-slate-700 whitespace-nowrap">
              السعر حتى:
            </span>
            <input
              type="range"
              min="1000"
              max="90000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-[#00C2CB]"
            />
            <span className="text-xs font-black text-[#00C2CB] whitespace-nowrap min-w-[80px]">
              {priceRange[1].toLocaleString()} ج.م
            </span>
          </div>

          <div className="text-xs font-bold text-slate-500">
            معروض <strong className="text-slate-900">{totalProductsCount}</strong> منتج
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex items-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full bg-white rounded-t-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto z-10 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#00C2CB]" />
                <h3 className="font-black text-base text-slate-900">فلترة المنتجات</h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* Brand */}
              <div>
                <p className="text-xs font-black text-slate-700 mb-2">الماركة</p>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => onSelectBrand(b)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        selectedBrand === b
                          ? "bg-[#00C2CB] text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage */}
              <div>
                <p className="text-xs font-black text-slate-700 mb-2">المساحة التخزينية</p>
                <div className="flex flex-wrap gap-2">
                  {storages.map((s) => (
                    <button
                      key={s}
                      onClick={() => onSelectStorage(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        selectedStorage === s
                          ? "bg-[#00C2CB] text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs font-black text-slate-700 mb-2">
                  <span>السعر حتى</span>
                  <span className="text-[#00C2CB]">{priceRange[1].toLocaleString()} ج.م</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="90000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => onPriceRangeChange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-[#00C2CB]"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={onToggleInStockOnly}
                    className="w-4 h-4 rounded text-[#00C2CB]"
                  />
                  <span>المتاح حاليًا فقط</span>
                </label>
                <label className="flex items-center gap-3 text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={discountedOnly}
                    onChange={onToggleDiscountedOnly}
                    className="w-4 h-4 rounded text-[#00C2CB]"
                  />
                  <span>العروض والخصومات فقط</span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={onResetFilters}
                className="w-1/3 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                مسح الفلاتر
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                تطبيق ({totalProductsCount} منتج)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
