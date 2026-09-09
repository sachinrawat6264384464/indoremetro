"use client";

import { useState } from "react";
import { QrCode, ShieldCheck, AlertOctagon, CheckCircle2, ScanLine } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function StaffQRScannerPage() {
  const [qrToken, setQrToken] = useState("");
  const [gateId, setGateId] = useState("GATE-01");
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrToken.trim()) {
      toast.error("Please enter a QR token string");
      return;
    }

    setLoading(true);
    setScanResult(null);

    const res = await apiFetch("/qr/validate", {
      method: "POST",
      body: JSON.stringify({
        qr_payload: qrToken.trim(),
        gate_id: gateId,
      }),
    });

    setLoading(false);

    if (res.success && res.data) {
      setScanResult(res.data);
      if (res.data.is_valid) {
        toast.success("Gate Unlocked! Ticket Validated.");
      } else {
        toast.error(`Validation Failed: ${res.data.message}`);
      }
    } else {
      toast.error(res.error?.message || "Validation API failed");
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff QR Gate Scanner Simulator</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Simulate Automatic Fare Collection (AFC) gate scanning and ticket validation</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handleValidate} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1.5">Gate ID</label>
            <select
              value={gateId}
              onChange={(e) => setGateId(e.target.value)}
              className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            >
              <option value="GATE-ENTRY-01">GATE-ENTRY-01 (Gandhi Nagar)</option>
              <option value="GATE-ENTRY-02">GATE-ENTRY-02 (Vijay Nagar)</option>
              <option value="GATE-EXIT-01">GATE-EXIT-01 (Radisson Square)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1.5">QR Ticket Token / Scanned Signature</label>
            <textarea
              required
              rows={4}
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              placeholder="Paste raw JWT HMAC QR token payload here..."
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
          >
            <ScanLine className="w-5 h-5 text-slate-950" /> {loading ? "Verifying Signature..." : "Scan & Validate Ticket"}
          </button>
        </form>

        {/* Validation Result Display */}
        {scanResult && (
          <div className={`p-6 rounded-2xl border space-y-4 ${
            scanResult.is_valid ? "bg-emerald-50 border-emerald-300 text-emerald-950" : "bg-rose-50 border-rose-300 text-rose-950"
          }`}>
            <div className="flex items-center gap-3">
              {scanResult.is_valid ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
              ) : (
                <AlertOctagon className="w-8 h-8 text-rose-600 shrink-0" />
              )}
              <div>
                <h3 className="text-lg font-black text-slate-900">{scanResult.message}</h3>
                <p className="text-xs font-bold opacity-80">Status Code: {scanResult.status_code}</p>
              </div>
            </div>

            {scanResult.ticket_number && (
              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-200 text-slate-800 font-medium">
                <div>
                  <span className="opacity-70 block font-semibold">Ticket Number:</span>
                  <span className="font-mono font-black text-slate-900">{scanResult.ticket_number}</span>
                </div>
                <div>
                  <span className="opacity-70 block font-semibold">Passengers:</span>
                  <span className="font-extrabold text-slate-900">{scanResult.passenger_count} Pass</span>
                </div>
                <div>
                  <span className="opacity-70 block font-semibold">From:</span>
                  <span className="font-extrabold text-slate-900">{scanResult.source_station}</span>
                </div>
                <div>
                  <span className="opacity-70 block font-semibold">To:</span>
                  <span className="font-extrabold text-slate-900">{scanResult.dest_station}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
