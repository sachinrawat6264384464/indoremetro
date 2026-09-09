"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function AdminAlertsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("INFO");
  const [loading, setLoading] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await apiFetch("/alerts", {
      method: "POST",
      body: JSON.stringify({
        title,
        message,
        severity,
        status: "PUBLISHED",
      }),
    });

    setLoading(false);

    if (res.success) {
      toast.success("Service alert published live!");
      setTitle("");
      setMessage("");
    } else {
      toast.error(res.error?.message || "Failed to publish alert");
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Service Alert Publisher</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Broadcast operational notices and maintenance updates to passengers</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handlePublish} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1.5">Alert Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Minor Delay on Yellow Line Priority Corridor"
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1.5">Severity Level</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            >
              <option value="INFO">INFO (General Notice)</option>
              <option value="WARNING">WARNING (Minor Delay)</option>
              <option value="CRITICAL">CRITICAL (Station Closure / Disruption)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1.5">Alert Description</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide clear details regarding track maintenance or delay duration..."
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
          >
            <Plus className="w-5 h-5 text-slate-950" /> {loading ? "Publishing..." : "Publish Alert Live"}
          </button>
        </form>
      </div>
    </div>
  );
}
