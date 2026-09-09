"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin, Search, ChevronDown, Check, Train } from "lucide-react";
import { Station } from "@/types";

interface StationSelectProps {
  stations: Station[];
  value: string;
  onChange: (stationId: string) => void;
  placeholder?: string;
  iconColor?: string;
  className?: string;
}

export function StationSelect({
  stations,
  value,
  onChange,
  placeholder = "Select Station",
  iconColor = "text-amber-500",
  className = "",
}: StationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedStation = stations.find((s) => s.id === value);

  const filteredStations = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.line_name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full h-14 px-4 rounded-2xl bg-white border border-slate-300 hover:border-amber-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 text-slate-900 font-extrabold text-sm shadow-sm transition flex items-center justify-between gap-2 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <MapPin className={`w-5 h-5 shrink-0 ${iconColor}`} />
          {selectedStation ? (
            <span className="truncate font-black text-slate-900 text-sm">
              {selectedStation.name}
            </span>
          ) : (
            <span className="text-slate-400 font-medium text-sm">{placeholder}</span>
          )}
        </div>

        {selectedStation && (
          <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-300 shrink-0">
            {selectedStation.code}
          </span>
        )}

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-amber-600" : ""
          }`}
        />
      </button>

      {/* Floating Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Bar */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/80">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search station or code (e.g. ST01)..."
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold focus:outline-none focus:border-amber-500 shadow-inner"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 p-1">
            {filteredStations.length === 0 ? (
              <div className="p-4 text-center text-xs font-bold text-slate-400">
                No matching stations found
              </div>
            ) : (
              filteredStations.map((st) => {
                const isSelected = st.id === value;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      onChange(st.id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full px-3.5 py-3 rounded-xl text-left text-xs flex items-center justify-between gap-3 transition ${
                      isSelected
                        ? "bg-amber-50 text-amber-950 font-black border border-amber-200"
                        : "hover:bg-slate-100/80 text-slate-800 font-bold"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-amber-500" : "bg-slate-300"}`} />
                      <span className="truncate">{st.name}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        {st.code}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 stroke-[3]" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
