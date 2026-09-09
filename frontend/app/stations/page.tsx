"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Search, CheckCircle, Wifi, Car, Building2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Station } from "@/types";

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStations() {
      setLoading(true);
      const res = await apiFetch<Station[]>("/stations");
      setLoading(false);
      if (res.success && res.data) {
        setStations(res.data);
      }
    }
    fetchStations();
  }, []);

  const filtered = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Metro Station Directory</h1>
          <p className="text-slate-400 text-sm mt-1">Indore Metro Priority Corridor (Yellow Line) Stations</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading stations database...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((st) => (
            <Link
              key={st.id}
              href={`/stations/${st.id}`}
              className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 block space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
                  {st.code}
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {st.status}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">{st.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{st.line_name}</p>
              </div>

              <div className="pt-3 border-t border-white/5 flex flex-wrap gap-2 text-xs text-slate-300">
                {st.amenities?.map((amenity, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                    {amenity}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
