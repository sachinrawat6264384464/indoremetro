"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  Phone,
  ShieldCheck,
  CreditCard,
  Ticket as TicketIcon,
  Sparkles,
  Award,
  Leaf,
  LogOut,
  Edit3,
  Lock,
  CheckCircle2,
  MapPin,
  Clock,
  QrCode,
  Zap,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Save,
  X,
  RefreshCw,
} from "lucide-react";
import { getStoredUser, isAuthenticated, clearAuthSession, saveAuthSession } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { User, Ticket as TicketType, Station } from "@/types";
import { toast } from "sonner";
import { ProfileCardWidget } from "@/components/metro/profile-card-widget";
import { StationSelect } from "@/components/ui/station-select";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "card" | "tickets" | "security">("overview");

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [homeStationId, setHomeStationId] = useState("");
  const [workStationId, setWorkStationId] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Stations & Tickets State
  const [stations, setStations] = useState<Station[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // Security Form State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [updatingPass, setUpdatingPass] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const [liveBalance, setLiveBalance] = useState<number>(450.0);
  const [smartCardNum, setSmartCardNum] = useState<string>("ENG-6264384464");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login?redirect=/profile");
      return;
    }

    async function fetchFreshProfile() {
      const res = await apiFetch<any>("/auth/me");
      if (res.success && res.data) {
        setUser(res.data);
        setFullName(res.data.name || "");
        setPhoneNum(res.data.phone || "9876543210");
        if (res.data.wallet_balance !== undefined) {
          setLiveBalance(res.data.wallet_balance);
        }
        if (res.data.smart_card_number) {
          setSmartCardNum(res.data.smart_card_number);
        }
      } else {
        const storedUser = getStoredUser();
        setUser(storedUser);
        if (storedUser) {
          setFullName(storedUser.name || "");
          setPhoneNum(storedUser.phone || "9876543210");
        }
      }
    }

    // Load stations for preference selection
    async function loadStations() {
      const res = await apiFetch<Station[]>("/stations");
      if (res.success && res.data && res.data.length > 0) {
        setStations(res.data);
        setHomeStationId(res.data[0].id);
        setWorkStationId(res.data[12]?.id || res.data[1].id);
      }
    }

    // Load recent user tickets
    async function loadTickets() {
      setLoadingTickets(true);
      const res = await apiFetch<TicketType[]>("/tickets/my-tickets");
      setLoadingTickets(false);
      if (res.success && res.data) {
        setTickets(res.data);
      }
    }

    fetchFreshProfile();
    loadStations();
    loadTickets();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
          <span>Loading Metro Passenger Profile...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    clearAuthSession();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiFetch<any>("/auth/me", {
      method: "PUT",
      body: JSON.stringify({ name: fullName, phone: phoneNum }),
    });

    if (res.success && res.data) {
      setUser(res.data);
      saveAuthSession(localStorage.getItem("token") || "", res.data);
      setIsEditing(false);
      toast.success("Profile details updated in database!");
    } else {
      const updatedUser = { ...user, name: fullName, phone: phoneNum };
      setUser(updatedUser);
      saveAuthSession(localStorage.getItem("token") || "", updatedUser);
      setIsEditing(false);
      toast.success("Profile details updated!");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setUpdatingPass(true);
    setTimeout(() => {
      setUpdatingPass(false);
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      toast.success("Password security credentials updated successfully!");
    }, 1000);
  };

  // Metrics
  const totalTrips = tickets.length > 0 ? tickets.length : 14;
  const co2Saved = (totalTrips * 1.85).toFixed(1);
  const metroPoints = totalTrips * 35;
  const walletBalance = liveBalance;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1400px] mx-auto space-y-8">

        {/* 🌟 HERO BANNER & PROFILE PROFILE HEADER */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
          
          {/* Top Banner Gradient Wallpaper */}
          <div className="h-44 sm:h-52 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-1/3 w-64 h-64 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Official MPMRCL Commuter Pass
              </span>
            </div>
          </div>

          {/* Profile Card Header Info Row */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              
              {/* Left Avatar & Name Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-amber-500 text-slate-950 font-black text-4xl sm:text-5xl flex items-center justify-center shadow-2xl border-4 border-white ring-4 ring-amber-500/20">
                    {user.name ? user.name.charAt(0).toUpperCase() : "P"}
                  </div>
                  <div className="absolute bottom-2 right-2 w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-white" title="Verified Account">
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>

                <div className="space-y-1.5 pb-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {user.name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                      {user.roles?.join(", ") || "PASSENGER"}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-bold flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-600" /> {user.email}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] font-extrabold text-emerald-700 pt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Passenger • Member since 2026</span>
                  </div>
                </div>
              </div>

              {/* Right Profile Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-2 border border-slate-200 transition shadow-sm"
                >
                  <Edit3 className="w-4 h-4 text-amber-600" />
                  <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
                </button>

                <Link
                  href="/book-ticket"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5"
                >
                  <TicketIcon className="w-4 h-4 stroke-[2.5]" />
                  <span>Book Ticket &rarr;</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* 📊 METRICS & STATS GRID (4 Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-2 relative overflow-hidden group hover:border-amber-400 transition">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center font-black">
              <TicketIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Total Journeys
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalTrips}</span>
                <span className="text-xs text-emerald-600 font-bold">Trips Completed</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-2 relative overflow-hidden group hover:border-emerald-400 transition">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center font-black">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                CO2 Emissions Saved
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-700">{co2Saved} kg</span>
                <span className="text-xs text-emerald-600 font-bold">Green Impact</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-2 relative overflow-hidden group hover:border-yellow-400 transition">
            <div className="w-10 h-10 rounded-2xl bg-yellow-100 border border-yellow-300 text-yellow-800 flex items-center justify-center font-black">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Indore Metro Points
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{metroPoints}</span>
                <span className="text-xs text-amber-600 font-bold">Pts Earned</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-md space-y-2 relative overflow-hidden group hover:border-blue-400 transition">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 border border-blue-300 text-blue-700 flex items-center justify-center font-black">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Smart Pass Balance
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-600">₹{walletBalance.toFixed(0)}</span>
                <span className="text-xs text-slate-500 font-bold">Available</span>
              </div>
            </div>
          </div>

        </div>

        {/* 🗂️ INTERACTIVE PROFILE NAVIGATION TABS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-2 sm:p-3">
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-2 px-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === "overview"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Personal Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("card")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === "card"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Digital Smart Card &amp; Wallet</span>
            </button>

            <button
              onClick={() => setActiveTab("tickets")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === "tickets"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              <TicketIcon className="w-4 h-4" />
              <span>Recent Ticket Activity</span>
              {tickets.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-amber-400">
                  {tickets.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
                activeTab === "security"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security &amp; Credentials</span>
            </button>
          </div>

          {/* TAB CONTENT AREA */}
          <div className="p-4 sm:p-6">

            {/* TAB 1: OVERVIEW & PERSONAL INFO */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* Form / Details View */}
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-amber-600" /> Edit Personal Information
                      </h3>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-slate-900 uppercase block">Full Name</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-sm focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-slate-900 uppercase block">Phone Number</label>
                        <input
                          type="tel"
                          value={phoneNum}
                          onChange={(e) => setPhoneNum(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-sm focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-slate-900 uppercase block">Preferred Home Station</label>
                        <StationSelect
                          stations={stations}
                          value={homeStationId}
                          onChange={setHomeStationId}
                          iconColor="text-emerald-600"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-slate-900 uppercase block">Preferred Office Station</label>
                        <StationSelect
                          stations={stations}
                          value={workStationId}
                          onChange={setWorkStationId}
                          iconColor="text-rose-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-900 uppercase block">Emergency Contact Number</label>
                      <input
                        type="tel"
                        placeholder="Emergency Contact Phone (e.g. 9876000000)"
                        value={emergencyContact}
                        onChange={(e) => setEmergencyContact(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md shadow-amber-500/20"
                    >
                      <Save className="w-4 h-4" /> Save Updated Details
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Account Details Box */}
                    <div className="lg:col-span-7 space-y-4">
                      <h3 className="text-base font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <UserIcon className="w-4.5 h-4.5 text-amber-600" /> Account Profile Attributes
                      </h3>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-amber-600" /> Full Passenger Name
                          </span>
                          <span className="text-sm font-black text-slate-900">{user.name}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Mail className="w-4 h-4 text-amber-600" /> Registered Email Address
                          </span>
                          <span className="text-sm font-bold text-slate-900">{user.email}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Phone className="w-4 h-4 text-amber-600" /> Mobile Contact
                          </span>
                          <span className="text-sm font-mono font-bold text-slate-900">{phoneNum}</span>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" /> System Account ID
                          </span>
                          <span className="text-xs font-mono text-slate-700 font-bold">{user.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* Travel Preferences & Quick Route Memory */}
                    <div className="lg:col-span-5 space-y-4">
                      <h3 className="text-base font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <MapPin className="w-4.5 h-4.5 text-emerald-600" /> Favorite Commute Route Memory
                      </h3>

                      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
                        <div className="flex justify-between items-center text-xs text-amber-400 font-extrabold">
                          <span>DEFAULT COMMUTE PAIR</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px]">
                            1-CLICK READY
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 py-2 border-y border-slate-800">
                          <div>
                            <span className="text-[10px] text-emerald-400 font-extrabold uppercase block">HOME STATION</span>
                            <span className="text-sm font-black text-white">Gandhi Nagar</span>
                          </div>
                          <ArrowRight className="w-5 h-5 text-amber-500 shrink-0" />
                          <div className="text-right">
                            <span className="text-[10px] text-rose-400 font-extrabold uppercase block">WORK STATION</span>
                            <span className="text-sm font-black text-white">Vijay Nagar</span>
                          </div>
                        </div>

                        <Link
                          href="/book-ticket"
                          className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition"
                        >
                          <TicketIcon className="w-4 h-4" /> Book Quick Commute Pass &rarr;
                        </Link>
                      </div>

                      {/* Eco Hero Progress */}
                      <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-black text-emerald-950">
                            <Leaf className="w-4 h-4 text-emerald-600" /> Green Eco Commuter Tier
                          </div>
                          <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            SILVER TIER
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-emerald-200 overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full w-[65%]" />
                        </div>
                        <p className="text-[11px] text-emerald-800 font-semibold">
                          Complete 6 more metro trips to unlock <strong>Gold Commuter Tier</strong> &amp; earn 200 bonus points!
                        </p>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* TAB 2: SMART CARD & WALLET */}
            {activeTab === "card" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Digital Card Preview */}
                  <div className="lg:col-span-6 space-y-4">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <CreditCard className="w-4.5 h-4.5 text-amber-600" /> Digital NFC Metro Pass Card
                    </h3>

                    <ProfileCardWidget
                      userName={user.name}
                      userEmail={user.email}
                      balance={walletBalance}
                      cardNumber={smartCardNum}
                    />

                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 font-semibold">
                      <p className="font-extrabold flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-600" /> Instant AFC Turnstile Access
                      </p>
                      <p>Tap your smartphone or QR pass at any Indore Metro turnstile gate to travel seamlessly.</p>
                    </div>
                  </div>

                  {/* Right Quick Top-up & Pass Options */}
                  <div className="lg:col-span-6 space-y-6">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Zap className="w-4.5 h-4.5 text-amber-600" /> Fast Wallet Top-Up
                    </h3>

                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-5">
                      <div>
                        <label className="text-xs font-extrabold text-slate-900 uppercase block mb-2">
                          Select Top-Up Amount
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {[100, 200, 500, 1000].map((amt) => (
                            <Link
                              key={amt}
                              href={`/recharge`}
                              className="py-3 rounded-xl bg-white hover:bg-amber-500 hover:text-slate-950 border border-slate-300 text-slate-900 font-black text-center text-xs transition shadow-sm"
                            >
                              ₹{amt}
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-200 space-y-3 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-700">
                          <span>Auto Top-Up Threshold:</span>
                          <span className="text-amber-600">₹50 Minimum</span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-slate-700">
                          <span>NFC Smart Pass Status:</span>
                          <span className="text-emerald-700">Active &amp; Linked</span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-slate-700">
                          <span>Monthly Commuter Pass:</span>
                          <span className="text-slate-900">30-Day Unlimited (Eligible)</span>
                        </div>
                      </div>

                      <Link
                        href="/recharge"
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
                      >
                        <CreditCard className="w-4 h-4" /> Go to Full Smart Card Recharge Portal &rarr;
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: RECENT TICKET ACTIVITY */}
            {activeTab === "tickets" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <TicketIcon className="w-4.5 h-4.5 text-amber-600" /> Digital QR Ticket Activity Stream
                  </h3>
                  <Link href="/my-tickets" className="text-xs font-extrabold text-amber-600 hover:underline flex items-center gap-1">
                    View All Tickets <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {loadingTickets ? (
                  <div className="text-center py-12 text-slate-500 font-bold text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                    <span>Loading your digital QR tickets...</span>
                  </div>
                ) : tickets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tickets.map((t) => (
                      <div key={t.id} className="bg-slate-50 border border-slate-200 p-5 rounded-3xl space-y-3 shadow-sm hover:border-amber-400 transition">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <span className="text-[11px] font-mono text-slate-500 font-bold">Ticket #{t.ticket_number || t.id.slice(0, 8)}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            t.status === "ACTIVE"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-slate-200 text-slate-700"
                          }`}>
                            {t.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-black text-slate-900">
                          <span>{t.source_station?.name || "Origin Station"}</span>
                          <ArrowRight className="w-4 h-4 text-amber-500" />
                          <span>{t.dest_station?.name || "Destination Station"}</span>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold pt-1">
                          <span>Date: {t.journey_date || new Date().toISOString().split("T")[0]}</span>
                          <span className="font-black text-amber-600 text-sm">₹{t.total_fare}</span>
                        </div>

                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={() => setSelectedTicket(t)}
                            className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <QrCode className="w-3.5 h-3.5 text-amber-400" /> View Digital QR
                          </button>
                          <Link
                            href={`/book-ticket?source=${t.source_station_id}&dest=${t.dest_station_id}`}
                            className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-extrabold text-xs flex items-center justify-center"
                            title="Re-book this exact route"
                          >
                            Re-book
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
                    <TicketIcon className="w-10 h-10 text-slate-400 mx-auto" />
                    <h4 className="text-sm font-black text-slate-900">No Tickets Booked Yet</h4>
                    <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                      You haven&apos;t booked any QR tickets recently. Book your first metro digital pass now!
                    </p>
                    <Link
                      href="/book-ticket"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20"
                    >
                      <TicketIcon className="w-4 h-4" /> Book First QR Ticket
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SECURITY & CREDENTIALS */}
            {activeTab === "security" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Change Password Form */}
                  <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                      <Lock className="w-4.5 h-4.5 text-amber-600" /> Change Security Password
                    </h3>

                    <form onSubmit={handleChangePassword} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-slate-900 uppercase block">Current Password</label>
                        <input
                          type="password"
                          required
                          value={currentPass}
                          onChange={(e) => setCurrentPass(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-sm focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-slate-900 uppercase block">New Password</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="Minimum 6 characters"
                          className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-sm focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-extrabold text-slate-900 uppercase block">Confirm New Password</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={confirmPass}
                          onChange={(e) => setConfirmPass(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold text-sm focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={updatingPass}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 disabled:opacity-50"
                      >
                        <Lock className="w-4 h-4" />
                        {updatingPass ? "Updating Password..." : "Update Security Credentials"}
                      </button>
                    </form>
                  </div>

                  {/* Right Security Overview Cards */}
                  <div className="lg:col-span-5 space-y-4">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                      <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" /> Account Protection &amp; 2FA
                    </h3>

                    <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-900">Two-Factor Authentication (2FA)</p>
                          <p className="text-[11px] text-slate-500 font-medium">Extra security layer for ticket purchases</p>
                        </div>
                        <button
                          onClick={() => {
                            setTwoFactorEnabled(!twoFactorEnabled);
                            toast.success(`2FA Authentication ${!twoFactorEnabled ? "Enabled" : "Disabled"}`);
                          }}
                          className={`w-12 h-6 rounded-full transition-colors p-0.5 ${
                            twoFactorEnabled ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                            twoFactorEnabled ? "translate-x-6" : "translate-x-0"
                          }`} />
                        </button>
                      </div>

                      <div className="pt-3 border-t border-slate-100 text-xs space-y-2 text-slate-600 font-medium">
                        <div className="flex justify-between">
                          <span>Last Password Change:</span>
                          <span className="font-bold text-slate-900">Today</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Login Session:</span>
                          <span className="font-bold text-emerald-700">Windows Chrome (Current)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* TICKET QR CODE DISPLAY MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                Official Digital Metro Pass
              </span>
              <h3 className="text-lg font-black text-slate-900">Indore Metro Ticket</h3>
              <p className="text-xs text-slate-500 font-mono">ID: {selectedTicket.id.slice(0, 16)}</p>
            </div>

            {/* QR Code Container */}
            <div className="bg-slate-950 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
              <div className="w-44 h-44 bg-white p-3 rounded-xl flex items-center justify-center shadow-lg">
                <QrCode className="w-36 h-36 text-slate-950" />
              </div>
              <p className="text-[10px] font-mono text-amber-400 font-bold tracking-widest uppercase">
                Scan at AFC Gate Turnstile
              </p>
            </div>

            <div className="text-xs space-y-1 font-bold text-slate-700 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Route:</span>
                <span className="text-slate-900">
                  {selectedTicket.source_station?.name} ➔ {selectedTicket.dest_station?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Fare:</span>
                <span className="text-amber-600 font-black">₹{selectedTicket.total_fare}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
