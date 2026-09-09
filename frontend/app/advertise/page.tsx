"use client";

import { Megaphone, Mail, Phone, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function AdvertisePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Advertising inquiry submitted! Our media team will respond shortly.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
          <Megaphone className="w-3.5 h-3.5" /> MPMRCL Commercial Opportunities
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Advertise with Indore Metro</h1>
        <p className="text-slate-400 text-sm mt-2 max-w-2xl">
          Connect your brand with thousands of daily commuters across high-visibility station screens, train wrap branding, digital displays, and kiosk spaces.
        </p>
      </div>

      {/* Media Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
          <Building2 className="w-8 h-8 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Station Naming Rights</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Co-branding & station co-naming opportunities for corporate leaders along the Yellow Line Priority Corridor.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
          <Megaphone className="w-8 h-8 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Digital Screens & Kiosks</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            High-definition video ads across platform screens, concourse digital billboards, and automated fare gates.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
          <Phone className="w-8 h-8 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">Train Exterior Wraps</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Full train body vinyl wraps delivering massive mobile brand presence across 31.46 km of Indore metro network.
          </p>
        </div>
      </div>

      {/* Inquiry Form */}
      {submitted ? (
        <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-3xl text-center space-y-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
          <p className="text-sm text-slate-400">Our commercial media partner will contact you within 1 business day.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold text-white">Submit Media Inquiry</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="Company Name"
                  className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  placeholder="business@company.com"
                  className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Advertising Interest / Message</label>
              <textarea
                rows={3}
                required
                placeholder="Specify preferred stations, media format, or campaign duration..."
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition"
            >
              Submit Advertising Inquiry
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
