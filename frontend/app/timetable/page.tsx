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
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1600px] mx-auto space-y-10">
        
        {/* Page Title & Subtitle */}
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Yellow Line Service Schedule
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">First &amp; Last Train Timings</h1>
          <p className="text-slate-600 text-sm mt-1">
            Yellow Line &bull; Updated regularly for all 16 operational stations (Devi Ahilya Bai Holkar Terminal to Radisson Square).
          </p>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center space-y-1 shadow-md">
            <span className="text-3xl sm:text-4xl font-black text-amber-600 block">06:00 AM</span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest block">First Train</span>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center space-y-1 shadow-md">
            <span className="text-3xl sm:text-4xl font-black text-amber-600 block">10:00 PM</span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest block">Last Train</span>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl text-center space-y-1 shadow-md">
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 block">Every 15 min</span>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest block">Peak Frequency</span>
          </div>
        </div>

        {/* Operational Stations Timings Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Train className="w-5 h-5 text-amber-600" /> Operational Stations (16 Active)
            </h2>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search station..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
              />
            </div>
          </div>

          {/* Timings Table */}
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">Station Name</th>
                    <th className="py-4 px-6">Line / Status</th>
                    <th className="py-4 px-6">First Train</th>
                    <th className="py-4 px-6">Last Train</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">Loading train schedule...</td>
                    </tr>
                  ) : filteredStations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 font-medium">No stations match &quot;{searchQuery}&quot;</td>
                    </tr>
                  ) : (
                    filteredStations.map((st) => {
                      const timeMatch = dbTimetables.find(t => t.station_id === st.id);
                      const firstTime = timeMatch?.first_train_time ? `${timeMatch.first_train_time} AM` : "06:00 AM";
                      const lastTime = timeMatch?.last_train_time ? `${timeMatch.last_train_time} PM` : "10:00 PM";
                      const isOperational = st.status ? st.status === "ACTIVE" : true;

                      return (
                        <tr key={st.id} className="hover:bg-slate-50 transition">
                          <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            {st.name} ({st.code})
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isOperational ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-slate-100 text-slate-600"
                            }`}>
                              {isOperational ? "Operational" : "Under Construction"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-amber-700 font-extrabold">{isOperational ? firstTime : "--:--"}</td>
                          <td className="py-4 px-6 text-amber-700 font-extrabold">{isOperational ? lastTime : "--:--"}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Note Disclaimer Card */}
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-center gap-3 text-xs text-amber-900 shadow-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Travel Note:</strong> Train timings may vary slightly during gazetted public holidays and ongoing system expansion trials. Passengers are advised to reach station platforms at least 5 minutes prior to departure.
          </span>
        </div>

      </div>
    </div>
  );
}
