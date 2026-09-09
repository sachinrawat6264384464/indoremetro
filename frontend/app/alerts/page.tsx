"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ShieldAlert, PhoneCall, Clock, Info, Activity, Radio } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ServiceAlert } from "@/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      setLoading(true);
      const res = await apiFetch<ServiceAlert[]>("/alerts/public");
      setLoading(false);
      if (res.success && res.data) setAlerts(res.data);
    }
    loadAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold mb-2">
              <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Live OCC Feed &amp; Control Advisories
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Live Service Alerts &amp; Operations</h1>
            <p className="text-slate-600 text-sm mt-1 font-medium">Real-time status updates, line advisories, and maintenance schedules from MPMRCL OCC.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              SYSTEM OVERALL: 100% OPERATIONAL
            </span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Real-time Status Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">Priority Corridor Yellow Line Status</h2>
                    <p className="text-xs text-slate-400 font-medium">Super Corridor 01 &rarr; Gandhi Nagar &bull; Normal Operation</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-amber-400">
                  Headway: 10 Mins
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">First Train</div>
                  <div className="text-base font-black text-amber-400">06:00 AM</div>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Last Train</div>
                  <div className="text-base font-black text-amber-400">10:00 PM</div>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Active Rakes</div>
                  <div className="text-base font-black text-emerald-400">6 Trains</div>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/50">
                  <div className="text-xs text-slate-400 font-bold uppercase mb-1">Punctuality</div>
                  <div className="text-base font-black text-emerald-400">99.8%</div>
                </div>
              </div>
            </div>

            {/* Active Alerts List or Light Empty State */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" /> Active Advisories &amp; Maintenance Notices
              </h2>

              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-28 w-full rounded-2xl" />
                  <Skeleton className="h-28 w-full rounded-2xl" />
                </div>
              ) : alerts.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 className="w-10 h-10 text-emerald-600" />}
                  title="All Lines Operating Normally"
                  description="There are currently no reported delays, line closures, or service advisories. Priority Corridor Yellow Line is running strictly on schedule."
                  actionLabel="Explore Timetable & Frequencies"
                  actionHref="/timetable"
                />
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition duration-200">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                            alert.severity === "CRITICAL"
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : alert.severity === "WARNING"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> {alert.severity} ADVISORY
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          {alert.created_at ? new Date(alert.created_at).toLocaleString() : 'Just Now'}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900">{alert.title}</h3>
                      <p className="text-sm text-slate-700 leading-relaxed font-medium">{alert.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Line-by-Line Corridor Matrix */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Corridor Line Status Breakdown</h3>
              <div className="divide-y divide-slate-100">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm" />
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">Yellow Line - Ring Line (Phase 1)</div>
                      <div className="text-xs text-slate-500 font-medium">Gandhi Nagar &bull; Super Corridor &bull; Bhawarkua &bull; Palasia</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-300">
                    ON TIME
                  </span>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-sm" />
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">Blue Line (Proposed Extension)</div>
                      <div className="text-xs text-slate-500 font-medium">Railway Station &bull; Airport Corridor</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold border border-slate-300">
                    UNDER CONSTRUCTION
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Control Room Helpline */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl border border-amber-300">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Control Room Emergency</h3>
                  <p className="text-xs text-slate-500 font-medium">24x7 Passengers Assistance</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Metro Helpline (Toll-Free)</span>
                  <a href="tel:07312500000" className="text-sm font-black text-amber-600 hover:underline">0731-2500000</a>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Women Helpline (24x7)</span>
                  <a href="tel:1091" className="text-sm font-black text-rose-600 hover:underline">1091</a>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Lost &amp; Found Desk</span>
                  <a href="tel:07312500001" className="text-sm font-black text-slate-900 hover:underline">Ext 104</a>
                </div>
              </div>
            </div>

            {/* Timetable Quick Card */}
            <div className="bg-amber-500 text-slate-950 p-6 rounded-3xl shadow-lg space-y-4 border border-amber-400">
              <div className="flex items-center justify-between">
                <Clock className="w-8 h-8 text-slate-950" />
                <span className="text-xs font-black bg-slate-950 text-white px-3 py-1 rounded-full">DAILY OPERATIONAL</span>
              </div>
              <h3 className="text-xl font-black">Plan Your Commute</h3>
              <p className="text-xs text-slate-900 font-semibold leading-relaxed">
                Check exact train arrival times, intermediate stops, and interchange station details on our official schedule portal.
              </p>
              <Link
                href="/timetable"
                className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-sm shadow-md transition"
              >
                Open Full Timetable &rarr;
              </Link>
            </div>

            {/* Passenger Guidelines */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-500" /> Commuter Advisory Guidelines
              </h3>
              <ul className="text-xs text-slate-600 space-y-2 font-medium list-disc pl-4 leading-relaxed">
                <li>Baggage limit per passenger is 25 kg.</li>
                <li>Eating, drinking, and smoking inside train coaches or station platforms is strictly prohibited.</li>
                <li>Always stand behind the yellow tactile strip on platforms while waiting for trains.</li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

