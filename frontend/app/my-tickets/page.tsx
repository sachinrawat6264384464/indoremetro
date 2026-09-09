"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket, QrCode, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Ticket as TicketType } from "@/types";

export default function MyTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    async function fetchTickets() {
      setLoading(true);
      const res = await apiFetch<TicketType[]>("/tickets/my-tickets");
      setLoading(false);
      if (res.success && res.data) {
        setTickets(res.data);
      }
    }
    fetchTickets();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Digital QR Tickets</h1>
          <p className="text-slate-400 text-sm mt-1">View active passes and booking history</p>
        </div>
        <Link
          href="/book-ticket"
          className="px-4 py-2.5 rounded-xl metro-gradient-bg text-white font-bold text-sm flex items-center gap-2 shadow-lg"
        >
          <Ticket className="w-4 h-4" /> Book New Ticket
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading your tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center space-y-4">
          <QrCode className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Tickets Found</h3>
          <p className="text-sm text-slate-400">You haven&apos;t booked any Indore Metro tickets yet.</p>
          <Link
            href="/book-ticket"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl metro-gradient-bg text-white font-bold text-sm"
          >
            Book Your First Ticket
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((t) => (
            <Link
              key={t.id}
              href={`/ticket/${t.id}`}
              className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 block"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">{t.ticket_number}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    t.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    t.status === "USED" ? "bg-slate-500/10 text-slate-400 border border-slate-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {t.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  {t.source_station?.name} &rarr; {t.dest_station?.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.passenger_count} Passenger(s) &bull; Date: {t.journey_date}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <span className="text-xl font-black text-teal-400">₹{t.total_fare}</span>
                <span className="text-xs font-bold text-teal-300 flex items-center gap-1">
                  View QR <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
