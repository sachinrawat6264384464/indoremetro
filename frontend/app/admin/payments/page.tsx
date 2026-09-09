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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Payment Transactions & Reconciliation</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Audit Razorpay payment transactions and signature logs</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Razorpay Order ID</th>
                <th className="py-4 px-6">Payment ID</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 font-mono font-black text-amber-600">{p.razorpay_order_id}</td>
                  <td className="py-4 px-6 font-mono text-slate-600 font-medium">{p.razorpay_payment_id || "N/A"}</td>
                  <td className="py-4 px-6 text-emerald-700 font-black">₹{p.amount}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                      p.status === "SUCCESS" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-rose-100 text-rose-800 border border-rose-300"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs font-bold text-slate-500">{new Date(p.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
