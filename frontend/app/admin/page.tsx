"use client";

import { useEffect, useState } from "react";
import { Users, Ticket, CreditCard, MapPin, TrendingUp, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { DashboardMetrics } from "@/types";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      const res = await apiFetch<DashboardMetrics>("/admin/dashboard");
      if (res.success && res.data) setMetrics(res.data);
    }
    loadMetrics();
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 font-semibold">
        Loading admin metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Operations Overview</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Real-time metrics from database transactions & passenger bookings.</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Total Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">₹{metrics.total_revenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md inline-block">Today: ₹{metrics.today_revenue.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Total Tickets</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{metrics.total_tickets.toLocaleString()}</p>
          <p className="text-xs text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-md inline-block">Today: {metrics.today_tickets} issued</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Registered Users</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{metrics.total_users.toLocaleString()}</p>
          <p className="text-xs text-slate-500 font-semibold">Passenger accounts</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400">Active Stations</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{metrics.active_stations}</p>
          <p className="text-xs text-cyan-800 font-bold bg-cyan-50 px-2.5 py-1 rounded-md inline-block">Priority Corridor Line 3</p>
        </div>

      </div>

      {/* Popular Stations & Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" /> Popular Origin Stations
          </h3>
          <div className="space-y-3">
            {metrics.popular_stations.map((st, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition">
                <span className="font-bold text-slate-900 text-sm">#{idx + 1} {st.name}</span>
                <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200">
                  {st.bookings} Bookings
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Payment Gateway Health
          </h3>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex justify-between items-center">
              <span className="text-sm font-bold text-emerald-900">Successful Transactions</span>
              <span className="text-3xl font-black text-emerald-700">{metrics.successful_payments}</span>
            </div>
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200/80 flex justify-between items-center">
              <span className="text-sm font-bold text-rose-900">Failed / Cancelled</span>
              <span className="text-3xl font-black text-rose-700">{metrics.failed_payments}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
