"use client";

import { Heart, MessageCircle, ShoppingBag, Trash2, X } from "lucide-react";
import React from "react";
import { Product } from "../../lib/types";
import { getProductWhatsAppUrl } from "../../lib/whatsapp";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  allProducts: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
  onOpenProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  allProducts,
  onAddToCart,
  onRemoveFromWishlist,
  onOpenProduct,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-start">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-500">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">المنتجات المحفوظة</h2>
              <p className="text-xs text-slate-500 font-medium">
                {wishlistedProducts.length} منتجات في قائمتك المفضلة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400 mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">مفيش منتجات محفوظة لسه</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs font-medium">
                دوس على علامة القلب على أي موبايل أو إكسسوار عشان تحفظه وترجعله في أي وقت.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 relative"
              >
                <div
                  onClick={() => onOpenProduct(product)}
                  className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => onOpenProduct(product)}
                    className="text-xs font-black text-slate-900 truncate hover:text-[#00C2CB] cursor-pointer"
                  >
                    {product.name}
                  </h4>
                  <p className="text-xs font-black text-slate-950 mt-0.5">
                    {product.price.toLocaleString()} ج.م
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-[#00C2CB] text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>ضيف للسلة</span>
                    </button>

                    <a
                      href={getProductWhatsAppUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold flex items-center gap-1 border border-emerald-200 transition-colors"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>واتساب</span>
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFromWishlist(product.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors mr-1"
                  title="حذف من المفضلة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-5 sm:p-6 border-t border-slate-200 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
