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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Fare Matrix Rules Manager</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Configure stop threshold pricing rules</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="py-4 px-6">Min Stops</th>
              <th className="py-4 px-6">Max Stops</th>
              <th className="py-4 px-6">Fare Amount</th>
              <th className="py-4 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {rules.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/80 transition">
                <td className="py-4 px-6 font-extrabold text-slate-900">{r.min_stops}</td>
                <td className="py-4 px-6 font-extrabold text-slate-900">{r.max_stops}</td>
                <td className="py-4 px-6 text-emerald-700 font-black text-lg">₹{r.fare_amount}</td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
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
