"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Ticket, Users, Calendar, Plus, Trash2, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { isAuthenticated, getStoredUser } from "@/lib/auth";
import { Station, FareCalculation } from "@/types";
import { toast } from "sonner";

function BookTicketForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stations, setStations] = useState<Station[]>([]);
  const [sourceId, setSourceId] = useState(searchParams.get("source") || "");
  const [destId, setDestId] = useState(searchParams.get("dest") || "");
  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split("T")[0]);
  const [passengers, setPassengers] = useState([{ passenger_name: "", passenger_type: "ADULT" }]);
  const [farePreview, setFarePreview] = useState<FareCalculation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      toast.error("Please sign in to book tickets");
      router.push("/login");
      return;
    }

    const user = getStoredUser();
    if (user && passengers.length === 1 && !passengers[0].passenger_name) {
      setPassengers([{ passenger_name: user.name, passenger_type: "ADULT" }]);
    }

    async function loadStations() {
      const res = await apiFetch<Station[]>("/stations");
      if (res.success && res.data) {
        setStations(res.data);
        if (!sourceId && res.data.length >= 2) {
          setSourceId(res.data[0].id);
          setDestId(res.data[12]?.id || res.data[1].id);
        }
      }
    }
    loadStations();
  }, []);

  useEffect(() => {
    async function updateFare() {
      if (sourceId && destId && sourceId !== destId) {
        const res = await apiFetch<FareCalculation>("/fares/calculate", {
          method: "POST",
          body: JSON.stringify({
            source_station_id: sourceId,
            dest_station_id: destId,
            passenger_count: passengers.length,
          }),
        });
        if (res.success && res.data) setFarePreview(res.data);
      }
    }
    updateFare();
  }, [sourceId, destId, passengers.length]);

  const addPassenger = () => {
    if (passengers.length < 10) {
      setPassengers([...passengers, { passenger_name: "", passenger_type: "ADULT" }]);
    }
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const handlePassengerNameChange = (index: number, name: string) => {
    const updated = [...passengers];
    updated[index].passenger_name = name;
    setPassengers(updated);
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceId === destId) {
      toast.error("Source and Destination stations cannot be identical");
      return;
    }

    for (const p of passengers) {
      if (!p.passenger_name.trim()) {
        toast.error("Please enter names for all passengers");
        return;
      }
    }

    setLoading(true);
    const ticketRes = await apiFetch("/tickets/book", {
      method: "POST",
      body: JSON.stringify({
        source_station_id: sourceId,
        dest_station_id: destId,
        journey_date: journeyDate,
        passengers: passengers,
      }),
    });

    if (!ticketRes.success || !ticketRes.data) {
      setLoading(false);
      toast.error(ticketRes.error?.message || "Failed to create ticket booking");
      return;
    }

    const ticketId = ticketRes.data.ticket_id;

    const payRes = await apiFetch("/payments/create-order", {
      method: "POST",
      body: JSON.stringify({ ticket_id: ticketId }),
    });

    setLoading(false);

    if (payRes.success && payRes.data) {
      toast.success("Ticket order created. Redirecting to payment...");
      router.push(`/payment/${payRes.data.razorpay_order_id}?ticket_id=${ticketId}&amount=${payRes.data.amount}`);
    } else {
      toast.error(payRes.error?.message || "Failed to initialize payment gateway");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Book Digital Metro Ticket</h1>
        <p className="text-slate-400 text-sm">Select travel itinerary and passenger details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <form onSubmit={handleBookSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1.5">Source Station</label>
                <select
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm font-medium"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>{st.name} ({st.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1.5">Destination Station</label>
                <select
                  value={destId}
                  onChange={(e) => setDestId(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm font-medium"
                >
                  {stations.map((st) => (
                    <option key={st.id} value={st.id}>{st.name} ({st.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase block mb-1.5">Journey Date</label>
              <input
                type="date"
                required
                value={journeyDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full h-12 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm font-medium"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-400" /> Passenger Details ({passengers.length})
                </label>
                {passengers.length < 10 && (
                  <button
                    type="button"
                    onClick={addPassenger}
                    className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Passenger
                  </button>
                )}
              </div>

              {passengers.map((p, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 w-6">#{idx + 1}</span>
                  <input
                    type="text"
                    required
                    placeholder="Passenger Name"
                    value={p.passenger_name}
                    onChange={(e) => handlePassengerNameChange(idx, e.target.value)}
                    className="flex-1 h-11 px-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white focus:outline-none focus:border-teal-500 text-sm"
                  />
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePassenger(idx)}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl metro-gradient-bg text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-teal-500/20 transition disabled:opacity-50"
            >
              {loading ? "Initializing Razorpay..." : "Proceed to Payment Checkout"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/10 pb-3">Fare Summary</h3>
            {farePreview ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Base Fare / Person:</span>
                  <span className="font-semibold text-white">₹{farePreview.base_fare_per_passenger}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Passengers:</span>
                  <span className="font-semibold text-white">{farePreview.passenger_count}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Intermediate Stops:</span>
                  <span className="font-semibold text-white">{farePreview.stop_count} stops</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-lg font-bold">
                  <span className="text-white">Total Amount:</span>
                  <span className="text-2xl text-teal-400">₹{farePreview.total_fare}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select stations to view fare details.</p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-teal-300 font-semibold">
              <ShieldCheck className="w-4 h-4" /> 100% Server Verified Ticketing
            </div>
            <p>Your ticket will be immediately issued with an HMAC-signed digital QR code upon payment completion.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookTicketPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading booking checkout...</div>}>
      <BookTicketForm />
    </Suspense>
  );
}
