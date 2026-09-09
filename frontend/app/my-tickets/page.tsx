"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket as TicketIcon, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Ticket as TicketType } from "@/types";
import { TicketCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MyTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CONFIRMED' | 'USED' | 'CANCELLED'>('ALL');

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

  const filteredTickets = activeTab === 'ALL' 
    ? tickets 
    : tickets.filter((t) => t.status === activeTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Digital QR Passes</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your active passes and ticket purchase history</p>
        </div>
        <Link
          href="/book-ticket"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/10 transition"
        >
          <TicketIcon className="w-4 h-4" /> Book New Ticket
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {(['ALL', 'CONFIRMED', 'USED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === tab
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab === 'ALL' ? 'All Tickets' : tab === 'CONFIRMED' ? 'Active / Upcoming' : tab === 'USED' ? 'Completed Trips' : 'Cancelled'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          <TicketCardSkeleton />
          <TicketCardSkeleton />
          <TicketCardSkeleton />
        </div>
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          title="No Tickets Found"
          description={
            activeTab === 'ALL'
              ? "You haven't booked any Indore Metro tickets yet."
              : `No ${activeTab.toLowerCase()} tickets found in your account.`
          }
          actionLabel="Book a Ticket Now"
          actionHref="/book-ticket"
        />
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((t) => (
            <Link
              key={t.id}
              href={`/ticket/${t.id}`}
              className="bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 block transition duration-200"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">{t.ticket_number}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'CONFIRMED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : t.status === 'USED'
                        ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
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

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <span className="text-xl font-black text-amber-400">₹{t.total_fare}</span>
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
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
