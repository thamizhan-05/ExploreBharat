'use client';

import React from 'react';

interface AddAttractionModalProps {
  show: boolean;
  onClose: () => void;
  attrForm: {
    name: string;
    cityId: string;
    categoryId: string;
    openingHours: string;
    address: string;
    imageUrl: string;
    description: string;
  };
  setAttrForm: React.Dispatch<React.SetStateAction<any>>;
  citiesList: any[];
  categoriesList: any[];
  formSubmitting: boolean;
  formSuccess: string;
  formError: string;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminAddAttractionModal({
  show,
  onClose,
  attrForm,
  setAttrForm,
  citiesList,
  categoriesList,
  formSubmitting,
  formSuccess,
  formError,
  onSubmit,
}: AddAttractionModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-xl font-black text-stone-900">Add New Tourist Attraction</h3>
            <p className="text-xs text-stone-500">Register destinations with verified entry rules, ticketing, or permit protocols.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {formSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
            {formSuccess}
          </div>
        )}
        {formError && (
          <div className="p-3 bg-rose-50 text-rose-800 rounded-xl text-xs font-bold border border-rose-200">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Attraction Name *</label>
              <input
                type="text"
                required
                value={attrForm.name}
                onChange={(e) => setAttrForm({ ...attrForm, name: e.target.value })}
                placeholder="e.g. Thirumalai Nayakkar Mahal"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Destination City *</label>
              <select
                value={attrForm.cityId}
                onChange={(e) => setAttrForm({ ...attrForm, cityId: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
              >
                {citiesList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.state?.name || 'India'})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Category *</label>
              <select
                value={attrForm.categoryId}
                onChange={(e) => setAttrForm({ ...attrForm, categoryId: e.target.value })}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
              >
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">Visiting Hours</label>
              <input
                type="text"
                value={attrForm.openingHours}
                onChange={(e) => setAttrForm({ ...attrForm, openingHours: e.target.value })}
                placeholder="e.g. 9:00 AM – 5:00 PM"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Address / Landmark *</label>
            <input
              type="text"
              required
              value={attrForm.address}
              onChange={(e) => setAttrForm({ ...attrForm, address: e.target.value })}
              placeholder="e.g. Panthadi 1st St, Madurai, Tamil Nadu"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Verified Place Image URL (Optional - Never generic fallback)</label>
            <input
              type="url"
              value={attrForm.imageUrl}
              onChange={(e) => setAttrForm({ ...attrForm, imageUrl: e.target.value })}
              placeholder="https://upload.wikimedia.org/... (or leave blank for 'Photo coming soon')"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Description *</label>
            <textarea
              rows={3}
              required
              value={attrForm.description}
              onChange={(e) => setAttrForm({ ...attrForm, description: e.target.value })}
              placeholder="Detailed authentic description of this monument..."
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-6 py-2.5 rounded-xl bg-bharat-saffron hover:bg-bharat-terracotta text-white font-extrabold shadow-md transition-all disabled:opacity-50"
            >
              {formSubmitting ? 'Registering...' : 'Register Attraction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
