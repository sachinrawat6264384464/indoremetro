"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminFaresPage() {
  const [rules, setRules] = useState<any[]>([]);

  useEffect(() => {
    async function loadFares() {
      const res = await apiFetch<any[]>("/fares/rules");
      if (res.success && res.data) setRules(res.data);
    }
    loadFares();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Fare Matrix Rules Manager</h1>
        <p className="text-slate-400 text-sm mt-1">Configure stop threshold pricing rules</p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="py-4 px-6">Min Stops</th>
              <th className="py-4 px-6">Max Stops</th>
              <th className="py-4 px-6">Fare Amount</th>
              <th className="py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rules.map((r) => (
              <tr key={r.id} className="hover:bg-white/5 transition">
                <td className="py-4 px-6 font-bold text-white">{r.min_stops}</td>
                <td className="py-4 px-6 font-bold text-white">{r.max_stops}</td>
                <td className="py-4 px-6 text-teal-400 font-extrabold text-lg">₹{r.fare_amount}</td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
