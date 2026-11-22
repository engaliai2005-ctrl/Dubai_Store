import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://engaliai2005-ctrl.github.io/Dubai_Store/"),
  title: {
    default: "دبي ستور | موبايلات وإكسسوارات أصلية في مصر",
    template: "%s | دبي ستور",
  },
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
    "سماعات ايربودز",
    "موبايل مصر",
    "هاتف ذكي",
    "iPhone مصر",
    "Samsung مصر",
  ],
  authors: [{ name: "Dubai Store Egypt" }],
  creator: "Dubai Store Egypt",
  publisher: "Dubai Store Egypt",
  robots: { index: true, follow: true },
  openGraph: {
    title: "دبي ستور | موبايلات وإكسسوارات أصلية في مصر",
    description: "اختار موبايلك من أحدث الموديلات وشوف الإكسسوارات والعروض اللي تناسبك.",
    type: "website",
    locale: "ar_EG",
    siteName: "دبي ستور",
    images: [{ url: "/logo.jpg", width: 512, height: 512, alt: "دبي ستور" }],
  },
  twitter: {
    card: "summary",
    title: "دبي ستور | موبايلات أصلية في مصر",
    description: "أحدث موبايلات آيفون وسامسونج وإكسسوارات أصلية بأفضل الأسعار.",
    images: ["/logo.jpg"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
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
