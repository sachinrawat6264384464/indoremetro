"use client";

import { useState } from "react";
import { CreditCard, Zap, ShieldCheck, CheckCircle2, Ticket } from "lucide-react";
import { toast } from "sonner";

export default function RechargePage() {
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState(200);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 8) {
      toast.error("Please enter a valid 10-digit Metro Smart Card Number");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success(`Smart Card ${cardNumber} successfully recharged with ₹${amount}!`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-600" /> Instant Smart Card Top-up
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Indore Metro Smart Card Recharge</h1>
          <p className="text-slate-600 text-sm mt-2 font-medium">
            Recharge your physical Metro Smart Card or buy a Monthly Unlimited Commuter Pass instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-md">
            {success ? (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h2 className="text-xl font-bold text-slate-900">Recharge Successful!</h2>
                <p className="text-sm text-slate-700 font-medium">
                  Card <span className="font-mono text-amber-600 font-bold">{cardNumber}</span> has been credited with <strong>₹{amount}</strong>.
                </p>
                <button
                  onClick={() => { setSuccess(false); setCardNumber(""); }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800"
                >
                  Recharge Another Card
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecharge} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase block mb-1.5">
                    Metro Smart Card Number (ENG-XXXXXXXX)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1004829103"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-base focus:outline-none focus:border-amber-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase block mb-2">Select Recharge Amount</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[100, 200, 500, 1000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setAmount(amt)}
                        className={`py-3 rounded-xl text-sm font-extrabold border transition ${
                          amount === amt
                            ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  {loading ? "Processing Recharge..." : `Proceed to Pay ₹${amount}`}
                </button>
              </form>
            )}
          </div>

          {/* Monthly Pass Promo */}
          <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-4 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Monthly Pass Savings</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Get 20% discount on daily travel with the 30-Day Unlimited Commuter Pass.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Standard Fare:</span>
                <span className="line-through text-slate-400 font-bold">₹1,500</span>
              </div>
              <div className="flex justify-between text-amber-600 font-extrabold text-sm">
                <span>Pass Price:</span>
                <span>₹1,200 / Month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

