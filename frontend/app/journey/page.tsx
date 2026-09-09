import JourneyPlannerWidget from "@/components/metro/journey-planner";
import { Navigation, MapPin } from "lucide-react";
import Link from "next/link";

export default function JourneyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
            <Navigation className="w-3.5 h-3.5 text-amber-600" /> Metro Route &amp; Fare Computation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Interactive Journey Planner</h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-medium">
            Calculate intermediate stops, travel time, and exact fare for your commute on Indore Metro.
          </p>

          <div className="pt-2 flex justify-center">
            <Link
              href="/map"
              className="px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Open Interactive GIS Metro Map &rarr;</span>
            </Link>
          </div>
        </div>

        <JourneyPlannerWidget />
      </div>
    </div>
  );
}

