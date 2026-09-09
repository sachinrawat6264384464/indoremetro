"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut, RotateCcw, X, Maximize2 } from "lucide-react";

interface MapZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string;
}

export function MapZoomModal({ isOpen, onClose, imageSrc = "/images/indore_metro_alignment_official.png" }: MapZoomModalProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.8));
  const handleReset = () => setZoomLevel(1);

  return (
    <div
      className="fixed inset-0 z-[2000] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-amber-600" /> Indore Metro Yellow Line &mdash; Official HD Schematic Map
            </h3>
            <p className="text-xs text-slate-500">Click &amp; drag or use zoom controls to inspect station alignments and phase details</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-3 text-xs font-mono font-bold text-slate-800">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition border-l border-slate-200 ml-1"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition font-bold"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable & Zoomable Image Viewport */}
        <div className="flex-1 overflow-auto p-6 bg-slate-100 flex items-center justify-center min-h-[500px]">
          <div
            className="transition-transform duration-200 ease-out origin-center cursor-grab active:cursor-grabbing"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <Image
              src={imageSrc}
              alt="Indore Metro Official Yellow Line Schematic HD Map"
              width={1600}
              height={1000}
              className="rounded-2xl shadow-lg object-contain max-w-full h-auto bg-white"
              priority
            />
          </div>
        </div>

        {/* Footer Legend */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-4 h-1 rounded-full bg-amber-500" /> Phase I: Elevated (6.3 km)</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-1 rounded-full bg-emerald-600" /> Phase II: Elevated (10.98 km)</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-1 rounded-full bg-sky-600 border border-dashed" /> Phase III: Underground (8.7 km)</span>
          </div>
          <span>Double-click or pinch to zoom</span>
        </div>
      </div>
    </div>
  );
}
