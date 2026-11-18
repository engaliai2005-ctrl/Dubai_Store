export type CategoryId =
  | "iphone"
  | "samsung"
  | "smartphones"
  | "smartwatches"
  | "earbuds"
  | "chargers"
  | "cases"
  | "protection"
  | "accessories";

export interface Category {
  id: CategoryId;
  name: string; // e.g. "آيفون"
  nameArabic?: string;
  nameEnglish?: string;
  description: string;
  image: string;
  badge?: string;
  itemCount?: number;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  brand: "Apple" | "Samsung" | "Xiaomi" | "Google" | "Anker" | "Spigen" | "Other";
  category: CategoryId;
  price: number; // in EGP
  originalPrice?: number; // original price in EGP if discounted
  discountPercentage?: number;
  description: string;
  shortDescription?: string;
  specs: Record<string, string>;
  images: string[];
  colors: ProductColor[];
  storageOptions?: string[]; // e.g. ["128 جيجا", "256 جيجا", "512 جيجا", "1 تيرا"]
  stock: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  rating: number; // 1 to 5
  reviewCount: number;
  compatibleAccessories?: string[];
  tags?: string[];
  createdAt: string;
}

export interface CartItem {
  product: Product;
  selectedColor?: ProductColor;
  selectedStorage?: string;
  quantity: number;
}

export interface AIQuestionnaireAnswers {
  budget: string;
  priority: string;
  brand: string;
  storage: string;
  primaryUsage: string;
}

export interface AIRecommendationResult {
  product: Product;
  matchScore: number; // 0 to 100
  reason: string;
  matchedFeatures: string[];
  suggestedAccessories: Product[];
}
