"use client";

import Link from "next/link";
import { Compass, MapPin, Navigation, ArrowRight, Camera, Utensils, Landmark } from "lucide-react";

export default function TourGuidePage() {
  const tours = [
    {
      id: "heritage",
      title: "Indore Heritage & Culture Trail",
      icon: <Landmark className="w-6 h-6 text-amber-400" />,
      station: "Rajwada Station",
      duration: "3 - 4 Hours",
      description: "Explore the 7-story Holkar Palace (Rajwada), Krishnapura Chhatris, and Gopal Mandir just steps from Rajwada Station.",
      highlights: ["Rajwada Palace", "Krishnapura Chhatris", "Sarafa Night Food Market"],
    },
    {
      id: "foodie",
      title: "Famous Indore Street Food Tour",
      icon: <Utensils className="w-6 h-6 text-emerald-400" />,
      station: "Palasia Square Station",
      duration: "2 - 3 Hours",
      description: "Visit Chappan Dukan (56 Shops) for legendary Poha-Jalebi, Garadu, and Bhutte ka Kees.",
      highlights: ["Chappan Dukan", "Palasia Square", "56 Street Food Hub"],
    },
    {
      id: "nature",
      title: "Gardens & Leisure Tour",
      icon: <Camera className="w-6 h-6 text-cyan-400" />,
      station: "Meghdoot Garden Station",
      duration: "2 Hours",
      description: "Relax at Meghdoot Garden, Vijay Nagar shopping malls, and amusement parks.",
      highlights: ["Meghdoot Garden", "C21 & Malhar Mega Mall", "Vijay Nagar Square"],
    },
    {
      id: "spiritual",
      title: "Spiritual & Temple Pilgrimage",
      icon: <Compass className="w-6 h-6 text-teal-400" />,
      station: "Khajrana Square Station",
      duration: "3 Hours",
      description: "Visit the revered Khajrana Ganesh Temple and Bada Ganpati Temple via Metro connectivity.",
      highlights: ["Khajrana Ganesh Temple", "Bada Ganpati", "Chota Ganpati"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" /> Official Indore Tourism Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Explore Indore by Metro</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Discover historical palaces, famous street food markets, lush gardens, and spiritual temples conveniently located near Yellow Line stations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tours.map((tour) => (
          <div key={tour.id} className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl space-y-4 hover:border-amber-500/30 transition">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
                {tour.icon}
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {tour.station}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">{tour.title}</h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">Estimated Duration: {tour.duration}</p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{tour.description}</p>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Key Attractions:</span>
              <div className="flex flex-wrap gap-2">
                {tour.highlights.map((h, i) => (
                  <span key={i} className="text-xs bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/journey?dest=${encodeURIComponent(tour.station)}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200"
              >
                Plan Route to {tour.station} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
