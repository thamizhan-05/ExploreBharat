'use client';

import React from 'react';

interface TripCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  setTitle: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  budget: number;
  setBudget: (val: number) => void;
  creating: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function TripCreateModal({
  isOpen,
  onClose,
  title,
  setTitle,
  destination,
  setDestination,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  budget,
  setBudget,
  creating,
  onSubmit,
}: TripCreateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-black text-stone-900">Create New Trip</h3>
        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-stone-700 block mb-1">Trip Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Royal Rajasthan 4-Day Journey"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Destination</label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Jaipur"
              className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-stone-700 block mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-700 block mb-1">Allocated Budget (₹)</label>
            <input
              type="number"
              required
              value={budget}
              onChange={(e) => setBudget(parseFloat(e.target.value))}
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
              disabled={creating}
              className="w-1/2 py-2.5 bg-bharat-saffron text-white font-bold rounded-xl shadow-md"
            >
              {creating ? 'Creating...' : 'Create Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
