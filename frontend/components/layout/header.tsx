"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Train, MapPin, Navigation, Calculator, Clock, AlertTriangle, 
  Ticket, User, Shield, LogOut, Menu, X 
} from "lucide-react";
import { getStoredUser, clearAuthSession, isAdminUser } from "@/lib/auth";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setIsAdmin(isAdminUser());
  }, [pathname]);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    setIsAdmin(false);
    router.push("/login");
  };

  const navItems = [
    { href: "/", label: "Home", icon: Train },
    { href: "/journey", label: "Plan Journey", icon: Navigation },
    { href: "/fare", label: "Fare Calculator", icon: Calculator },
    { href: "/stations", label: "Stations", icon: MapPin },
    { href: "/routes", label: "Routes", icon: Train },
    { href: "/timetable", label: "Timetable", icon: Clock },
    { href: "/alerts", label: "Service Alerts", icon: AlertTriangle },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 bg-[#090D16]/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl metro-gradient-bg flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Train className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                Indore <span className="metro-gradient-text">Metro</span>
              </div>
              <p className="text-[10px] text-teal-400 font-medium tracking-wider uppercase">MPMRCL Digital Web Platform</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/my-tickets"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center gap-2 transition"
                >
                  <Ticket className="w-4 h-4 text-teal-400" />
                  My Tickets
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-2 transition"
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    Admin Panel
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-200">
                    <div className="w-8 h-8 rounded-md bg-teal-700/50 flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 py-2 glass-panel rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5">
                      User Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg text-sm font-medium metro-gradient-bg text-white shadow-lg shadow-teal-500/20 hover:opacity-90 transition"
                >
                  Book Ticket
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 px-4 pt-2 pb-6 space-y-2 bg-[#090D16]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/my-tickets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-lg text-center font-medium bg-teal-500/15 text-teal-300 border border-teal-500/30"
                >
                  My Tickets
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-lg text-center font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-lg text-center font-medium bg-rose-500/15 text-rose-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-lg text-center font-medium bg-white/5 text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-lg text-center font-medium metro-gradient-bg text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
