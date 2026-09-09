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

import { QrCode, CreditCard, ShieldCheck, HelpCircle } from "lucide-react";

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
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-2">
              <QrCode className="w-3.5 h-3.5 text-amber-600" /> Electronic Ticket Vault
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">My Digital QR Passes</h1>
            <p className="text-slate-600 text-sm mt-1 font-medium">Manage your active passes and ticket purchase history</p>
          </div>
          <Link
            href="/book-ticket"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 transition shrink-0"
          >
            <TicketIcon className="w-4 h-4" /> Book New Ticket
          </Link>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
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
              </div>
            ) : filteredTickets.length === 0 ? (
              <EmptyState
                icon={<QrCode className="w-10 h-10 text-amber-500" />}
                title="No Tickets Found"
                description={
                  activeTab === 'ALL'
                    ? "You haven't booked any Indore Metro tickets yet. Book your digital pass now for instant contactless travel."
                    : `No ${activeTab.toLowerCase()} tickets found in your account.`
                }
                actionLabel="Book a Ticket Now"
                actionHref="/book-ticket"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTickets.map((t) => (
                  <Link
                    key={t.id}
                    href={`/ticket/${t.id}`}
                    className="bg-white border border-slate-200 hover:border-amber-400 p-6 rounded-2xl flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition duration-200"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
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

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
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

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Recharge Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl border border-amber-300">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Metro Smart Card</h3>
                  <p className="text-xs text-slate-500 font-medium">Instant Online Top-up</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Save 10% on every ride by recharging your MPMRCL GoSmart Card online.
              </p>
              <Link
                href="/recharge"
                className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition"
              >
                Recharge Smart Card &rarr;
              </Link>
            </div>

            {/* How to Use QR at Gates */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md space-y-4 border border-slate-800">
              <h3 className="text-sm font-extrabold text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> AFC Gate QR Entry Instructions
              </h3>
              <ul className="text-xs text-slate-300 space-y-2.5 font-medium list-disc pl-4 leading-relaxed">
                <li>Increase your phone brightness to maximum before scanning.</li>
                <li>Hold the QR code 4-6 inches above the glass scanner at automatic gates.</li>
                <li>Wait for the green light and audio beep before passing through the gate.</li>
              </ul>
            </div>

            {/* Support Widget */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" /> Need Help with Your Ticket?
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                If your payment was deducted or ticket wasn&apos;t generated, contact our 24/7 Ticketing Helpdesk.
              </p>
              <a href="tel:07312500000" className="inline-block text-xs font-black text-amber-600 hover:underline">
                Call Ticketing Support: 0731-2500000 &rarr;
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

