"use client";

import { useState } from "react";
import { PackageSearch, ShieldCheck, CheckCircle2 } from "lucide-react";
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
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <PackageSearch className="w-3.5 h-3.5 text-amber-600" /> MPMRCL Customer Care
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Lost &amp; Found Assistance</h1>
          <p className="text-slate-600 text-sm mt-2 font-medium">
            Report lost items or check claimed belongings recovered from Indore Metro coaches and station premises.
          </p>
        </div>

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
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-md">
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
                    className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase block mb-1.5">Item Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm"
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
                    className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm"
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
                    className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm"
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
                  className="w-full p-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 resize-none shadow-sm"
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

        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Central Control Helpline
          </div>
          <p>You can also reach the station supervisor at any active Yellow Line station or call customer service at <strong>+91 93191 63327</strong>.</p>
        </div>
      </div>
    </div>
  );
}

