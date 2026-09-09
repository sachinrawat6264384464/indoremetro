"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Building2, Train } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Station } from "@/types";
import { FALLBACK_STATIONS } from "@/lib/data/fallback-stations";

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStations() {
      setLoading(true);
      const res = await apiFetch<Station[]>("/stations");
      setLoading(false);
      if (res.success && res.data && res.data.length > 0) {
        setStations(res.data);
      } else {
        setStations(FALLBACK_STATIONS);
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
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1600px] mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-2">
              <Train className="w-3.5 h-3.5 text-amber-600" /> MPMRCL Station Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Metro Station Directory</h1>
            <p className="text-slate-600 text-sm mt-1 font-medium">Explore all {stations.length > 0 ? stations.length : 16} operational &amp; planned Indore Metro Yellow Line stations</p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by station name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm font-medium shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500 font-medium">Loading stations database...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((st) => (
              <Link
                key={st.id}
                href={`/stations/${st.id}`}
                className="bg-white hover:bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-amber-400/80 block space-y-4 shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-extrabold border border-amber-300">
                    {st.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {st.status || "Operational"}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 hover:text-amber-600 transition-colors">{st.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{st.line_name}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
                  {st.amenities?.map((amenity, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

