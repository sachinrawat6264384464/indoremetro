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
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl metro-gradient-bg mx-auto flex items-center justify-center text-white shadow-lg">
            <Train className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Sign In to Indore Metro</h1>
          <p className="text-xs text-slate-400">Access your digital QR tickets & journey history</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="passenger@indoremetro.gov.in"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl metro-gradient-bg text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 space-y-2 pt-4 border-t border-white/10">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-teal-400 font-semibold hover:underline">
              Create Account
            </Link>
          </p>
          <p className="text-slate-500">Demo Admin: admin@indoremetro.gov.in / Admin@123456</p>
        </div>
      </div>
    </div>
  );
}
