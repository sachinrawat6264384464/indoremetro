"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ServiceAlert } from "@/types";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);

  useEffect(() => {
    async function loadAlerts() {
      const res = await apiFetch<ServiceAlert[]>("/alerts/public");
      if (res.success && res.data) setAlerts(res.data);
    }
    loadAlerts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Live Service Alerts</h1>
        <p className="text-slate-400 text-sm mt-1">Official operational updates and maintenance notices from Metro Control.</p>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center text-slate-400">
            All metro lines are operating smoothly without disruptions.
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  alert.severity === "CRITICAL" ? "bg-rose-500/10 text-rose-300 border border-rose-500/20" :
                  alert.severity === "WARNING" ? "bg-amber-500/10 text-amber-300 border border-amber-500/20" :
                  "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                }`}>
                  <AlertTriangle className="w-3.5 h-3.5" /> {alert.severity}
                </span>
                <span className="text-xs text-slate-500">{new Date(alert.created_at).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{alert.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{alert.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
