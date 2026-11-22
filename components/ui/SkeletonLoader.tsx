"use client";

import React from "react";

/** Animated skeleton card matching ProductCard dimensions */
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 overflow-hidden flex flex-col">
      {/* Image area */}
      <div className="aspect-square w-full skeleton" />
      {/* Info area */}
      <div className="p-3.5 sm:p-5 flex flex-col gap-2.5">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-3/4 rounded" />
        <div className="flex gap-1 mt-1">
          <div className="skeleton h-5 w-10 rounded" />
          <div className="skeleton h-5 w-10 rounded" />
        </div>
        <div className="pt-3 border-t border-slate-100 mt-auto">
          <div className="skeleton h-5 w-24 rounded mb-3" />
          <div className="grid grid-cols-2 gap-2">
            <div className="skeleton h-8 rounded-xl" />
            <div className="skeleton h-8 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Grid of skeleton loaders while products load */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Simple one-line skeleton text */
export function SkeletonText({ width = "100%", height = "1rem" }: { width?: string; height?: string }) {
  return (
    <span
      className="skeleton block rounded"
      style={{ width, height, display: "block" }}
      aria-hidden="true"
    />
  );
}
