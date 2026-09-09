"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function TimetablePage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadTimetable() {
      const res = await apiFetch<any[]>("/timetables");
      if (res.success && res.data) setItems(res.data);
    }
    loadTimetable();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Metro Timetable & Schedules</h1>
        <p className="text-slate-400 text-sm mt-1">Operational train frequencies and daily departure timings.</p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-4 px-6">Station Name</th>
                <th className="py-4 px-6">First Train</th>
                <th className="py-4 px-6">Last Train</th>
                <th className="py-4 px-6">Peak Freq</th>
                <th className="py-4 px-6">Off-Peak Freq</th>
                <th className="py-4 px-6">Operating Days</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition">
                  <td className="py-4 px-6 font-bold text-white">{row.station_name}</td>
                  <td className="py-4 px-6 text-teal-400 font-semibold">{row.first_train_time} AM</td>
                  <td className="py-4 px-6 text-amber-400 font-semibold">{row.last_train_time} PM</td>
                  <td className="py-4 px-6">{row.peak_frequency_mins} Mins</td>
                  <td className="py-4 px-6">{row.off_peak_frequency_mins} Mins</td>
                  <td className="py-4 px-6 text-slate-400">{row.operating_days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
