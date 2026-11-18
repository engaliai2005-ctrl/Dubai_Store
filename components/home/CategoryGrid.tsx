"use client";

import { ArrowLeft } from "lucide-react";
import React from "react";
import { Category, Product } from "../../lib/types";

interface CategoryGridProps {
  categories: Category[];
  products: Product[];
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  products,
  onSelectCategory,
}) => {
  // Count available products per category
  const getProductCount = (catId: string) => {
    return products.filter((p) => p.category === catId).length;
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDFA] text-[#00C2CB] text-xs font-bold mb-2">
              تصفح حسب القسم
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              أقسام المتجر
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              اختر القسم اللي بتدور عليه واستكشف أحدث الموبايلات والإكسسوارات الأصلية.
            </p>
          </div>

          <button
            onClick={() => onSelectCategory("all")}
            className="text-xs sm:text-sm font-bold text-[#00C2CB] hover:text-[#0891B2] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>عرض كل المنتجات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* 9 Categories Grid - Clean & Consistent */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {categories.map((category) => {
            const count = getProductCount(category.id);

            return (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="group relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 hover:border-[#00C2CB] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Category Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                  {/* Badge */}
                  {category.badge && (
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-black text-[#00C2CB] shadow-2xs">
                      {category.badge}
                    </div>
                  )}

                  {/* Title on Image */}
                  <div className="absolute bottom-2.5 right-3 left-3">
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#A5F3FC] transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Footer with Count & CTA */}
                <div className="p-3 sm:p-4 bg-white flex items-center justify-between border-t border-slate-100">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500">
                    {count > 0 ? `متوفر ${count} منتجات` : "متوفر في المتجر"}
                  </span>

                  <span className="text-xs font-black text-[#00C2CB] group-hover:text-[#0891B2] flex items-center gap-1 transition-colors">
                    <span>تصفح</span>
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
