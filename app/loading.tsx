import { ProductGridSkeleton } from "../components/ui/SkeletonLoader";

/** Next.js route-level loading UI — shown while page.tsx is loading */
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Skeleton Navbar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs h-20 flex items-center px-6">
        <div className="skeleton h-10 w-28 rounded-xl" />
        <div className="flex-1" />
        <div className="flex gap-3">
          <div className="skeleton h-9 w-9 rounded-xl" />
          <div className="skeleton h-9 w-9 rounded-xl" />
          <div className="skeleton h-9 w-20 rounded-xl" />
        </div>
      </div>

      {/* Skeleton Hero */}
      <div className="bg-gradient-to-b from-[#F0FDFA] to-white py-16 px-6 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="skeleton h-5 w-48 rounded-full" />
          <div className="skeleton h-10 w-72 rounded-xl" />
          <div className="skeleton h-10 w-56 rounded-xl" />
          <div className="skeleton h-5 w-96 rounded-lg" />
          <div className="flex gap-3 mt-4">
            <div className="skeleton h-12 w-40 rounded-2xl" />
            <div className="skeleton h-12 w-32 rounded-2xl" />
          </div>
        </div>
      </div>

      {/* Skeleton Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="skeleton h-7 w-48 rounded-xl mb-6" />
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
