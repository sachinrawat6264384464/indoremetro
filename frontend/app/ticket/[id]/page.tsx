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
    return <div className="text-center py-24 text-slate-500 font-medium">Loading digital ticket...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1200px] mx-auto space-y-6">
        <button
          onClick={() => router.push("/my-tickets")}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-bold transition"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600" /> Back to My Tickets
        </button>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          
          {/* Ticket Header Badge */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Indore Metro Rail</span>
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
              ticket.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
              ticket.status === "USED" ? "bg-slate-100 text-slate-700 border border-slate-300" :
              "bg-amber-100 text-amber-900 border border-amber-300"
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" /> {ticket.status}
            </span>
          </div>

          {/* QR Code Section */}
          {ticket.qr_image_base64 ? (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-xs mx-auto shadow-sm space-y-2">
              <img src={ticket.qr_image_base64} alt="Digital QR Ticket" className="w-56 h-56 mx-auto" />
              <p className="text-[10px] text-amber-700 font-mono tracking-wider font-extrabold uppercase">HMAC-SHA256 SIGNED TOKEN</p>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-50 text-slate-500 text-sm font-medium border border-slate-200">
              QR Code will be rendered upon payment confirmation.
            </div>
          )}

          <div className="space-y-1">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Ticket Number</p>
            <p className="text-2xl font-black text-amber-700 font-mono">{ticket.ticket_number}</p>
          </div>

          {/* Trip Details Grid */}
          <div className="grid grid-cols-2 gap-4 text-left p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
            <div>
              <span className="text-xs text-slate-500 font-bold block">From Station</span>
              <span className="font-extrabold text-slate-900">{ticket.source_station?.name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">To Station</span>
              <span className="font-extrabold text-slate-900">{ticket.dest_station?.name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">Passengers</span>
              <span className="font-extrabold text-slate-900">{ticket.passenger_count}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold block">Total Fare</span>
              <span className="font-black text-amber-600 text-base">₹{ticket.total_fare}</span>
            </div>
          </div>

          {/* Passenger Names List */}
          {ticket.passengers && ticket.passengers.length > 0 && (
            <div className="text-left space-y-1.5 pt-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">Pass Holder(s)</span>
              <div className="flex flex-wrap gap-2">
                {ticket.passengers.map((p, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
                    {p.passenger_name} ({p.passenger_type})
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold flex items-center justify-center gap-2 transition text-xs shadow-sm"
            >
              <Printer className="w-4 h-4 text-amber-400" /> Print / Save Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

