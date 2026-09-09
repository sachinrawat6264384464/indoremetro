"use client";

import React from "react";
import { Leaf, ShieldCheck } from "lucide-react";

export function CarbonSavingsBadge({ passengerTrips = 14200 }: { passengerTrips?: number }) {
  const co2SavedKg = (passengerTrips * 0.42).toFixed(1);

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-3 text-left">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
          <Leaf className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            Green Mobility Impact <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </h4>
          <p className="text-xs text-slate-500">Indore Metro zero-emission electric train operations.</p>
        </div>
      </div>

      <div className="text-center sm:text-right shrink-0">
        <span className="text-2xl font-black text-emerald-600 block font-mono">{co2SavedKg} kg</span>
        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest block">CO₂ Emissions Prevented</span>
      </div>
    </div>
  );
}
