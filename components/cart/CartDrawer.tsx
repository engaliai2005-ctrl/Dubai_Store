"use client";

import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  X
} from "lucide-react";
import React, { useState } from "react";
import { CartItem } from "../../lib/types";
import { DUBAI_STORE_PHONE_DISPLAY, getCartWhatsAppUrl } from "../../lib/whatsapp";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalAmount: number;
  onUpdateQty: (index: number, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenProduct: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOpenProduct,
}) => {
  const [customerNotes, setCustomerNotes] = useState("");

  if (!isOpen) return null;

  const handleWhatsAppCheckout = () => {
    const url = getCartWhatsAppUrl(items, totalAmount, customerNotes);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over panel from right in RTL */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#F0FDFA] text-[#00C2CB]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">سلة المشتريات</h2>
              <p className="text-xs text-slate-500 font-medium">
                {items.length === 0
                  ? "السلة فاضية حالياً"
                  : `${items.length} منتجات مضافة`}
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

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900">سلتك فاضية لسه</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs font-medium">
                تصفح أحدث الموبايلات والشواحن الأصلية وضيف اللي تحبه للسلة بضغطة واحدة.
              </p>
              <button
                onClick={onClose}
                className="mt-5 px-6 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs hover:bg-[#00C2CB] transition-colors"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            items.map((item, index) => (
              <div
                key={`${item.product.id}-${index}`}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 relative"
              >
                <div
                  onClick={() => onOpenProduct(item.product.id)}
                  className="w-16 h-16 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => onOpenProduct(item.product.id)}
                    className="text-xs font-black text-slate-900 truncate hover:text-[#00C2CB] cursor-pointer"
                  >
                    {item.product.name}
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-bold">
                    {item.selectedColor && (
                      <span className="flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full border border-slate-300"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        {item.selectedColor.name}
                      </span>
                    )}
                    {item.selectedStorage && (
                      <>
                        <span>•</span>
                        <span>{item.selectedStorage}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-black text-slate-950">
                      {(item.product.price * item.quantity).toLocaleString()} ج.م
                    </span>

                    <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                      <button
                        onClick={() => onUpdateQty(index, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:text-slate-900 font-black"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 text-xs font-black text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(index, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-slate-600 hover:text-slate-900 font-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors mr-1"
                  title="مسح من السلة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}

          {/* Notes */}
          {items.length > 0 && (
            <div className="pt-2">
              <label className="text-xs font-black text-slate-700 block mb-1">
                ملاحظات أو عنوان التوصيل (اختياري):
              </label>
              <input
                type="text"
                placeholder="مثال: يرجى الاتصال قبل التوصيل، العنوان بالتفصيل..."
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#00C2CB] font-medium"
              />
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-slate-200 bg-slate-50 space-y-3.5">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-600 font-bold">
                <span>إجمالي المنتجات:</span>
                <span className="text-slate-900 font-black">{totalAmount.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between text-slate-600 font-bold">
                <span>مصاريف الشحن:</span>
                <span className="text-emerald-700">تحدد في الواتساب حسب المحافظة</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                <span>المبلغ الإجمالي التقريبي:</span>
                <span className="text-base text-[#00C2CB]">{totalAmount.toLocaleString()} ج.م</span>
              </div>
            </div>

            {/* Complete Order via WhatsApp */}
            <button
              onClick={handleWhatsAppCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <MessageCircle className="w-5 h-5" />
              <span>اطلب كل المنتجات على واتساب</span>
              <ArrowLeft className="w-4 h-4 mr-1" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-bold">
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                واتساب معتمد ({DUBAI_STORE_PHONE_DISPLAY})
              </span>
              <button
                onClick={onClearCart}
                className="text-slate-400 hover:text-rose-500 transition-colors"
              >
                تفريغ السلة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
