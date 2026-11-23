"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, Sparkles, MessageCircle } from "lucide-react";
import { withBasePath } from "../../lib/site";
import { getGeneralWhatsAppUrl } from "../../lib/whatsapp";

interface PromoBannerProps {
  onSelectCategory: (categoryId: string) => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div
        onClick={() => onSelectCategory("iphone")}
        className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300"
      >
        {/* Banner Image */}
        <div className="relative w-full aspect-[3.5/1] min-h-[160px] sm:min-h-[220px] md:min-h-[280px]">
          <img
            src={withBasePath("/dubai-store-iphone-banner.jpg")}
            alt="عروض آيفون الحصرية من دبي ستور"
            className="w-full h-full object-cover object-center transform group-hover:scale-[1.01] transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </div>

        {/* Floating Quick Action Overlay on bottom/left */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex items-center gap-2">
          <a
            href={getGeneralWhatsAppUrl("مساء الخير، بتواصل معاكم بخصوص عروض الآيفون الجديدة في دبي ستور.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-105"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">اطلب عبر واتساب</span>
            <span className="sm:hidden">واتساب</span>
          </a>

          <button
            onClick={() => onSelectCategory("iphone")}
            className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-[#00C2CB] text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-sm transition-all"
          >
            <span>استكشف عروض الآيفون</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
