"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Zap, CheckCircle2, Ticket, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { isAuthenticated, getStoredUser } from "@/lib/auth";
import { saveFormCache, getFormCache, clearFormCache, CACHE_KEYS } from "@/lib/form-cache";

interface RechargeCacheData {
  cardNumber?: string;
  amount?: number;
}

export default function RechargePage() {
  const router = useRouter();
  const cached = getFormCache<RechargeCacheData>(CACHE_KEYS.RECHARGE);

  const [cardNumber, setCardNumber] = useState(cached?.cardNumber || "");
  const [amount, setAmount] = useState(cached?.amount || 500);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);

  useEffect(() => {
    saveFormCache(CACHE_KEYS.RECHARGE, { cardNumber, amount });
  }, [cardNumber, amount]);

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }
    async function loadCardInfo() {
      const res = await apiFetch<any>("/recharge/my-card");
      if (res.success && res.data) {
        if (!cardNumber) {
          setCardNumber(res.data.smart_card_number || "ENG-6264384464");
        }
        setCurrentBalance(res.data.wallet_balance);
      }
    }
    loadCardInfo();
  }, []);

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.trim().length < 6) {
      toast.error("Please enter a valid Metro Smart Card Number");
      return;
    }

    if (!isAuthenticated()) {
      saveFormCache(CACHE_KEYS.RECHARGE, { cardNumber, amount });
      toast.error("Please sign in to recharge your smart card");
      router.push("/login?redirect=/recharge");
      return;
    }

    setLoading(true);

    const res = await apiFetch<any>("/recharge/create-order", {
      method: "POST",
      body: JSON.stringify({
        card_number: cardNumber,
        amount: amount,
      }),
    });

    setLoading(false);

    if (res.success && res.data) {
      toast.success("Recharge order initialized. Redirecting to Razorpay checkout...");
      clearFormCache(CACHE_KEYS.RECHARGE);
      router.push(
        `/payment/${res.data.razorpay_order_id}?type=recharge&card_number=${encodeURIComponent(
          cardNumber
        )}&amount=${amount}`
      );
    } else {
      toast.error(res.message || res.error?.message || "Failed to initialize Razorpay recharge order");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1600px] mx-auto space-y-10">
        
        <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-600" /> Instant Smart Card Top-Up Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Indore Metro Smart Card Recharge</h1>
            <p className="text-slate-600 text-sm mt-2 font-medium">
              Recharge your physical Metro Smart Card or buy a Monthly Unlimited Commuter Pass instantly.
            </p>
          </div>

          {currentBalance !== null && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md text-right shrink-0">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                Current Wallet Balance
              </span>
              <span className="text-2xl font-black text-amber-600">
                ₹{currentBalance.toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl space-y-6 shadow-md">
            <form onSubmit={handleRecharge} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-900 uppercase block mb-1.5">
                  Metro Smart Card Number (ENG-XXXXXXXX)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ENG-6264384464"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 font-mono text-base focus:outline-none focus:border-amber-500 shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 uppercase block mb-2">Select Top-Up Amount</label>
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

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1 font-semibold">
                <div className="flex items-center gap-1.5 font-extrabold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Razorpay Secured Payment Checkout
                </div>
                <p>Top-up amounts are instantly credited to your Smart Card &amp; DB balance upon payment confirmation.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                {loading ? "Initializing Razorpay Order..." : `Proceed to Pay ₹${amount} with Razorpay`}
              </button>
            </form>
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
