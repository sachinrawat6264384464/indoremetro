"use client";

import React, { useState } from "react";
import { Station, JourneyPlan } from "@/types";
import { Navigation, ArrowRightLeft, Clock, MapPin, Ticket, ChevronUp, ChevronDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { StationSelect } from "@/components/ui/station-select";

interface JourneyDrawerProps {
  stations: Station[];
  sourceId: string;
  destId: string;
  onSourceChange: (id: string) => void;
  onDestChange: (id: string) => void;
  onSwap: () => void;
  onFindRoute: () => void;
  journeyResult: JourneyPlan | null;
  loading: boolean;
}

export function JourneyDrawer({
  stations,
  sourceId,
  destId,
  onSourceChange,
  onDestChange,
  onSwap,
  onFindRoute,
  journeyResult,
  loading,
}: JourneyDrawerProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="absolute bottom-4 left-4 right-4 z-30 max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-4">
      {/* Drawer Header Toggle */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-sm text-white">Interactive Journey Planner</h3>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <>
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                From Station
              </label>
              <StationSelect
                stations={stations}
                value={sourceId}
                onChange={onSourceChange}
                iconColor="text-emerald-400"
                placeholder="Select Origin"
              />
            </div>

            <div className="sm:col-span-1 flex items-center justify-center pt-3 sm:pt-0">
              <button
                onClick={onSwap}
                title="Swap Stations"
                className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 transition-colors shadow-md"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:col-span-4">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                To Station
              </label>
              <StationSelect
                stations={stations}
                value={destId}
                onChange={onDestChange}
                iconColor="text-rose-400"
                placeholder="Select Destination"
              />
            </div>

            <div className="sm:col-span-2 pt-2 sm:pt-3">
              <button
                onClick={onFindRoute}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 disabled:opacity-50"
              >
                {loading ? "Searching..." : "Find Route"}
              </button>
            </div>
          </div>

          {/* Journey Result Summary */}
          {journeyResult && (
            <div className="pt-3 border-t border-slate-800 space-y-3 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Stops</span>
                  <span className="font-bold text-white text-base">{journeyResult.stop_count} stops</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Est. Time</span>
                  <span className="font-bold text-white text-base">{journeyResult.estimated_time_mins} mins</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Distance</span>
                  <span className="font-bold text-white text-base">{journeyResult.distance_km} km</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-400 block font-semibold">Total Fare</span>
                    <span className="font-extrabold text-amber-400 text-base">
                      {formatCurrency(journeyResult.fare_amount)}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      router.push(
                        `/book-ticket?source=${journeyResult.source_station.id}&dest=${journeyResult.dest_station.id}`
                      )
                    }
                    className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-[11px] hover:bg-amber-400 transition"
                  >
                    Book Ticket
                  </button>
                </div>
              </div>

              {/* Station sequence pills */}
              {journeyResult.intermediate_stations && journeyResult.intermediate_stations.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[11px]">
                  {journeyResult.intermediate_stations.map((st, i) => (
                    <React.Fragment key={st.station?.id || i}>
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 font-medium shrink-0 border border-slate-700">
                        {st.station?.name}
                      </span>
                      {i < journeyResult.intermediate_stations.length - 1 && (
                        <span className="text-slate-600 font-bold">&rarr;</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
