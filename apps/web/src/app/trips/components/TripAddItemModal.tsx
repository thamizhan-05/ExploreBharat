'use client';

import React from 'react';

interface TripAddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTimeSlot: 'MORNING' | 'AFTERNOON' | 'EVENING';
  setItemTimeSlot: (slot: 'MORNING' | 'AFTERNOON' | 'EVENING') => void;
  itemTitle: string;
  setItemTitle: (title: string) => void;
  itemPlace: string;
  setItemPlace: (place: string) => void;
  itemCost: number;
  setItemCost: (cost: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TripAddItemModal({
  isOpen,
  onClose,
  itemTimeSlot,
  setItemTimeSlot,
  itemTitle,
  setItemTitle,
  itemPlace,
  setItemPlace,
  itemCost,
  setItemCost,
  onSubmit,
}: TripAddItemModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-black text-stone-900">Add Item to Day</h3>
        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Time Slot</label>
            <select
              value={itemTimeSlot}
              onChange={(e) => setItemTimeSlot(e.target.value as any)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            >
              <option value="MORNING">Morning (09:00 - 12:00)</option>
              <option value="AFTERNOON">Afternoon (12:00 - 16:00)</option>
              <option value="EVENING">Evening (16:00 - 20:00)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Item Title</label>
            <input
              type="text"
              required
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              placeholder="e.g. Amber Fort Sheesh Mahal Tour"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Place Name</label>
            <input
              type="text"
              required
              value={itemPlace}
              onChange={(e) => setItemPlace(e.target.value)}
              placeholder="e.g. Amber Fort"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Estimated Cost (₹)</label>
            <input
              type="number"
              value={itemCost}
              onChange={(e) => setItemCost(parseFloat(e.target.value) || 0)}
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 bg-stone-100 font-bold rounded-xl text-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 bg-bharat-saffron text-white font-bold rounded-xl shadow-md"
            >
              Add to Day
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
