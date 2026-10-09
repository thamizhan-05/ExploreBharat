'use client';

import React, { useState } from 'react';
import { X, MapPin, Sparkles, Image as ImageIcon, CheckCircle2, AlertCircle, Compass } from 'lucide-react';
import { api } from '../lib/api';

interface SuggestPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const CATEGORIES = [
  'Heritage & Forts',
  'UNESCO & Monuments',
  'Religious & Spiritual',
  'Nature & Mountains',
  'Wildlife & Sanctuaries',
  'Beaches & Coastal',
  'Adventure & Sports',
  'Food & Local Culture',
  'Hidden Gems'
];

export function SuggestPlaceModal({ isOpen, onClose }: SuggestPlaceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    state: 'Tamil Nadu',
    district: '',
    city: '',
    category: 'Heritage & Forts',
    entryType: 'FREE',
    entryFee: '',
    description: '',
    imageUrl: '',
    whyWorthVisiting: '',
    bestTimeToVisit: 'October to March',
    howToReach: '',
    submittedByEmail: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/attractions/suggest', {
        name: formData.name,
        state: formData.state,
        district: formData.district || undefined,
        city: formData.city || undefined,
        category: formData.category,
        description: formData.description,
        imageUrl: formData.imageUrl || undefined,
        entryType: formData.entryType,
        entryFee: formData.entryFee ? parseFloat(formData.entryFee) : undefined,
        bestTimeToVisit: formData.bestTimeToVisit || undefined,
        howToReach: formData.howToReach || undefined,
        whyWorthVisiting: formData.whyWorthVisiting || undefined,
        submittedByEmail: formData.submittedByEmail || undefined
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to submit place suggestion.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setError(null);
    setFormData({
      name: '',
      state: 'Tamil Nadu',
      district: '',
      city: '',
      category: 'Heritage & Forts',
      entryType: 'FREE',
      entryFee: '',
      description: '',
      imageUrl: '',
      whyWorthVisiting: '',
      bestTimeToVisit: 'October to March',
      howToReach: '',
      submittedByEmail: ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-600 text-white shadow-md shadow-orange-600/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Suggest a Destination</h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Help uncover India&apos;s hidden heritage, sacred places, and untold wonders.
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {success ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Suggestion Received!</h3>
              <p className="max-w-md mx-auto text-sm text-zinc-600 dark:text-zinc-400">
                Thank you for contributing to ExploreBharat. Our editorial verification team will review the location, photo license, and admission rules before publishing it to the national catalog.
              </p>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-md transition-all"
                >
                  Close & Continue Exploring
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Attraction / Place Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samanar Hills Jain Caves"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    State / Union Territory *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    City / Town / Village
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Madurai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Entry Type *
                  </label>
                  <select
                    value={formData.entryType}
                    onChange={(e) => setFormData({ ...formData, entryType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="FREE">FREE ENTRY (Zero admission fee)</option>
                    <option value="PAID">PAID (Official ticket required)</option>
                    <option value="CONDITIONAL">CONDITIONAL (Free with paid sections)</option>
                    <option value="PERMIT_REQUIRED">PERMIT_REQUIRED (Forest/ILP pass needed)</option>
                    <option value="UNKNOWN">UNKNOWN</option>
                  </select>
                </div>

                {formData.entryType === 'PAID' && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Entry Fee (₹ INR)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={formData.entryFee}
                      onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share historical context, architecture, or natural beauty of this destination..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Direct Photo URL (Wikimedia Commons, Official Site, or High-Resolution Public URL)
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://upload.wikimedia.org/...jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <ImageIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                  Absolute rule: Image must be authentic and genuinely depict this exact place. No stock placeholders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October to March"
                    value={formData.bestTimeToVisit}
                    onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Your Contact Email (for verification credit)
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.submittedByEmail}
                    onChange={(e) => setFormData({ ...formData, submittedByEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium shadow-md shadow-orange-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit for Verification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
