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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Route & Station Sequence Manager</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Configure line station orders and travel distances</p>
      </div>

      <div className="space-y-6">
        {routes.map((r) => (
          <div key={r.id} className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">{r.name} ({r.code})</h2>
                <p className="text-xs font-semibold text-slate-500">{r.direction}</p>
              </div>
              <span className="text-xs text-amber-900 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200 font-extrabold">
                {r.route_stations?.length || 0} Stations Configured
              </span>
            </div>

            <div className="space-y-2.5">
              {r.route_stations?.map((rs) => (
                <div key={rs.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm hover:border-amber-200 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
                      {rs.station_order}
                    </span>
                    <span className="font-extrabold text-slate-900">{rs.station.name} ({rs.station.code})</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{rs.distance_from_start_km} km from start</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
