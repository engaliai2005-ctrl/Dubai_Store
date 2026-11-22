import { Home, Search, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الصفحة مش موجودة | دبي ستور",
  description: "الصفحة اللي بتدور عليها مش موجودة. ارجع للرئيسية وشوف أحدث موبايلاتنا.",
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#F0FDFA] to-slate-50 flex flex-col items-center justify-center px-4 text-center font-sans"
      dir="rtl"
    >
      {/* Brand */}
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.jpg"
          alt="Dubai Store"
          className="w-14 h-14 rounded-2xl object-contain border border-[#00C2CB]/30 shadow-md"
        />
        <span className="text-xl font-black text-slate-900 group-hover:text-[#00C2CB] transition-colors">
          دبي ستور
        </span>
      </Link>

      {/* 404 Illustration */}
      <div className="relative mb-8">
        <div className="text-[120px] sm:text-[160px] font-black text-[#00C2CB]/15 select-none leading-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-xl border border-[#00C2CB]/30 flex items-center justify-center">
            <Search className="w-9 h-9 sm:w-11 sm:h-11 text-[#00C2CB]" />
          </div>
        </div>
      </div>

      {/* Message */}
      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
        الصفحة دي مش موجودة
      </h1>
      <p className="text-sm sm:text-base text-slate-500 max-w-sm leading-relaxed font-medium mb-8">
        يمكن الرابط اتغير أو الصفحة اتحذفت. ارجع للرئيسية وشوف أحدث موبايلاتنا وعروضنا.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#00C2CB] hover:bg-[#0891B2] text-white font-black text-sm shadow-lg shadow-[#00C2CB]/25 transition-all hover:scale-105 active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>ارجع للرئيسية</span>
        </Link>

        <a
          href="https://wa.me/201008135160?text=مرحبا، أحتاج مساعدة"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95"
        >
          <MessageCircle className="w-4 h-4" />
          <span>تواصل معانا</span>
        </a>
      </div>

      {/* Footer note */}
      <p className="mt-10 text-xs text-slate-400 font-medium">
        دبي ستور • موبايلات وإكسسوارات أصلية في مصر
      </p>
    </div>
  );
}
