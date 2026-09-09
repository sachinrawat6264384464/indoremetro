"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Route } from "@/types";

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    async function loadRoutes() {
      const res = await apiFetch<Route[]>("/routes");
      if (res.success && res.data) setRoutes(res.data);
    }
    loadRoutes();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Route & Station Sequence Manager</h1>
        <p className="text-slate-400 text-sm mt-1">Configure line station orders and travel distances</p>
      </div>

      <div className="space-y-6">
        {routes.map((r) => (
          <div key={r.id} className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-xl font-bold text-white">{r.name} ({r.code})</h2>
                <p className="text-xs text-slate-400">{r.direction}</p>
              </div>
              <span className="text-xs text-teal-400 font-bold">{r.route_stations?.length || 0} Stations Configured</span>
            </div>

            <div className="space-y-2">
              {r.route_stations?.map((rs) => (
                <div key={rs.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center">
                      {rs.station_order}
                    </span>
                    <span className="font-bold text-white">{rs.station.name} ({rs.station.code})</span>
                  </div>
                  <span className="text-xs text-slate-400">{rs.distance_from_start_km} km from start</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
