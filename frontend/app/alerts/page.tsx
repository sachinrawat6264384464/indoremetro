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
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Operational Control Advisories
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Live Service Alerts &amp; Advisories</h1>
          <p className="text-slate-600 text-sm mt-1 font-medium">Official operational updates and maintenance announcements from Indore Metro Control Centre.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        ) : alerts.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="w-8 h-8 text-emerald-600" />}
            title="All Lines Operating Normally"
            description="There are currently no reported delays, line closures, or service advisories. Priority Corridor Yellow Line is running on schedule."
            actionLabel="View Timetable & Frequency"
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
                <h2 className="text-xl font-extrabold text-slate-900">{alert.title}</h2>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">{alert.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

