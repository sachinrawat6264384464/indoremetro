"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QrCode, Ticket, CheckCircle2, Clock, ArrowLeft, Printer, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Ticket as TicketType } from "@/types";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketType | null>(null);

  useEffect(() => {
    async function loadTicket() {
      if (params.id) {
        const res = await apiFetch<TicketType>(`/tickets/${params.id}`);
        if (res.success && res.data) setTicket(res.data);
      }
    }
    loadTicket();
  }, [params.id]);

  if (!ticket) {
    return <div className="text-center py-24 text-slate-400">Loading digital ticket...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      <button
        onClick={() => router.push("/my-tickets")}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Tickets
      </button>

      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl text-center">
        
        {/* Ticket Header Badge */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-xs font-bold text-slate-400">Indore Metro Rail</span>
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
            ticket.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" :
            ticket.status === "USED" ? "bg-slate-500/10 text-slate-400 border border-slate-500/30" :
            "bg-amber-500/10 text-amber-300 border border-amber-500/30"
          }`}>
            <CheckCircle2 className="w-3.5 h-3.5" /> {ticket.status}
          </span>
        </div>

        {/* QR Code Section */}
        {ticket.qr_image_base64 ? (
          <div className="p-4 bg-white rounded-2xl max-w-xs mx-auto shadow-inner space-y-2">
            <img src={ticket.qr_image_base64} alt="Digital QR Ticket" className="w-56 h-56 mx-auto" />
            <p className="text-[10px] text-slate-600 font-mono tracking-wider font-bold">HMAC-SHA256 SIGNED TOKEN</p>
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-slate-900/80 text-slate-400 text-sm">
            QR Code will be rendered upon payment confirmation.
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Ticket Number</p>
          <p className="text-xl font-black text-white font-mono">{ticket.ticket_number}</p>
        </div>

        {/* Trip Details Grid */}
        <div className="grid grid-cols-2 gap-4 text-left p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-sm">
          <div>
            <span className="text-xs text-slate-400 block">From Station</span>
            <span className="font-bold text-white">{ticket.source_station?.name}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">To Station</span>
            <span className="font-bold text-white">{ticket.dest_station?.name}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Passengers</span>
            <span className="font-bold text-white">{ticket.passenger_count}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Total Fare</span>
            <span className="font-bold text-teal-400">₹{ticket.total_fare}</span>
          </div>
        </div>

        {/* Passenger Names List */}
        {ticket.passengers && ticket.passengers.length > 0 && (
          <div className="text-left space-y-1.5 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Pass Holder(s)</span>
            <div className="flex flex-wrap gap-2">
              {ticket.passengers.map((p, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-200">
                  {p.passenger_name} ({p.passenger_type})
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-white/10 flex gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 flex items-center justify-center gap-2 transition text-sm"
          >
            <Printer className="w-4 h-4" /> Print / Save Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
