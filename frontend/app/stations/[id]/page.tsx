"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Navigation,
  ArrowLeft,
  Clock,
  IndianRupee,
  CheckCircle2,
  Bus,
  Car,
  Bike,
  ShieldCheck,
  Zap,
  Ticket,
  ExternalLink,
  Info,
  ChevronRight
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Station } from "@/types";

export default function StationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [station, setStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      if (params.id) {
        setLoading(true);
        const res = await apiFetch<Station>(`/stations/${params.id}`);
        if (res.success && res.data) {
          setStation(res.data);
        }
        setLoading(false);
      }
    }
    loadDetail();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-slate-600 font-medium">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-700 font-semibold">Loading official station details...</p>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center max-w-md w-full">
          <Info className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Station Not Found</h2>
          <p className="text-sm text-slate-600 mb-6">The requested station could not be loaded or does not exist.</p>
          <button
            onClick={() => router.push('/stations')}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-md"
          >
            Back to All Stations
          </button>
        </div>
      </div>
    );
  }

  const isOperational = station.status === "ACTIVE" || station.status === "OPERATIONAL";

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1400px] mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/stations')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-amber-600 transition bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-amber-600" /> Back to Stations Directory
          </button>
          <span className="text-xs font-semibold text-slate-500">
            Yellow Line Priority Corridor
          </span>
        </div>

        {/* Hero Header Card */}
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
                  Station {station.station_number ? String(station.station_number).padStart(2, '0') : station.code}
                </span>
                <span className={`px-3.5 py-1 rounded-full text-xs font-extrabold uppercase border ${
                  isOperational 
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}>
                  {isOperational ? "Operational" : "Under Construction"}
                </span>
                {station.area && (
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                    📍 {station.area}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white flex flex-wrap items-baseline gap-4">
                  <span>{station.name}</span>
                  {station.hindi_name && (
                    <span className="text-2xl sm:text-3xl font-bold text-amber-400 font-sans">
                      ({station.hindi_name})
                    </span>
                  )}
                </h1>
                <p className="text-slate-400 text-sm sm:text-base mt-2 flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                  {station.line_name || "Yellow Line"} &bull; Indore Metro Rail Project
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[220px]">
              <button
                onClick={() => router.push(`/journey?source=${station.id}`)}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-amber-500/20 transition transform active:scale-95"
              >
                <Navigation className="w-4 h-4 fill-slate-950" /> Plan Journey From Here
              </button>
              <button
                onClick={() => router.push(`/booking?source=${station.id}`)}
                className="w-full py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2.5 border border-slate-700 transition"
              >
                <Ticket className="w-4 h-4 text-amber-400" /> Book QR Ticket
              </button>
            </div>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operating Timings</p>
              <p className="text-base font-extrabold text-slate-900">{station.timings || "06:00 AM - 10:00 PM"}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Minimum Base Fare</p>
              <p className="text-base font-extrabold text-slate-900">{station.base_fare || "₹10 Onwards"}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Area / Suburb</p>
              <p className="text-base font-extrabold text-slate-900 truncate max-w-[160px]">{station.area || "Indore Central"}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Station Line</p>
              <p className="text-base font-extrabold text-slate-900">Yellow Line (Priority)</p>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3): Amenities & Gates */}
          <div className="lg:col-span-2 space-y-6">
            {/* Station Amenities & Facilities */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Station Facilities & Amenities</h3>
                    <p className="text-xs text-slate-500">World-class passenger conveniences available at {station.name}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(station.amenities && station.amenities.length > 0
                  ? station.amenities
                  : [
                      "Elevator / Lifts",
                      "Escalators",
                      "Drinking Water",
                      "Restrooms",
                      "Wheelchair Access",
                      "CCTV Security",
                      "Ticket Counters",
                      "Mobile Charging"
                    ]
                ).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-slate-800 text-xs font-bold hover:border-amber-400 hover:bg-amber-50/50 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Entry / Exit Gates */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Entry & Exit Gates (Doors)</h3>
                    <p className="text-xs text-slate-500">Official gates and nearby landmark access points</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(station.gates && station.gates.length > 0
                  ? station.gates
                  : [
                      { gate: "Gate 1", desc: `Main Entry towards ${station.area || 'Super Corridor'} Road` },
                      { gate: "Gate 2", desc: "Secondary Exit towards Bus Stand & Parking Area" }
                    ]
                ).map((g, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-slate-900 text-amber-400 text-xs font-black rounded-lg">
                        {g.gate}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Accessibility Access</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 pt-1">{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicative Parking Charges */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Indicative Metro Parking Charges</h3>
                    <p className="text-xs text-slate-500">Official parking rates for 2-Wheelers, Cars, & Cycles</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase font-bold">
                      <th className="py-3 px-4 rounded-l-xl">Vehicle Type</th>
                      <th className="py-3 px-4">Up to 6 Hours</th>
                      <th className="py-3 px-4 rounded-r-xl">Night Parking (10 PM - 6 AM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                    {(station.parking_charges && station.parking_charges.length > 0
                      ? station.parking_charges
                      : [
                          { vehicle: "Two Wheeler (Bike/Scooter)", day: "₹15", night: "₹30" },
                          { vehicle: "Four Wheeler (Car)", day: "₹30", night: "₹60" },
                          { vehicle: "Bicycle / Cycle", day: "₹5", night: "₹10" }
                        ]
                    ).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                          {row.vehicle.includes("Two") || row.vehicle.includes("Bike") ? (
                            <Bike className="w-4 h-4 text-amber-600" />
                          ) : row.vehicle.includes("Four") || row.vehicle.includes("Car") ? (
                            <Car className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Bike className="w-4 h-4 text-emerald-600" />
                          )}
                          {row.vehicle}
                        </td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">{row.day}</td>
                        <td className="py-3 px-4 text-slate-600">{row.night}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (1/3): Nearby Transport & Map Link */}
          <div className="space-y-6">
            {/* Nearby Transport Options */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
                  <Bus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Nearby Transport</h3>
                  <p className="text-xs text-slate-500">Last-mile connectivity options</p>
                </div>
              </div>

              <div className="space-y-3">
                {(station.nearby_transport && station.nearby_transport.length > 0
                  ? station.nearby_transport
                  : [
                      { title: "City Bus Stop (iBus)", location: "Adjacent to Gate 1", fare: "₹10 - ₹25" },
                      { title: "Auto Rickshaw Stand", location: "Outside Gate 2 Exit", fare: "Metered / Standard" },
                      { title: "E-Rickshaw Feeder", location: "Station Plaza", fare: "₹10 Flat Rate" }
                    ]
                ).map((t, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{t.title}</span>
                      <span className="text-[11px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        {t.fare}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">📍 {t.location}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* GPS Coordinates & Google Maps CTA */}
            {station.latitude && station.longitude && (
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white space-y-4 shadow-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-amber-400" />
                  <div>
                    <h4 className="font-bold text-sm">Station Geolocation</h4>
                    <p className="text-xs text-slate-400">{station.latitude}, {station.longitude}</p>
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <ExternalLink className="w-4 h-4" /> Open in Google Maps
                </a>
              </div>
            )}

            {/* Quick Fare Banner */}
            <div className="bg-amber-500 p-6 rounded-3xl text-slate-950 space-y-4 shadow-md">
              <h4 className="font-black text-lg">Planning a ride from {station.name}?</h4>
              <p className="text-xs font-semibold text-slate-900 opacity-90">
                Book digital QR tickets in under 30 seconds with instant confirmation & WhatsApp notification.
              </p>
              <button
                onClick={() => router.push(`/booking?source=${station.id}`)}
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                Book Ticket Now <ChevronRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


