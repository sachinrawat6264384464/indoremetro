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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Audit Trail Logs</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Traceable logs of all sensitive administrative operations</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-black text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Action</th>
                <th className="py-4 px-6">Resource</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-6 text-xs font-bold text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="py-4 px-6 font-extrabold text-slate-900">{log.user_email}</td>
                  <td className="py-4 px-6 font-mono font-black text-amber-600">{log.action}</td>
                  <td className="py-4 px-6 text-slate-700 font-medium">{log.resource_type} ({log.resource_id || "N/A"})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
