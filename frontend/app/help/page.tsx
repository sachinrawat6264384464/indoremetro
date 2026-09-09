import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HelpPage() {
  const faqs = [
    {
      q: "How do I book a QR ticket for Indore Metro?",
      a: "Go to the 'Book Ticket' tab, choose your source and destination stations, enter passenger details, and complete payment via Razorpay. Your QR ticket will be instantly generated.",
    },
    {
      q: "What is the validity of a Metro QR ticket?",
      a: "Single journey tickets are valid for the day of purchase until midnight. Once scanned at entry, you have up to 90 minutes to complete your journey.",
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
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Help & Support Center
        </h1>
        <p className="text-slate-400 text-sm">
          Everything you need to know about Indore Metro ticketing, station amenities, and journey rules.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center p-6 space-y-3 border-amber-500/30">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
            📞
          </div>
          <h3 className="font-bold text-slate-100">Helpline</h3>
          <p className="text-xs text-slate-400">Toll-Free Customer Support</p>
          <p className="font-mono text-amber-400 text-sm font-semibold">1800-233-0101</p>
        </Card>

        <Card className="text-center p-6 space-y-3 border-amber-500/30">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
            ✉️
          </div>
          <h3 className="font-bold text-slate-100">Email Support</h3>
          <p className="text-xs text-slate-400">Queries & Feedback</p>
          <p className="font-mono text-amber-400 text-sm font-semibold">support@indoremetro.gov.in</p>
        </Card>

        <Card className="text-center p-6 space-y-3 border-amber-500/30">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
            🏢
          </div>
          <h3 className="font-bold text-slate-100">Control Center</h3>
          <p className="text-xs text-slate-400">Main Metro Depot</p>
          <p className="text-slate-300 text-xs font-medium">Gandhi Nagar, Indore, MP</p>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Frequently Asked Questions</h2>
        <div className="grid gap-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-amber-400">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300 leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
