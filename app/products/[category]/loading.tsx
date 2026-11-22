import { ProductGridSkeleton } from "../../../components/ui/SkeletonLoader";

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Skeleton Navbar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 h-20 flex items-center px-6">
        <div className="skeleton h-10 w-28 rounded-xl" />
        <div className="flex-1" />
        <div className="flex gap-3">
          <div className="skeleton h-9 w-9 rounded-xl" />
          <div className="skeleton h-9 w-20 rounded-xl" />
        </div>
      </div>

      {/* Skeleton Category Header */}
      <div className="bg-gradient-to-l from-slate-900 to-slate-800 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="skeleton h-5 w-32 rounded-full mb-4 opacity-30" />
          <div className="skeleton h-10 w-56 rounded-xl mb-3 opacity-40" />
          <div className="skeleton h-5 w-80 rounded-lg opacity-30" />
        </div>
      </div>

      {/* Skeleton Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="skeleton h-7 w-32 rounded-xl mb-6" />
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  );
}
