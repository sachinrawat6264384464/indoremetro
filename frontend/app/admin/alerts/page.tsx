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
        <h1 className="text-3xl font-extrabold text-white">Service Alert Publisher</h1>
        <p className="text-slate-400 text-sm mt-1">Broadcast operational notices and maintenance updates to passengers</p>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <form onSubmit={handlePublish} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Alert Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Minor Delay on Yellow Line Priority Corridor"
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Severity Level</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
            >
              <option value="INFO">INFO (General Notice)</option>
              <option value="WARNING">WARNING (Minor Delay)</option>
              <option value="CRITICAL">CRITICAL (Station Closure / Disruption)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Alert Description</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide clear details regarding track maintenance or delay duration..."
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl metro-gradient-bg text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> {loading ? "Publishing..." : "Publish Alert Live"}
          </button>
        </form>
      </div>
    </div>
  );
}
