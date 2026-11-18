import { CartItem, Product, ProductColor } from "./types";
import { SITE_BASE_PATH } from "./site";

export const DUBAI_STORE_WHATSAPP_NUMBER = "201008135160"; // +201008135160
export const DUBAI_STORE_PHONE_DISPLAY = "01008135160";

/**
 * Generates a personalized Egyptian Arabic WhatsApp message for an individual product inquiry
 * Example format matching user requirement:
 * “مساء الخير، أنا مهتم بموبايل [اسم المنتج] الموجود عندكم على الموقع، وسعره [السعر]. ممكن أعرف تفاصيل الطلب والتوفر؟”
 */
export function getProductWhatsAppUrl(
  product: Product,
  selectedColor?: ProductColor,
  selectedStorage?: string,
  currentUrl?: string
): string {
  const url =
    currentUrl ||
    (typeof window !== "undefined"
      ? `${window.location.origin}${SITE_BASE_PATH}/?product=${product.id}`
      : `https://engaliai2005-ctrl.github.io${SITE_BASE_PATH}/?product=${product.id}`);

  let variantDetails = "";
  if (selectedColor || selectedStorage) {
    const parts = [];
    if (selectedColor) parts.push(`اللون: ${selectedColor.name}`);
    if (selectedStorage) parts.push(`المساحة: ${selectedStorage}`);
    variantDetails = ` (${parts.join(" - ")})`;
  }

  const message = `مساء الخير، أنا مهتم بموبايل ${product.name}${variantDetails} الموجود عندكم على الموقع، وسعره ${product.price.toLocaleString()} ج.م.

لينك المنتج: ${url}

ممكن أعرف تفاصيل الطلب والتوفر؟
شكراً ليك!`;

  return `https://wa.me/${DUBAI_STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}

/**
 * Generates a natural Egyptian Arabic WhatsApp checkout summary for all items in the cart
 */
export function getCartWhatsAppUrl(
  items: CartItem[],
  totalAmount: number,
  notes?: string
): string {
  if (items.length === 0) return `https://wa.me/${DUBAI_STORE_WHATSAPP_NUMBER}`;

  const storeUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${SITE_BASE_PATH}`
      : `https://engaliai2005-ctrl.github.io${SITE_BASE_PATH}`;

  const itemListText = items
    .map((item, index) => {
      const parts = [];
      if (item.selectedColor) parts.push(item.selectedColor.name);
      if (item.selectedStorage) parts.push(item.selectedStorage);
      const variantStr = parts.length > 0 ? ` (${parts.join(" - ")})` : "";
      const subtotal = item.product.price * item.quantity;
      return `${index + 1}. ${item.product.name}${variantStr}
   العدد: ${item.quantity} × ${item.product.price.toLocaleString()} ج.م = ${subtotal.toLocaleString()} ج.م`;
    })
    .join("\n\n");

  const notesText = notes ? `\nملاحظة من العميل: ${notes}\n` : "";

  const message = `مساء الخير يا دبي ستور!
حابب أطلب المنتجات دي من على الموقع عندكم:

━━━━━━━━━━━━━━━━━━━
🛒 تفاصيل سلة المشتريات:
━━━━━━━━━━━━━━━━━━━
${itemListText}

━━━━━━━━━━━━━━━━━━━
💰 إجمالي الحساب التقريبي: ${totalAmount.toLocaleString()} ج.م
━━━━━━━━━━━━━━━━━━━${notesText}
الموقع: ${storeUrl}

ممكن تأكدوا لي التوفر وتعرفوني تفاصيل وميعاد التوصيل؟
شكراً جداً!`;

  return `https://wa.me/${DUBAI_STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}

/**
 * Quick general Egyptian WhatsApp chat link
 */
export function getGeneralWhatsAppUrl(
  customPrompt = "مساء الخير يا دبي ستور! كنت حابب استفسر عن الموبايلات المتاحة عندكم والأسعار."
): string {
  return `https://wa.me/${DUBAI_STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    customPrompt
  )}`;
}
