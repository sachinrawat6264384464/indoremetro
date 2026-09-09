"use client";

import { useEffect, useState } from "react";
import { Clock, Train, Search, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Station } from "@/types";

export default function TimetablePage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [dbTimetables, setDbTimetables] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [stationRes, timeRes] = await Promise.all([
        apiFetch<Station[]>("/stations"),
        apiFetch<any[]>("/timetables"),
      ]);

      if (stationRes.success && stationRes.data) {
        setStations(stationRes.data);
      }
      if (timeRes.success && timeRes.data) {
        setDbTimetables(timeRes.data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredStations = stations.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Title & Subtitle */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
          <Clock className="w-3.5 h-3.5" /> Yellow Line Service Schedule
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">First &amp; Last Train Timings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Yellow Line &bull; Updated regularly for all 16 operational stations (Devi Ahilya Bai Holkar Terminal to Radisson Square).
        </p>
      </div>

      {/* Top Metric Cards (Matches Competitor UI Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl text-center space-y-1 shadow-xl">
          <span className="text-3xl sm:text-4xl font-black text-amber-400 block">06:00 AM</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">First Train</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl text-center space-y-1 shadow-xl">
          <span className="text-3xl sm:text-4xl font-black text-amber-400 block">10:00 PM</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Last Train</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl text-center space-y-1 shadow-xl">
          <span className="text-3xl sm:text-4xl font-black text-emerald-400 block">Every 15 min</span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Peak Frequency</span>
        </div>
      </div>

      {/* Operational Stations Timings Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Train className="w-5 h-5 text-amber-400" /> Operational Stations (16 Active)
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search station..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Timings Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Station Name</th>
                  <th className="py-4 px-6">Line / Status</th>
                  <th className="py-4 px-6">First Train</th>
                  <th className="py-4 px-6">Last Train</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">Loading train schedule...</td>
                  </tr>
                ) : filteredStations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">No stations match &quot;{searchQuery}&quot;</td>
                  </tr>
                ) : (
                  filteredStations.map((st) => {
                    const timeMatch = dbTimetables.find(t => t.station_id === st.id);
                    const firstTime = timeMatch?.first_train_time ? `${timeMatch.first_train_time} AM` : "06:00 AM";
                    const lastTime = timeMatch?.last_train_time ? `${timeMatch.last_train_time} PM` : "10:00 PM";
                    const isOperational = st.status ? st.status === "ACTIVE" : true;

                    return (
                      <tr key={st.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-4 px-6 font-bold text-white flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          {st.name} ({st.code})
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isOperational ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400"
                          }`}>
                            {isOperational ? "Operational" : "Under Construction"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-amber-300 font-semibold">{isOperational ? firstTime : "--:--"}</td>
                        <td className="py-4 px-6 text-amber-300 font-semibold">{isOperational ? lastTime : "--:--"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/90">
        <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
        <span>
          Timings are indicative as per MPMRCL guidelines. Always verify with official live advisories before early morning or late night journeys.
        </span>
      </div>
    </div>
  );
}
