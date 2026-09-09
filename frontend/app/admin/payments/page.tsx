"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    async function loadPayments() {
      const res = await apiFetch<any[]>("/admin/payments");
      if (res.success && res.data) setPayments(res.data);
    }
    loadPayments();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Payment Transactions & Reconciliation</h1>
        <p className="text-slate-400 text-sm mt-1">Audit Razorpay payment transactions and signature logs</p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-4 px-6">Razorpay Order ID</th>
                <th className="py-4 px-6">Payment ID</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition">
                  <td className="py-4 px-6 font-mono font-bold text-amber-400">{p.razorpay_order_id}</td>
                  <td className="py-4 px-6 font-mono text-slate-300">{p.razorpay_payment_id || "N/A"}</td>
                  <td className="py-4 px-6 text-teal-400 font-bold">₹{p.amount}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-400">{new Date(p.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
