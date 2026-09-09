"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import JourneyPlannerWidget from "@/components/metro/journey-planner";
import { LiveTrainTracker } from "@/components/metro/LiveTrainTracker";
import { CarbonSavingsBadge } from "@/components/metro/CarbonSavingsBadge";
import { Train, ShieldCheck, QrCode, Clock, MapPin, AlertTriangle, ArrowRight, HelpCircle, Activity } from "lucide-react";
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

      {/* Hero Section with High-Resolution Image Background & Floating Showcase */}
      <section className="relative pt-8 lg:pt-14 px-4 sm:px-6 lg:px-10 w-full space-y-10">
        
        {/* Top Hero Showcase Card with Background Metro Train Image */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity hover:opacity-50 transition duration-700">
            <Image
              src="/images/hero_metro_train.png"
              alt="Indore Metro Train"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#070A12] via-[#070A12]/90 to-transparent z-10" />

          <div className="relative z-20 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Train className="w-4 h-4 text-amber-400" /> Official MPMRCL Transit Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                Move Smarter with <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-teal-300 bg-clip-text text-transparent">Indore Metro</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Experience high-speed, eco-friendly urban commuting across the Priority Corridor. Book signed Digital QR tickets and check live train frequencies in real time.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/journey"
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-lg shadow-amber-500/20 transition flex items-center gap-2"
                >
                  Plan Journey <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/book-ticket"
                  className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold border border-slate-700 transition flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-amber-400" /> Book Digital QR Pass
                </Link>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white">29</span>
                  <p className="text-xs text-slate-400 font-medium">Total Stations</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">16</span>
                  <p className="text-xs text-slate-400 font-medium">Active Operational</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">31.46 km</span>
                  <p className="text-xs text-slate-400 font-medium">Yellow Line Loop</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400">7 Mins</span>
                  <p className="text-xs text-slate-400 font-medium">Peak Frequency</p>
                </div>
              </div>
            </div>

            {/* Quick Journey Planner Widget Overlay */}
            <div className="lg:col-span-5">
              <JourneyPlannerWidget />
            </div>
          </div>
        </div>

        {/* Live Telemetry & Carbon Impact Counter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <LiveTrainTracker />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <CarbonSavingsBadge />
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Operating Hours: <strong>06:00 AM &ndash; 10:00 PM</strong></span>
              </div>
              <Link href="/timetable" className="text-amber-400 font-bold hover:underline">
                View Timetable &rarr;
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* AFC Gate & Digital Ticketing Feature Showcase Section */}
      <section className="w-full px-4 sm:px-6 lg:px-10">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          
          <div className="lg:col-span-5 relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <Image
              src="/images/qr_scanner_gate.png"
              alt="Automatic Fare Collection QR Gate"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-slate-900/90 border border-slate-700/80 rounded-xl backdrop-blur-md text-xs">
              <span className="font-bold text-amber-400 block">Automatic Fare Collection (AFC)</span>
              <span className="text-slate-300">Instant contactless QR code scanning at gate turnstiles</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="text-left">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">Next-Gen Urban Transit</span>
              <h2 className="text-3xl font-extrabold text-white">Contactless Digital QR Ticketing</h2>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Skip station ticket queues entirely. Purchase cryptographically signed digital QR passes directly from your smartphone and scan at operational gate turnstiles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <QrCode className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">HMAC Signed Tokens</h3>
                <p className="text-xs text-slate-400">Forgery-proof QR codes verified instantly by AFC scanners.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Razorpay Secure Checkout</h3>
                <p className="text-xs text-slate-400">UPI, Credit/Debit cards, and NetBanking with instant receipts.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Stations Preview */}
      <section className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Popular Metro Stations</h2>
            <p className="text-xs text-slate-400">Priority Corridor Line 3 Stations</p>
          </div>
          <Link href="/stations" className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
            View All 16 Stations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((st) => (
            <Link
              key={st.id}
              href={`/stations/${st.id}`}
              className="bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 p-5 rounded-2xl block transition duration-200"
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
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-400" /> Amenities: {st.amenities?.length || 0}</span>
                <span className="text-amber-300 font-medium">Details &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 text-sm mt-2">Got questions about Indore Metro ticketing and schedules?</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" /> How long is a digital QR ticket valid?
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Digital QR tickets remain valid for 180 minutes (3 hours) from booking confirmation, or until scanned at an automatic fare collection exit gate.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" /> Can I book tickets for multiple passengers?
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Yes, you can select up to 10 passengers in a single booking session. Each passenger name is encoded in the master digital pass.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" /> What happens if my phone battery dies?
            </h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Every confirmed ticket sends an automated email containing your QR ticket and ticket number. Station customer helpdesks can also assist via your registered phone number.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
