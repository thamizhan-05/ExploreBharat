'use client';

import React from 'react';
import { RefreshCw, Check, Flag, X } from 'lucide-react';

interface ImageIntegrityTabProps {
  ii: {
    totalImages?: number;
    uniqueImages?: number;
    exactDuplicatesCount?: number;
    nearDuplicatesCount?: number;
    brokenImagesCount?: number;
    recentImages?: any[];
  };
  healthChecking: boolean;
  onRunHealthCheck: () => void;
  onImageAction: (id: string, action: string) => void;
}

export default function AdminImageIntegrityTab({
  ii,
  healthChecking,
  onRunHealthCheck,
  onImageAction,
}: ImageIntegrityTabProps) {
  return (
    <div className="space-y-8">
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Zero Duplication Guarantee</span>
            <h2 className="text-2xl font-black tracking-tight text-white">🖼️ Image Integrity Engine</h2>
            <p className="text-xs text-stone-400 max-w-2xl mt-1">
              Enforces the Absolute Image Rule using cryptographic SHA-256 exact-match detection and dHash perceptual near-duplicate matching.
            </p>
          </div>
          <button
            onClick={onRunHealthCheck}
            disabled={healthChecking}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg disabled:opacity-50 self-start"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${healthChecking ? 'animate-spin' : ''}`} />
            <span>{healthChecking ? 'Auditing Hash Hashes...' : 'Run Automated Health Check'}</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-800">
          <div className="bg-stone-800/80 p-4 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Total Images</span>
            <p className="text-2xl font-black text-white mt-1">{ii.totalImages || 0}</p>
            <span className="text-[10px] text-stone-400">{ii.uniqueImages || 0} unique hashes</span>
          </div>
          <div className="bg-stone-800/80 p-4 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Exact Duplicates</span>
            <p className={`text-2xl font-black mt-1 ${(ii.exactDuplicatesCount || 0) === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {ii.exactDuplicatesCount || 0}
            </p>
            <span className="text-[10px] text-stone-400">{(ii.exactDuplicatesCount || 0) === 0 ? 'Zero duplicates' : 'Flagged for removal'}</span>
          </div>
          <div className="bg-stone-800/80 p-4 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Near Duplicates (dHash)</span>
            <p className="text-2xl font-black text-amber-400 mt-1">{ii.nearDuplicatesCount || 0}</p>
            <span className="text-[10px] text-stone-400">Distance &le; 5 review</span>
          </div>
          <div className="bg-stone-800/80 p-4 rounded-2xl">
            <span className="text-[10px] font-bold text-stone-400 block uppercase">Broken / Missing</span>
            <p className={`text-2xl font-black mt-1 ${(ii.brokenImagesCount || 0) === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {ii.brokenImagesCount || 0}
            </p>
            <span className="text-[10px] text-stone-400">{(ii.brokenImagesCount || 0) === 0 ? 'All links 200 OK' : 'Needs replacement'}</span>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-stone-900">Image Provenance & Integrity Audit Table</h3>
            <p className="text-xs text-stone-500">Every image stores cryptographic hash, license, photographer attribution, and place identity.</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ✓ SHA-256 & dHash Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Preview</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">SHA-256 Hash</th>
                <th className="py-3 px-4">pHash / dHash</th>
                <th className="py-3 px-4">Source & License</th>
                <th className="py-3 px-4">Attribution</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {ii.recentImages?.map((img: any) => (
                <tr key={img.id} className="hover:bg-stone-50/80">
                  <td className="py-3 px-4">
                    <div className="w-14 h-10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200">
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-900 max-w-[150px] truncate">
                    {img.attraction?.name || img.hotel?.name || 'Entity'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-stone-500">
                    {img.contentHash ? img.contentHash.substring(0, 12) + '...' : 'pending'}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-stone-500">
                    {img.perceptualHash || 'pending'}
                  </td>
                  <td className="py-3 px-4 text-stone-600">
                    <span className="font-semibold block">{img.sourceType}</span>
                    <span className="text-[10px] text-stone-400">{img.license || 'CC-BY-SA'}</span>
                  </td>
                  <td className="py-3 px-4 text-stone-500 max-w-[150px] truncate">
                    {img.attribution || img.photographer || 'Wikimedia / ASI'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      img.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {img.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => onImageAction(img.id, 'APPROVE')}
                      title="Approve Image"
                      className="p-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onImageAction(img.id, 'SET_PRIMARY')}
                      title="Set as Hero / Primary"
                      className="p-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      <span className="text-xs">⭐</span>
                    </button>
                    <button
                      onClick={() => onImageAction(img.id, 'FLAG')}
                      title="Flag for review"
                      className="p-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onImageAction(img.id, 'REJECT')}
                      title="Reject Image"
                      className="p-1 rounded bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
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
