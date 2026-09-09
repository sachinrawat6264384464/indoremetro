"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import JourneyPlannerWidget from "@/components/metro/journey-planner";
import { LiveTrainTracker } from "@/components/metro/LiveTrainTracker";
import { CarbonSavingsBadge } from "@/components/metro/CarbonSavingsBadge";
import { MapZoomModal } from "@/components/metro/MapZoomModal";
import { Train, ShieldCheck, QrCode, Clock, MapPin, AlertTriangle, ArrowRight, HelpCircle, Activity, ZoomIn, Maximize2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ServiceAlert, Station } from "@/types";

export default function HomePage() {
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isMapZoomOpen, setIsMapZoomOpen] = useState(false);

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
    <div className="space-y-16 pb-20 bg-[#F8FAFC]">
      
      {/* Service Alert Banner if available */}
      {alerts.length > 0 && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2.5 px-4 text-center text-sm font-medium text-amber-800 flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span><strong>Service Notice:</strong> {alerts[0].title} — {alerts[0].message}</span>
        </div>
      )}

      {/* Hero Section with High-Resolution Crisp Real Train Image Showcase */}
      <section className="relative pt-6 lg:pt-10 px-4 sm:px-6 lg:px-10 w-full space-y-8">
        
        {/* Top Hero Showcase Card with Sharp Crisp Metro Train Background */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-300 shadow-xl bg-white">
          
          {/* Crisp Train Image on Right Half */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 z-0">
            <Image
              src="/image.png"
              alt="Official Indore Metro Yellow Coach"
              fill
              className="object-cover object-right shadow-inner"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent lg:hidden" />
          </div>
          <div className="hidden lg:block absolute inset-y-0 left-0 w-7/12 bg-gradient-to-r from-white via-white to-white/60 z-10" />

          <div className="relative z-20 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold">
                <Train className="w-4 h-4 text-amber-600" /> Official MPMRCL Transit Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Move Smarter with <span className="text-amber-500">Indore Metro</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-xl font-medium">
                Experience high-speed, eco-friendly urban commuting across the Priority Corridor. Book signed Digital QR tickets and check live train frequencies in real time.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/journey"
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-md shadow-amber-500/20 transition flex items-center gap-2"
                >
                  Plan Journey <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/book-ticket"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-sm transition flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-amber-400" /> Book Digital QR Pass
                </Link>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">29</span>
                  <p className="text-xs text-slate-600 font-bold">Total Stations</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600">16</span>
                  <p className="text-xs text-slate-600 font-bold">Active Operational</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-amber-600">31.46 km</span>
                  <p className="text-xs text-slate-600 font-bold">Yellow Line Loop</p>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-sky-600">7 Mins</span>
                  <p className="text-xs text-slate-600 font-bold">Peak Frequency</p>
                </div>
              </div>
            </div>

            {/* Quick Journey Planner Widget Overlay */}
            <div className="lg:col-span-5 relative z-30">
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
            <div className="bg-white border border-slate-200 p-5 rounded-3xl flex items-center justify-between text-xs text-slate-700 shadow-sm">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-600" />
                <span>Operating Hours: <strong>06:00 AM &ndash; 10:00 PM</strong></span>
              </div>
              <Link href="/timetable" className="text-amber-600 font-bold hover:underline">
                View Timetable &rarr;
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* Official HD Schematic Yellow Line Map Section (Click to Zoom Lightbox) */}
      <section className="w-full px-4 sm:px-6 lg:px-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">Official Route Network</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Indore Metro Yellow Line Official HD Map</h2>
              <p className="text-slate-600 text-sm mt-1">
                Schematic alignment showing Phase 1 (Trials on Sep-23), Phase 2 (11 Elevated Stations), and Phase 3 (Underground &amp; Airport Corridor).
              </p>
            </div>

            <button
              onClick={() => setIsMapZoomOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 shrink-0 transition"
            >
              <ZoomIn className="w-4 h-4" /> Click to Zoom HD Map
            </button>
          </div>

          {/* Interactive Map Preview Card */}
          <div
            onClick={() => setIsMapZoomOpen(true)}
            className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer group shadow-inner"
          >
            <Image
              src="/images/yellow_line_official_map.png"
              alt="Official Indore Metro Yellow Line Map"
              fill
              className="object-contain p-4 group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-[2px]">
              <span className="px-6 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-sm shadow-2xl flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-amber-600" /> Open HD Map Lightbox Zoom
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Fleet Showcase Section */}
      <section className="w-full px-4 sm:px-6 lg:px-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-lg">
          
          <div className="lg:col-span-5 relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <Image
              src="/images/{3029DCFD-7960-48FC-A5E7-CD1301682249}.png"
              alt="Indore Metro Official Fleet Profile"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 border border-slate-200 rounded-xl backdrop-blur-md text-xs">
              <span className="font-bold text-amber-600 block">Indore Metro Priority Corridor Fleet</span>
              <span className="text-slate-700">Official Standard Gauge Electric Multiple Unit (EMU)</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="text-left">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">Next-Gen Urban Transit</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Contactless Digital QR Ticketing</h2>
              <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                Skip station ticket queues entirely. Purchase cryptographically signed digital QR passes directly from your smartphone and scan at operational gate turnstiles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <QrCode className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">HMAC Signed Tokens</h3>
                <p className="text-xs text-slate-500">Forgery-proof QR codes verified instantly by AFC scanners.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Razorpay Secure Checkout</h3>
                <p className="text-xs text-slate-500">UPI, Credit/Debit cards, and NetBanking with instant receipts.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Stations Preview */}
      <section className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Popular Metro Stations</h2>
            <p className="text-xs text-slate-500">Priority Corridor Line 3 Stations</p>
          </div>
          <Link href="/stations" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            View All 16 Stations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((st) => (
            <Link
              key={st.id}
              href={`/stations/${st.id}`}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-amber-400/60 p-5 rounded-2xl block transition duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                  {st.code}
                </span>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Operational
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{st.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{st.line_name}</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-600" /> Amenities: {st.amenities?.length || 0}</span>
                <span className="text-amber-600 font-bold">Details &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-500 text-sm mt-2">Got questions about Indore Metro ticketing and schedules?</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" /> How long is a digital QR ticket valid?
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Digital QR tickets remain valid for 180 minutes (3 hours) from booking confirmation, or until scanned at an automatic fare collection exit gate.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" /> Can I book tickets for multiple passengers?
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Yes, you can select up to 10 passengers in a single booking session. Each passenger name is encoded in the master digital pass.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" /> What happens if my phone battery dies?
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Every confirmed ticket sends an automated email containing your QR ticket and ticket number. Station customer helpdesks can also assist via your registered phone number.
            </p>
          </div>
        </div>
      </section>

      {/* Map Lightbox Zoom Modal Component */}
      <MapZoomModal isOpen={isMapZoomOpen} onClose={() => setIsMapZoomOpen(false)} />

    </div>
  );
}
