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
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1600px] mx-auto space-y-10">
        
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <Megaphone className="w-3.5 h-3.5 text-amber-600" /> MPMRCL Commercial Opportunities
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Advertise with Indore Metro</h1>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl font-medium">
            Connect your brand with thousands of daily commuters across high-visibility station screens, train wrap branding, digital displays, and kiosk spaces.
          </p>
        </div>

        {/* Media Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition">
            <Building2 className="w-8 h-8 text-amber-600" />
            <h3 className="text-lg font-extrabold text-slate-900">Station Naming Rights</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Co-branding &amp; station co-naming opportunities for corporate leaders along the Yellow Line Priority Corridor.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition">
            <Megaphone className="w-8 h-8 text-emerald-600" />
            <h3 className="text-lg font-extrabold text-slate-900">Digital Screens &amp; Kiosks</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              High-definition video ads across platform screens, concourse digital billboards, and automated fare gates.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition">
            <Phone className="w-8 h-8 text-sky-600" />
            <h3 className="text-lg font-extrabold text-slate-900">Train Exterior Wraps</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Full train body vinyl wraps delivering massive mobile brand presence across 31.46 km of Indore metro network.
            </p>
          </div>
        </div>

        {/* Inquiry Form */}
        {submitted ? (
          <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center space-y-4 shadow-md">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-extrabold text-slate-900">Inquiry Received</h3>
            <p className="text-sm text-slate-600 font-medium">Our commercial media partner will contact you within 1 business day.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-md">
            <h3 className="text-xl font-extrabold text-slate-900">Submit Media Inquiry</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase block mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Company Name"
                    className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase block mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    placeholder="business@company.com"
                    className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 uppercase block mb-1">Advertising Interest / Message</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify preferred stations, media format, or campaign duration..."
                  className="w-full p-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 resize-none shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition shadow-md shadow-amber-500/20"
              >
                Submit Advertising Inquiry
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

