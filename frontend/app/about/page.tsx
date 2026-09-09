"use client";

import { Train, ShieldCheck, MapPin, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
          <Train className="w-3.5 h-3.5" /> MPMRCL Official Overview
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">About Indore Metro Rail</h1>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          Madhya Pradesh Metro Rail Corporation Limited (MPMRCL) is developing a state-of-the-art urban rapid transit system to transform mobility across Indore, India&apos;s cleanest city.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-2">
          <MapPin className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-extrabold text-white">31.46 km Loop</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The Priority Corridor Yellow Line forms a continuous loop connecting Super Corridor, MR 10, Vijay Nagar, Radisson Square, Rajwada, and the Airport.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-2">
          <Award className="w-6 h-6 text-emerald-400" />
          <h3 className="text-xl font-extrabold text-white">Eco-Friendly & Smart</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Equipped with regenerative braking, solar-powered stations, automatic fare collection (AFC), and 100% digital contactless ticketing.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl space-y-4">
        <h2 className="text-2xl font-bold text-white">Key System Statistics</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center">
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
            <span className="text-2xl font-black text-amber-400 block">29</span>
            <span className="text-xs text-slate-400">Total Stations</span>
          </div>
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
            <span className="text-2xl font-black text-emerald-400 block">16</span>
            <span className="text-xs text-slate-400">Operational</span>
          </div>
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
            <span className="text-2xl font-black text-cyan-400 block">80 km/h</span>
            <span className="text-xs text-slate-400">Design Speed</span>
          </div>
          <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
            <span className="text-2xl font-black text-teal-400 block">1435 mm</span>
            <span className="text-xs text-slate-400">Standard Gauge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
