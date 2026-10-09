'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface JourneyAlertsTabProps {
  alerts: any[];
}

export default function JourneyAlertsTab({ alerts }: JourneyAlertsTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm space-y-4">
      <div className="border-b border-stone-100 pb-3">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Connection Validations &amp; Safety Advisories
        </h3>
        <p className="text-xs text-stone-500">
          Our safety engine checks platform transfer margins, security checkpoints, and attraction closing windows.
        </p>
      </div>

      {alerts && alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert: any, idx: number) => (
            <div
              key={alert.id || idx}
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                alert.severity === 'WARNING'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : alert.severity === 'CRITICAL'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wide">
                    {alert.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-white/80 border">
                    {alert.alertType}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-stone-700">{alert.message}</p>
                {alert.actionRequired && (
                  <p className="text-[11px] font-bold text-amber-800">
                    Recommendation: {alert.actionRequired}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-stone-500 text-xs">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          All transfer buffers and operational timings are fully validated. No high-risk tight connections detected!
        </div>
      )}
    </div>
  );
}
