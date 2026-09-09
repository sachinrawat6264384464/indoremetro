"use client";

import React, { useEffect, useState } from "react";
import { ServiceAlert } from "@/types";
import { apiFetch } from "@/lib/api";

export function LiveAlertsBanner() {
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);

  useEffect(() => {
    async function loadAlerts() {
      const res = await apiFetch<ServiceAlert[]>("/alerts/active");
      if (res.success && res.data && res.data.length > 0) {
        setAlerts(res.data);
      }
    }
    loadAlerts();
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-sm flex items-center justify-between">
      <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span className="font-semibold uppercase tracking-wider text-xs bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
          Live Service Alert:
        </span>
        <p className="truncate text-slate-200">
          <strong>{alerts[0].title}:</strong> {alerts[0].message}
        </p>
      </div>
    </div>
  );
}
