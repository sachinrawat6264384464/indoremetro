"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Live Service Alerts & Advisories</h1>
        <p className="text-slate-400 text-sm mt-1">Official operational updates and maintenance announcements from Indore Metro Control Centre.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState
          icon={<CheckCircle2 className="w-8 h-8 text-emerald-400" />}
          title="All Lines Operating Normally"
          description="There are currently no reported delays, line closures, or service advisories. Priority Corridor Yellow Line is running on schedule."
          actionLabel="View Timetable & Frequency"
          actionHref="/timetable"
        />
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    alert.severity === "CRITICAL"
                      ? "bg-rose-500/10 text-rose-300 border border-rose-500/20"
                      : alert.severity === "WARNING"
                      ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      : "bg-teal-500/10 text-teal-300 border border-teal-500/20"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> {alert.severity} ADVISORY
                </span>
                <span className="text-xs text-slate-500">
                  {alert.created_at ? new Date(alert.created_at).toLocaleString() : 'Just Now'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{alert.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
