"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Navigation, ArrowLeft } from "lucide-react";
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
    return <div className="text-center py-24 text-slate-500 font-medium">Loading station details...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600" /> Back to Stations Directory
        </button>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-3.5 py-1.5 rounded-lg bg-amber-100 text-amber-900 font-extrabold border border-amber-300 text-xs">
              {station.code}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {station.status || "Operational"}
            </span>
          </div>

          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">{station.name}</h1>
            <p className="text-slate-600 text-sm mt-1 font-medium">{station.line_name} &bull; Priority Corridor</p>
          </div>

          {station.latitude && station.longitude && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between shadow-sm">
              <span className="flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-amber-600" /> GPS Coordinates: {station.latitude}, {station.longitude}
              </span>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Available Station Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {station.amenities?.map((item, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex gap-4">
            <button
              onClick={() => router.push(`/journey?source=${station.id}`)}
              className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition"
            >
              <Navigation className="w-4 h-4" /> Plan Trip From Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

