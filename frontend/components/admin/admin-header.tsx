"use client";

import React from "react";
import { getStoredUser } from "@/lib/auth";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const user = getStoredUser();

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-slate-200">{user?.name || "Admin User"}</p>
          <p className="text-xs text-amber-400 font-mono">System Administrator</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center text-sm shadow-inner">
          {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>
      </div>
    </header>
  );
}
