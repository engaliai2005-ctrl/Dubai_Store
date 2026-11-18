import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://engaliai2005-ctrl.github.io/Dubai_Store/"),
  title: "Dubai Store – متجر دبي ستور | أفضل موبايلات وإكسسوارات أصلية في مصر",
  description:
    "موقع دبي ستور الرسمي. تصفح أحدث هواتف آبل آيفون وسامسونج، ساعات ذكية، سماعات إيربودز، شواحن أصلية وجرابات مع خدمة الطلب المباشر عبر واتساب والتوصيل لجميع محافظات مصر.",
  keywords: [
    "دبي ستور",
    "Dubai Store",
    "موبايلات مصر",
    "آيفون 16 برو ماكس",
    "سامسونج S25 الترا",
    "إكسسوارات موبايل",
    "شواحن أصلية",
    "سماعات ايربودز"
  ],
  authors: [{ name: "Dubai Store Egypt" }],
  openGraph: {
    title: "Dubai Store – متجر دبي ستور | موبايلات وإكسسوارات أصلية",
    description: "اختار موبايلك من أحدث الموديلات وشوف الإكسسوارات والعروض اللي تناسبك.",
    type: "website",
    locale: "ar_EG",
  },
};

export const viewport: Viewport = {
  themeColor: "#00C2CB",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
