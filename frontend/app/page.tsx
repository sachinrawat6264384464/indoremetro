"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import JourneyPlannerWidget from "@/components/metro/journey-planner";
import { LiveTrainTracker } from "@/components/metro/LiveTrainTracker";
import { CarbonSavingsBadge } from "@/components/metro/CarbonSavingsBadge";
import { MapZoomModal } from "@/components/metro/MapZoomModal";
import { 
  Train, 
  ShieldCheck, 
  QrCode, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ArrowRight, 
  HelpCircle, 
  Activity, 
  ZoomIn, 
  Maximize2,
  Layers,
  Map,
  Sparkles,
  Sliders
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { ServiceAlert, Station } from "@/types";

export default function HomePage() {
  const [alerts, setAlerts] = useState<ServiceAlert[]>([]);
  const [stations, setStations] = useState<Station[]>([]);
  const [isMapZoomOpen, setIsMapZoomOpen] = useState(false);
  const [activeMapView, setActiveMapView] = useState<'ALIGNMENT' | 'LOOP'>('ALIGNMENT');
  const [stationFilter, setStationFilter] = useState<'OPERATIONAL' | 'ALL'>('OPERATIONAL');

  useEffect(() => {
    async function loadData() {
      const alertRes = await apiFetch<ServiceAlert[]>("/alerts/public");
      if (alertRes.success && alertRes.data) setAlerts(alertRes.data);

      const stationRes = await apiFetch<Station[]>("/stations");
      if (stationRes.success && stationRes.data) setStations(stationRes.data);
    }
    loadData();
  }, []);

  const displayedStations = stationFilter === 'OPERATIONAL' 
    ? stations.slice(0, 6) 
    : stations;

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
      <section className="relative pt-6 lg:pt-8 px-4 sm:px-6 lg:px-10 w-full space-y-8 max-w-[1600px] mx-auto">
        
        {/* Main Hero Card Container with Full Background Image */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 lg:p-12 relative overflow-hidden group">
          
          {/* Full Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero_metro_train.png"
              alt="Indore Metro Train Background"
              fill
              priority
              className="object-cover object-right lg:object-center opacity-25 group-hover:scale-105 transition-transform duration-1000 ease-out pointer-events-none"
            />
            {/* Smooth Overlay Gradient for High Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/40 pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* Left Column: Headline, Description & Stats (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 backdrop-blur-md border border-amber-300 text-amber-950 text-xs font-black shadow-sm">
                <Train className="w-4 h-4 text-amber-600 animate-bounce" /> Official MPMRCL Transit Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Move Smarter with <span className="text-amber-500 underline decoration-amber-300 decoration-wavy decoration-2">Indore Metro</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-bold max-w-2xl">
                Experience high-speed, eco-friendly urban commuting across the Priority Corridor. Book signed Digital QR tickets and check live train frequencies in real time.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/journey"
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  Plan Journey <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/book-ticket"
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-md transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-amber-400" /> Book Digital QR Pass
                </Link>
              </div>

              {/* Quick Stats Grid with Glassmorphic Backdrop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80">
                <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-sm">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 block font-mono">29</span>
                  <p className="text-xs text-slate-700 font-black">Total Stations</p>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-sm">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 block font-mono">16</span>
                  <p className="text-xs text-slate-700 font-black">Active Operational</p>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-sm">
                  <span className="text-2xl sm:text-3xl font-black text-amber-600 block font-mono">31.46 km</span>
                  <p className="text-xs text-slate-700 font-black">Yellow Line Loop</p>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-sm">
                  <span className="text-2xl sm:text-3xl font-black text-sky-600 block font-mono">7 Mins</span>
                  <p className="text-xs text-slate-700 font-black">Peak Frequency</p>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Journey Planner Widget (5 Cols) */}
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

      {/* Official HD Schematic Map Section with Modern Segment Toggle Button */}
      <section className="w-full px-4 sm:px-6 lg:px-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
          
          {/* Header Row with Segment Toggle Switch */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Interactive Network Diagram
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Indore Metro System Map</h2>
              <p className="text-slate-600 text-sm mt-1">
                Toggle between the official Phase Alignment Diagram and the City Ring GIS Map.
              </p>
            </div>

            {/* BADIYA SEGMENTED TOGGLE SWITCH */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-inner">
                <button
                  onClick={() => setActiveMapView('ALIGNMENT')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center gap-2 ${
                    activeMapView === 'ALIGNMENT'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>Phase Alignment Diagram</span>
                </button>

                <button
                  onClick={() => setActiveMapView('LOOP')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 flex items-center gap-2 ${
                    activeMapView === 'LOOP'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span>City Loop GIS Map</span>
                </button>
              </div>

              <button
                onClick={() => setIsMapZoomOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm shrink-0 transition"
              >
                <ZoomIn className="w-4 h-4 text-amber-400" /> Full HD Zoom
              </button>
            </div>
          </div>

          {/* Dynamic 2-Column Map Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Map Image Viewer Card with Clean White Background */}
            <div
              onClick={() => setIsMapZoomOpen(true)}
              className="lg:col-span-8 relative min-h-[380px] sm:min-h-[440px] w-full rounded-2xl overflow-hidden border border-slate-200 bg-white cursor-pointer group shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Image
                src={activeMapView === 'ALIGNMENT' ? '/images/indore_metro_loop_diagram.png' : '/images/yellow_line_official_map.png'}
                alt={activeMapView === 'ALIGNMENT' ? 'Indore Metro Yellow Line Loop Diagram' : 'Indore Metro Yellow Line GIS Map'}
                fill
                className="object-contain p-4 group-hover:scale-[1.02] transition duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center backdrop-blur-[2px]">
                <span className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-extrabold text-sm shadow-2xl flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-amber-400" /> Click to Open HD Lightbox Zoom
                </span>
              </div>

              {/* View Badge Overlay */}
              <div className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-300 text-slate-900 text-xs font-bold shadow-md flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Showing: {activeMapView === 'ALIGNMENT' ? 'Official Yellow Line Loop Schematic Diagram' : 'Indore Yellow Line City Loop GIS View'}</span>
              </div>
            </div>

            {/* Right Project / Route Breakdown Panel based on activeMapView */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-4">
              
              {activeMapView === 'ALIGNMENT' ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" /> Corridor Phase Breakdown
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="font-bold text-amber-600 block">PHASE I (Priority Corridor)</span>
                      <p className="text-slate-700 font-semibold">6.3 KM &bull; 05 Stations (Elevated)</p>
                      <p className="text-slate-500">Train trials commenced 30-Sep-23 (Super Corridor to Bhawarsala)</p>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="font-bold text-emerald-600 block">PHASE II (Operational Extension)</span>
                      <p className="text-slate-700 font-semibold">10.98 KM &bull; 11 Stations (Elevated)</p>
                      <p className="text-slate-500">MR 10 Road to Radisson Square &amp; Bengali Chauraha</p>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="font-bold text-sky-600 block">PHASE III (Central &amp; Airport)</span>
                      <p className="text-slate-700 font-semibold">8.7 KM (07 Stns UG) + 5.34 KM (05 Stns Elevated)</p>
                      <p className="text-slate-500">Tenders awarded (Rajwada, Bada Ganpati to Airport)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-2">
                    <Map className="w-4 h-4 text-amber-600" /> Ring Loop Key Highlights
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="font-bold text-amber-600 block">Indore Airport Connectivity</span>
                      <p className="text-slate-700 font-semibold">Underground Direct Terminal Access</p>
                      <p className="text-slate-500">Seamless transit link to Devi Ahilya Bai Holkar Airport.</p>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="font-bold text-emerald-600 block">Super Corridor Depot &amp; Hub</span>
                      <p className="text-slate-700 font-semibold">Primary Maintenance &amp; Stabling</p>
                      <p className="text-slate-500">High-tech maintenance depot &amp; operational control center.</p>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-sm">
                      <span className="font-bold text-purple-600 block">Rajwada Central Interchange</span>
                      <p className="text-slate-700 font-semibold">Heritage City Center Station</p>
                      <p className="text-slate-500">Deep underground station connecting historical market hub.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => setIsMapZoomOpen(true)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <ZoomIn className="w-4 h-4 text-amber-400" /> Click to Inspect in Full HD Lightbox
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Fleet Showcase Section */}
      <section className="w-full px-4 sm:px-6 lg:px-10">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-lg">
          
          <div className="lg:col-span-5 relative h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <Image
              src="/images/indore_metro_train_front.png"
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

      {/* Popular Stations Preview Section with BADIYA FILTER TOGGLE */}
      <section className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Popular Metro Stations</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore operational priority corridor &amp; future line 3 stations</p>
          </div>

          {/* BADIYA STATION FILTER TOGGLE BUTTON */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-inner">
              <button
                onClick={() => setStationFilter('OPERATIONAL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                  stationFilter === 'OPERATIONAL'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Operational (16)</span>
              </button>

              <button
                onClick={() => setStationFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                  stationFilter === 'ALL'
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-slate-700" />
                <span>Show All (29)</span>
              </button>
            </div>

            <Link href="/stations" className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedStations.map((st) => (
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

      {/* Passenger Quick Tools & Transit Hub (Replaces FAQ) */}
      <section className="w-full px-4 sm:px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600" /> Passenger Transit Tools & Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Essential Passenger Services</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto font-bold">Everything you need for a smooth & hassle-free commute on Indore Metro</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">GIS Interactive Map</h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Explore all 29 Yellow Line stations, elevation specs, and real-time station entrance locations.
              </p>
            </div>
            <Link
              href="/map"
              className="inline-flex items-center gap-2 text-xs font-black text-amber-600 hover:text-amber-700 pt-2"
            >
              Open System Map <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600">
                <Train className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Fare Calculator</h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Calculate distance-based fare slabs, passenger counts, and instant single/return ticket pricing.
              </p>
            </div>
            <Link
              href="/fare"
              className="inline-flex items-center gap-2 text-xs font-black text-emerald-600 hover:text-emerald-700 pt-2"
            >
              Calculate Fare <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-600">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Train Timetables</h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                View first & last train departure times, peak hour train frequencies, and Sunday schedules.
              </p>
            </div>
            <Link
              href="/timetable"
              className="inline-flex items-center gap-2 text-xs font-black text-sky-600 hover:text-sky-700 pt-2"
            >
              View Timetable <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Lost & Found Portal</h3>
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                Report misplaced personal belongings or track items recovered by station security staff.
              </p>
            </div>
            <Link
              href="/lost-found"
              className="inline-flex items-center gap-2 text-xs font-black text-purple-600 hover:text-purple-700 pt-2"
            >
              Report / Search Item <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Map Lightbox Zoom Modal Component */}
      <MapZoomModal 
        isOpen={isMapZoomOpen} 
        onClose={() => setIsMapZoomOpen(false)} 
        imageSrc={activeMapView === 'ALIGNMENT' ? '/images/indore_metro_loop_diagram.png' : '/images/yellow_line_official_map.png'}
      />

    </div>
  );
}
