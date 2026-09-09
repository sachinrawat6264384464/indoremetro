"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Leaf, ShieldCheck, TreePine, Fuel, Calculator, HelpCircle, Zap, Info, LogIn, User as UserIcon, Ticket, Award } from "lucide-react";
import { getStoredUser, isAuthenticated } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { User } from "@/types";

export function CarbonSavingsBadge({ passengerTrips = 14200 }: { passengerTrips?: number }) {
  const [showFormula, setShowFormula] = useState(false);
  const [personalTrips, setPersonalTrips] = useState(2); // Default 2 trips per day slider
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [myTicketsCount, setMyTicketsCount] = useState<number>(0);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Check auth session & load user ticket history
  useEffect(() => {
    const authed = isAuthenticated();
    setIsLoggedIn(authed);
    if (authed) {
      const u = getStoredUser();
      setUser(u);

      // Fetch user's real booked tickets to compute actual carbon savings
      setLoadingTickets(true);
      apiFetch<any[]>("/tickets/my-tickets").then((res) => {
        if (res.success && res.data) {
          setMyTicketsCount(res.data.length);
        }
        setLoadingTickets(false);
      }).catch(() => setLoadingTickets(false));
    }
  }, []);

  // Real-world environmental calculations for Indore Metro
  const co2PerTrip = 0.42;
  const co2SavedKg = (passengerTrips * co2PerTrip).toFixed(1);
  const treesEquivalent = Math.round(passengerTrips * co2PerTrip / 20); // 1 tree absorbs ~20kg CO2/year
  const petrolSavedLiters = Math.round(passengerTrips * 0.175); // ~0.175L petrol saved per trip

  // Personal footprint calculations
  const personalCo2Saved = (personalTrips * co2PerTrip * 30).toFixed(1); // Monthly personal savings slider
  const userActualCo2Saved = (myTicketsCount * co2PerTrip).toFixed(1);

  // Commuter Badge level based on actual booked tickets
  const getCommuterTier = (count: number) => {
    if (count >= 10) return { title: "Gold Eco Commuter", badge: "🥇", color: "bg-amber-100 text-amber-900 border-amber-300" };
    if (count >= 5) return { title: "Silver Eco Commuter", badge: "🥈", color: "bg-slate-100 text-slate-900 border-slate-300" };
    if (count >= 1) return { title: "Green Pioneer Commuter", badge: "🌱", color: "bg-emerald-100 text-emerald-900 border-emerald-300" };
    return { title: "New Metro Commuter", badge: "🚆", color: "bg-slate-100 text-slate-700 border-slate-200" };
  };

  const tier = getCommuterTier(myTicketsCount);

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-5 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-4 relative z-10">
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0 shadow-sm">
              <Leaf className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                Green Mobility Impact <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h4>
              <p className="text-xs text-slate-500 font-semibold">Indore Metro zero-emission electric operations</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowFormula(!showFormula)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition border border-slate-200"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>How it's calculated</span>
          </button>
        </div>

        {/* Hero Impact Stats Row */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> DAILY EMISSIONS PREVENTED
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Fleet Feed
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                {co2SavedKg}
              </span>
              <span className="text-base font-bold text-emerald-200 ml-1.5">kg CO₂</span>
            </div>
            <span className="text-xs text-slate-300 font-semibold">Today in Indore</span>
          </div>

          {/* Real-world equivalents grid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
              <TreePine className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Trees Saved</span>
                <span className="font-extrabold text-white">~{treesEquivalent} Trees</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
              <Fuel className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Fuel Saved</span>
                <span className="font-extrabold text-white">~{petrolSavedLiters} L Petrol</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Formula Explanation Accordion */}
        {showFormula && (
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <span className="font-black text-emerald-950 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-emerald-700" /> Mathematical Formula
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-md">
                MPMRCL Standards
              </span>
            </div>

            <div className="font-mono bg-white p-2.5 rounded-xl border border-emerald-200 text-slate-800 font-bold text-[11px] leading-relaxed">
              CO₂ Saved = Passenger Trips (14,200) × Net Savings (0.42 kg/trip)
            </div>

            <ul className="space-y-1.5 text-slate-700 font-medium text-[11px]">
              <li className="flex items-center justify-between">
                <span>🚗 Petrol/Auto Commute (3 km avg):</span>
                <span className="font-mono font-bold text-slate-900">0.48 kg CO₂</span>
              </li>
              <li className="flex items-center justify-between">
                <span>⚡ Indore Electric Metro Train:</span>
                <span className="font-mono font-bold text-emerald-700">0.06 kg CO₂</span>
              </li>
              <li className="flex items-center justify-between pt-1 border-t border-emerald-200/60 font-bold text-emerald-900">
                <span>🌱 Net Prevention Per Passenger:</span>
                <span className="font-mono font-bold text-emerald-700">0.42 kg CO₂</span>
              </li>
            </ul>
          </div>
        )}

        {/* Dynamic Personal Carbon Section (Logged In vs Logged Out) */}
        {isLoggedIn ? (
          /* LOGGED IN USER PERSONAL TRACKER CARD */
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 space-y-3 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <span className="text-xs font-black text-slate-900 block leading-tight">
                    {user?.name || "Commuter"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold block">Logged In Eco Tracker</span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border flex items-center gap-1 ${tier.color}`}>
                <span>{tier.badge}</span>
                <span>{tier.title}</span>
              </span>
            </div>

            {/* Actual Booked Ticket CO2 Savings */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-0.5 shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Ticket className="w-3 h-3 text-amber-600" /> Booked Trips
                </span>
                <span className="text-base font-black text-slate-900 font-mono block">
                  {loadingTickets ? "..." : `${myTicketsCount} Tickets`}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-0.5 shadow-sm">
                <span className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-600" /> Your CO₂ Prevented
                </span>
                <span className="text-base font-black text-emerald-600 font-mono block">
                  {loadingTickets ? "..." : `${userActualCo2Saved} kg`}
                </span>
              </div>
            </div>

            {/* Projected trip slider for logged in user */}
            <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
                <span>Monthly Savings Estimator ({personalTrips} trips/day):</span>
                <span className="text-emerald-700 font-black font-mono">{personalCo2Saved} kg/mo</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={personalTrips}
                onChange={(e) => setPersonalTrips(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>
        ) : (
          /* LOGGED OUT SIGN-IN PROMPT CARD */
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <span className="font-black text-slate-900 flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4 text-amber-600" /> Sign In to Track Personal Eco Savings
                </span>
                <p className="text-slate-500 font-medium leading-relaxed text-[11px]">
                  Log in to track your actual ticket carbon savings, unlock Eco Commuter Badges, and see your personal footprint reduction!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Link
                href="/login"
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-center text-xs shadow-sm transition flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In Now
              </Link>
              <Link
                href="/signup"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-center text-xs shadow-sm transition"
              >
                Register
              </Link>
            </div>

            {/* Projected trip slider for guest visitors */}
            <div className="pt-2 border-t border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-600 font-bold">
                <span>Guest Savings Estimator ({personalTrips} trips/day):</span>
                <span className="text-emerald-700 font-black font-mono">{personalCo2Saved} kg CO₂ / mo</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={personalTrips}
                onChange={(e) => setPersonalTrips(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


