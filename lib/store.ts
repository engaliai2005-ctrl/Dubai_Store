"use client";

import { useEffect, useState } from "react";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from "./seed-data";
import { CartItem, Category, CategoryId, Product, ProductColor } from "./types";

const PRODUCTS_STORAGE_KEY = "dubai_store_products_v2";
const CATEGORIES_STORAGE_KEY = "dubai_store_categories_v2";
const CART_STORAGE_KEY = "dubai_store_cart_v2";
const WISHLIST_STORAGE_KEY = "dubai_store_wishlist_v2";
const ADMIN_AUTH_KEY = "dubai_store_admin_auth_v2";

type Listener = () => void;
const listeners = new Set<Listener>();
function notify() {
  listeners.forEach((listener) => listener());
}

let productsState: Product[] = INITIAL_PRODUCTS;
let categoriesState: Category[] = INITIAL_CATEGORIES;
let cartState: CartItem[] = [];
let wishlistState: string[] = [];
let isAdminState = false;
let isInitialized = false;

function initStore() {
  if (typeof window === "undefined" || isInitialized) return;

  try {
    const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (savedProducts) {
      const parsed = JSON.parse(savedProducts);
      if (Array.isArray(parsed) && parsed.length > 0) {
        productsState = parsed;
      }
    } else {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }

    const savedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (savedCategories) {
      const parsed = JSON.parse(savedCategories);
      if (Array.isArray(parsed) && parsed.length > 0) {
        categoriesState = parsed;
      }
    } else {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    }

    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      cartState = JSON.parse(savedCart);
    }

    const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (savedWishlist) {
      wishlistState = JSON.parse(savedWishlist);
    }

    const savedAuth = sessionStorage.getItem(ADMIN_AUTH_KEY);
    if (savedAuth === "true") {
      isAdminState = true;
    }

    isInitialized = true;
  } catch (err) {
    console.error("Failed to initialize store from localStorage", err);
  }
}

export const Store = {
  getProducts(): Product[] {
    return productsState;
  },

  getCategories(): Category[] {
    return categoriesState;
  },

  getCart(): CartItem[] {
    return cartState;
  },

  getWishlist(): string[] {
    return wishlistState;
  },

  isAdminLoggedIn(): boolean {
    return isAdminState;
  },

  adminLogin(password: string): boolean {
    if (password === "dubai2026" || password === "admin123") {
      isAdminState = true;
      if (typeof window !== "undefined") {
        sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
      }
      notify();
      return true;
    }
    return false;
  },

  adminLogout() {
    isAdminState = false;
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    }
    notify();
  },

  // Product CRUD
  addProduct(product: Omit<Product, "id" | "createdAt">): Product {
    const newProduct: Product = {
      ...product,
      id: `dubai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    productsState = [newProduct, ...productsState];
    if (typeof window !== "undefined") {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsState));
    }
    notify();
    return newProduct;
  },

  updateProduct(updated: Product) {
    productsState = productsState.map((p) => (p.id === updated.id ? updated : p));
    if (typeof window !== "undefined") {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsState));
    }
    notify();
  },

  deleteProduct(productId: string) {
    productsState = productsState.filter((p) => p.id !== productId);
    if (typeof window !== "undefined") {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsState));
    }
    this.removeFromCart(productId);
    notify();
  },

  toggleProductStock(productId: string) {
    productsState = productsState.map((p) => {
      if (p.id === productId) {
        return {
          ...p,
          isAvailable: !p.isAvailable,
          stock: !p.isAvailable ? Math.max(5, p.stock) : 0,
        };
      }
      return p;
    });
    if (typeof window !== "undefined") {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsState));
    }
    notify();
  },

  bulkApplyDiscount(category: string, discountPercentage: number) {
    productsState = productsState.map((p) => {
      if (category === "all" || p.category === category) {
        const originalPrice = p.originalPrice || p.price;
        const newPrice = Math.round(originalPrice * (1 - discountPercentage / 100));
        return {
          ...p,
          originalPrice,
          price: newPrice,
          discountPercentage,
        };
      }
      return p;
    });
    if (typeof window !== "undefined") {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsState));
    }
    notify();
  },

  resetCatalogToDemo() {
    productsState = INITIAL_PRODUCTS;
    categoriesState = INITIAL_CATEGORIES;
    if (typeof window !== "undefined") {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    }
    notify();
  },

  importProductsJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed) && parsed.length > 0) {
        productsState = parsed;
        if (typeof window !== "undefined") {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(productsState));
        }
        notify();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  // Category Actions
  addCategory(category: Category) {
    categoriesState = [...categoriesState, category];
    if (typeof window !== "undefined") {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categoriesState));
    }
    notify();
  },

  deleteCategory(categoryId: CategoryId) {
    categoriesState = categoriesState.filter((c) => c.id !== categoryId);
    if (typeof window !== "undefined") {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categoriesState));
    }
    notify();
  },

  // Cart Actions
  addToCart(product: Product, color?: ProductColor, storage?: string, quantity = 1) {
    const existingIndex = cartState.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor?.name === color?.name &&
        item.selectedStorage === storage
    );

    if (existingIndex > -1) {
      cartState[existingIndex].quantity += quantity;
    } else {
      cartState.push({
        product,
        selectedColor: color || product.colors?.[0],
        selectedStorage: storage || product.storageOptions?.[0],
        quantity,
      });
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    }
    notify();
  },

  updateCartQty(index: number, quantity: number) {
    if (quantity <= 0) {
      cartState.splice(index, 1);
    } else {
      cartState[index].quantity = quantity;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    }
    notify();
  },

  removeFromCart(productId: string) {
    cartState = cartState.filter((item) => item.product.id !== productId);
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    }
    notify();
  },

  clearCart() {
    cartState = [];
    if (typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    }
    notify();
  },

  // Wishlist Actions
  toggleWishlist(productId: string) {
    if (wishlistState.includes(productId)) {
      wishlistState = wishlistState.filter((id) => id !== productId);
    } else {
      wishlistState.push(productId);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistState));
    }
    notify();
  },
};

export function useDubaiStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    initStore();
    const handler = () => setTick((t) => t + 1);
    listeners.add(handler);
    setTick((t) => t + 1);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const products = Store.getProducts();
  const categories = Store.getCategories();
  const cart = Store.getCart();
  const wishlist = Store.getWishlist();
  const isAdminLoggedIn = Store.isAdminLoggedIn();

  const cartTotalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    products,
    categories,
    cart,
    wishlist,
    isAdminLoggedIn,
    cartTotalAmount,
    cartItemCount,
    adminLogin: Store.adminLogin,
    adminLogout: Store.adminLogout,
    addProduct: Store.addProduct,
    updateProduct: Store.updateProduct,
    deleteProduct: Store.deleteProduct,
    toggleProductStock: Store.toggleProductStock,
    bulkApplyDiscount: Store.bulkApplyDiscount,
    resetCatalogToDemo: Store.resetCatalogToDemo,
    importProductsJSON: Store.importProductsJSON,
    addCategory: Store.addCategory,
    deleteCategory: Store.deleteCategory,
    addToCart: Store.addToCart,
    updateCartQty: Store.updateCartQty,
    removeFromCart: Store.removeFromCart,
    clearCart: Store.clearCart,
    toggleWishlist: Store.toggleWishlist,
  };
}
