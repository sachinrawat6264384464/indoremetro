"use client";

import React, { useState } from "react";
import { Leaf, ShieldCheck, TreePine, Fuel, Calculator, HelpCircle, Zap, Info, ArrowRight } from "lucide-react";

export function CarbonSavingsBadge({ passengerTrips = 14200 }: { passengerTrips?: number }) {
  const [showFormula, setShowFormula] = useState(false);
  const [personalTrips, setPersonalTrips] = useState(2); // Default 2 trips per day

  // Real-world environmental calculations for Indore Metro
  // Average road vehicle in Indore emits ~160g CO2/km (0.48kg per 3km trip)
  // Metro EMU train emits ~20g CO2/km per passenger (0.06kg per 3km trip)
  // Net CO2 saved per trip = 0.42 kg
  const co2PerTrip = 0.42;
  const co2SavedKg = (passengerTrips * co2PerTrip).toFixed(1);
  const treesEquivalent = Math.round(passengerTrips * co2PerTrip / 20); // 1 tree absorbs ~20kg CO2/year
  const petrolSavedLiters = Math.round(passengerTrips * 0.175); // ~0.175L petrol saved per trip

  // Personal footprint calculations
  const personalCo2Saved = (personalTrips * co2PerTrip * 30).toFixed(1); // Monthly personal savings

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-5 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-4 relative z-10">
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-sm">
              <Leaf className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                Green Mobility Impact <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h4>
              <p className="text-xs text-slate-500 font-semibold">Indore Metro zero-emission electric operations</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFormula(!showFormula)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition border border-slate-200"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>How it's calculated</span>
          </button>
        </div>

        {/* Hero Impact Stats Row */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> DAILY EMISSIONS PREVENTED
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Fleet Feed
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                {co2SavedKg}
              </span>
              <span className="text-base font-bold text-emerald-200 ml-1.5">kg CO₂</span>
            </div>
            <span className="text-xs text-slate-300 font-semibold">Today in Indore</span>
          </div>

          {/* Real-world equivalents grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
              <TreePine className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Trees Saved</span>
                <span className="font-extrabold text-white">~{treesEquivalent} Trees</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
              <Fuel className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Fuel Saved</span>
                <span className="font-extrabold text-white">~{petrolSavedLiters} L Petrol</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Formula Explanation Accordion */}
        {showFormula && (
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="font-black text-emerald-950 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-700" /> Mathematical Formula
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                MPMRCL Standards
              </span>
            </div>

            <div className="font-mono bg-white p-2.5 rounded-xl border border-emerald-200 text-slate-800 font-bold text-[11px] leading-relaxed">
              CO₂ Saved = Passenger Trips (14,200) × Net Savings (0.42 kg/trip)
            </div>

            <ul className="space-y-1.5 text-slate-700 font-medium text-[11px]">
              <li className="flex items-center justify-between">
                <span>🚗 Petrol/Auto Commute (3 km avg):</span>
                <span className="font-mono font-bold text-slate-900">0.48 kg CO₂</span>
              </li>
              <li className="flex items-center justify-between">
                <span>⚡ Indore Electric Metro Train:</span>
                <span className="font-mono font-bold text-emerald-700">0.06 kg CO₂</span>
              </li>
              <li className="flex items-center justify-between pt-1 border-t border-emerald-200/60 font-bold text-emerald-900">
                <span>🌱 Net Prevention Per Passenger:</span>
                <span className="font-mono font-bold text-emerald-700">0.42 kg CO₂</span>
              </li>
            </ul>
          </div>
        )}

        {/* Personal Carbon Footprint Calculator Widget */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600" /> Your Personal Monthly Green Savings
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200">
              {personalCo2Saved} kg CO₂ / mo
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
              <span>Your Daily Metro Trips:</span>
              <span className="text-amber-600 font-black">{personalTrips} Trips/Day</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={personalTrips}
              onChange={(e) => setPersonalTrips(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

