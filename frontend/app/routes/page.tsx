"use client";

import { useEffect, useState } from "react";
import { Train, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Route } from "@/types";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    async function loadRoutes() {
      const res = await apiFetch<Route[]>("/routes");
      if (res.success && res.data) setRoutes(res.data);
    }
    loadRoutes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Metro Line & Route Map</h1>
        <p className="text-slate-400 text-sm mt-1">Explore sequential station stops along the Indore Yellow Line corridor.</p>
      </div>

      <div className="space-y-8">
        {routes.map((route) => (
          <div key={route.id} className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="px-3 py-1 rounded-md text-xs font-bold text-slate-950 bg-amber-400">
                  {route.code}
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">{route.name}</h2>
                <p className="text-xs text-slate-400">{route.direction}</p>
              </div>
              <span className="text-xs text-teal-400 font-semibold">{route.route_stations?.length || 0} Total Stations</span>
            </div>

            {/* Sequential Line Schematic */}
            <div className="relative overflow-x-auto py-6">
              <div className="flex items-center min-w-max gap-8 px-4">
                {route.route_stations?.map((rs, idx) => (
                  <div key={rs.id} className="flex items-center gap-8">
                    <div className="flex flex-col items-center space-y-2 text-center w-28">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-md">
                        {rs.station_order}
                      </div>
                      <span className="text-sm font-semibold text-white truncate max-w-full">{rs.station.name}</span>
                      <span className="text-[10px] text-slate-400">{rs.distance_from_start_km} km</span>
                    </div>

                    {idx < route.route_stations.length - 1 && (
                      <div className="w-12 h-1 bg-amber-500/40 rounded-full relative">
                        <div className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 right-0 animate-ping" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
