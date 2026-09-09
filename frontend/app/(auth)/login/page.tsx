"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Train, LogIn, Lock, Mail } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { saveAuthSession } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.success && res.data) {
      saveAuthSession(res.data.access_token, res.data.user);
      toast.success("Welcome back! Signed in successfully.");
      if (res.data.user.roles.includes("SUPER_ADMIN") || res.data.user.roles.includes("ADMIN")) {
        router.push("/admin");
      } else {
        router.push("/my-tickets");
      }
    } else {
      toast.error(res.error?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Train className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sign In to Indore Metro</h1>
          <p className="text-xs text-slate-600 font-medium">Access your digital QR tickets &amp; passenger account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="passenger@indoremetro.gov.in"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-semibold shadow-sm transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-semibold shadow-sm transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Authenticating..." : "Sign In &rarr;"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 space-y-2 pt-4 border-t border-slate-100 font-medium">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-amber-600 font-extrabold hover:underline">
              Create Account
            </Link>
          </p>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-[11px] text-amber-900 font-semibold space-y-0.5">
            <p className="font-extrabold">Demo Passenger / Admin Credentials:</p>
            <p>Admin: admin@indoremetro.gov.in / Admin@123456</p>
            <p>User: passenger@indoremetro.gov.in / User@123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
