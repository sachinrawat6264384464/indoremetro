"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus, User, Mail, Lock, Phone } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, password }),
    });

    setLoading(false);

    if (res.success) {
      toast.success("Account created successfully! Please sign in.");
      const loginUrl = redirectUrl
        ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
        : "/login";
      router.push(loginUrl);
    } else {
      toast.error(res.error?.message || "Registration failed");
    }
  };

  const loginLink = redirectUrl
    ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
    : "/login";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Passenger Account</h1>
          <p className="text-xs text-slate-600 font-medium">Book digital QR tickets &amp; manage travel passes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-semibold shadow-sm transition"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@example.com"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-semibold shadow-sm transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white text-sm font-semibold shadow-sm transition"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
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
            {loading ? "Creating..." : "Create Account \u2192"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 pt-4 border-t border-slate-100 font-medium">
          Already registered?{" "}
          <Link href={loginLink} className="text-amber-600 font-extrabold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500 font-medium">Loading Sign Up...</div>}>
      <SignupForm />
    </Suspense>
  );
}
