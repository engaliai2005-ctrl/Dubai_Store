"use client";

import { MessageCircle, X } from "lucide-react";
import React, { useState } from "react";
import { DUBAI_STORE_PHONE_DISPLAY, getGeneralWhatsAppUrl } from "../../lib/whatsapp";

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Interactive Tooltip Card */}
      {showTooltip && (
        <div className="mb-3 max-w-xs bg-white text-slate-800 p-3.5 rounded-2xl shadow-2xl border border-slate-100 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] mt-1 flex-shrink-0 animate-ping" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Dubai Store Expert</span>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                aria-label="Close tooltip"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Need assistance choosing a phone or inquiring about today’s discounts?
            </p>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-emerald-600 font-semibold">
              <span>Online • {DUBAI_STORE_PHONE_DISPLAY}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={getGeneralWhatsAppUrl("Hello Dubai Store! I would like to ask about your available mobile phones and accessories.")}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_8px_25px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:scale-110 active:scale-95"
        aria-label="Order or Chat on WhatsApp"
      >
        {/* Radar Pulse Ring */}
        <span className="absolute -inset-1.5 rounded-full bg-emerald-400 opacity-40 group-hover:animate-ping pointer-events-none" />

        <MessageCircle className="w-7 h-7 relative z-10" />

        {/* Small live notification indicator dot */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00E5FF] border-2 border-white shadow-xs z-20" />
      </a>
    </div>
  );
};
