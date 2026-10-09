'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { getItemIcon, getConfidenceBadge } from './JourneyTimelineTab';

interface JourneyAuditModalProps {
  selectedItem: any;
  onClose: () => void;
}

export default function JourneyAuditModal({
  selectedItem,
  onClose,
}: JourneyAuditModalProps) {
  if (!selectedItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-stone-100 rounded-lg">
              {getItemIcon(selectedItem)}
            </div>
            <div>
              <h4 className="text-sm font-black text-stone-900 uppercase">
                Journey Event Data Audit
              </h4>
              <p className="text-[11px] text-stone-500">Full structured record with source traceability</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-stone-50 p-3 rounded-xl border space-y-1">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">Scheduled Event</span>
            <span className="font-bold text-stone-900 text-sm">{selectedItem.title}</span>
            {selectedItem.subtitle && (
              <p className="text-xs text-stone-600">{selectedItem.subtitle}</p>
            )}
            <p className="text-xs text-amber-700 font-mono font-semibold">Scheduled Time: {selectedItem.time}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-lg border bg-stone-50">
              <span className="text-[10px] text-stone-400 font-bold block uppercase">Event Type</span>
              <span className="font-bold text-stone-800">{selectedItem.type}</span>
            </div>
            <div className="p-2.5 rounded-lg border bg-stone-50">
              <span className="text-[10px] text-stone-400 font-bold block uppercase">Duration</span>
              <span className="font-bold text-stone-800">{selectedItem.durationMinutes || '--'} min</span>
            </div>
            <div className="p-2.5 rounded-lg border bg-stone-50">
              <span className="text-[10px] text-stone-400 font-bold block uppercase">Confidence</span>
              <div>{getConfidenceBadge(selectedItem.confidence || selectedItem.statusBadge)}</div>
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-stone-600">Tariff / Cost:</span>
              <span className="font-bold text-stone-900">
                {selectedItem.costLabel || `₹${selectedItem.costInr || 0}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-stone-600">Data Source:</span>
              <span className="font-mono text-stone-800 font-bold">{selectedItem.source || 'ExploreBharat Registry'}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-stone-600">Status Classification:</span>
              <span className="text-stone-800 font-semibold">{selectedItem.statusBadge}</span>
            </div>
          </div>

          {selectedItem.details && (
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-[11px] space-y-1">
              <span className="font-bold text-amber-900 block">Transit &amp; Venue Details:</span>
              <pre className="text-[10px] font-mono text-stone-800 whitespace-pre-wrap">
                {JSON.stringify(selectedItem.details, null, 2)}
              </pre>
            </div>
          )}

          {selectedItem.bookingUrl && (
            <div className="pt-2">
              <a
                href={selectedItem.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                Open Official Booking Gateway
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
