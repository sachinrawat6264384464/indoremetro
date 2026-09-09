"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import JourneyPlannerWidget from "@/components/metro/journey-planner";
import { Train, ShieldCheck, QrCode, Clock, MapPin, AlertTriangle, ArrowRight, HelpCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ServiceAlert, Station } from "@/types";

export default function HomePage() {
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    async function loadData() {
      const alertRes = await apiFetch<ServiceAlert[]>("/alerts/public");
      if (alertRes.success && alertRes.data) setAlerts(alertRes.data);

      const stationRes = await apiFetch<Station[]>("/stations");
      if (stationRes.success && stationRes.data) setStations(stationRes.data.slice(0, 6));
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Service Alert Banner if available */}
      {alerts.length > 0 && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-4 text-center text-sm font-medium text-amber-300 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span><strong>Service Notice:</strong> {alerts[0].title} — {alerts[0].message}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Train className="w-4 h-4 text-teal-400" /> MPMRCL Official Metro Web Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Explore <span className="metro-gradient-text">Indore Metro</span> Rail System
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed">
              Plan your daily commute across the Priority Corridor, check instant fares, view live station schedules, and book tamper-resistant Digital QR tickets in seconds.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/journey"
                className="px-6 py-3.5 rounded-xl metro-gradient-bg text-white font-bold shadow-lg shadow-teal-500/25 hover:opacity-90 transition flex items-center gap-2"
              >
                Plan Journey <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/book-ticket"
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-teal-400" /> Instant QR Booking
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <span className="text-2xl font-black text-white">16</span>
                <p className="text-xs text-slate-400">Active Stations</p>
              </div>
              <div>
                <span className="text-2xl font-black text-teal-400">31.46 km</span>
                <p className="text-xs text-slate-400">Yellow Line Loop</p>
              </div>
              <div>
                <span className="text-2xl font-black text-amber-400">7 Mins</span>
                <p className="text-xs text-slate-400">Peak Frequency</p>
              </div>
            </div>
          </div>

          {/* Journey Planner Hero Widget */}
          <div className="lg:col-span-6">
            <JourneyPlannerWidget />
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-white">Designed for Next-Gen Urban Transit</h2>
          <p className="text-slate-400 text-sm mt-2">Everything you need for seamless, contactless commuting in Indore city.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Signed Digital QR Ticket</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Cryptographically signed QR tickets preventing forgery. Simply tap and scan at automatic fare collection gates.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Server-Verified Payments</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Integrated with Razorpay. Payment verification happens 100% server-side with instant automated email receipts.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Real-Time Schedule & Alerts</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Live updates on train arrivals, peak & off-peak frequencies, and maintenance announcements directly from station control.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Stations Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Popular Metro Stations</h2>
            <p className="text-xs text-slate-400">Priority Corridor Line 3 Stations</p>
          </div>
          <Link href="/stations" className="text-sm font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1">
            View All 16 Stations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((st) => (
            <Link
              key={st.id}
              href={`/stations/${st.id}`}
              className="glass-panel glass-panel-hover p-5 rounded-2xl block border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
                  {st.code}
                </span>
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Operational
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{st.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{st.line_name}</p>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-teal-400" /> Amenities: {st.amenities?.length || 0}</span>
                <span className="text-teal-300 font-medium">Details &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm mt-2">Got questions about Indore Metro ticketing?</p>
        </div>

        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-400" /> How long is a digital QR ticket valid?
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Digital QR tickets remain valid for 180 minutes (3 hours) from the time of booking confirmation, or until scanned at an automatic fare collection exit gate.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-400" /> Can I book tickets for multiple passengers?
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Yes, you can select up to 10 passengers in a single booking session. Each passenger name will be encoded in the master QR pass.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-teal-400" /> What happens if my phone battery dies?
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Every confirmed ticket sends a confirmation email containing your QR ticket and ticket number. Station customer helpdesks can also assist via your registered email or phone.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
