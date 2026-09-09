"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Navigation, Ticket, ArrowLeft, Wifi, Building } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Station } from "@/types";

export default function StationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [station, setStation] = useState<Station | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (params.id) {
        const res = await apiFetch<Station>(`/stations/${params.id}`);
        if (res.success && res.data) setStation(res.data);
      }
    }
    loadDetail();
  }, [params.id]);

  if (!station) {
    return <div className="text-center py-24 text-slate-400">Loading station details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Stations Directory
      </button>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <span className="px-3.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30">
            {station.code}
          </span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            {station.status}
          </span>
        </div>

        <div>
          <h1 className="text-4xl font-extrabold text-white">{station.name}</h1>
          <p className="text-slate-400 text-sm mt-1">{station.line_name} &bull; Priority Corridor</p>
        </div>

        {station.latitude && station.longitude && (
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" /> GPS Coordinates: {station.latitude}, {station.longitude}
            </span>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Available Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {station.amenities?.map((item, idx) => (
              <span key={idx} className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex gap-4">
          <button
            onClick={() => router.push(`/journey?source=${station.id}`)}
            className="flex-1 py-3 rounded-xl metro-gradient-bg text-white font-bold flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4" /> Plan Trip From Here
          </button>
        </div>
      </div>
    </div>
  );
}
