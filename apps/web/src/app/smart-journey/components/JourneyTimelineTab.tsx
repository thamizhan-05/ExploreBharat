'use client';

import React from 'react';
import { 
  Compass, 
  MapPin, 
  Clock, 
  Eye, 
  ExternalLink,
  Hotel as HotelIcon,
  UtensilsCrossed,
  Train,
  Plane,
  Bus,
  Car,
  CheckCircle2,
  Info
} from 'lucide-react';

interface JourneyTimelineTabProps {
  days: any[];
  onSelectTimelineItem: (item: any) => void;
}

export function getItemIcon(item: any) {
  if (item.type === 'HOTEL_CHECKIN') {
    return <HotelIcon className="w-5 h-5 text-indigo-600" />;
  }
  if (item.type === 'ATTRACTION') {
    return <Compass className="w-5 h-5 text-rose-600" />;
  }
  if (item.type === 'MEAL') {
    return <UtensilsCrossed className="w-5 h-5 text-amber-600" />;
  }
  switch (item.transportMode?.toUpperCase()) {
    case 'INTERCITY_TRAIN':
    case 'LOCAL_TRAIN':
      return <Train className="w-5 h-5 text-emerald-600" />;
    case 'FLIGHT':
      return <Plane className="w-5 h-5 text-blue-600" />;
    case 'BUS':
      return <Bus className="w-5 h-5 text-amber-600" />;
    case 'AUTO':
      return <span className="text-base font-bold text-yellow-600">🛺</span>;
    case 'TAXI':
    case 'CAR':
      return <Car className="w-5 h-5 text-indigo-600" />;
    case 'METRO':
      return <Train className="w-5 h-5 text-purple-600" />;
    case 'WALK':
    default:
      return <span className="text-base font-bold text-stone-600">🚶</span>;
  }
}

export function getConfidenceBadge(confidence?: string) {
  switch (confidence) {
    case 'VERIFIED':
    case 'LIVE':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {confidence}
        </span>
      );
    case 'SCHEDULED':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 text-blue-600" /> SCHEDULED
        </span>
      );
    case 'ESTIMATED':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
          <Info className="w-3 h-3 text-amber-600" /> ESTIMATED
        </span>
      );
  }
}

export default function JourneyTimelineTab({
  days,
  onSelectTimelineItem,
}: JourneyTimelineTabProps) {
  if (!days || days.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
        <Compass className="w-8 h-8 text-stone-400 mx-auto mb-2 animate-bounce" />
        <p className="text-sm font-semibold">No journey calculated yet.</p>
        <p className="text-xs text-stone-400 mt-1">Configure your travel parameters on the left and click "Generate Door-to-Door Plan".</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {days.map((day: any, dayIdx: number) => (
        <div key={dayIdx} className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
          {/* Day Header */}
          <div className="bg-stone-100/70 px-5 py-3.5 border-b border-stone-200/70 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-bharat-saffron text-white text-xs font-black flex items-center justify-center shadow-sm">
                D{day.dayNumber}
              </span>
              <div>
                <h4 className="text-sm font-bold text-stone-900">{day.title}</h4>
                <p className="text-[11px] text-stone-500 font-medium">
                  {new Date(day.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-stone-600 bg-white px-2.5 py-1 rounded-md border border-stone-200">
              {day.timeline?.length || 0} Scheduled Events
            </span>
          </div>

          {/* Timeline Steps */}
          <div className="p-5 space-y-4">
            {day.timeline && day.timeline.length > 0 ? (
              day.timeline.map((item: any, itemIdx: number) => (
                <div
                  key={itemIdx}
                  className="group relative pl-6 border-l-2 border-stone-200 hover:border-amber-400 transition-colors pb-4 last:pb-0"
                >
                  {/* Bullet indicator */}
                  <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-amber-500 group-hover:scale-110 transition-transform flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </div>

                  <div className="bg-stone-50/80 hover:bg-stone-50 rounded-xl p-4 border border-stone-200/70 transition-all">
                    {/* Item Top Metadata */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded-lg border border-stone-200 shadow-2xs">
                          {getItemIcon(item)}
                        </div>
                        <div>
                          <span className="text-xs font-black text-stone-900 uppercase">
                            {item.time} • {item.title}
                          </span>
                          {item.subtitle && (
                            <p className="text-[11px] font-semibold text-stone-600">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getConfidenceBadge(item.confidence || item.statusBadge)}
                        {item.costInr !== undefined && (
                          <span className="text-xs font-extrabold text-stone-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                            ₹{item.costInr.toLocaleString('en-IN')} {item.statusBadge === 'ESTIMATED' ? 'est.' : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Location & Cost Label */}
                    <div className="flex flex-wrap items-center justify-between gap-2 my-2 text-xs">
                      {item.location && (
                        <div className="flex items-center gap-1 text-stone-600">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{item.location}</span>
                        </div>
                      )}

                      {item.durationMinutes && (
                        <div className="flex items-center gap-1 text-stone-500">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Duration: {item.durationMinutes} min</span>
                        </div>
                      )}

                      {item.costLabel && (
                        <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                          {item.costLabel}
                        </span>
                      )}
                    </div>

                    {/* Details / Notes */}
                    {item.details && (
                      <div className="text-[11px] text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200/60 my-2 space-y-1">
                        {item.details.intermediateStops && (
                          <p><strong>Stops:</strong> {item.details.intermediateStops.join(' → ')}</p>
                        )}
                        {item.details.class && (
                          <p><strong>Travel Class:</strong> {item.details.class}</p>
                        )}
                        {item.details.openingHours && (
                          <p><strong>Visiting Hours:</strong> {item.details.openingHours}</p>
                        )}
                        {item.details.address && (
                          <p><strong>Address:</strong> {item.details.address}</p>
                        )}
                      </div>
                    )}

                    {/* Action Footer */}
                    <div className="mt-2 pt-2 border-t border-stone-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2 text-stone-500">
                        <span>Source: <strong className="text-stone-700">{item.source || 'ExploreBharat Registry'}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectTimelineItem(item)}
                          className="text-stone-700 hover:text-stone-900 font-semibold flex items-center gap-1 underline underline-offset-2"
                        >
                          <Eye className="w-3 h-3" />
                          Data Audit
                        </button>
                        {item.bookingUrl && (
                          <a
                            href={item.bookingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-stone-900 hover:bg-black text-white rounded-md font-bold text-[11px] transition-colors"
                          >
                            Book with Provider
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-stone-500 text-xs">
                No journey legs scheduled for this day.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
