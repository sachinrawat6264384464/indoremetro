import React, { useState } from "react";
import { Station } from "@/types";
import { FALLBACK_STATIONS } from "@/lib/data/fallback-stations";
import { Train, RefreshCw, Info, MapPin, ArrowRightLeft, Sparkles, Navigation, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface MetroRingGraphProps {
  stations?: Station[];
}

export function MetroRingGraph({ stations = FALLBACK_STATIONS }: MetroRingGraphProps) {
  const activeStations = stations.length > 0 ? stations : FALLBACK_STATIONS;
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [animateTrains, setAnimateTrains] = useState(true);

  const selectedStation = activeStations[selectedIndex] || activeStations[0];

  // SVG Canvas Configuration
  const total = activeStations.length;
  const centerX = 320;
  const centerY = 320;
  const radius = 190;
  const labelRadius = 245;

  const stationPositions = activeStations.map((st, i) => {
    // Start angle from top (-90 deg)
    const angleDeg = (i / total) * 360 - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);

    const labelX = centerX + labelRadius * Math.cos(angleRad);
    const labelY = centerY + labelRadius * Math.sin(angleRad);

    const cosVal = Math.cos(angleRad);
    const sinVal = Math.sin(angleRad);

    const textAnchor: "start" | "end" | "middle" = cosVal > 0.2 ? "start" : cosVal < -0.2 ? "end" : "middle";
    const dy = sinVal > 0.6 ? "1em" : sinVal < -0.6 ? "-0.4em" : "0.3em";

    return {
      ...st,
      x,
      y,
      labelX,
      labelY,
      angleDeg,
      textAnchor,
      dy,
      order: i + 1,
    };
  });

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + total) % total);
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
      
      {/* Widget Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> 360° Ring Loop Interactive Network
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Indore Metro Yellow Line 3 Ring Corridor Graph
          </h2>
          <p className="text-slate-600 text-sm mt-1 font-medium">
            Click any station node or label to view continuous loop connections, live train flow, &amp; distance matrix.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAnimateTrains(!animateTrains)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border ${
              animateTrains
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${animateTrains ? "animate-spin" : ""}`} />
            <span>{animateTrains ? "Live Trains Moving" : "Paused Animation"}</span>
          </button>
        </div>
      </div>

      {/* Quick Station Jump Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Jump to Station:
        </span>
        {stationPositions.map((pos, idx) => (
          <button
            key={pos.id}
            onClick={() => setSelectedIndex(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 border ${
              selectedIndex === idx
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            #{pos.order} {pos.name}
          </button>
        ))}
      </div>

      {/* Main Graph Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* SVG Circular Graph Area (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden min-h-[520px]">
          
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

          {/* SVG Canvas */}
          <svg viewBox="0 0 640 640" className="w-full max-w-[580px] h-auto relative z-10">
            <defs>
              {/* Yellow Ring Gradient */}
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>

              {/* Glow Filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Outer Circular Track Glow */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="14"
              strokeOpacity="0.2"
              filter="url(#glow)"
            />

            {/* Main Yellow Line Circular Track */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="7"
              strokeDasharray="10 5"
            />

            {/* Inner Directional Track (DOWN Line) */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius - 20}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2.5"
              strokeOpacity="0.5"
              strokeDasharray="5 5"
            />

            {/* Animated Train Rakes along the Ring */}
            {animateTrains && (
              <>
                {/* UP Line Train (Clockwise) */}
                <circle r="7" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.5" filter="url(#glow)">
                  <animateMotion
                    path={`M ${centerX} ${centerY - radius} A ${radius} ${radius} 0 1 1 ${centerX - 0.1} ${centerY - radius}`}
                    dur="18s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* DOWN Line Train (Counter-Clockwise) */}
                <circle r="7" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2.5" filter="url(#glow)">
                  <animateMotion
                    path={`M ${centerX} ${centerY - (radius - 20)} A ${radius - 20} ${radius - 20} 0 1 0 ${centerX + 0.1} ${centerY - (radius - 20)}`}
                    dur="22s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}

            {/* Center Loop Hub Badge */}
            <g transform={`translate(${centerX}, ${centerY})`}>
              <circle r="56" fill="#0F172A" stroke="#F59E0B" strokeWidth="2.5" filter="url(#glow)" />
              <text y="-10" textAnchor="middle" fill="#F59E0B" fontSize="13" fontWeight="900" letterSpacing="1">
                INDORE
              </text>
              <text y="8" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="800">
                RING LOOP
              </text>
              <text y="24" textAnchor="middle" fill="#94A3B8" fontSize="9" fontWeight="700">
                31.46 KM LOOP
              </text>
            </g>

            {/* Station Nodes & Radial Name Labels around perimeter */}
            {stationPositions.map((pos, idx) => {
              const isSelected = selectedIndex === idx;

              return (
                <g
                  key={pos.id}
                  onClick={() => setSelectedIndex(idx)}
                  className="cursor-pointer transition-all duration-300 group"
                >
                  {/* Leader line connecting circle node to label */}
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={pos.labelX}
                    y2={pos.labelY}
                    stroke={isSelected ? "#F59E0B" : "#475569"}
                    strokeWidth={isSelected ? "2" : "1"}
                    strokeDasharray={isSelected ? "none" : "2 2"}
                  />

                  {/* Outer selection glow ring */}
                  {isSelected && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="18"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="3"
                      className="animate-ping"
                    />
                  )}

                  {/* Station Node Circle */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? "13" : "9"}
                    fill={isSelected ? "#F59E0B" : "#0F172A"}
                    stroke={isSelected ? "#FFFFFF" : "#F59E0B"}
                    strokeWidth="3"
                  />

                  {/* Station Order Number inside node */}
                  <text
                    x={pos.x}
                    y={pos.y + 3.5}
                    textAnchor="middle"
                    fill={isSelected ? "#000000" : "#FFFFFF"}
                    fontSize="8"
                    fontWeight="900"
                  >
                    {pos.order}
                  </text>

                  {/* Station Name Radial Text Label */}
                  <text
                    x={pos.labelX}
                    y={pos.labelY}
                    textAnchor={pos.textAnchor}
                    dy={pos.dy}
                    fill={isSelected ? "#FBBF24" : "#E2E8F0"}
                    fontSize={isSelected ? "11" : "9 font-bold"}
                    fontWeight={isSelected ? "900" : "700"}
                    className="transition-colors duration-200 font-sans"
                  >
                    {pos.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Direction Legend Overlay */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 relative z-20 text-xs font-extrabold text-slate-200 bg-slate-900/90 px-5 py-2.5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-md">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
              <span>UP Line (Clockwise)</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400 animate-pulse shadow-sm shadow-sky-400" />
              <span>DOWN Line (Counter-Clockwise)</span>
            </span>
          </div>
        </div>

        {/* Selected Station Control & Details Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Station Selector Header & Next/Prev Controls */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                  #{selectedIndex + 1}
                </span>
                <span className="text-xs font-mono font-extrabold text-amber-400 uppercase">
                  {selectedStation.code || "ST01"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
                  title="Previous station node"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
                  title="Next station node"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Operational Node
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{selectedStation.name}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Indore Priority Corridor Yellow Line 3</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 font-bold block">Distance from Origin</span>
                <span className="text-base font-black text-amber-400">
                  {Number((selectedIndex * 1.5).toFixed(1))} km
                </span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60">
                <span className="text-slate-400 font-bold block">Est Travel Duration</span>
                <span className="text-base font-black text-emerald-400">
                  ~{selectedIndex * 2} mins
                </span>
              </div>
            </div>
          </div>

          {/* Station Amenities Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" /> Station Amenities &amp; Infrastructure
            </h4>

            {selectedStation.amenities && selectedStation.amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedStation.amenities.map((amenity, aIdx) => (
                  <span key={aIdx} className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 font-medium">Standard MPMRCL facilities available.</p>
            )}

            <div className="pt-2 flex items-center gap-3">
              <Link
                href={`/book-ticket?source=${selectedStation.id}`}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs text-center shadow-md shadow-amber-500/20 transition"
              >
                Book Ticket from {selectedStation.name} &rarr;
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
