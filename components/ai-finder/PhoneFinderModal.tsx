"use client";

import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ArrowRight,
  Battery,
  Camera,
  Check,
  CheckCircle2,
  DollarSign,
  Gamepad2,
  HardDrive,
  Layers,
  MessageCircle,
  Plus,
  RotateCcw,
  Smartphone,
  Sparkles,
  Star,
  X,
  Zap
} from "lucide-react";
import React, { useState } from "react";
import { computePhoneRecommendations } from "../../lib/ai-engine";
import { AIQuestionnaireAnswers, AIRecommendationResult, Product } from "../../lib/types";
import { getProductWhatsAppUrl } from "../../lib/whatsapp";

interface PhoneFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalog: Product[];
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const PhoneFinderModal: React.FC<PhoneFinderModalProps> = ({
  isOpen,
  onClose,
  catalog,
  onOpenProduct,
  onAddToCart,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AIRecommendationResult[] | null>(null);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const [answers, setAnswers] = useState<AIQuestionnaireAnswers>({
    budget: "above-50000",
    priority: "camera",
    brand: "any",
    storage: "256 جيجا",
    primaryUsage: "photography",
  });

  if (!isOpen) return null;

  // The 5 Egyptian Questions
  const questions = [
    {
      id: "budget",
      title: "ميزانيتك كام؟",
      subtitle: "حدد المبلغ التقريبي اللي مجهزه لشراء موبايلك الجديد.",
      icon: DollarSign,
      options: [
        { label: "أقل من 15,000 ج.م", value: "under-15000", desc: "فئة اقتصادية وعملية جداً" },
        { label: "من 15,000 إلى 30,000 ج.م", value: "15000-30000", desc: "فئة متوسطة عليا وأداء ممتاز" },
        { label: "من 30,000 إلى 50,000 ج.م", value: "30000-50000", desc: "موبايلات فلاجشيب ومواصفات قوية" },
        { label: "أكتر من 50,000 ج.م", value: "above-50000", desc: "أعلى فئة (آيفون 16 برو، S25 ألترا)" },
      ],
    },
    {
      id: "priority",
      title: "أهم حاجة عندك في الموبايل إيه؟",
      subtitle: "عشان نوجهك للموبايل اللي هيريحك أكتر في استخدامك.",
      icon: Star,
      options: [
        { label: "كاميرا وتصوير احترافي", value: "camera", desc: "صور نقية وفيديوهات 4K وثبات عالي" },
        { label: "ألعاب وأداء سريع جداً", value: "gaming", desc: "شاشة 120Hz ومعالج جبار بدون أي تهنيج" },
        { label: "بطارية تكفيني اليوم كله بزيادة", value: "battery", desc: "شحن سريع وبطارية تقعد معاك اليوم كامل" },
        { label: "تصميم فخم وخامات ممتازة", value: "design", desc: "شياكة، خامات تيتانيوم وفخامة في الإيد" },
      ],
    },
    {
      id: "brand",
      title: "بتحب آيفون ولا سامسونج ولا مش فارقة؟",
      subtitle: "اختار النظام اللي بترتاحله في الاستخدام.",
      icon: Smartphone,
      options: [
        { label: "آبل (آيفون - iOS)", value: "apple", desc: "سهولة، أمان ونظام آبل المتكامل" },
        { label: "سامسونج (Galaxy - أندرويد)", value: "samsung", desc: "شاشات خرافية وذكاء اصطناعي وقلم" },
        { label: "مش فارقة.. رشحلي الأفضل بسعري", value: "any", desc: "عاوز أحسن موبايل بالميزانية دي" },
      ],
    },
    {
      id: "primaryUsage",
      title: "بتستخدم الموبايل في إيه أكتر؟",
      subtitle: "طبيعة يومك وشغلك مع التليفون.",
      icon: Layers,
      options: [
        { label: "تصوير وفيديوهات وسوشيال ميديا", value: "photography", desc: "إنستجرام وتيك توك وصور تذكارية" },
        { label: "ألعاب تقيلة (ببجي، كول أوف ديوتي)", value: "gaming", desc: "جيمينج مكثف ومحتاج فريمات عالية" },
        { label: "شغل ومكالمات وإيميلات", value: "work", desc: "شغل يومي وتنقل سريع بين التطبيقات" },
        { label: "استخدام عادي ومسلسلات", value: "entertainment", desc: "يوتيوب، نتفليكس وتصفح خفيف" },
      ],
    },
    {
      id: "storage",
      title: "محتاج مساحة تخزين قد إيه؟",
      subtitle: "حسب كمية الصور والفيديوهات والتطبيقات اللي بتنزلها.",
      icon: HardDrive,
      options: [
        { label: "128 جيجا", value: "128 جيجا", desc: "كافية للاستخدام اليومي المعتدل" },
        { label: "256 جيجا (الموصى بها)", value: "256 جيجا", desc: "الأنسب لتصوير الفيديوهات والألعاب" },
        { label: "512 جيجا أو 1 تيرا", value: "512 جيجا", desc: "مساحة ضخمة جداً لشغل المحتوى وصناع الأفلام" },
        { label: "مش فارقة معايا أوي", value: "مش فارقة", desc: "اختارلي المساحة القياسية المناسبة" },
      ],
    },
  ];

  const currentQ = questions[currentStep];

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        const recs = computePhoneRecommendations(answers, catalog);
        setResults(recs);
        setIsAnalyzing(false);

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#00C2CB", "#00E5FF", "#0891B2", "#10B981"],
          });
        } catch {
          // fallback
        }
      }, 900);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setResults(null);
    setIsAnalyzing(false);
  };

  const handleAddAccessory = (acc: Product) => {
    onAddToCart(acc);
    setAddedItems((prev) => ({ ...prev, [acc.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [acc.id]: false }));
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#00C2CB]/20 text-[#00C2CB]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                مش عارف تختار موبايل؟ سيبها علينا!
              </h2>
              <p className="text-xs text-slate-300">
                جاوب على 5 أسئلة سريعة وهنرشحلك أفضل 3 موبايلات مناسبين ليك وموجودين في المحل
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {isAnalyzing ? (
            /* Analyzing state */
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-5">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                <div className="absolute inset-0 rounded-full border-4 border-[#00C2CB] border-t-transparent animate-spin" />
                <div className="absolute inset-2.5 rounded-full bg-[#F0FDFA] flex items-center justify-center text-[#00C2CB]">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  بنراجع مواصفات الموبايلات المتاحة في المخزن...
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  بنشوف الموبايلات المتطابقة مع ميزانيتك، قوة الكاميرا والبطارية عشان نطلعلك الأنسب ليك.
                </p>
              </div>
            </div>
          ) : results ? (
            /* Results Screen */
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                    تم تحليل طلبك بنجاح
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                    أفضل 3 موبايلات مناسبين ليك في دبي ستور:
                  </h3>
                </div>

                <button
                  onClick={handleRestart}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ابدأ من جديد</span>
                </button>
              </div>

              {/* 3 Recommended Phones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.map((result, idx) => {
                  const phone = result.product;
                  const ranks = ["المطابق الأول ⭐", "اختيار بديل ممتاز", "اختيار مناسب جداً"];

                  return (
                    <div
                      key={phone.id}
                      className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                        idx === 0
                          ? "bg-[#F0FDFA] border-[#00C2CB] ring-2 ring-[#00C2CB]/30"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div>
                        {/* Rank & Score */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                              idx === 0
                                ? "bg-[#00C2CB] text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {ranks[idx]}
                          </span>
                          <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            تطابق {result.matchScore}%
                          </span>
                        </div>

                        {/* Image */}
                        <div className="aspect-square w-full bg-white rounded-xl p-3 flex items-center justify-center my-2 border border-slate-100">
                          <img
                            src={phone.images[0]}
                            alt={phone.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Name & Price */}
                        <span className="text-[10px] font-black text-[#00C2CB]">{phone.brand}</span>
                        <h4 className="text-xs font-black text-slate-900 line-clamp-1 mt-0.5">
                          {phone.name}
                        </h4>
                        <p className="text-sm font-black text-slate-950 mt-1">
                          {phone.price.toLocaleString()} ج.م
                        </p>

                        {/* Why this matches */}
                        <div className="mt-2.5 p-2.5 rounded-xl bg-white border border-slate-100 text-[11px] text-slate-600 leading-relaxed font-medium">
                          <strong className="text-slate-900 block mb-0.5">ليه الموبايل ده يناسبك؟</strong>
                          {result.reason}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-1.5">
                        <button
                          onClick={() => {
                            onClose();
                            onOpenProduct(phone);
                          }}
                          className="w-full py-2 rounded-xl bg-slate-900 hover:bg-[#00C2CB] text-white text-xs font-black transition-colors"
                        >
                          شوف تفاصيل الموبايل
                        </button>

                        <a
                          href={getProductWhatsAppUrl(phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-black transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>اطلب على واتساب</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Complete your setup: كمل تجهيز موبايلك */}
              {results[0] && results[0].suggestedAccessories.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="mb-3">
                    <h4 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#00C2CB]" />
                      <span>كمل تجهيز موبايلك</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      إكسسوارات أصلية متوافقة مع الموبايل المختار لحمايته وشحنه بأقصى سرعة.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {results[0].suggestedAccessories.map((acc) => {
                      const isAdded = addedItems[acc.id];

                      return (
                        <div
                          key={acc.id}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={acc.images[0]}
                              alt=""
                              className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-slate-100 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="text-[11px] font-black text-slate-900 truncate">
                                {acc.name}
                              </h5>
                              <p className="text-xs font-black text-[#00C2CB]">
                                {acc.price.toLocaleString()} ج.م
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddAccessory(acc)}
                            className={`mt-2.5 w-full py-1.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                              isAdded
                                ? "bg-emerald-600 text-white"
                                : "bg-white border border-slate-200 hover:border-[#00C2CB] text-slate-800"
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>اتضاف للسلة!</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 text-[#00C2CB]" />
                                <span>ضيف للسلة</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 5-Step Questions */
            <div className="space-y-5">
              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1.5">
                  <span>
                    السؤال <strong className="text-slate-800">{currentStep + 1}</strong> من{" "}
                    <strong>{questions.length}</strong>
                  </span>
                  <span className="text-[#00C2CB] font-black">
                    {Math.round(((currentStep + 1) / questions.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-[#00C2CB] transition-all duration-300"
                    style={{
                      width: `${((currentStep + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {currentQ.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentQ.subtitle}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {currentQ.options.map((opt) => {
                  const isSelected =
                    (answers as unknown as Record<string, string>)[currentQ.id] === opt.value;

                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectOption(opt.value)}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex items-start justify-between ${
                        isSelected
                          ? "bg-[#F0FDFA] border-[#00C2CB] ring-2 ring-[#00C2CB]/30"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div>
                        <p
                          className={`text-xs sm:text-sm font-black ${
                            isSelected ? "text-[#00C2CB]" : "text-slate-900"
                          }`}
                        >
                          {opt.label}
                        </p>
                        {opt.desc && (
                          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                            {opt.desc}
                          </p>
                        )}
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 ${
                          isSelected
                            ? "bg-[#00C2CB] border-[#00C2CB] text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Nav */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>السابق</span>
                </button>

                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-[#00C2CB] text-white text-xs font-black flex items-center gap-1.5 transition-colors"
                >
                  <span>
                    {currentStep === questions.length - 1
                      ? "شوف الترشيحات"
                      : "التالي"}
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
