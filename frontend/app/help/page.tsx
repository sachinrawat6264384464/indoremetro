import React from "react";
import { HelpCircle, Phone, Mail, Building2 } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      q: "How do I book a QR ticket for Indore Metro?",
      a: "Go to the 'Book Ticket' tab, choose your source and destination stations, enter passenger details, and complete payment via Razorpay. Your QR ticket will be instantly generated.",
    },
    {
      q: "What is the validity of a Metro QR ticket?",
      a: "Single journey tickets are valid for the day of purchase until midnight. Once scanned at entry, you have up to 180 minutes to complete your journey.",
    },
    {
      q: "Can I cancel my ticket and get a refund?",
      a: "Unused tickets can be cancelled before entry. Refunds will be credited back to your original payment mode within 3-5 business days.",
    },
    {
      q: "What amenities are available at metro stations?",
      a: "Indore Metro stations are equipped with escalators, elevators for divyangjan, Wi-Fi, drinking water, restrooms, and automated ticketing kiosks.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="text-center space-y-2 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Customer Support Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Help &amp; Support Center
          </h1>
          <p className="text-slate-600 text-sm font-medium">
            Everything you need to know about Indore Metro ticketing, station amenities, and journey rules.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl text-center p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900">Helpline</h3>
            <p className="text-xs text-slate-500 font-medium">Toll-Free Customer Support</p>
            <p className="font-mono text-amber-600 text-sm font-bold">1800-233-0101</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl text-center p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900">Email Support</h3>
            <p className="text-xs text-slate-500 font-medium">Queries &amp; Feedback</p>
            <p className="font-mono text-amber-600 text-sm font-bold">support@indoremetro.gov.in</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl text-center p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900">Control Center</h3>
            <p className="text-xs text-slate-500 font-medium">Main Metro Depot</p>
            <p className="text-slate-700 text-xs font-bold">Gandhi Nagar, Indore, MP</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
                <h3 className="text-base font-bold text-amber-600 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600" /> {faq.q}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

