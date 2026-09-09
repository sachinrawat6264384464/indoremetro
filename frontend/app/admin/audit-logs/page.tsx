"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function loadLogs() {
      const res = await apiFetch<any[]>("/admin/audit-logs");
      if (res.success && res.data) setLogs(res.data);
    }
    loadLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">System Audit Trail Logs</h1>
        <p className="text-slate-400 text-sm mt-1">Traceable logs of all sensitive administrative operations</p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Action</th>
                <th className="py-4 px-6">Resource</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition">
                  <td className="py-4 px-6 text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-4 px-6 font-semibold text-white">{log.user_email}</td>
                  <td className="py-4 px-6 font-mono font-bold text-amber-400">{log.action}</td>
                  <td className="py-4 px-6 text-slate-300">{log.resource_type} ({log.resource_id || "N/A"})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
