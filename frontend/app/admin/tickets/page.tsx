"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    async function loadTickets() {
      const res = await apiFetch<any[]>("/admin/tickets");
      if (res.success && res.data) setTickets(res.data);
    }
    loadTickets();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Ticket Audit & Transactions</h1>
        <p className="text-slate-400 text-sm mt-1">Audit all passenger digital tickets and booking states</p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-4 px-6">Ticket Number</th>
                <th className="py-4 px-6">User Email</th>
                <th className="py-4 px-6">Journey</th>
                <th className="py-4 px-6">Passengers</th>
                <th className="py-4 px-6">Total Fare</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition">
                  <td className="py-4 px-6 font-mono font-bold text-amber-400">{t.ticket_number}</td>
                  <td className="py-4 px-6 text-slate-300">{t.user_email}</td>
                  <td className="py-4 px-6 font-semibold text-white">{t.source_station} &rarr; {t.dest_station}</td>
                  <td className="py-4 px-6">{t.passenger_count}</td>
                  <td className="py-4 px-6 text-teal-400 font-bold">₹{t.total_fare}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      t.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      t.status === "USED" ? "bg-slate-500/10 text-slate-400 border border-slate-500/20" :
                      "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
