"use client";

import React, { useState, useEffect } from "react";
import { Station, FareCalculation } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export function FareCalculator() {
  const [stations, setStations] = useState<Station[]>([]);
  const [sourceId, setSourceId] = useState("");
  const [destId, setDestId] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [fareResult, setFareResult] = useState<FareCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStations() {
      const res = await apiFetch<Station[]>("/stations");
      if (res.success && res.data) {
        setStations(res.data);
        if (res.data.length >= 2) {
          setSourceId(res.data[0].id);
          setDestId(res.data[1].id);
        }
      }
    }
    loadStations();
  }, []);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceId === destId) {
      setError("Source and destination stations must be different");
      return;
    }

    setError("");
    setLoading(true);

    const res = await apiFetch<FareCalculation>(
      `/fare/calculate?source_station_id=${sourceId}&dest_station_id=${destId}&passenger_count=${passengerCount}`
    );

    setLoading(false);
    if (res.success && res.data) {
      setFareResult(res.data);
    } else {
      setError(res.message || "Failed to calculate fare");
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-amber-400">
          Metro Fare Estimator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Source Station
            </label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Destination Station
            </label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Number of Passengers
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={passengerCount}
              onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-400 text-center font-medium">{error}</p>}

          <Button type="submit" isLoading={loading} className="w-full">
            Calculate Fare
          </Button>
        </form>

        {fareResult && (
          <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center space-y-2">
            <h4 className="text-sm font-semibold text-slate-300">Estimated Fare</h4>
            <div className="text-3xl font-extrabold text-amber-400">
              {formatCurrency(fareResult.total_fare)}
            </div>
            <p className="text-xs text-slate-400">
              {fareResult.stop_count} stops • {formatCurrency(fareResult.base_fare_per_passenger)} / passenger
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
