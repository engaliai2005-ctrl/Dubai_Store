"use client";

import { ArrowLeft, CheckCircle2, Compass, ShieldCheck, Sparkles, Truck, Zap } from "lucide-react";
import React from "react";

interface HeroProps {
  onExploreClick: () => void;
  onOpenAIFinder: () => void;
  onReopenEntrance?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onOpenAIFinder,
  onReopenEntrance,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0FDFA] via-[#F8FAFC] to-white pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-slate-200">
      {/* Subtle turquoise background aura */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#00C2CB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Right Column in RTL: Main Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#00C2CB]/40 shadow-2xs mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00C2CB] animate-pulse" />
              <span className="text-xs font-bold text-slate-800">
                متجر دبي ستور • أحدث الأجهزة الأصلية في مصر
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.2]">
              كل اللي محتاجه لموبايلك.. <br />
              <span className="text-[#00C2CB]">
                هتلاقيه عندنا
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed font-medium">
              اختار موبايلك من أحدث الموديلات، وشوف الإكسسوارات والعروض اللي تناسبك.
            </p>

            {/* Two Main CTA Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={onExploreClick}
                className="px-8 py-3.5 rounded-2xl bg-[#00C2CB] hover:bg-[#0891B2] text-white font-extrabold text-sm shadow-md shadow-[#00C2CB]/30 transition-all flex items-center gap-2 transform active:scale-98"
              >
                <span>اتفرج على الموبايلات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAIFinder}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-[#0891B2] font-bold text-sm border-2 border-[#00C2CB]/50 hover:border-[#00C2CB] shadow-2xs transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#00C2CB]" />
                <span>ساعدني أختار</span>
              </button>

              {onReopenEntrance && (
                <button
                  onClick={onReopenEntrance}
                  className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-[#00C2CB]" />
                  <span>دخول المحل 3D</span>
                </button>
              )}
            </div>

            {/* Value Highlights */}
            <div className="mt-8 pt-6 border-t border-slate-200 w-full grid grid-cols-3 gap-4 text-right">
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900">100%</p>
                <p className="text-xs text-slate-500 font-bold">أصلي ومضمون</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-slate-900">فوري</p>
                <p className="text-xs text-slate-500 font-bold">طلب عبر واتساب</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-[#00C2CB]">سريع</p>
                <p className="text-xs text-slate-500 font-bold">شحن لكل المحافظات</p>
              </div>
            </div>
          </div>

          {/* Left Column in RTL: Beautiful Smartphone Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200">
              {/* Product Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-[#F0FDFA] text-[#00C2CB] border border-[#00C2CB]/30">
                  وصل حديثاً
                </span>
                <span className="text-xs font-bold text-slate-900">
                  آيفون 16 برو ماكس
                </span>
              </div>

              {/* Image */}
              <div className="relative my-4 aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#F0FDFA] to-slate-50 flex items-center justify-center p-3">
                <img
                  src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80"
                  alt="iPhone 16 Pro Max"
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold block">سعر الكاش</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-black text-slate-950">78,500 ج.م</span>
                    <span className="text-xs text-slate-400 line-through">83,000 ج.م</span>
                  </div>
                </div>

                <button
                  onClick={onExploreClick}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#00C2CB] text-white text-xs font-bold transition-colors"
                >
                  شوف التفاصيل
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
