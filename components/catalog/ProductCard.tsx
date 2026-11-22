"use client";

import { Check, Heart, MessageCircle, Star } from "lucide-react";
import React, { useState } from "react";
import { Product } from "../../lib/types";
import { getProductWhatsAppUrl } from "../../lib/whatsapp";

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23F1F5F9'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='40' fill='%2394A3B8'%3E📱%3C/text%3E%3C/svg%3E";

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getProductWhatsAppUrl(product, product.colors?.[0], product.storageOptions?.[0]);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  const imgSrc = imgError
    ? FALLBACK_IMG
    : product.images?.[0] || FALLBACK_IMG;

  const isAvailable = product.isAvailable && product.stock > 0;

  return (
    <div
      onClick={() => onOpenDetails(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpenDetails(product)}
      aria-label={`${product.name} - ${product.price.toLocaleString()} ج.م`}
      className="group relative rounded-2xl sm:rounded-3xl bg-white border border-slate-200 hover:border-[#00C2CB] hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00C2CB] focus-visible:outline-none"
    >
      {/* Top Badges & Wishlist */}
      <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 flex-wrap">
          {product.discountPercentage && product.discountPercentage > 0 ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-600 text-white shadow-xs">
              خصم {product.discountPercentage}%
            </span>
          ) : null}

          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-[#F0FDFA] text-[#00C2CB] border border-[#00C2CB]/30">
              جديد
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="pointer-events-auto p-1.5 sm:p-2 rounded-full bg-white/90 shadow-xs hover:bg-white text-slate-400 hover:text-rose-500 transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
          aria-label={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? "fill-rose-500 text-rose-500" : ""
            }`}
          />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-50 p-4 sm:p-6 flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
          decoding="async"
          onError={() => setImgError(true)}
        />

        {/* Out-of-stock overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs">
              خلص من المخزن
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Stock Status */}
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="font-extrabold text-[#00C2CB]">{product.brand}</span>
            <span className={`font-bold ${isAvailable ? "text-emerald-600" : "text-rose-600"}`}>
              {isAvailable ? "متوفر" : "نفد"}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#00C2CB] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Storage Options */}
          {product.storageOptions && product.storageOptions.length > 0 && (
            <div className="mt-2 flex items-center gap-1 flex-wrap">
              {product.storageOptions.slice(0, 3).map((opt) => (
                <span
                  key={opt}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold"
                >
                  {opt}
                </span>
              ))}
            </div>
          )}

          {/* Rating */}
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-bold text-slate-500">
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* Price & Actions */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          {/* Price */}
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-black text-slate-950">
                {product.price.toLocaleString()} ج.م
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[11px] text-slate-400 line-through">
                  {product.originalPrice.toLocaleString()} ج.م
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenDetails(product)}
              className="py-2.5 px-2.5 rounded-xl bg-slate-900 hover:bg-[#00C2CB] text-white text-[11px] sm:text-xs font-black transition-colors text-center min-h-[40px]"
            >
              التفاصيل
            </button>

            <button
              onClick={handleWhatsApp}
              className="py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] sm:text-xs font-black transition-colors flex items-center justify-center gap-1 min-h-[40px]"
              aria-label={`اطلب ${product.name} عبر واتساب`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>واتساب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

