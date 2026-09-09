"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Script from "next/script";
import { CreditCard, ShieldCheck, Zap, Lock } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

function PaymentContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const razorpayOrderId = params.orderId as string;
  const ticketId = searchParams.get("ticket_id");
  const amountParam = searchParams.get("amount");

  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TZqBOCPsZMvWzA";

  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setScriptLoaded(true);
    }
  }, []);

  const handleRazorpayPayment = () => {
    if (!ticketId || !razorpayOrderId) {
      toast.error("Invalid payment session data");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Razorpay SDK is loading, please try again in a moment");
      return;
    }

    setLoading(true);

    const amountInPaise = amountParam ? Math.round(parseFloat(amountParam) * 100) : 5000;

    const options = {
      key: keyId,
      amount: amountInPaise,
      currency: "INR",
      name: "Indore Metro Rail",
      description: `E-Ticket Payment (${razorpayOrderId})`,
      order_id: razorpayOrderId,
      handler: async function (response: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) {
        try {
          const res = await apiFetch("/payments/verify", {
            method: "POST",
            body: JSON.stringify({
              ticket_id: ticketId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          setLoading(false);

          if (res.success && res.data) {
            toast.success("Payment verified! Digital QR Ticket generated.");
            router.push(`/ticket/${ticketId}`);
          } else {
            toast.error(res.message || res.error?.message || "Payment verification failed");
          }
        } catch (err: any) {
          setLoading(false);
          toast.error("Server error during payment verification");
        }
      },
      prefill: {
        name: "Passenger",
        email: "passenger@indoremetro.gov.in",
        contact: "9876543210",
      },
      notes: {
        ticket_id: ticketId,
      },
      theme: {
        color: "#F59E0B",
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          toast.info("Payment window closed");
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      setLoading(false);
      toast.error("Failed to launch Razorpay Modal");
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    if (!ticketId || !razorpayOrderId) return;

    setLoading(true);

    const paymentId = `pay_sim_${Math.random().toString(36).substring(2, 9)}`;
    const signature = `sig_simulated_${Math.random().toString(36).substring(2, 14)}`;

    const res = await apiFetch("/payments/verify", {
      method: "POST",
      body: JSON.stringify({
        ticket_id: ticketId,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    });

    setLoading(false);

    if (res.success && res.data) {
      toast.success("Simulated Payment verified! Digital QR Ticket generated.");
      router.push(`/ticket/${ticketId}`);
    } else {
      toast.error(res.message || res.error?.message || "Payment verification failed");
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
            <CreditCard className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white">Razorpay Secure Checkout</h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">Order ID: {razorpayOrderId}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-left text-sm space-y-3">
            <div className="flex justify-between text-slate-300">
              <span>Merchant:</span>
              <span className="font-semibold text-white">Indore Metro Rail</span>
            </div>
            {amountParam && (
              <div className="flex justify-between text-slate-300">
                <span>Amount Payable:</span>
                <span className="font-bold text-amber-400 text-lg">
                  {formatCurrency(parseFloat(amountParam))}
                </span>
              </div>
            )}
            <div className="flex justify-between text-slate-300 pt-2 border-t border-slate-800">
              <span>Razorpay Key:</span>
              <span className="font-mono text-xs text-amber-400">{keyId}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Server Verification:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Enabled (HMAC-SHA256)
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRazorpayPayment}
              disabled={loading}
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {loading ? "Processing Payment..." : "Pay with Razorpay (Cards, UPI, NetBanking)"}
            </button>

            <button
              onClick={handleSimulatePaymentSuccess}
              disabled={loading}
              className="w-full h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition border border-slate-700 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Simulate Test Payment (Dev Mode)
            </button>
          </div>

          <p className="text-[11px] text-slate-500">
            Powered by Razorpay Payments • 256-bit SSL Encryption
          </p>
        </div>
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading payment checkout...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
