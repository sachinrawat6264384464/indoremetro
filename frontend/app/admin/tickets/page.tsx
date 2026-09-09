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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ticket Audit & Transactions</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Audit all passenger digital tickets and booking states</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Ticket Number</th>
                <th className="py-4 px-6">User Email</th>
                <th className="py-4 px-6">Journey</th>
                <th className="py-4 px-6">Passengers</th>
                <th className="py-4 px-6">Total Fare</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-mono font-black text-amber-600">{t.ticket_number}</td>
                  <td className="py-4 px-6 text-slate-600 font-medium">{t.user_email}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">{t.source_station} &rarr; {t.dest_station}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">{t.passenger_count}</td>
                  <td className="py-4 px-6 text-emerald-700 font-black">₹{t.total_fare}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      t.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                      t.status === "USED" ? "bg-slate-100 text-slate-700 border border-slate-300" :
                      "bg-rose-100 text-rose-800 border border-rose-300"
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
