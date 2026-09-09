"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { CreditCard, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

function PaymentContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const razorpayOrderId = params.orderId as string;
  const ticketId = searchParams.get("ticket_id");

  const [loading, setLoading] = useState(false);

  const handleSimulatePaymentSuccess = async () => {
    if (!ticketId || !razorpayOrderId) return;

    setLoading(true);

    const paymentId = `pay_${Math.random().toString(36).substr(2, 9)}`;
    const signature = `sig_simulated_${Math.random().toString(36).substr(2, 14)}`;

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
      toast.success("Payment verified! Digital QR Ticket generated.");
      router.push(`/ticket/${ticketId}`);
    } else {
      toast.error(res.error?.message || "Payment verification failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-3xl bg-teal-500/10 border border-teal-500/30 mx-auto flex items-center justify-center text-teal-400">
          <CreditCard className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">Razorpay Secure Checkout</h1>
          <p className="text-xs text-slate-400 mt-1">Order ID: {razorpayOrderId}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 text-left text-sm space-y-2">
          <div className="flex justify-between text-slate-300">
            <span>Payment Provider:</span>
            <span className="font-semibold text-white">Razorpay India</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Server Verification:</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Enabled (HMAC)
            </span>
          </div>
        </div>

        <button
          onClick={handleSimulatePaymentSuccess}
          disabled={loading}
          className="w-full h-12 rounded-xl metro-gradient-bg text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-teal-500/25 disabled:opacity-50"
        >
          {loading ? "Verifying Signature Server-Side..." : "Simulate Successful Razorpay Payment"}
        </button>

        <p className="text-xs text-slate-500">
          Payment state transitions will be verified server-side before confirming ticket status.
        </p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading payment checkout...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
