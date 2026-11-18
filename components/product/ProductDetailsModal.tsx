"use client";

import {
  Check,
  CheckCircle2,
  Heart,
  MessageCircle,
  Plus,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  X,
  Zap
} from "lucide-react";
import React, { useState } from "react";
import { Product, ProductColor } from "../../lib/types";
import { DUBAI_STORE_PHONE_DISPLAY, getProductWhatsAppUrl } from "../../lib/whatsapp";

interface ProductDetailsModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color?: ProductColor, storage?: string, quantity?: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  allProducts: Product[];
  onOpenProduct: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  allProducts,
  onOpenProduct,
}) => {
  if (!product) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors?.[0] || { name: "أساسي", hex: "#000000" }
  );
  const [selectedStorage, setSelectedStorage] = useState<string>(
    product.storageOptions?.[0] || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Compatible accessories
  const compatibleItems = allProducts.filter((p) =>
    product.compatibleAccessories?.includes(p.id)
  );

  // "ممكن يعجبك كمان" (Related products in same category or brand)
  const similarItems = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 3);

  const handleAdd = () => {
    onAddToCart(product, selectedColor, selectedStorage, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  const handleWhatsApp = () => {
    const url = getProductWhatsAppUrl(product, selectedColor, selectedStorage);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const currentImage = product.images[activeImageIdx] || product.images[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-auto flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-b border-slate-200">
            {/* Gallery Column */}
            <div className="md:col-span-6 bg-slate-50 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-l border-slate-200">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#F0FDFA] text-[#00C2CB] border border-[#00C2CB]/30">
                  {product.brand}
                </span>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className="p-2 rounded-full bg-white shadow-2xs text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Main Image */}
              <div className="relative aspect-square w-full my-4 flex items-center justify-center">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center justify-center gap-2 pt-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`w-14 h-14 rounded-xl bg-white p-1 border transition-all overflow-hidden ${
                        activeImageIdx === i
                          ? "border-[#00C2CB] ring-2 ring-[#00C2CB]/30"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Features */}
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-around text-center text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <Shield className="w-4 h-4" />
                  <span>أصلي 100% بالضمان</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-[#00C2CB]">
                  <Truck className="w-4 h-4" />
                  <span>شحن سريع لجميع المحافظات</span>
                </div>
              </div>
            </div>

            {/* Product Details Column */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-5">
                {/* Product Name & Availability */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        product.isAvailable && product.stock > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {product.isAvailable && product.stock > 0
                        ? `متوفر في المخزن (${product.stock} قطع)`
                        : "خلص من المخزن"}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {product.name}
                  </h2>

                  {/* Price */}
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-black text-slate-950">
                      {product.price.toLocaleString()} ج.م
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-slate-400 line-through">
                        {product.originalPrice.toLocaleString()} ج.م
                      </span>
                    )}
                    {product.discountPercentage && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-black bg-rose-50 text-rose-600 border border-rose-200">
                        وفر {product.discountPercentage}%
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {product.description}
                  </p>
                </div>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-2">
                      اللون المتاح: <span className="text-[#00C2CB]">{selectedColor.name}</span>
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.colors.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                            selectedColor.name === c.name
                              ? "border-[#00C2CB] bg-[#F0FDFA] text-[#00C2CB] ring-2 ring-[#00C2CB]/30"
                              : "border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Storage Selection */}
                {product.storageOptions && product.storageOptions.length > 0 && (
                  <div>
                    <label className="text-xs font-black text-slate-800 block mb-2">
                      المساحة: <span className="text-[#00C2CB]">{selectedStorage}</span>
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.storageOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedStorage(opt)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all ${
                            selectedStorage === opt
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications Sheet */}
                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                      المواصفات الفنية
                    </h4>
                    <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 text-xs space-y-1.5">
                      {Object.entries(product.specs).map(([label, val]) => (
                        <div
                          key={label}
                          className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-200/60 pb-1.5 last:border-b-0 last:pb-0"
                        >
                          <span className="font-bold text-slate-500 sm:w-1/3">{label}</span>
                          <span className="font-semibold text-slate-900 sm:w-2/3">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions: ضيف للسلة + اطلب على واتساب */}
              <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">العدد المطلوب:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-slate-600 hover:text-slate-900 font-black"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-black text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-slate-600 hover:text-slate-900 font-black"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleAdd}
                    disabled={!product.isAvailable || product.stock <= 0}
                    className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                      addedSuccess
                        ? "bg-emerald-600 text-white"
                        : product.isAvailable && product.stock > 0
                        ? "bg-slate-900 hover:bg-[#00C2CB] text-white active:scale-98"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>اتضاف للسلة!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>ضيف للسلة</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>اطلب على واتساب</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subsections: "إكسسوارات مناسبة للموبايل ده" + "ممكن يعجبك كمان" */}
          <div className="p-6 sm:p-8 space-y-8 bg-slate-50/50">
            {/* 1. إكسسوارات مناسبة للموبايل ده */}
            {compatibleItems.length > 0 && (
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#00C2CB]" />
                  <span>إكسسوارات مناسبة للموبايل ده</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {compatibleItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div
                        onClick={() => onOpenProduct(item)}
                        className="flex items-center gap-2.5 cursor-pointer min-w-0"
                      >
                        <img
                          src={item.images[0]}
                          alt=""
                          className="w-10 h-10 object-contain rounded bg-slate-50 p-1 border border-slate-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-800 truncate">{item.name}</p>
                          <p className="text-xs font-black text-[#00C2CB]">{item.price.toLocaleString()} ج.م</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-[#00C2CB] hover:text-white text-slate-800 font-bold text-xs flex items-center gap-1 transition-colors flex-shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. ممكن يعجبك كمان */}
            {similarItems.length > 0 && (
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 mb-3">
                  ممكن يعجبك كمان
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {similarItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onOpenProduct(item)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-[#00C2CB] cursor-pointer transition-all flex items-center gap-3 shadow-2xs"
                    >
                      <img
                        src={item.images[0]}
                        alt=""
                        className="w-12 h-12 object-contain bg-slate-50 rounded-xl p-1 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs font-black text-[#00C2CB] mt-0.5">{item.price.toLocaleString()} ج.م</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
