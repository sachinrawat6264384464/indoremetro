"use client";

import { useEffect, useState } from "react";
import { Train, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Route } from "@/types";
import { FALLBACK_ROUTES } from "@/lib/data/fallback-stations";

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoutes() {
      setLoading(true);
      const res = await apiFetch<Route[]>("/routes");
      setLoading(false);
      if (res.success && res.data && res.data.length > 0) {
        setRoutes(res.data);
      } else {
        setRoutes(FALLBACK_ROUTES);
      }
    }
    loadRoutes();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1600px] mx-auto space-y-8">
        
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <Train className="w-3.5 h-3.5 text-amber-600" /> System Line Schematic
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Metro Line &amp; Route Map</h1>
          <p className="text-slate-600 text-sm mt-1">Explore sequential station stops along the Indore Yellow Line corridor.</p>
        </div>

        <div className="space-y-8">
          {routes.map((route) => (
            <div key={route.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-3 py-1 rounded-md text-xs font-extrabold text-slate-950 bg-amber-400 border border-amber-500">
                    {route.code}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2">{route.name}</h2>
                  <p className="text-xs text-slate-500 font-medium">{route.direction}</p>
                </div>
                <span className="text-xs text-amber-600 font-bold">{route.route_stations?.length || 0} Total Stations</span>
              </div>

              {/* Sequential Line Schematic */}
              <div className="relative overflow-x-auto py-6">
                <div className="flex items-center min-w-max gap-8 px-4">
                  {route.route_stations?.map((rs, idx) => (
                    <div key={rs.id} className="flex items-center gap-8">
                      <div className="flex flex-col items-center space-y-2 text-center w-28">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                          {rs.station_order}
                        </div>
                        <span className="text-sm font-bold text-slate-900 truncate max-w-full">{rs.station.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{rs.distance_from_start_km} km</span>
                      </div>

                      {idx < route.route_stations.length - 1 && (
                        <div className="w-12 h-1 bg-amber-300 rounded-full relative">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 absolute -top-0.5 right-0 animate-ping" />
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
    </div>
  );
}

