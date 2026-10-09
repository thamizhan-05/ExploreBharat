'use client';

import React from 'react';
import { RefreshCw, Shield, MapPin } from 'lucide-react';

interface AdminDataCenterTabProps {
  dc: any;
  onRefresh: () => void;
}

export function AdminDataCenterTab({ dc, onRefresh }: AdminDataCenterTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Authentic India Inventory</span>
            <h2 className="text-2xl font-black tracking-tight text-white">🏛️ Real Data Center</h2>
            <p className="text-xs text-stone-400 max-w-2xl mt-1">
              Traceable, multi-source knowledge system covering ASI monuments, State Tourism bodies, and verified hotels across all 28 States and 8 Union Territories.
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs font-bold rounded-xl flex items-center gap-2 self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Inventory
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800">
          <div className="bg-stone-800/80 p-4 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Verified Attractions</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{dc.attractions?.verified || 0} <span className="text-xs font-normal text-stone-400">/ {dc.attractions?.total || 0}</span></p>
            <span className="text-[10px] text-stone-400">100% genuine places</span>
          </div>
          <div className="bg-stone-800/80 p-4 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Verified Hotels</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{dc.hotels?.verified || 0} <span className="text-xs font-normal text-stone-400">/ {dc.hotels?.total || 0}</span></p>
            <span className="text-[10px] text-stone-400">{dc.hotels?.withPriceSource || 0} real tariff sources</span>
          </div>
          <div className="bg-stone-800/80 p-4 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Hidden Gems</span>
            <p className="text-2xl font-black text-blue-400 mt-1">{dc.attractions?.hiddenGems || 0}</p>
            <span className="text-[10px] text-stone-400">Curated authentic places</span>
          </div>
          <div className="bg-stone-800/80 p-4 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Free Entry Places</span>
            <p className="text-2xl font-black text-purple-400 mt-1">{dc.attractions?.freeEntry || 0}</p>
            <span className="text-[10px] text-stone-400">Verified zero-fee entry</span>
          </div>
        </div>
      </div>

      {/* Sources Breakdown & Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-bharat-saffron" /> Provenance Sources Breakdown
          </h3>
          <div className="space-y-3">
            {dc.sources && Object.entries(dc.sources).map(([sourceName, count]: any) => (
              <div key={sourceName} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100">
                <span className="font-semibold text-stone-700">{sourceName.replace('_', ' ')}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-900 font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-sm">
          <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" /> 28 States & 8 Union Territories Support
          </h3>
          <p className="text-xs text-stone-500">
            ExploreBharat data model supports pan-India administrative hierarchy (Country &rarr; State &rarr; District &rarr; City &rarr; Attraction).
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-stone-50 rounded-2xl border border-stone-100 text-[11px]">
            {dc.stateDistribution?.map((st: any) => (
              <span key={st.code} className="px-2.5 py-1 bg-white border border-stone-200 rounded-lg font-medium text-stone-700">
                {st.name} ({st._count?.cities || 0})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Attractions Table with Provenance */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-extrabold text-stone-900">Authentic Attractions Directory (Real Places)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Attraction</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Entry Protocol</th>
                <th className="py-3 px-4">Source / Authority</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {dc.attractionsList?.map((a: any) => (
                <tr key={a.id} className="hover:bg-stone-50/80">
                  <td className="py-3 px-4 font-bold text-stone-900 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      <img src={a.heroImageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span>{a.name}</span>
                      {a.isHiddenGem && <span className="text-[10px] text-amber-600 block">✨ Hidden Gem</span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    {a.city?.name || 'India'}
                    <span className="text-[10px] text-stone-400 block">{a.district || a.city?.state?.name}</span>
                  </td>
                  <td className="py-3 px-4 text-stone-700">{a.category?.name || 'Heritage'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      a.entryType === 'FREE' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-800'
                    }`}>
                      {a.entryType === 'FREE' ? 'FREE' : `₹${a.entryFee || a.adultIndianFee || 50}`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-500 font-medium">{a.feeSource || 'Official ASI / State'}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {a.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDataCenterTab;
