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
    return <div className="text-center py-20 text-slate-400">Loading admin metrics...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">System Operations Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time metrics from database transactions & passenger bookings.</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Revenue</span>
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white">₹{metrics.total_revenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 font-medium">Today: ₹{metrics.today_revenue.toLocaleString()}</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Tickets</span>
            <Ticket className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white">{metrics.total_tickets.toLocaleString()}</p>
          <p className="text-xs text-amber-300 font-medium">Today: {metrics.today_tickets} issued</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Registered Users</span>
            <Users className="w-5 h-5 text-teal-400" />
          </div>
          <p className="text-3xl font-black text-white">{metrics.total_users.toLocaleString()}</p>
          <p className="text-xs text-slate-400 font-medium">Passenger accounts</p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Active Stations</span>
            <MapPin className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white">{metrics.active_stations}</p>
          <p className="text-xs text-cyan-300 font-medium">Priority Corridor Line 3</p>
        </div>

      </div>

      {/* Popular Stations & Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" /> Popular Origin Stations
          </h3>
          <div className="space-y-3">
            {metrics.popular_stations.map((st, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5">
                <span className="font-semibold text-white text-sm">#{idx + 1} {st.name}</span>
                <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                  {st.bookings} Bookings
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Payment Gateway Health
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 flex justify-between items-center">
              <span className="text-sm font-semibold text-emerald-300">Successful Transactions</span>
              <span className="text-2xl font-black text-emerald-400">{metrics.successful_payments}</span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20 flex justify-between items-center">
              <span className="text-sm font-semibold text-rose-300">Failed / Cancelled</span>
              <span className="text-2xl font-black text-rose-400">{metrics.failed_payments}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
