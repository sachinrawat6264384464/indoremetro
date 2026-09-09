import JourneyPlannerWidget from "@/components/metro/journey-planner";
import { Navigation, MapPin, Sparkles, Compass } from "lucide-react";
import Link from "next/link";

export default function JourneyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1500px] mx-auto space-y-10">
        
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black shadow-sm">
            <Navigation className="w-4 h-4 text-amber-600 animate-pulse" /> Official Route &amp; Fare Computation Engine
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Interactive <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">Journey Planner</span>
          </h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-bold leading-relaxed">
            Calculate intermediate stops, estimated journey time, carbon savings, and exact ticket fares on Indore Metro Line 3 Priority Corridor.
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              href="/map"
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Explore Interactive GIS Metro Map &rarr;</span>
            </Link>
          </div>
        </div>

        {/* Main Planner Widget */}
        <JourneyPlannerWidget />

        {/* Quick Help & Metro Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              ⚡
            </div>
            <h4 className="text-base font-black text-slate-900">High Frequency Service</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Trains run every 5 to 7 minutes during peak operational hours across all Priority Corridor stations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              🎟️
            </div>
            <h4 className="text-base font-black text-slate-900">Instant QR Ticketing</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              Book digital QR tickets instantly online. Scan directly at Automatic Fare Collection (AFC) turnstiles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              ♿
            </div>
            <h4 className="text-base font-black text-slate-900">100% Accessible Stations</h4>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              All stations are equipped with elevators, escalators, tactile flooring, and dedicated seating for passengers.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
