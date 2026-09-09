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
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1600px] mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">My Digital QR Passes</h1>
            <p className="text-slate-600 text-sm mt-1">Manage your active passes and ticket purchase history</p>
          </div>
          <Link
            href="/book-ticket"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 transition shrink-0"
          >
            <TicketIcon className="w-4 h-4" /> Book New Ticket
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          {(['ALL', 'CONFIRMED', 'USED', 'CANCELLED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === tab
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((t) => (
              <Link
                key={t.id}
                href={`/ticket/${t.id}`}
                className="bg-white border border-slate-200 hover:border-amber-400/80 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 block shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold text-amber-700">{t.ticket_number}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        t.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : t.status === 'USED'
                          ? 'bg-slate-100 text-slate-700 border border-slate-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {t.source_station?.name} &rarr; {t.dest_station?.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {t.passenger_count} Passenger(s) &bull; Date: {t.journey_date}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="text-xl font-black text-amber-600">₹{t.total_fare}</span>
                  <span className="text-xs font-extrabold text-amber-600 flex items-center gap-1">
                    View QR <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

