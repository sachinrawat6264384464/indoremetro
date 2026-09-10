"use client";

import { Train, Wifi, CreditCard, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProfileCardWidgetProps {
  userName: string;
  userEmail: string;
  balance?: number;
  cardNumber?: string;
}

export function ProfileCardWidget({
  userName,
  userEmail,
  balance = 450,
  cardNumber = "IND-8942-1094-8201",
}: ProfileCardWidgetProps) {
  return (
    <div className="w-full max-w-md bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 text-white rounded-3xl p-6 shadow-2xl border border-amber-500/20 relative overflow-hidden group hover:shadow-amber-500/10 transition-all duration-300">
      {/* Background Decorative Metallic Waves & Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Card Header: Brand & Contactless Icon */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/30">
            <Train className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xs font-black tracking-wider text-amber-400 block leading-tight">
              INDORE METRO
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
              Smart Commuter Pass
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-amber-400/80 rotate-90" />
          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Chip & Holographic Foil Mockup */}
      <div className="my-6 flex items-center justify-between relative z-10">
        <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-yellow-300 via-amber-400 to-yellow-500 p-1 flex items-center justify-center shadow-inner border border-yellow-200">
          <div className="w-full h-full border border-amber-600/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
            <div className="bg-amber-600/20 rounded-xs" />
            <div className="bg-amber-600/20 rounded-xs" />
            <div className="bg-amber-600/20 rounded-xs" />
            <div className="bg-amber-600/20 rounded-xs" />
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Wallet Balance
          </span>
          <span className="text-2xl font-black text-amber-400 tracking-tight">
            ₹{balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Card Number & User Info */}
      <div className="space-y-4 relative z-10 pt-2 border-t border-slate-800/80">
        <div className="flex justify-between items-center">
          <span className="font-mono text-sm tracking-widest text-slate-300 font-bold">
            {cardNumber}
          </span>
          <span className="text-[10px] font-black uppercase text-amber-500/80 tracking-widest">
            AFC VERIFIED
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
              Cardholder
            </span>
            <span className="text-xs font-black text-white truncate max-w-[180px] block">
              {userName}
            </span>
          </div>

          <Link
            href="/recharge"
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 shadow-md shadow-amber-500/20 transition transform hover:scale-105 active:scale-95"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Recharge &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
