import { createClient } from "@supabase/supabase-js";
import { Category, Product } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("placeholder") &&
    supabaseUrl.startsWith("https://")
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL SCHEMA REFERENCE FOR SUPABASE:
 *
 * CREATE TABLE categories (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   name_arabic TEXT,
 *   description TEXT,
 *   image TEXT,
 *   badge TEXT,
 *   item_count INT DEFAULT 0
 * );
 *
 * CREATE TABLE products (
 *   id TEXT PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   brand TEXT NOT NULL,
 *   category TEXT REFERENCES categories(id),
 *   price NUMERIC NOT NULL,
 *   original_price NUMERIC,
 *   discount_percentage NUMERIC,
 *   description TEXT,
 *   short_description TEXT,
 *   specs JSONB DEFAULT '{}'::jsonb,
 *   images TEXT[] DEFAULT '{}',
 *   colors JSONB DEFAULT '[]'::jsonb,
 *   storage_options TEXT[] DEFAULT '{}',
 *   stock INT DEFAULT 0,
 *   is_available BOOLEAN DEFAULT true,
 *   is_featured BOOLEAN DEFAULT false,
 *   is_new_arrival BOOLEAN DEFAULT false,
 *   rating NUMERIC DEFAULT 5.0,
 *   review_count INT DEFAULT 0,
 *   compatible_accessories TEXT[] DEFAULT '{}',
 *   tags TEXT[] DEFAULT '{}',
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 */

export async function fetchProductsFromSupabase(): Promise<Product[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.warn("Supabase fetch products error:", error.message);
      return null;
    }
    return data as Product[];
  } catch {
    return null;
  }
}

export async function syncProductToSupabase(product: Product): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("products").upsert(product);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("products").delete().eq("id", productId);
    return !error;
  } catch {
    return false;
  }
}
