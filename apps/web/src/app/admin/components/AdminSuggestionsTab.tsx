'use client';

import React from 'react';
import { Search, Check, X } from 'lucide-react';

interface SuggestionsTabProps {
  duplicateCheckQuery: string;
  setDuplicateCheckQuery: (val: string) => void;
  duplicateCheckCity: string;
  setDuplicateCheckCity: (val: string) => void;
  duplicateChecking: boolean;
  duplicateResults: any[] | null;
  onRunDuplicateCheck: () => void;
  suggestionsFilter: 'ALL' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  setSuggestionsFilter: (filter: 'ALL' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED') => void;
  suggestionsList: any[];
  onApproveSuggestion: (id: string) => void;
  onRejectSuggestion: (id: string) => void;
}

export default function AdminSuggestionsTab({
  duplicateCheckQuery,
  setDuplicateCheckQuery,
  duplicateCheckCity,
  setDuplicateCheckCity,
  duplicateChecking,
  duplicateResults,
  onRunDuplicateCheck,
  suggestionsFilter,
  setSuggestionsFilter,
  suggestionsList,
  onApproveSuggestion,
  onRejectSuggestion,
}: SuggestionsTabProps) {
  const filteredSuggestions = suggestionsList.filter(
    (s) => suggestionsFilter === 'ALL' || s.status === suggestionsFilter
  );

  return (
    <div className="space-y-8">
      {/* Section 1: Interactive Place Duplicate Matcher */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <span>🔍 Place Duplicate Detection & Matcher</span>
            </h3>
            <p className="text-xs text-stone-500">
              Tests normalized name tokens, Levenshtein distance, and GPS geodesic proximity before onboarding places.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Candidate Place Name</label>
            <input
              type="text"
              value={duplicateCheckQuery}
              onChange={(e) => setDuplicateCheckQuery(e.target.value)}
              placeholder="e.g. Arulmigu Meenakshi Sundareswarar"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">City / Region (Optional)</label>
            <input
              type="text"
              value={duplicateCheckCity}
              onChange={(e) => setDuplicateCheckCity(e.target.value)}
              placeholder="e.g. Madurai"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-bharat-saffron"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={onRunDuplicateCheck}
              disabled={duplicateChecking || !duplicateCheckQuery.trim()}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{duplicateChecking ? 'Scanning Catalog...' : 'Check For Duplicate'}</span>
            </button>
          </div>
        </div>

        {duplicateResults && (
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <span className="text-xs font-extrabold text-stone-700 block">
              Scan Results ({duplicateResults.length} Matches Found):
            </span>
            {duplicateResults.length === 0 ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold border border-emerald-200">
                ✓ No conflicting duplicate found! This landmark appears unique in the ExploreBharat national database.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {duplicateResults.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-stone-900 text-sm">{m.existingName}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        m.confidenceScore >= 90
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.confidenceScore}% Match ({m.matchReason})
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Located in: <strong className="text-stone-800">{m.cityName}</strong>
                      {m.distanceKm !== undefined && (
                        <span> • Proximity: <strong className="text-stone-800">{m.distanceKm} km</strong></span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Section 2: Community Place Suggestions Review Queue */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <span>📬 Community Place Suggestions Queue</span>
            </h3>
            <p className="text-xs text-stone-500">
              Submissions contributed by verified travelers awaiting editorial review and publication.
            </p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-[11px] font-bold">
            {(['ALL', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSuggestionsFilter(filter)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  suggestionsFilter === filter
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {filter.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestions Cards */}
        {filteredSuggestions.length === 0 ? (
          <div className="py-12 text-center text-stone-400 text-xs font-medium italic">
            No place suggestions matching this filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSuggestions.map((sug) => (
              <div
                key={sug.id}
                className="p-5 rounded-2xl border border-stone-200 hover:border-amber-300 transition-all bg-stone-50/50 flex flex-col md:flex-row gap-5 items-start justify-between"
              >
                <div className="flex gap-4 items-start">
                  {sug.imageUrl ? (
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                      <img src={sug.imageUrl} alt={sug.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-stone-200 text-stone-400 flex items-center justify-center shrink-0 text-xs font-bold">
                      No Photo
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-stone-900 text-sm">{sug.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {sug.category}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-200 text-stone-700">
                        {sug.entryType} {sug.entryFee ? `₹${sug.entryFee}` : ''}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        sug.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : (sug.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800')
                      }`}>
                        {sug.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600">
                      📍 <strong>{sug.city ? `${sug.city}, ` : ''}{sug.state}</strong>
                      {sug.submittedByEmail && (
                        <span> • Submitted by: <em>{sug.submittedByEmail}</em></span>
                      )}
                    </p>

                    <p className="text-xs text-stone-700 line-clamp-2 max-w-2xl">
                      {sug.description}
                    </p>

                    {sug.whyWorthVisiting && (
                      <p className="text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-100">
                        💡 <strong>Why Visit:</strong> {sug.whyWorthVisiting}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                {sug.status === 'PENDING_REVIEW' && (
                  <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => onApproveSuggestion(sug.id)}
                      className="flex-1 md:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                    <button
                      onClick={() => onRejectSuggestion(sug.id)}
                      className="flex-1 md:flex-initial px-4 py-2 bg-stone-200 hover:bg-rose-100 hover:text-rose-700 text-stone-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
