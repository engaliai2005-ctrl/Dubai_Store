"use client";

import { Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error silently for debugging in dev
    if (process.env.NODE_ENV === "development") {
      console.error("[GlobalError]", error);
    }
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-gradient-to-b from-[#F0FDFA] to-slate-50 flex flex-col items-center justify-center px-4 text-center font-sans">
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

        {/* Error Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-xl border border-amber-200 flex items-center justify-center mb-6">
          <span className="text-4xl sm:text-5xl select-none">⚡</span>
        </div>

        {/* Message */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
          حصلت مشكلة مؤقتة
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-sm leading-relaxed font-medium mb-8">
          حصل خطأ غير متوقع. جرب تحدّث الصفحة أو ارجع للرئيسية وكلمنا على واتساب لو المشكلة اتكررت.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#00C2CB] hover:bg-[#0891B2] text-white font-black text-sm shadow-lg shadow-[#00C2CB]/25 transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>حاول تاني</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-black text-sm border border-slate-200 shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>الرئيسية</span>
          </Link>
        </div>

        <p className="mt-10 text-xs text-slate-400 font-medium">
          دبي ستور • موبايلات وإكسسوارات أصلية في مصر
        </p>
      </body>
    </html>
  );
}
