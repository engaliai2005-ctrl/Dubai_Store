"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Boxes,
  CheckCircle2,
  DollarSign,
  Download,
  Edit,
  Eye,
  Filter,
  Flame,
  Layers,
  LayoutDashboard,
  Lock,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  Store,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  XCircle
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { BulkOperationsModal } from "../../components/admin/BulkOperationsModal";
import { CategoryManagerModal } from "../../components/admin/CategoryManagerModal";
import { ProductFormModal } from "../../components/admin/ProductFormModal";
import { DubaiStoreLogo } from "../../components/ui/Logo";
import { INITIAL_CATEGORIES } from "../../lib/seed-data";
import { useDubaiStore } from "../../lib/store";
import { Category, CategoryId, Product } from "../../lib/types";

type AdminTab = "overview" | "products" | "categories" | "inventory" | "promotions" | "settings";

export default function AdminPage() {
  const {
    products,
    categories,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    adminGetLockoutInfo,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductStock,
    bulkApplyDiscount,
    resetCatalogToDemo,
    importProductsJSON,
    addCategory,
    deleteCategory,
  } = useDubaiStore();

  // Active Sidebar Tab
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Authentication State
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Product Modals State
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Table Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Bulk Discount in Tab State
  const [promoCategory, setPromoCategory] = useState("all");
  const [promoPercent, setPromoPercent] = useState("10");

  // Quick Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(passwordInput);
    if (!success) {
      setLoginError("كلمة المرور غير صحيحة. تأكد من كلمة المرور الصحيحة.");
      setPasswordInput("");
    } else {
      setLoginError("");
      setPasswordInput("");
    }
  };

  // Login Screen if unauthorized
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white font-sans" dir="rtl">
        <div className="w-full max-w-md bg-slate-800/90 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3 rounded-2xl bg-white shadow-md mb-4 inline-block">
              <DubaiStoreLogo size="md" clickable={false} />
            </div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#00C2CB]" />
              <span>لوحة تحكم دبي ستور</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
              أدخل كلمة المرور الخاصة بالإدارة للوصول إلى المنتجات والمخزون.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                كلمة المرور
              </label>
              <input
                type="password"
                required
                placeholder="أدخل كلمة المرور (مثال: dubai2026)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-700 rounded-xl text-white text-sm focus:outline-hidden focus:border-[#00C2CB] transition-all text-left"
                dir="ltr"
                autoFocus
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#00C2CB] hover:bg-[#0891B2] text-slate-950 font-black text-sm shadow-lg shadow-[#00C2CB]/20 transition-all transform active:scale-98"
            >
              تسجيل الدخول
            </button>

            <div className="pt-4 border-t border-slate-700 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-bold"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>الرجوع إلى المتجر العام</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Analytics Metrics
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.isAvailable && p.stock > 0);
  const outOfStockProducts = products.filter((p) => !p.isAvailable || p.stock === 0);
  const lowStockProducts = products.filter((p) => p.isAvailable && p.stock <= 5 && p.stock > 0);
  const onSaleProducts = products.filter((p) => p.discountPercentage && p.discountPercentage > 0);
  const totalStockCount = products.reduce((acc, p) => acc + (p.isAvailable ? p.stock : 0), 0);
  const totalInventoryValue = products.reduce(
    (acc, p) => acc + (p.isAvailable ? p.price * p.stock : 0),
    0
  );

  // Filtered Products for Table
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;

    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "in-stock"
        ? product.isAvailable && product.stock > 0
        : !product.isAvailable || product.stock === 0;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsAddEditOpen(true);
  };

  const handleCreateClick = () => {
    setEditingProduct(null);
    setIsAddEditOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج نهائياً من قاعدة البيانات؟")) {
      deleteProduct(productId);
      showToast("تم حذف المنتج بنجاح.");
    }
  };

  const handleToggleStock = (productId: string) => {
    toggleProductStock(productId);
    showToast("تم تحديث حالة توفر المنتج بالمخزن.");
  };

  const handleSaveProduct = (data: Omit<Product, "id" | "createdAt"> | Product) => {
    if ("id" in data) {
      updateProduct(data as Product);
      showToast("تم تعديل المنتج بنجاح.");
    } else {
      addProduct(data);
      showToast("تم إضافة منتج جديد للكتالوج.");
    }
  };

  const handleApplyPromo = () => {
    const pct = Number(promoPercent) || 0;
    bulkApplyDiscount(promoCategory, pct);
    showToast(`تم تطبيق خصم ${pct}% على قسم ${promoCategory === "all" ? "جميع الأقسام" : promoCategory} بنجاح.`);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dubai_store_catalog_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("تم تحميل ملف الكتالوج JSON بنجاح.");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <DubaiStoreLogo size="sm" clickable={false} />
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#F0FDFA] text-[#00C2CB] border border-[#00C2CB]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>لوحة إدارة دبي ستور</span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5 text-[#00C2CB]" />
              <span>عرض المتجر</span>
            </Link>

            <button
              onClick={adminLogout}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar on Right + Content on Left */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Right Sidebar */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-l border-slate-200 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-black text-slate-400 uppercase tracking-wider">
              القائمة الرئيسية
            </div>

            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === "overview"
                  ? "bg-[#00C2CB] text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>الرئيسية والإحصائيات</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === "products"
                  ? "bg-[#00C2CB] text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>المنتجات</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === "products" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {totalProducts}
              </span>
            </button>

            <button
              onClick={handleCreateClick}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-black text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>إضافة منتج جديد</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === "categories"
                  ? "bg-[#00C2CB] text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>الأقسام ({categories.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === "inventory"
                  ? "bg-[#00C2CB] text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Boxes className="w-4 h-4" />
                <span>المخزون والتنبيهات</span>
              </div>
              {lowStockProducts.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("promotions")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === "promotions"
                  ? "bg-[#00C2CB] text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4" />
                <span>العروض والخصومات</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                activeTab === "promotions" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {onSaleProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                activeTab === "settings"
                  ? "bg-[#00C2CB] text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>الإعدادات والنسخ الاحتياطي</span>
            </button>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 text-[11px] text-slate-400 font-bold">
            متجر دبي ستور • إصدار 2026
          </div>
        </aside>

        {/* Left Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">نظرة عامة على المتجر</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  ملخص فوري لبيانات المنتجات، حالة المخزون، وقيمة البضاعة المسجلة.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">إجمالي الموديلات</span>
                    <Package className="w-4 h-4 text-[#00C2CB]" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{totalProducts}</div>
                  <span className="text-[11px] text-slate-500 font-medium">منتج مسجل بالكتالوج</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">متوفر بالمخزن</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-black text-emerald-600">{inStockProducts.length}</div>
                  <span className="text-[11px] text-slate-500 font-medium">{totalStockCount} قطعة متاحة للبيع</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">عروض وخصومات</span>
                    <Flame className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="text-2xl font-black text-rose-600">{onSaleProducts.length}</div>
                  <span className="text-[11px] text-slate-500 font-medium">منتجات بأسعار مخفضة</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold">إجمالي قيمة المخزون</span>
                    <DollarSign className="w-4 h-4 text-[#00C2CB]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">
                    {totalInventoryValue.toLocaleString()} <span className="text-xs font-normal">ج.م</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">سعر بيع البضاعة المتوفرة</span>
                </div>
              </div>

              {/* Low Stock Warning Banner if applicable */}
              {lowStockProducts.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-black">تنبيه: {lowStockProducts.length} منتجات أوشكت على النفاد!</h4>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        يوجد منتجات متبقي منها 5 قطع أو أقل بالمخزن. يرجى تزويد الكمية.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("inventory")}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap transition-colors"
                  >
                    عرض المنتجات
                  </button>
                </div>
              )}

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={handleCreateClick}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#00C2CB] cursor-pointer shadow-2xs transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] text-[#00C2CB] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">إضافة منتج جديد</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">سجل هاتف أو إكسسوار جديد بالأسعار والمواصفات</p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("promotions")}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#00C2CB] cursor-pointer shadow-2xs transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">إدارة العروض والخصومات</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">تطبيق خصم بنسبة مئوية على قسم كامل دفعة واحدة</p>
                  </div>
                </div>

                <div
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#00C2CB] cursor-pointer shadow-2xs transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">إدارة الأقسام</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">إضافة قسم جديد أو تعديل الأقسام التسعة الرئيسية</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS TABLE */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">إدارة المنتجات</h1>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    تعديل، حذف، وتغيير حالة التوفر لجميع منتجات المتجر.
                  </p>
                </div>

                <button
                  onClick={handleCreateClick}
                  className="px-4 py-2.5 rounded-xl bg-[#00C2CB] hover:bg-[#0891B2] text-white font-black text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة منتج جديد</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ابحث بالاسم، الماركة، أو القسم..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#00C2CB]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#00C2CB]"
                  >
                    <option value="all">كل الأقسام</option>
                    {(categories.length > 0 ? categories : INITIAL_CATEGORIES).map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#00C2CB]"
                  >
                    <option value="all">كل الحالات</option>
                    <option value="in-stock">المتوفر فقط</option>
                    <option value="out-of-stock">غير المتوفر / نفد</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                      <tr>
                        <th className="py-3 px-4">المنتج</th>
                        <th className="py-3 px-4">القسم</th>
                        <th className="py-3 px-4">السعر</th>
                        <th className="py-3 px-4">الخصم</th>
                        <th className="py-3 px-4">المخزون</th>
                        <th className="py-3 px-4">الحالة</th>
                        <th className="py-3 px-4 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images?.[0] || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=100&q=80"}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200"
                              />
                              <div>
                                <div className="font-black text-slate-900">{p.name}</div>
                                <div className="text-[10px] text-slate-400">{p.brand}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-600">
                            {categories.find((c) => c.id === p.category)?.name || p.category}
                          </td>
                          <td className="py-3 px-4 font-black text-slate-900 whitespace-nowrap">
                            {p.price.toLocaleString()} ج.م
                          </td>
                          <td className="py-3 px-4">
                            {p.discountPercentage && p.discountPercentage > 0 ? (
                              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200">
                                {p.discountPercentage}%
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-bold ${p.stock <= 5 ? "text-amber-600" : "text-slate-900"}`}>
                              {p.stock} قطعة
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleToggleStock(p.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                                p.isAvailable && p.stock > 0
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                  : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                              }`}
                            >
                              {p.isAvailable && p.stock > 0 ? "متوفر" : "غير متوفر"}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#00C2CB] transition-colors"
                                title="تعديل"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(p.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">إدارة أقسام المتجر</h1>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    الأقسام التسعة الرئيسية للمتجر وصورها وعدد المنتجات في كل قسم.
                  </p>
                </div>

                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#00C2CB] hover:bg-[#0891B2] text-white font-black text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة قسم جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(categories.length > 0 ? categories : INITIAL_CATEGORIES).map((cat) => {
                  const count = products.filter((p) => p.category === cat.id).length;
                  return (
                    <div key={cat.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100"
                        />
                        <div>
                          <h3 className="font-black text-slate-900 text-sm">{cat.name}</h3>
                          <span className="text-[11px] text-slate-400 font-bold">{cat.nameEnglish || cat.id}</span>
                          {cat.badge && (
                            <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-[#F0FDFA] text-[#00C2CB] font-black">
                              {cat.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 font-medium mb-3">
                        {cat.description}
                      </p>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-600">متوفر {count} منتج</span>
                        <Link
                          href={`/products/${cat.id}`}
                          target="_blank"
                          className="text-[#00C2CB] hover:underline font-black flex items-center gap-1"
                        >
                          <span>عرض القسم</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: INVENTORY & LOW STOCK */}
          {activeTab === "inventory" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">إدارة المخزون والتنبيهات</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  مراقبة كميات القطع المتوفرة في المخزن والتنبيه الفوري عند اقتراب نفاد أي منتج.
                </p>
              </div>

              {/* Low stock table */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-amber-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-black text-amber-900">
                      منتجات أوشكت على النفاد ({lowStockProducts.length})
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-700 font-bold">متبقي 5 قطع أو أقل</span>
                </div>

                {lowStockProducts.length === 0 ? (
                  <div className="p-8 text-center text-xs font-bold text-slate-400">
                    لا يوجد أي منتجات أوشكت على النفاد حالياً.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                        <tr>
                          <th className="py-3 px-4">المنتج</th>
                          <th className="py-3 px-4">الماركة</th>
                          <th className="py-3 px-4">الكمية المتبقية</th>
                          <th className="py-3 px-4">السعر</th>
                          <th className="py-3 px-4 text-center">إجراء سريع</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {lowStockProducts.map((p) => (
                          <tr key={p.id}>
                            <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                            <td className="py-3 px-4 text-slate-500">{p.brand}</td>
                            <td className="py-3 px-4 font-black text-amber-600">{p.stock} قطع فقط</td>
                            <td className="py-3 px-4 font-black text-slate-900">{p.price.toLocaleString()} ج.م</td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-[#00C2CB] text-white text-[11px] font-bold transition-colors"
                              >
                                تزويد الكمية
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PROMOTIONS */}
          {activeTab === "promotions" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">إدارة العروض والخصومات</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  تطبيق خصم جماعي بالنسبة المئوية على قسم معين أو على كل المنتجات دفعة واحدة.
                </p>
              </div>

              {/* Bulk discount card */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs max-w-xl space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-rose-500" />
                  <span>تطبيق خصم جماعي فوري</span>
                </h3>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">اختر القسم</label>
                  <select
                    value={promoCategory}
                    onChange={(e) => setPromoCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#00C2CB]"
                  >
                    <option value="all">كل أقسام المتجر</option>
                    {(categories.length > 0 ? categories : INITIAL_CATEGORIES).map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">نسبة الخصم المئوية (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={promoPercent}
                    onChange={(e) => setPromoPercent(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-[#00C2CB]"
                    placeholder="مثال: 10 أو 15"
                  />
                </div>

                <button
                  onClick={handleApplyPromo}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  <span>تطبيق الخصم فوراً</span>
                </button>
              </div>

              {/* Discounted products count */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-slate-900">
                    المنتجات الخاضعة لخصومات حالياً ({onSaleProducts.length})
                  </span>
                  <button
                    onClick={() => {
                      bulkApplyDiscount("all", 0);
                      showToast("تم إلغاء جميع الخصومات من الكتالوج.");
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    إلغاء كل الخصومات
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {onSaleProducts.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.images?.[0] || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=100&q=80"}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{p.name}</div>
                          <div className="text-[11px] font-black text-rose-600">خصم {p.discountPercentage}%</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-900">{p.price.toLocaleString()} ج.م</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">الإعدادات والنسخ الاحتياطي</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  تصدير بيانات المتجر كملف JSON، واستعادة بيانات الديمو التجريبية الأصلية عند الحاجة.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Backup & Export */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                    <Download className="w-4 h-4 text-[#00C2CB]" />
                    <span>تصدير نسخة احتياطية من الكتالوج</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    قم بتحميل ملف JSON يحتوي على كامل المنتجات والمواصفات والأسعار الحالية لحفظها على جهازك.
                  </p>
                  <button
                    onClick={handleExportJSON}
                    className="mt-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#00C2CB] text-white text-xs font-black transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الكتالوج (JSON)</span>
                  </button>
                </div>

                {/* Reset to Demo */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-rose-600 font-black text-sm">
                    <RefreshCw className="w-4 h-4" />
                    <span>استعادة البيانات الافتراضية (Demo Reset)</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    استعادة جميع هواتف آيفون وسامسونج والإكسسوارات الافتراضية الأصلية بأسعارها وصورها الأساسية.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm("هل أنت متأكد من استعادة بيانات الديمو الافتراضية للمتجر؟ سيتم استبدال المنتجات الحالية.")) {
                        resetCatalogToDemo();
                        showToast("تمت استعادة البيانات الافتراضية للكتالوج بنجاح.");
                      }
                    }}
                    className="mt-2 px-4 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-black transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>استعادة البيانات الافتراضية</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingProduct(null);
        }}
        categories={categories.length > 0 ? categories : INITIAL_CATEGORIES}
        initialProduct={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories.length > 0 ? categories : INITIAL_CATEGORIES}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
      />

      {/* Bulk Operations Modal */}
      <BulkOperationsModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        categories={categories.length > 0 ? categories : INITIAL_CATEGORIES}
        products={products}
        onApplyDiscount={bulkApplyDiscount}
        onResetToDemo={resetCatalogToDemo}
        onImportJSON={importProductsJSON}
      />
    </div>
  );
}
