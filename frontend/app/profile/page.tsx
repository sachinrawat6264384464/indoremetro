"use client";

import { useEffect, useState } from "react";
import { User as UserIcon, Mail, Phone, ShieldCheck } from "lucide-react";
import { getStoredUser, isAuthenticated } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { User } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }
    setUser(getStoredUser());
  }, []);

  if (!user) return <div className="text-center py-24 text-slate-400">Loading profile...</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-16 space-y-6">
      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl metro-gradient-bg flex items-center justify-center font-bold text-2xl text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user.name}</h1>
            <p className="text-xs text-teal-400 font-semibold">{user.roles?.join(", ")}</p>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10 text-sm">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-teal-400" /> Email Address
            </span>
            <span className="font-semibold text-white">{user.email}</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-slate-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-400" /> Account ID
            </span>
            <span className="font-mono text-xs text-slate-300">{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
