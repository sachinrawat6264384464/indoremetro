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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
          <Zap className="w-3.5 h-3.5" /> Instant Smart Card Top-up
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Indore Metro Smart Card Recharge</h1>
        <p className="text-slate-400 text-sm mt-2">
          Recharge your physical Metro Smart Card or buy a Monthly Unlimited Commuter Pass instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h2 className="text-xl font-bold text-white">Recharge Successful!</h2>
              <p className="text-sm text-slate-300">
                Card <span className="font-mono text-amber-400">{cardNumber}</span> has been credited with <strong>₹{amount}</strong>.
              </p>
              <button
                onClick={() => { setSuccess(false); setCardNumber(""); }}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
              >
                Recharge Another Card
              </button>
            </div>
          ) : (
            <form onSubmit={handleRecharge} className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1.5">
                  Metro Smart Card Number (ENG-XXXXXXXX)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1004829103"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-base focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-2">Select Recharge Amount</label>
                <div className="grid grid-cols-4 gap-3">
                  {[100, 200, 500, 1000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className={`py-3 rounded-xl text-sm font-bold border transition ${
                        amount === amt
                          ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                          : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600"
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
                className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                {loading ? "Processing Recharge..." : `Proceed to Pay ₹${amount}`}
              </button>
            </form>
          )}
        </div>

        {/* Monthly Pass Promo */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Monthly Pass Savings</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Get 20% discount on daily travel with the 30-Day Unlimited Commuter Pass.
          </p>
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Standard Fare:</span>
              <span className="line-through text-slate-500">₹1,500</span>
            </div>
            <div className="flex justify-between text-amber-400 font-bold text-sm">
              <span>Pass Price:</span>
              <span>₹1,200 / Month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
