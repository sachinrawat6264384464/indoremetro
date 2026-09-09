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

  if (!user) return <div className="text-center py-24 text-slate-500 font-medium">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">{user.name}</h1>
              <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mt-0.5">{user.roles?.join(", ")}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 text-sm">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600" /> Email Address
              </span>
              <span className="font-bold text-slate-900">{user.email}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600" /> Account ID
              </span>
              <span className="font-mono text-xs text-slate-700 font-bold">{user.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

