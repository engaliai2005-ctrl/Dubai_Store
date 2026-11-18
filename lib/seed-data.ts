import { Category, Product } from "./types";

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "iphone",
    name: "آيفون",
    nameEnglish: "iPhones",
    description: "أحدث أجهزة آبل آيفون 16 و15 برو ماكس الأصلية بضمان معتمد وبأفضل سعر في مصر.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    badge: "الأكثر طلباً",
    itemCount: 4,
  },
  {
    id: "samsung",
    name: "سامسونج",
    nameEnglish: "Samsung Galaxy",
    description: "سلسلة جالاكسي S25 وS24 ألترا مع قلم S Pen وميزات ذكاء اصطناعي Galaxy AI.",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    badge: "Galaxy AI",
    itemCount: 3,
  },
  {
    id: "smartphones",
    name: "موبايلات تانية",
    nameEnglish: "Other Smartphones",
    description: "موبايلات فلاجشيب ومميزة من جوجل بيكسل وشاومي بأعلى أداء وأفضل كاميرات.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    badge: "اختيارات مميزة",
    itemCount: 2,
  },
  {
    id: "smartwatches",
    name: "ساعات سمارت",
    nameEnglish: "Smart Watches",
    description: "ساعات آبل واتش ألترا وسلسلة جالاكسي ووتش لمتابعة صحتك وتمارينك اليومية.",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
    badge: "أحدث إصدارات",
    itemCount: 3,
  },
  {
    id: "earbuds",
    name: "سماعات وإيربودز",
    nameEnglish: "AirPods & Earbuds",
    description: "إيربودز برو وسماعات رأس بعزل ضوضاء فعال وصوت نقي جداً لمكالماتك وموسيقاك.",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    badge: "صوت نقي",
    itemCount: 3,
  },
  {
    id: "chargers",
    name: "شواحن وكابلات",
    nameEnglish: "Chargers & Cables",
    description: "رؤوس شواحن أصلية سريعة 20 واط و45 واط من آبل وسامسونج وأنكر وكابلات ضد القطع.",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80",
    badge: "أصلي 100%",
    itemCount: 3,
  },
  {
    id: "cases",
    name: "جرابات",
    nameEnglish: "Phone Cases",
    description: "جرابات سيليكون أصلية ماج سيف وجربات حماية ضد الصدمات بتصميم شيك وعصري.",
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=800&q=80",
    badge: "ألوان جديدة",
    itemCount: 2,
  },
  {
    id: "protection",
    name: "اسكرينات وحماية",
    nameEnglish: "Screen Protectors",
    description: "اسكرينات زجاجية 9H ضد الكسر والخدش وبصمات الأصابع وحماية كاملة لعدسات الكاميرا.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
    badge: "حماية 9H",
    itemCount: 2,
  },
  {
    id: "accessories",
    name: "إكسسوارات متنوعة",
    nameEnglish: "Accessories",
    description: "محافظ ماج سيف ذكية، حوامل سيارة، استاندات مكتبية وكل ما تحتاجه لموبايلك.",
    image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80",
    badge: "إكسسوارات عملية",
    itemCount: 2,
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- آيفون ---
  {
    id: "iphone-16-pro-max",
    name: "آبل آيفون 16 برو ماكس (iPhone 16 Pro Max)",
    brand: "Apple",
    category: "iphone",
    price: 78500,
    originalPrice: 83000,
    discountPercentage: 5,
    description: "أقوى موبايل من آبل بخامة التيتانيوم من الدرجة الخامسة ومعالج A18 Pro الجبار، مع زر التحكم بالكاميرا الجديد كلياً وشاشة 6.9 بوصة سوبر ريتينا، وبطارية تعيش معاك اليوم كله بزيادة.",
    shortDescription: "شاشة 6.9 بوصة، تيتانيوم طبيعي، معالج A18 Pro، كاميرا 48 ميجابكسل.",
    specs: {
      "الشاشة": "6.9 بوصة Super Retina XDR OLED بتردد 120Hz ProMotion",
      "المعالج": "Apple A18 Pro بتكنولوجيا 3 نانو المتطورة",
      "الكاميرا": "كاميرا رئيسية 48MP + عدسة فائقة الاتساع 48MP + تقريب بصري 5x",
      "البطارية": "حتى 33 ساعة تشغيل فيديو مع شحن سريع MagSafe",
      "الخامة": "إطار تيتانيوم درجة 5 مع زجاج Ceramic Shield المقوى",
      "مقاومة الماء": "معيار IP68 حتى عمق 6 أمتار لمدة 30 دقيقة"
    },
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "تيتانيوم صحراوي", hex: "#C5B29B" },
      { name: "تيتانيوم طبيعي", hex: "#9E9993" },
      { name: "تيتانيوم أبيض", hex: "#E3E4E5" },
      { name: "تيتانيوم أسود", hex: "#3B3A38" }
    ],
    storageOptions: ["256 جيجا", "512 جيجا", "1 تيرا"],
    stock: 12,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 38,
    compatibleAccessories: ["apple-20w-charger", "airpods-pro-2", "apple-silicone-case-16", "glass-screen-protector-16"],
    tags: ["flagship", "iphone", "apple", "camera"],
    createdAt: "2026-09-20T00:00:00Z"
  },
  {
    id: "iphone-16-pro",
    name: "آبل آيفون 16 برو (iPhone 16 Pro)",
    brand: "Apple",
    category: "iphone",
    price: 68900,
    originalPrice: 72500,
    discountPercentage: 5,
    description: "نفس الأداء الاحترافي للبرو ماكس ولكن بحجم مريح 6.3 بوصة في إيدك. معالج A18 Pro، زر الكاميرا الجديد، وميكروفونات بجودة الاستوديو.",
    shortDescription: "شاشة 6.3 بوصة ProMotion، معالج A18 Pro، تقريب بصري 5x.",
    specs: {
      "الشاشة": "6.3 بوصة Super Retina XDR OLED بتردد 120Hz",
      "المعالج": "Apple A18 Pro",
      "الكاميرا": "48MP رئيسية + 48MP زاوية واسعة + 12MP تيليفوتو 5x",
      "البطارية": "حتى 27 ساعة تشغيل فيديو",
      "الخامة": "تيتانيوم مع زجاج خلفي مطفي فخم"
    },
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "تيتانيوم طبيعي", hex: "#9E9993" },
      { name: "تيتانيوم صحراوي", hex: "#C5B29B" },
      { name: "تيتانيوم أسود", hex: "#3B3A38" }
    ],
    storageOptions: ["128 جيجا", "256 جيجا", "512 جيجا"],
    stock: 15,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 29,
    compatibleAccessories: ["apple-20w-charger", "airpods-pro-2", "apple-silicone-case-16"],
    tags: ["iphone", "apple", "pro"],
    createdAt: "2026-09-20T00:00:00Z"
  },
  {
    id: "iphone-16",
    name: "آبل آيفون 16 العادي (iPhone 16)",
    brand: "Apple",
    category: "iphone",
    price: 46900,
    originalPrice: 49500,
    discountPercentage: 5,
    description: "الألوان الجديدة الجذابة مع زر التحكم بالكاميرا وزر الأكشن السريع، ومعالج A18 وكاميرا 48 ميجابكسل بتديك صور نقية في كل الإضاءات.",
    shortDescription: "ألوان جديدة، زر أكشن، كاميرا فيوجن 48MP، معالج A18.",
    specs: {
      "الشاشة": "6.1 بوصة Super Retina XDR، إضاءة حتى 2000 شمعة",
      "المعالج": "Apple A18",
      "الكاميرا": "48MP أساسية + 12MP ماكرو وزاوية واسعة",
      "البطارية": "حتى 22 ساعة تشغيل فيديو"
    },
    images: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "تيل تركواز", hex: "#00C2CB" },
      { name: "أزرق أولترامارين", hex: "#4361EE" },
      { name: "بينك", hex: "#FFB5C5" },
      { name: "أبيض", hex: "#F5F5F7" },
      { name: "أسود", hex: "#1F2022" }
    ],
    storageOptions: ["128 جيجا", "256 جيجا"],
    stock: 20,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 42,
    compatibleAccessories: ["apple-20w-charger", "glass-screen-protector-16"],
    tags: ["iphone16", "apple"],
    createdAt: "2026-09-20T00:00:00Z"
  },
  {
    id: "iphone-15",
    name: "آبل آيفون 15 (iPhone 15)",
    brand: "Apple",
    category: "iphone",
    price: 36500,
    originalPrice: 39900,
    discountPercentage: 8,
    description: "أفضل قيمة مقابل سعر من آبل. بيحتوي على الجزيرة التفاعلية Dynamic Island، منفذ تايب سي USB-C، وكاميرا 48 ميجابكسل بدقة عالية جداً.",
    shortDescription: "الجزيرة التفاعلية، كاميرا 48MP، منفذ Type-C، أداء فائق.",
    specs: {
      "الشاشة": "6.1 بوصة مع Dynamic Island",
      "المعالج": "Apple A16 Bionic",
      "الكاميرا": "48 ميجابكسل رئيسية",
      "المنفذ": "USB Type-C"
    },
    images: [
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "أزرق فاتح", hex: "#D4E1E8" },
      { name: "أسود", hex: "#353839" }
    ],
    storageOptions: ["128 جيجا", "256 جيجا"],
    stock: 14,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    rating: 4.7,
    reviewCount: 65,
    compatibleAccessories: ["apple-20w-charger", "airpods-pro-2"],
    tags: ["apple", "deal"],
    createdAt: "2025-10-15T00:00:00Z"
  },

  // --- سامسونج ---
  {
    id: "samsung-s25-ultra",
    name: "سامسونج جالاكسي S25 ألترا (Galaxy S25 Ultra 5G)",
    brand: "Samsung",
    category: "samsung",
    price: 74900,
    originalPrice: 79900,
    discountPercentage: 6,
    description: "وحش سامسونج الجديد كلياً. شاشة جبارة مسطحة مانعة للانعكاس، كاميرا 200 ميجابكسل فائقة الدقة، قلم S Pen مدمج، ومعالج Snapdragon 8 Elite المخصص للجالاكسي.",
    shortDescription: "معالج سنابدراجون 8 Elite، كاميرا 200MP، قلم S Pen، ذكاء اصطناعي.",
    specs: {
      "الشاشة": "6.9 بوصة Dynamic AMOLED 2X بتردد 1-120Hz وسطوع 3000 شمعة",
      "المعالج": "Snapdragon 8 Elite for Galaxy",
      "الكاميرا": "200MP أساسية + 50MP بيريسكوب 5x + 50MP زاوية واسعة",
      "القلم": "S Pen مدمج بالبلوتوث وإيماءات هوائية",
      "البطارية": "5000 مللي أمبير مع شحن فائق السرعة 45W"
    },
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "تيتانيوم فضي أزرق", hex: "#95A3B3" },
      { name: "تيتانيوم رمادي", hex: "#7E7F83" },
      { name: "تيتانيوم أسود", hex: "#2B2B2B" }
    ],
    storageOptions: ["256 جيجا", "512 جيجا", "1 تيرا"],
    stock: 8,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 31,
    compatibleAccessories: ["samsung-45w-charger", "galaxy-buds-3-pro", "galaxy-watch-7-ultra"],
    tags: ["samsung", "flagship", "spen"],
    createdAt: "2026-02-10T00:00:00Z"
  },
  {
    id: "samsung-s24-ultra",
    name: "سامسونج جالاكسي S24 ألترا (Galaxy S24 Ultra)",
    brand: "Samsung",
    category: "samsung",
    price: 58500,
    originalPrice: 65000,
    discountPercentage: 10,
    description: "هيكل متين من التيتانيوم مع شاشة مسطحة مريحة للعين، كاميرا 200 ميجابكسل، وكل ميزات Galaxy AI للترجمة والبحث الفوري وتعديل الصور.",
    shortDescription: "شاشة مسطحة، تيتانيوم، كاميرا 200MP، قلم S Pen.",
    specs: {
      "الشاشة": "6.8 بوصة Dynamic AMOLED 2X بتردد 120Hz",
      "المعالج": "Snapdragon 8 Gen 3 for Galaxy",
      "الكاميرا": "200MP + 50MP 5x + 12MP + 10MP",
      "البطارية": "5000 مللي أمبير"
    },
    images: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "تيتانيوم رمادي", hex: "#787676" },
      { name: "تيتانيوم أسود", hex: "#222222" }
    ],
    storageOptions: ["256 جيجا", "512 جيجا"],
    stock: 10,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    rating: 4.8,
    reviewCount: 54,
    compatibleAccessories: ["samsung-45w-charger", "galaxy-buds-3-pro"],
    tags: ["samsung", "deal"],
    createdAt: "2025-08-01T00:00:00Z"
  },
  {
    id: "samsung-a55-5g",
    name: "سامسونج جالاكسي A55 5G (Galaxy A55)",
    brand: "Samsung",
    category: "samsung",
    price: 18700,
    originalPrice: 20500,
    discountPercentage: 9,
    description: "أفضل موبايل فئة متوسطة بتصميم معدني فخم، كاميرا 50 ميجابكسل بتثبيت بصري OIS، وشاشة أموليد ألوانها روعة مع بطارية تقعد يومين.",
    shortDescription: "إطار معدني، شاشة 120Hz Super AMOLED، كاميرا 50MP مع مانع اهتزاز.",
    specs: {
      "الشاشة": "6.6 بوصة FHD+ Super AMOLED بتردد 120Hz",
      "المعالج": "Exynos 1480 مع معالج رسومي AMD",
      "الكاميرا": "50MP أساسية OIS + 12MP واسعة + 5MP ماكرو",
      "البطارية": "5000 مللي أمبير"
    },
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "أزرق ثلجي", hex: "#D2E4EE" },
      { name: "كحلي غامق", hex: "#1C2738" }
    ],
    storageOptions: ["128 جيجا", "256 جيجا"],
    stock: 25,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
    rating: 4.6,
    reviewCount: 78,
    compatibleAccessories: ["samsung-45w-charger"],
    tags: ["samsung", "bestseller"],
    createdAt: "2025-11-01T00:00:00Z"
  },

  // --- موبايلات تانية ---
  {
    id: "google-pixel-9-pro",
    name: "جوجل بيكسل 9 برو (Google Pixel 9 Pro)",
    brand: "Google",
    category: "smartphones",
    price: 52000,
    originalPrice: 56000,
    discountPercentage: 7,
    description: "أفضل تجربة أندرويد خام في العالم مع ذكاء اصطناعي Gemini AI المدمج، وكاميرات مذهلة بتطلع صور واقعية جداً مع دعم تحديثات لمدة 7 سنين.",
    shortDescription: "معالج Tensor G4، ذكاء اصطناعي Gemini، كاميرات احترافية.",
    specs: {
      "الشاشة": "6.3 بوصة Super Actua LTPO OLED بتردد 1-120Hz",
      "المعالج": "Google Tensor G4 مع شريحة أمان Titan M2",
      "الكاميرا": "50MP عريضة + 48MP زاوية واسعة + 48MP زووم 5x",
      "الرام": "16 جيجا رام للذكاء الاصطناعي"
    },
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "أبيض بورسلين", hex: "#F3F1EC" },
      { name: "أسود أوبسيديان", hex: "#2D2E30" }
    ],
    storageOptions: ["128 جيجا", "256 جيجا", "512 جيجا"],
    stock: 7,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 19,
    compatibleAccessories: ["anker-65w-charger"],
    tags: ["google", "pixel"],
    createdAt: "2026-08-15T00:00:00Z"
  },

  // --- ساعات سمارت ---
  {
    id: "apple-watch-ultra-2",
    name: "ساعة آبل واتش ألترا 2 (Apple Watch Ultra 2)",
    brand: "Apple",
    category: "smartwatches",
    price: 43500,
    originalPrice: 46000,
    discountPercentage: 5,
    description: "أقوى ساعة ذكية للرياضة والمغامرات والاستخدام اليومي الفخم. هيكل تيتانيوم أسود مطفي 49 مم، سطوع 3000 شمعة، وبطارية تدوم أيام.",
    shortDescription: "تيتانيوم أسود 49 مم، سطوع 3000 شمعة، مقاومة للماء حتى 100 متر.",
    specs: {
      "المقاس": "49 مم تيتانيوم",
      "الشاشة": "Retina Always-On بسطوع 3000 شمعة",
      "البطارية": "حتى 36 ساعة استخدام طبيعي و72 ساعة توفير طاقة"
    },
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "تيتانيوم أسود", hex: "#232323" },
      { name: "تيتانيوم طبيعي", hex: "#A8A39D" }
    ],
    stock: 9,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 32,
    tags: ["apple-watch", "ultra"],
    createdAt: "2026-09-20T00:00:00Z"
  },
  {
    id: "apple-watch-series-10",
    name: "ساعة آبل واتش سيريس 10 (Apple Watch Series 10)",
    brand: "Apple",
    category: "smartwatches",
    price: 24500,
    originalPrice: 26500,
    discountPercentage: 8,
    description: "أنحف ساعة من آبل مع أكبر شاشة مريحة للقراءة وزوايا رؤية أوسع وشحن سريع 80% في 30 دقيقة بس.",
    shortDescription: "أنحف ساعة آبل، شاشة واسعة OLED، شحن سريع فائق.",
    specs: {
      "المقاس": "46 مم ألومنيوم فخم",
      "الشحن": "شحن فائق السرعة حتى 80% في نصف ساعة"
    },
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "أسود جيت بلاك", hex: "#0E0E0E" },
      { name: "فضي", hex: "#E5E6E8" }
    ],
    stock: 14,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 22,
    tags: ["apple-watch"],
    createdAt: "2026-09-20T00:00:00Z"
  },
  {
    id: "galaxy-watch-7-ultra",
    name: "ساعة سامسونج جالاكسي ووتش ألترا (Galaxy Watch Ultra)",
    brand: "Samsung",
    category: "smartwatches",
    price: 33500,
    originalPrice: 36000,
    discountPercentage: 7,
    description: "تصميم وسائدي من التيتانيوم ومقاومة للمياه 10ATM، مع نظام تحديد مواقع GPS مزدوج وبطارية تقعد لغاية 100 ساعة في وضع التوفير.",
    shortDescription: "تيتانيوم متين 47 مم، بطارية ضخمة، مقاومة مياه 10ATM.",
    specs: {
      "المقاس": "47 مم تيتانيوم درجة 4",
      "الشاشة": "Super AMOLED مع زجاج ياقوتي مقاوم للخدش"
    },
    images: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "تيتانيوم رمادي", hex: "#525252" },
      { name: "تيتانيوم أبيض", hex: "#EAEAEA" }
    ],
    stock: 6,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 17,
    tags: ["samsung-watch"],
    createdAt: "2026-07-20T00:00:00Z"
  },

  // --- سماعات وإيربودز ---
  {
    id: "airpods-pro-2",
    name: "سماعة آبل إيربودز برو 2 أصلية (AirPods Pro 2 Type-C)",
    brand: "Apple",
    category: "earbuds",
    price: 11900,
    originalPrice: 13200,
    discountPercentage: 10,
    description: "عزل ضوضاء نشط مضاعف بيعزلك تماماً عن الدوشة اللي حواليك، مع ميزة الصوت المكاني ثلاثي الأبعاد وعلبة شحن تايب سي MagSafe.",
    shortDescription: "شريحة H2، عزل ضوضاء مضاعف، صوت محيطي، منفذ Type-C.",
    specs: {
      "الشريحة": "Apple H2 للموسيقى وU1 للعلبة",
      "البطارية": "حتى 6 ساعات استماع و30 ساعة بالعلبة",
      "الشحن": "منفذ Type-C وشحن MagSafe لاسلكي"
    },
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "أبيض لامع", hex: "#FFFFFF" }
    ],
    stock: 28,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 115,
    tags: ["apple", "airpods", "anc"],
    createdAt: "2025-09-15T00:00:00Z"
  },
  {
    id: "galaxy-buds-3-pro",
    name: "سماعة سامسونج جالاكسي بودز 3 برو (Galaxy Buds3 Pro)",
    brand: "Samsung",
    category: "earbuds",
    price: 9400,
    originalPrice: 10500,
    discountPercentage: 10,
    description: "تصميم شيك بإضاءة Blade Lights تفاعلية، صوت Hi-Fi بدقة 24 بت وسماعات ثنائية نقية مع عزل ذكي بالذكاء الاصطناعي.",
    shortDescription: "صوت 24-bit نقي، إضاءة Blade، عزل ذكي متكيف.",
    specs: {
      "الصوت": "سماعات ثنائية اتجاهين (دايناميك 10.5 مم + بلانار 6.1 مم)",
      "البطارية": "حتى 30 ساعة مع العلبة"
    },
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "فضي", hex: "#B8B9BB" },
      { name: "أبيض", hex: "#F3F3F3" }
    ],
    stock: 19,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 26,
    tags: ["samsung", "buds"],
    createdAt: "2026-07-20T00:00:00Z"
  },
  {
    id: "airpods-max",
    name: "سماعة رأس آبل إيربودز ماكس (Apple AirPods Max Type-C)",
    brand: "Apple",
    category: "earbuds",
    price: 32500,
    originalPrice: 35000,
    discountPercentage: 7,
    description: "فخامة الصوت فوق الأذن. تجربة صوتية ساحرة مع خامات ألومنيوم وقماش شبكي مريح جداً وعزل ضوضاء استثنائي.",
    shortDescription: "سماعة رأس فاخرة، عزل جبار، شحن Type-C.",
    specs: {
      "النوع": "سماعة رأس لاسلكية فوق الأذن",
      "البطارية": "20 ساعة مع تشغيل العزل الكامل"
    },
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "رمادي فلكي", hex: "#38393B" },
      { name: "فضي", hex: "#E1E2E4" }
    ],
    stock: 5,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 18,
    tags: ["apple", "max"],
    createdAt: "2026-09-20T00:00:00Z"
  },

  // --- شواحن وكابلات ---
  {
    id: "apple-20w-charger",
    name: "رأس شاحن آبل أصلي 20 واط (Apple 20W Power Adapter)",
    brand: "Apple",
    category: "chargers",
    price: 1150,
    originalPrice: 1350,
    discountPercentage: 15,
    description: "شاحن آبل الأصلي المعتمد بقوة 20 واط للشحن السريع الآمن على بطارية الآيفون، بيشحن موبايلك 50% في حوالي نصف ساعة.",
    shortDescription: "شاحن آبل أصلي 20 واط سريع وآمن على البطارية.",
    specs: {
      "القدرة": "20 واط بتقنية Power Delivery",
      "المنفذ": "USB-C",
      "التوافق": "جميع موديلات الآيفون والآيباد والإيربودز"
    },
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "أبيض", hex: "#FFFFFF" }
    ],
    stock: 60,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 140,
    tags: ["apple", "charger"],
    createdAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "samsung-45w-charger",
    name: "شاحن سامسونج أصلي 45 واط مع كابل (Samsung 45W Fast Charger)",
    brand: "Samsung",
    category: "chargers",
    price: 1650,
    originalPrice: 1950,
    discountPercentage: 15,
    description: "رأس شاحن سامسونج فائق السرعة Super Fast Charging 2.0 مع كابل تايب سي 5A أصلي بطول 1.8 متر في العلبة.",
    shortDescription: "شاحن سامسونج 45 واط الأصلي مع كابل 5A قوي في العلبة.",
    specs: {
      "القدرة": "45 واط بتقنية PPS",
      "الكابل المرفق": "كابل Type-C إلى Type-C تيار 5 أمبير"
    },
    images: [
      "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "أسود", hex: "#1A1A1A" },
      { name: "أبيض", hex: "#FFFFFF" }
    ],
    stock: 45,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    rating: 4.8,
    reviewCount: 92,
    tags: ["samsung", "charger"],
    createdAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "anker-65w-charger",
    name: "شاحن أنكر برايم 67 واط GaN ثلاثي المنافذ (Anker Prime 67W)",
    brand: "Anker",
    category: "chargers",
    price: 2450,
    originalPrice: 2850,
    discountPercentage: 14,
    description: "شاحن صغير الحجم جبار بتقنية الجاليوم نيتريد GaN، فيه 3 منافذ يشحنوا الآيفون والسامسونج واللاب توب في نفس اللحظة بأمان تام.",
    shortDescription: "3 منافذ (2x Type-C + 1x USB-A) بقوة 67 واط.",
    specs: {
      "القدرة": "67 واط تقنية GaNPrime",
      "المنافذ": "2 Type-C + 1 USB-A"
    },
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "أسود مطفي", hex: "#222222" }
    ],
    stock: 22,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 64,
    tags: ["anker", "gan"],
    createdAt: "2025-06-01T00:00:00Z"
  },

  // --- جرابات ---
  {
    id: "apple-silicone-case-16",
    name: "جراب آبل سيليكون أصلي ماج سيف (iPhone 16 Pro Max Silicone Case)",
    brand: "Apple",
    category: "cases",
    price: 2800,
    originalPrice: 3200,
    discountPercentage: 12,
    description: "جراب سيليكون ناعم الملمس مبطن بالمايكروفايبر من جوه، بيدعم زر التحكم بالكاميرا الجديد من خلال طبقة كريستال ياقوتي ومغناطيس ماج سيف قوي.",
    shortDescription: "سيليكون ناعم، يدعم زر الكاميرا وماج سيف بالكامل.",
    specs: {
      "الخامة": "سيليكون عالي الجودة مع بطانة مايكروفايبر ناعمة",
      "الميزة": "حلقة ماغنتيك MagSafe مدمجة"
    },
    images: [
      "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "تركواز دبي ستور", hex: "#00C2CB" },
      { name: "كحلي منتصف الليل", hex: "#1A2536" },
      { name: "أسود فخم", hex: "#1C1C1E" }
    ],
    stock: 35,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 47,
    tags: ["case", "apple"],
    createdAt: "2026-09-20T00:00:00Z"
  },
  {
    id: "spigen-ultra-hybrid-case",
    name: "جراب سبيجن ألترا هايبرد شفاف (Spigen Ultra Hybrid)",
    brand: "Spigen",
    category: "cases",
    price: 1250,
    originalPrice: 1450,
    discountPercentage: 14,
    description: "جراب شفاف تماماً يظهر لون موبايلك الأصلي مع وسائد هوائية Air Cushion في الأركان لحماية التليفون من الصدمات والوقعات الشديدة.",
    shortDescription: "شفاف مقاوم للاصفرار مع حماية أركان معتمدة ضد الصدمات.",
    specs: {
      "الخامة": "ظهر بولي كربونات صلب مع جوانب TPU مرنة",
      "الحماية": "معتمدة ضد السقوط العسكري"
    },
    images: [
      "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "شفاف كريستال", hex: "#F0F4F8" }
    ],
    stock: 40,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    rating: 4.8,
    reviewCount: 52,
    tags: ["spigen", "case"],
    createdAt: "2025-05-10T00:00:00Z"
  },

  // --- اسكرينات وحماية ---
  {
    id: "glass-screen-protector-16",
    name: "اسكرينة سبيجن EZ FIT زجاجية 9H حبتين (Spigen EZ Fit 2-Pack)",
    brand: "Spigen",
    category: "protection",
    price: 850,
    originalPrice: 1050,
    discountPercentage: 19,
    description: "اسكرينة زجاج مقوى 9H بتيجي مع إطار محاذاة أوتوماتيكي بتركبها بنفسك في 10 ثواني من غير أي فقاعات هواء وبتحمي الشاشة من الكسر والخدوش.",
    shortDescription: "علبة فيها اسكرينتين مع قالب تركيب سهل وسريع بدون فقاعات.",
    specs: {
      "الصلابة": "زجاج مقوى 9H عالي الشفافية",
      "المحتوى": "2 اسكرينة + قالب تركيب سهل + عدة تنظيف"
    },
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "شفافية عالية HD", hex: "#E8F4F8" }
    ],
    stock: 50,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 88,
    tags: ["screen-protector"],
    createdAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "camera-lens-protector",
    name: "حماية عدسات الكاميرا زجاج ياقوتي (Sapphire Lens Protector)",
    brand: "Other",
    category: "protection",
    price: 450,
    originalPrice: 550,
    discountPercentage: 18,
    description: "حلقات معدنية مع زجاج ياقوتي لحماية كل عدسة كاميرا لوحدها من غير ما تأثر نهائياً على جودة التصوير أو الفلاش بالليل.",
    shortDescription: "حماية فردية للعدسات مقاومة للخدش والتصوير الليلي.",
    specs: {
      "المادة": "زجاج ياقوتي مع إطار تيتانيوم",
      "الوضوح": "نفاذية ضوء 99.9%"
    },
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "تيتانيوم أسود", hex: "#222222" },
      { name: "تيتانيوم طبيعي", hex: "#9E9993" }
    ],
    stock: 65,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    rating: 4.7,
    reviewCount: 41,
    tags: ["protection"],
    createdAt: "2025-03-01T00:00:00Z"
  },

  // --- إكسسوارات متنوعة ---
  {
    id: "magsafe-wallet-stand",
    name: "محفظة ماج سيف واستاند تليفون MOFT (MagSafe Snap Wallet)",
    brand: "Other",
    category: "accessories",
    price: 1350,
    originalPrice: 1600,
    discountPercentage: 15,
    description: "محفظة جلدية مغناطيسية بتشيل لحد 3 بطاقات مع حماية ضد السرقة الإلكترونية RFID، وبتفتح استاند للموبايل بالطول أو العرض لمشاهدة الفيديوهات.",
    shortDescription: "محفظة كروت ماج سيف واستاند تليفون قابل للطي.",
    specs: {
      "السعة": "حتى 3 كروت مع حماية RFID",
      "الزوايا": "وضع رأسي 60 درجة ووضع أفقي عائم"
    },
    images: [
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "تركواز دبي ستور", hex: "#00C2CB" },
      { name: "كحلي كلاسيك", hex: "#1C2D42" },
      { name: "بني جلد", hex: "#6F4E37" }
    ],
    stock: 24,
    isAvailable: true,
    isFeatured: true,
    isNewArrival: false,
    rating: 4.7,
    reviewCount: 39,
    tags: ["wallet", "stand"],
    createdAt: "2025-04-10T00:00:00Z"
  },
  {
    id: "magsafe-car-mount",
    name: "حامل موبايل مغناطيسي للسيارة ماج سيف (MagSafe Car Mount)",
    brand: "Anker",
    category: "accessories",
    price: 950,
    originalPrice: 1150,
    discountPercentage: 17,
    description: "يثبت بقوة على فتحة تكييف السيارة بمغناطيس قوي جداً ميقعش في المطبات، وبيدور 360 درجة لراحة تامة أثناء الـ GPS والقيادة.",
    shortDescription: "حامل سيارة ماج سيف قوي ودوران 360 درجة.",
    specs: {
      "التثبيت": "فتحات التكييف في السيارة",
      "التوافق": "جميع موبايلات ماج سيف أو الجرابات المغناطيسية"
    },
    images: [
      "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=900&q=80"
    ],
    colors: [
      { name: "أسود مطفي", hex: "#111111" }
    ],
    stock: 30,
    isAvailable: true,
    isFeatured: false,
    isNewArrival: false,
    rating: 4.8,
    reviewCount: 45,
    tags: ["car", "magsafe"],
    createdAt: "2025-02-15T00:00:00Z"
  }
];
