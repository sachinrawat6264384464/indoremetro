"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Thank you for reaching out! Our customer support team will contact you shortly.");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1600px] mx-auto space-y-10">
        
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <Phone className="w-3.5 h-3.5 text-amber-600" /> Helpline &amp; Customer Desk
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Contact &amp; Helpline</h1>
          <p className="text-slate-600 text-sm mt-2 font-medium">
            Get in touch with Indore Metro Customer Care, station control, or submit general inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 rounded-xl text-amber-600 border border-amber-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase block">Passenger Helpline</span>
                  <a href="tel:+919319163327" className="text-base font-extrabold text-slate-900 hover:text-amber-600">
                    +91 93191 63327
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600 border border-emerald-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase block">Official Email</span>
                  <span className="text-sm font-bold text-slate-900">support@indoremetro.gov.in</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-100 rounded-xl text-sky-600 border border-sky-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold uppercase block">Headquarters</span>
                  <span className="text-xs text-slate-700 font-medium">MPMRCL Office, Super Corridor, Indore, MP 452005</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-md">
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-extrabold text-slate-900">Message Sent</h3>
                <p className="text-xs text-slate-600 font-medium">We have received your message and will respond via email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase block mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Ticket inquiry, station feedback, etc."
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase block mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Write your message..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-500 resize-none shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-amber-500/20"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

