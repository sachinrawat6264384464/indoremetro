"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Train, Navigation, Calculator, MapPin, Route as RouteIcon, Clock, AlertTriangle, 
  Ticket, Shield, LogOut, Menu, X, ChevronDown, User as UserIcon, Search
} from "lucide-react";
import { getStoredUser, clearAuthSession, isAdminUser } from "@/lib/auth";
import { GlobalSearch } from "@/components/layout/GlobalSearch";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setIsAdmin(isAdminUser());
    setProfileDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    setIsAdmin(false);
    setProfileDropdownOpen(false);
    router.push("/login");
  };

  const navItems = [
    { href: "/", label: "Home", icon: Train },
    { href: "/map", label: "Map", icon: MapPin },
    { href: "/journey", label: "Plan Journey", icon: Navigation },
    { href: "/fare", label: "Fare Calculator", icon: Calculator },
    { href: "/stations", label: "Stations", icon: MapPin },
    { href: "/routes", label: "Routes", icon: RouteIcon },
    { href: "/timetable", label: "Timetable", icon: Clock },
    { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#070A12]/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
        {/* Top subtle ambient glow line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-teal-500 via-amber-400 to-sky-500" />

        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all duration-300">
                <Train className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div>
                <div className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
                  INDORE <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-teal-300 bg-clip-text text-transparent">METRO</span>
                </div>
                <p className="text-[10px] text-amber-400/90 font-semibold tracking-widest uppercase mt-0.5">
                  MPMRCL Official Platform
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 shadow-inner">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-gradient-to-r from-amber-500/20 to-amber-500/10 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Compact Navigation (Medium Screens) */}
            <nav className="hidden lg:flex xl:hidden items-center gap-1">
              {navItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                      isActive
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Controls */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              {/* Universal Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 transition-all text-xs font-medium"
                title="Search stations, routes, and help"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden xl:inline">Search...</span>
                <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-400">
                  Ctrl K
                </kbd>
              </button>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/my-tickets"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Ticket className="w-4 h-4 text-amber-400" />
                    <span>My Tickets</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-2 transition-all shadow-sm"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Admin</span>
                    </Link>
                  )}

                  {/* Profile Menu Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-extrabold flex items-center justify-center text-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {profileDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-1 z-50 animate-fade-in">
                        <div className="px-3 py-2 border-b border-slate-800">
                          <p className="text-xs font-bold text-white truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>My Profile</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/book-ticket"
                    className="px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center gap-1.5"
                  >
                    <Ticket className="w-4 h-4 stroke-[2.5]" />
                    <span>Book Ticket</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                title="Search"
              >
                <Search className="w-4 h-4 text-slate-400" />
              </button>

              <Link
                href="/book-ticket"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950"
              >
                Book Ticket
              </Link>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800/80 bg-[#070A12] px-4 pt-3 pb-6 space-y-2 animate-fade-in">
            <div className="grid grid-cols-2 gap-1.5 pb-3 border-b border-slate-800/80">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "text-slate-300 bg-slate-900/60 border border-slate-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/my-tickets"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-slate-900 text-white border border-slate-800 flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4 text-amber-400" />
                    My Tickets
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 rounded-xl text-center text-xs font-bold bg-slate-900 text-white border border-slate-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/book-ticket"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2.5 rounded-xl text-center text-xs font-bold bg-amber-500 text-slate-950"
                  >
                    Book Ticket
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Universal Search Overlay */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
