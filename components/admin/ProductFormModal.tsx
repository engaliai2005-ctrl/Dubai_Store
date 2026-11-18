"use client";

import { Check, Image, Plus, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import { Category, CategoryId, Product, ProductColor } from "../../lib/types";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  initialProduct?: Product | null;
  onSave: (product: Omit<Product, "id" | "createdAt"> | Product) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  categories,
  initialProduct,
  onSave,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || "");
  const [brand, setBrand] = useState<Product["brand"]>(initialProduct?.brand || "Apple");
  const [category, setCategory] = useState<CategoryId>(initialProduct?.category || "iphone");
  const [price, setPrice] = useState(initialProduct?.price ? String(initialProduct.price) : "");
  const [originalPrice, setOriginalPrice] = useState(
    initialProduct?.originalPrice ? String(initialProduct.originalPrice) : ""
  );
  const [stock, setStock] = useState(initialProduct?.stock !== undefined ? String(initialProduct.stock) : "10");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.images?.[0] || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80"
  );
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured || false);
  const [isNewArrival, setIsNewArrival] = useState(initialProduct?.isNewArrival || false);
  const [isAvailable, setIsAvailable] = useState(initialProduct?.isAvailable ?? true);

  // Storage tags
  const [storageTags, setStorageTags] = useState<string[]>(
    initialProduct?.storageOptions || ["128GB", "256GB"]
  );
  const [newStorage, setNewStorage] = useState("");

  // Color options
  const [colors, setColors] = useState<ProductColor[]>(
    initialProduct?.colors || [
      { name: "Black", hex: "#1C1C1E" },
      { name: "Silver", hex: "#E5E5EA" },
    ]
  );
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#00E5FF");

  // Specs key-value pairs
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    initialProduct?.specs
      ? Object.entries(initialProduct.specs).map(([k, v]) => ({ key: k, value: v }))
      : [
          { key: "Display", value: "6.7-inch OLED" },
          { key: "Processor", value: "High Performance Octa-Core" },
        ]
  );

  const handleAddStorage = () => {
    if (newStorage && !storageTags.includes(newStorage.toUpperCase())) {
      setStorageTags([...storageTags, newStorage.toUpperCase()]);
      setNewStorage("");
    }
  };

  const handleRemoveStorage = (tag: string) => {
    setStorageTags(storageTags.filter((t) => t !== tag));
  };

  const handleAddColor = () => {
    if (newColorName) {
      setColors([...colors, { name: newColorName, hex: newColorHex }]);
      setNewColorName("");
    }
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleAddSpecRow = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const priceNum = Number(price) || 0;
    const origPriceNum = originalPrice ? Number(originalPrice) : undefined;
    const discountPct =
      origPriceNum && origPriceNum > priceNum
        ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)
        : undefined;

    const specsMap: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsMap[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      ...(initialProduct ? initialProduct : {}),
      name,
      brand,
      category,
      price: priceNum,
      originalPrice: origPriceNum,
      discountPercentage: discountPct,
      stock: Number(stock) || 0,
      description,
      shortDescription,
      images: [imageUrl],
      colors,
      storageOptions: storageTags,
      specs: specsMap,
      isAvailable,
      isFeatured,
      isNewArrival,
      rating: initialProduct?.rating || 4.8,
      reviewCount: initialProduct?.reviewCount || 1,
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {isEditing ? `Edit Product: ${initialProduct?.name}` : "Add New Product to Catalog"}
            </h3>
            <p className="text-xs text-slate-400">
              Changes will save to database and immediately reflect on the public website.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Row 1: Name & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. iPhone 16 Pro Max 256GB"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#00C2CB]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Brand *</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as Product["brand"])}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#00C2CB] bg-white"
              >
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Google">Google</option>
                <option value="Xiaomi">Xiaomi</option>
                <option value="Anker">Anker</option>
                <option value="Spigen">Spigen</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 2: Category, Price, Original Price, Stock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#00C2CB] bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Price (EGP) *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 78500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#00C2CB]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Original Price (EGP)
              </label>
              <input
                type="number"
                placeholder="e.g. 83000 (if discount)"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#00C2CB]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 15"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#00C2CB]"
              />
            </div>
          </div>

          {/* Image URL & Instant Preview */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Product Image URL (High-res PNG/JPG) *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#00C2CB]"
              />
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="preview" className="w-full h-full object-contain" />
                ) : (
                  <Image className="w-5 h-5 text-slate-300" />
                )}
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Short Highlight Line
              </label>
              <input
                type="text"
                placeholder="e.g. Grade 5 Titanium, A18 Pro chip, 48MP Fusion Camera."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#00C2CB]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Description *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Detailed device description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#00C2CB]"
              />
            </div>
          </div>

          {/* Storage & Color Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            {/* Storage Options */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Storage Capacities
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. 512GB"
                  value={newStorage}
                  onChange={(e) => setNewStorage(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={handleAddStorage}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold hover:bg-slate-200"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {storageTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStorage(tag)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Available Colors
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Color Name (e.g. Desert Titanium)"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  className="flex-1 text-xs p-2 rounded-xl border border-slate-200"
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                  title="Pick hex color"
                />
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="px-3 py-2 rounded-xl bg-slate-100 text-xs font-bold hover:bg-slate-200"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {colors.map((c, i) => (
                  <span
                    key={c.name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-xs font-semibold text-slate-700"
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-slate-300"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(i)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                Technical Specifications (Key - Value)
              </label>
              <button
                type="button"
                onClick={handleAddSpecRow}
                className="text-xs text-[#0891B2] font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spec Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Feature (e.g. Display)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(i, "key", e.target.value)}
                    className="w-1/3 text-xs p-2 rounded-xl border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Specification (e.g. 6.9-inch 120Hz)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(i, "value", e.target.value)}
                    className="w-2/3 text-xs p-2 rounded-xl border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(i)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Flags: Featured, New, Available */}
          <div className="flex items-center gap-6 pt-3 border-t border-slate-100 text-xs font-medium">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-[#0891B2]"
              />
              <span>In Stock & Available</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#0891B2]"
              />
              <span>Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 rounded text-[#0891B2]"
              />
              <span>New Arrival Badge</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0891B2] text-white text-xs font-bold transition-all shadow-md"
            >
              {isEditing ? "Save Product Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
