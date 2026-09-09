import JourneyPlannerWidget from "@/components/metro/journey-planner";
import { Navigation } from "lucide-react";

export default function JourneyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
          <Navigation className="w-3.5 h-3.5" /> Metro Route & Fare Computation
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Interactive Journey Planner</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Calculate intermediate stops, travel time, and exact fare for your commute on Indore Metro Yellow Line.
        </p>
      </div>

      <JourneyPlannerWidget />
    </div>
  );
}
