"use client";

import Link from "next/link";
import { Compass, MapPin, Navigation, ArrowRight, Camera, Utensils, Landmark } from "lucide-react";

export default function TourGuidePage() {
  const tours = [
    {
      id: "heritage",
      title: "Indore Heritage & Culture Trail",
      icon: <Landmark className="w-6 h-6 text-amber-600" />,
      station: "Rajwada Station",
      duration: "3 - 4 Hours",
      description: "Explore the 7-story Holkar Palace (Rajwada), Krishnapura Chhatris, and Gopal Mandir just steps from Rajwada Station.",
      highlights: ["Rajwada Palace", "Krishnapura Chhatris", "Sarafa Night Food Market"],
    },
    {
      id: "foodie",
      title: "Famous Indore Street Food Tour",
      icon: <Utensils className="w-6 h-6 text-emerald-600" />,
      station: "Palasia Square Station",
      duration: "2 - 3 Hours",
      description: "Visit Chappan Dukan (56 Shops) for legendary Poha-Jalebi, Garadu, and Bhutte ka Kees.",
      highlights: ["Chappan Dukan", "Palasia Square", "56 Street Food Hub"],
    },
    {
      id: "nature",
      title: "Gardens & Leisure Tour",
      icon: <Camera className="w-6 h-6 text-sky-600" />,
      station: "Meghdoot Garden Station",
      duration: "2 Hours",
      description: "Relax at Meghdoot Garden, Vijay Nagar shopping malls, and amusement parks.",
      highlights: ["Meghdoot Garden", "C21 & Malhar Mega Mall", "Vijay Nagar Square"],
    },
    {
      id: "spiritual",
      title: "Spiritual & Temple Pilgrimage",
      icon: <Compass className="w-6 h-6 text-amber-600" />,
      station: "Khajrana Square Station",
      duration: "3 Hours",
      description: "Visit the revered Khajrana Ganesh Temple and Bada Ganpati Temple via Metro connectivity.",
      highlights: ["Khajrana Ganesh Temple", "Bada Ganpati", "Chota Ganpati"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5 text-amber-600" /> Official Indore Tourism Guide
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Explore Indore by Metro</h1>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl font-medium">
            Discover historical palaces, famous street food markets, lush gardens, and spiritual temples conveniently located near Yellow Line stations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 hover:border-amber-400/80 shadow-sm hover:shadow-md transition duration-200">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200">
                  {tour.icon}
                </div>
                <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" /> {tour.station}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">{tour.title}</h2>
                <p className="text-xs text-slate-500 mt-1 font-semibold">Estimated Duration: {tour.duration}</p>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-medium">{tour.description}</p>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">Key Attractions:</span>
                <div className="flex flex-wrap gap-2">
                  {tour.highlights.map((h, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/journey?dest=${encodeURIComponent(tour.station)}`}
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-600 hover:text-amber-700"
                >
                  Plan Route to {tour.station} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

