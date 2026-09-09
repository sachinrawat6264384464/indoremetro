"use client";

import React from "react";
import { ZoomIn, ZoomOut, Compass, Locate, Layers, Eye, EyeOff } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onLocateUser: () => void;
  showStations: boolean;
  onToggleStations: () => void;
  showPOIs: boolean;
  onTogglePOIs: () => void;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  onResetView,
  onLocateUser,
  showStations,
  onToggleStations,
  showPOIs,
  onTogglePOIs,
}: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
      {/* Map Navigation Buttons */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 text-slate-300">
        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="p-2 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-2 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-800 my-0.5" />
        <button
          onClick={onResetView}
          title="Reset Map Center"
          className="p-2 rounded-xl hover:bg-slate-800 hover:text-amber-400 transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>
        <button
          onClick={onLocateUser}
          title="Find My Location"
          className="p-2 rounded-xl hover:bg-slate-800 hover:text-teal-400 transition-colors"
        >
          <Locate className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Visibility Toggles */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 text-xs">
        <button
          onClick={onToggleStations}
          className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
            showStations
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {showStations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Stations</span>
        </button>
        <button
          onClick={onTogglePOIs}
          className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
            showPOIs
              ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {showPOIs ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Landmarks</span>
        </button>
      </div>
    </div>
  );
}
