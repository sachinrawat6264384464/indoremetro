"use client";

import { Train, ShieldCheck, MapPin, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <Train className="w-3.5 h-3.5 text-amber-600" /> MPMRCL Official Overview
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">About Indore Metro Rail</h1>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed font-medium">
            Madhya Pradesh Metro Rail Corporation Limited (MPMRCL) is developing a state-of-the-art urban rapid transit system to transform mobility across Indore, India&apos;s cleanest city.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
            <MapPin className="w-6 h-6 text-amber-600" />
            <h3 className="text-xl font-extrabold text-slate-900">31.46 km Loop</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              The Priority Corridor Yellow Line forms a continuous loop connecting Super Corridor, MR 10, Vijay Nagar, Radisson Square, Rajwada, and the Airport.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-2 shadow-sm">
            <Award className="w-6 h-6 text-emerald-600" />
            <h3 className="text-xl font-extrabold text-slate-900">Eco-Friendly &amp; Smart</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Equipped with regenerative braking, solar-powered stations, automatic fare collection (AFC), and 100% digital contactless ticketing.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-4 shadow-md">
          <h2 className="text-2xl font-extrabold text-slate-900">Key System Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-2xl font-black text-slate-900 block">29</span>
              <span className="text-xs text-slate-600 font-bold">Total Stations</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-2xl font-black text-emerald-600 block">16</span>
              <span className="text-xs text-slate-600 font-bold">Operational</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-2xl font-black text-amber-600 block">80 km/h</span>
              <span className="text-xs text-slate-600 font-bold">Design Speed</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-2xl font-black text-sky-600 block">1435 mm</span>
              <span className="text-xs text-slate-600 font-bold">Standard Gauge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

