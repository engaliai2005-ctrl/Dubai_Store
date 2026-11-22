"use client";

import { MessageCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { DUBAI_STORE_PHONE_DISPLAY, getGeneralWhatsAppUrl } from "../../lib/whatsapp";

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Show tooltip after 3 seconds so it doesn't block initial load
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start floating-whatsapp" dir="rtl">
      {/* Interactive Tooltip Card — Egyptian Arabic */}
      {showTooltip && (
        <div className="mb-3 max-w-[220px] sm:max-w-xs bg-white text-slate-800 p-3.5 rounded-2xl shadow-2xl border border-emerald-100 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] mt-1 flex-shrink-0 animate-pulse" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-slate-900">دبي ستور</span>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 flex-shrink-0"
                aria-label="إغلاق"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              محتاج مساعدة في اختيار موبايل أو تعرف عن عروض النهارده؟
            </p>
            <div className="mt-1.5 text-[10px] text-emerald-600 font-bold">
              متاح الآن • {DUBAI_STORE_PHONE_DISPLAY}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={getGeneralWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_8px_25px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="تواصل معانا على واتساب"
        onClick={() => setShowTooltip(false)}
      >
        {/* Radar Pulse Ring */}
        <span className="absolute -inset-1.5 rounded-full bg-emerald-400 opacity-30 animate-ping pointer-events-none" />

        <MessageCircle className="w-7 h-7 relative z-10" />

        {/* Live indicator dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00C2CB] border-2 border-white shadow-xs z-20" />
      </a>
    </div>
  );
};
