"use client";

import { Download, Percent, RefreshCw, Upload, X } from "lucide-react";
import React, { useState } from "react";
import { Category, Product } from "../../lib/types";

interface BulkOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  products: Product[];
  onApplyDiscount: (category: string, discount: number) => void;
  onResetToDemo: () => void;
  onImportJSON: (jsonString: string) => boolean;
}

export const BulkOperationsModal: React.FC<BulkOperationsModalProps> = ({
  isOpen,
  onClose,
  categories,
  products,
  onApplyDiscount,
  onResetToDemo,
  onImportJSON,
}) => {
  if (!isOpen) return null;

  const [discountCategory, setDiscountCategory] = useState("all");
  const [discountPercent, setDiscountPercent] = useState("10");
  const [jsonText, setJsonText] = useState("");
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleApplyDiscount = () => {
    const pct = Number(discountPercent) || 0;
    onApplyDiscount(discountCategory, pct);
    setImportStatus(`Successfully applied ${pct}% discount to ${discountCategory} products!`);
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dubai_store_catalog_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Brand", "Category", "Price_EGP", "OriginalPrice_EGP", "Stock", "Available"];
    const rows = products.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.brand,
      p.category,
      p.price,
      p.originalPrice || p.price,
      p.stock,
      p.isAvailable ? "YES" : "NO",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dubai_store_products_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImport = () => {
    if (!jsonText.trim()) return;
    const ok = onImportJSON(jsonText);
    if (ok) {
      setImportStatus("Catalog imported successfully!");
      setJsonText("");
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1500);
    } else {
      setImportStatus("Invalid JSON format. Please verify the JSON array.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Bulk Management & Data Tools</h3>
            <p className="text-xs text-slate-400">
              Bulk price updates, sales promotions, and catalog backup/export.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {importStatus && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              {importStatus}
            </div>
          )}

          {/* 1. Bulk Discount Promotion */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#0891B2]" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Apply Bulk Store Discount
              </h4>
            </div>
            <p className="text-xs text-slate-500">
              Instantly recalculate prices and discount badges across an entire category or the whole store.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Target Category</label>
                <select
                  value={discountCategory}
                  onChange={(e) => setDiscountCategory(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="all">All Store Products</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Discount %</label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  className="w-full py-2 rounded-xl bg-[#0891B2] hover:bg-[#00C2CB] text-white text-xs font-bold transition-colors"
                >
                  Apply Discount
                </button>
              </div>
            </div>
          </div>

          {/* 2. Export Catalog */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Export Catalog Data
              </h4>
            </div>
            <p className="text-xs text-slate-500">
              Download your product catalog backup for inventory records or spreadsheets.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <span>Export to CSV (Excel)</span>
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-800 transition-colors flex items-center gap-1.5"
              >
                <span>Export to JSON</span>
              </button>
            </div>
          </div>

          {/* 3. Import JSON Catalog */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-slate-700" />
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Import JSON Catalog
              </h4>
            </div>
            <textarea
              rows={3}
              placeholder="Paste JSON array of products here..."
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-mono"
            />
            <button
              type="button"
              onClick={handleImport}
              disabled={!jsonText.trim()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold"
            >
              Import JSON
            </button>
          </div>

          {/* 4. Reset to Initial Demo Catalog */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  Reset Catalog to Original Sample Data
                </h4>
                <p className="text-xs text-rose-600 mt-0.5">
                  Re-populates the database with initial iPhones, Samsung Galaxy, and accessories.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset catalog back to initial sample products?")) {
                    onResetToDemo();
                    onClose();
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
