"use client";

import { useState } from "react";
import { PackageSearch, ShieldCheck, CheckCircle2, MapPin, PhoneCall, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

export default function LostFoundPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    item_name: "",
    category: "ELECTRONICS",
    station_id: "",
    date_lost: new Date().toISOString().split("T")[0],
    contact_name: "",
    contact_phone: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Lost & Found claim submitted. Metro Control will contact you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1600px] mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <PackageSearch className="w-3.5 h-3.5 text-amber-600" /> MPMRCL Customer Care &amp; Baggage Retrieval
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Lost &amp; Found Assistance Portal</h1>
          <p className="text-slate-600 text-sm mt-2 font-medium">
            Report lost items or claim recovered belongings retrieved from Indore Metro trains and station concourses.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {submitted ? (
              <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center space-y-4 shadow-md">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">Report Submitted Successfully</h2>
                <p className="text-slate-700 text-sm max-w-md mx-auto font-medium">
                  Your reference ID is <strong className="text-amber-600 font-mono">LF-{Math.floor(100000 + Math.random() * 900000)}</strong>. Station Security is processing your claim.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                >
                  Submit Another Report
                </button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-md space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-extrabold text-slate-900">Report Missing Belonging</h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Provide detailed item information to help our security team match your claim.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-900 uppercase block mb-1.5">Item Name / Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Black Leather Wallet, Blue Backpack"
                        value={formData.item_name}
                        onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-900 uppercase block mb-1.5">Item Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm font-medium"
                      >
                        <option value="ELECTRONICS">Electronics (Mobile, Laptop, Earbuds)</option>
                        <option value="DOCUMENTS">Documents &amp; Cards (ID, Wallet)</option>
                        <option value="BAGS">Bags &amp; Luggage</option>
                        <option value="CLOTHING">Clothing &amp; Accessories</option>
                        <option value="OTHER">Other Personal Belongings</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-900 uppercase block mb-1.5">Contact Person Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name"
                        value={formData.contact_name}
                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-900 uppercase block mb-1.5">Mobile Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 uppercase block mb-1.5">Detailed Description &amp; Location Details</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Mention specific brand, color, train direction, or station platform where it was left behind..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 resize-none shadow-sm font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition shadow-md shadow-amber-500/20"
                  >
                    Submit Lost Item Report
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" /> Lost &amp; Found Retrieval Policy
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                All un-claimed articles found in metro coaches are securely logged by MPMRCL Station Security. Items are held at the Central Depot for up to 30 days before being handed over to municipal authorities according to statutory guidelines.
              </p>
            </div>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Central Depot Location */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-800 rounded-2xl border border-amber-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Central Depot Desk</h3>
                  <p className="text-xs text-slate-500 font-medium">Baggage Recovery Centre</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Gandhi Nagar Depot Administrative Block, Super Corridor, Indore, Madhya Pradesh - 452005.
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Working Hours: Mon-Sat (10:00 AM - 05:00 PM)</span>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md space-y-4 border border-slate-800">
              <h3 className="text-sm font-extrabold text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Required Proofs for Claiming
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 font-medium list-disc pl-4 leading-relaxed">
                <li>Government-issued Photo ID (Aadhaar, Driving License, Voter ID).</li>
                <li>Original Purchase Invoice or IMEI/Serial Number for electronics.</li>
                <li>Indore Metro Travel Ticket / Smart Card used during journey.</li>
              </ul>
            </div>

            {/* Helpline */}
            <div className="bg-amber-500 text-slate-950 p-6 rounded-3xl shadow-md space-y-3 border border-amber-400">
              <h3 className="text-base font-black flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-slate-950" /> Instant Security Helpline
              </h3>
              <p className="text-xs text-slate-900 font-semibold leading-relaxed">
                Speak directly with the station security control desk for immediate assistance regarding lost items.
              </p>
              <a
                href="tel:07312500001"
                className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs shadow-md transition"
              >
                Call Depot Desk: 0731-2500001 &rarr;
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

