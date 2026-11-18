"use client";

import { CheckCircle2, Clock, MapPin, Phone, ShieldCheck, Sparkles, Truck } from "lucide-react";
import Link from "next/link";
import React from "react";
import { DUBAI_STORE_PHONE_DISPLAY, getGeneralWhatsAppUrl } from "../../lib/whatsapp";
import { DubaiStoreLogo } from "../ui/Logo";

interface FooterProps {
  onOpenAIFinder: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAIFinder,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-slate-900 text-white pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="p-2.5 rounded-xl bg-[#00C2CB]/10 text-[#00C2CB] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">منتجات أصلية 100%</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">
                جميع الموبايلات والإكسسوارات جديدة بالكرتونة والضمان وسيريال رسمي معتمد.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">طلب فوري على واتساب</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">
                تواصل مباشر وسريع للرد على كل استفساراتك وتأكيد طلبك في ثواني.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="p-2.5 rounded-xl bg-[#00C2CB]/10 text-[#00C2CB] flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">توصيل سريع في مصر</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">
                شحن وتوصيل آمن لباب البيت في القاهرة، الجيزة، الإسكندرية وجميع المحافظات.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="p-2.5 rounded-xl bg-[#00C2CB]/10 text-[#00C2CB] flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">مساعد ذكي لاختيار الموبايل</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">
                نظام ذكي بيساعدك تختار أنسب موبايل يوافق ميزانيتك واحتياجاتك بدون حيرة.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="bg-white p-2.5 rounded-2xl inline-block">
              <DubaiStoreLogo size="md" clickable={false} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              دبي ستور هو وجهتك الأولى في مصر لأحدث الهواتف الذكية الأصلية من آبل وسامسونج، والإكسسوارات والشواحن المعتمدة بأسعار تنافسية.
            </p>

            <div className="space-y-2 text-xs text-slate-300 font-medium pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00C2CB]" />
                <span>مصر • متجر دبي ستور للموبايل والإكسسوارات</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00C2CB]" />
                <span>مفتوح يومياً: من 10:00 صباحاً حتى 11:30 مساءً</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 font-bold"
                >
                  واتساب المبيعات: {DUBAI_STORE_PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h5 className="text-xs font-black text-white uppercase tracking-wider">أقسام المتجر</h5>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => onSelectCategory("iphone")}
                  className="hover:text-[#00C2CB] transition-colors"
                >
                  آيفون (iPhone)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("samsung")}
                  className="hover:text-[#00C2CB] transition-colors"
                >
                  سامسونج جالاكسي (Samsung)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("smartwatches")}
                  className="hover:text-[#00C2CB] transition-colors"
                >
                  ساعات سمارت
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("earbuds")}
                  className="hover:text-[#00C2CB] transition-colors"
                >
                  سماعات وإيربودز
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("chargers")}
                  className="hover:text-[#00C2CB] transition-colors"
                >
                  شواحن وكابلات أصلية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("cases")}
                  className="hover:text-[#00C2CB] transition-colors"
                >
                  جرابات حماية وماج سيف
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Features */}
          <div className="space-y-3">
            <h5 className="text-xs font-black text-white uppercase tracking-wider">روابط سريعة</h5>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={onOpenAIFinder}
                  className="hover:text-[#00C2CB] transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00C2CB]" />
                  <span>مش عارف تختار موبايل؟ سيبها علينا!</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory("all")}
                  className="hover:text-[#00C2CB] transition-colors"
                >
                  كل المنتجات المتاحة
                </button>
              </li>
              <li>
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  طلب أسعار الجملة أو الاستفسارات
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-slate-200 transition-colors">
                  لوحة تحكم صاحب المحل (/admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct */}
          <div className="space-y-3">
            <h5 className="text-xs font-black text-white uppercase tracking-wider">تواصل مباشر فوري</h5>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              عندك سؤال عن أي موبايل أو حابب تتأكد من الألوان المتاحة؟ فريق دبي ستور هيرد عليك فوراً.
            </p>
            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>كلمنا على واتساب</span>
            </a>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 pt-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>متاحين حالياً للرد على الرسائل</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} دبي ستور (Dubai Store). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-slate-300">
              لوحة الإدارة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
