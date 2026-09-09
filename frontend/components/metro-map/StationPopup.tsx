import React from "react";
import Link from "next/link";
import { Station } from "@/types";
import { MapPin, Navigation, Tag, Building2 } from "lucide-react";

interface StationPopupProps {
  station: Station;
  onSelectFrom?: (st: Station) => void;
  onSelectTo?: (st: Station) => void;
}

export function StationPopup({ station, onSelectFrom, onSelectTo }: StationPopupProps) {
  return (
    <div className="p-1 max-w-xs space-y-2 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
            {station.code}
          </span>
          <h4 className="font-bold text-sm text-slate-900">{station.name}</h4>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
          {station.status}
        </span>
      </div>

      <div className="text-xs space-y-1 text-slate-600">
        <p className="flex items-center gap-1">
          <Tag className="w-3 h-3 text-amber-600" />
          <span>Line: <strong>{station.line_name}</strong></span>
        </p>

        {station.amenities && station.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {station.amenities.map((am, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-700">
                {am}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-200 flex gap-1.5">
        {onSelectFrom && (
          <button
            onClick={() => onSelectFrom(station)}
            className="flex-1 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] flex items-center justify-center gap-1"
          >
            <Navigation className="w-3 h-3" /> From Here
          </button>
        )}
        {onSelectTo && (
          <button
            onClick={() => onSelectTo(station)}
            className="flex-1 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1"
          >
            <MapPin className="w-3 h-3" /> To Here
          </button>
        )}
      </div>
    </div>
  );
}
