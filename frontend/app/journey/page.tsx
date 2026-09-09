import JourneyPlannerWidget from "@/components/metro/journey-planner";
import { Navigation, MapPin } from "lucide-react";
import Link from "next/link";

export default function JourneyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Navigation className="w-3.5 h-3.5" /> Metro Route & Fare Computation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Interactive Journey Planner</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Calculate intermediate stops, travel time, and exact fare for your commute on Indore Metro.
        </p>

        <div className="pt-2 flex justify-center">
          <Link
            href="/map"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
          >
            <MapPin className="w-4 h-4 stroke-[2.5]" />
            <span>Open Interactive GIS Metro Map</span>
          </Link>
        </div>
      </div>

      <JourneyPlannerWidget />
    </div>
  );
}
