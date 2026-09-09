"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Ticket, Users, Calendar, Plus, Trash2, ShieldCheck, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-10">
      <div className="w-full max-w-[1600px] mx-auto space-y-8">
        
        <div className="border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold mb-2">
            <Ticket className="w-3.5 h-3.5 text-amber-600" /> Digital QR Pass Booking
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Book Digital Metro Ticket</h1>
          <p className="text-slate-600 text-sm mt-1 font-medium">Select travel itinerary and passenger details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
            <form onSubmit={handleBookSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase block mb-1.5">Source Station</label>
                  <select
                    value={sourceId}
                    onChange={(e) => setSourceId(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 text-sm font-semibold shadow-sm"
                  >
                    {stations.map((st) => (
                      <option key={st.id} value={st.id}>{st.name} ({st.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 uppercase block mb-1.5">Destination Station</label>
                  <select
                    value={destId}
                    onChange={(e) => setDestId(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 text-sm font-semibold shadow-sm"
                  >
                    {stations.map((st) => (
                      <option key={st.id} value={st.id}>{st.name} ({st.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 uppercase block mb-1.5">Journey Date</label>
                <input
                  type="date"
                  required
                  value={journeyDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 text-sm font-semibold shadow-sm"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600" /> Passenger Details ({passengers.length})
                  </label>
                  {passengers.length < 10 && (
                    <button
                      type="button"
                      onClick={addPassenger}
                      className="text-xs font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Passenger
                    </button>
                  )}
                </div>

                {passengers.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-6">#{idx + 1}</span>
                    <input
                      type="text"
                      required
                      placeholder="Passenger Name"
                      value={p.passenger_name}
                      onChange={(e) => handlePassengerNameChange(idx, e.target.value)}
                      className="flex-1 h-11 px-4 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-500 text-sm font-medium shadow-sm"
                    />
                    {passengers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePassenger(idx)}
                        className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
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
                className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition disabled:opacity-50"
              >
                {loading ? "Initializing Razorpay..." : "Proceed to Payment Checkout"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 border-b border-slate-200 pb-3">Fare Summary</h3>
              {farePreview ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Base Fare / Person:</span>
                    <span className="font-bold text-slate-900">₹{farePreview.base_fare_per_passenger}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Passengers:</span>
                    <span className="font-bold text-slate-900">{farePreview.passenger_count}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-medium">
                    <span>Intermediate Stops:</span>
                    <span className="font-bold text-slate-900">{farePreview.stop_count} stops</span>
                  </div>
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-lg font-extrabold">
                    <span className="text-slate-900">Total Amount:</span>
                    <span className="text-2xl font-black text-amber-600">₹{farePreview.total_fare}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 font-medium">Select stations to view fare details.</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Server Verified Ticketing
              </div>
              <p>Your ticket will be immediately issued with an HMAC-signed digital QR code upon payment completion.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookTicketPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-500 font-medium">Loading booking checkout...</div>}>
      <BookTicketForm />
    </Suspense>
  );
}
