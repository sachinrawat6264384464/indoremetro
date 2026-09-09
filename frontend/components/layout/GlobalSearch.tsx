'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Station } from '@/types';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  type: 'station' | 'route' | 'place' | 'help';
  title: string;
  subtitle: string;
  url: string;
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // Fetch stations for search
      apiFetch<Station[]>('/stations').then((res) => {
        if (res.success && res.data) setStations(res.data);
      }).catch(() => {});
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Static route & help targets
  const staticItems: SearchItem[] = [
    { id: 'route-yellow', type: 'route', title: 'Yellow Line (Priority Corridor)', subtitle: 'Super Corridor to Palasia', url: '/routes' },
    { id: 'map', type: 'route', title: 'Interactive Metro Map', subtitle: 'View GIS map & nearby places', url: '/map' },
    { id: 'fare-calc', type: 'help', title: 'Fare Calculator', subtitle: 'Check ticket prices between stations', url: '/fare' },
    { id: 'timetable-sch', type: 'help', title: 'Train Timetable & Schedules', subtitle: 'First train, last train & frequencies', url: '/timetable' },
    { id: 'alerts-live', type: 'help', title: 'Live Service Alerts', subtitle: 'Network status & service disruptions', url: '/alerts' },
    { id: 'help-faq', type: 'help', title: 'Passenger FAQs & Support', subtitle: 'Tickets, refunds & travel guidelines', url: '/help' },
  ];

  // Map stations to search items
  const stationItems: SearchItem[] = stations.map((s) => ({
    id: `station-${s.id}`,
    type: 'station',
    title: `${s.name} (${s.code})`,
    subtitle: `${s.line_name || 'Yellow Line'}`,
    url: `/stations/${s.id}`,
  }));

  const allItems = [...stationItems, ...staticItems];

  const results = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : staticItems;

  const handleSelect = (item: SearchItem) => {
    onClose();
    router.push(item.url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1050] bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-16 md:pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-800/80">
          <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="w-full py-4 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-base"
            placeholder="Search stations, lines, places, or help (e.g. Rajwada, Ticket, Timetable)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded hover:text-slate-200 mr-2"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-1 text-[10px] font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-500/10 border border-amber-500/30' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      item.type === 'station' ? 'bg-amber-500/20 text-amber-400' :
                      item.type === 'route' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-teal-500/20 text-teal-400'
                    }`}>
                      {item.type === 'station' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      ) : item.type === 'route' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-100">{item.title}</p>
                      <p className="text-xs text-slate-400">{item.subtitle}</p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm font-medium">No results found for &quot;{query}&quot;</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for station names like &quot;Palasia&quot;, &quot;Rajwada&quot;, or &quot;Airport&quot;.</p>
            </div>
          )}
        </div>

        {/* Footer help */}
        <div className="px-4 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Navigate with <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px]">↓</kbd></span>
          <span>Select with <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px]">ENTER</kbd></span>
        </div>
      </div>
    </div>
  );
}
