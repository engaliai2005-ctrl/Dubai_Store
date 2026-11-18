"use client";

import { Plus, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import { Category, CategoryId } from "../../lib/types";

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: CategoryId) => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onDeleteCategory,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState("");
  const [nameArabic, setNameArabic] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80");
  const [badge, setBadge] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const id = name.toLowerCase().replace(/[^a-z0-9]/g, "-") as CategoryId;
    onAddCategory({
      id,
      name,
      nameArabic: nameArabic || undefined,
      description,
      image: imageUrl,
      badge: badge || undefined,
      itemCount: 0,
    });

    setName("");
    setNameArabic("");
    setDescription("");
    setBadge("");
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
            <h3 className="text-base font-bold text-white">Manage Store Departments</h3>
            <p className="text-xs text-slate-400">
              Create and manage customer categories and navigation tabs.
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
          {/* Add Category Form */}
          <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Add New Department
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaming Consoles"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  Arabic Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. أجهزة الألعاب"
                  value={nameArabic}
                  onChange={(e) => setNameArabic(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. New / Hot"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Description</label>
              <input
                type="text"
                placeholder="Short department summary..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-white"
              />
            </div>

            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-[#0891B2] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Department</span>
            </button>
          </form>

          {/* Current Departments List */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Active Departments ({categories.length})
            </h4>

            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-100"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{cat.name}</p>
                      {cat.nameArabic && (
                        <p className="text-[10px] text-slate-400">{cat.nameArabic}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
