"use client";

import React, { useState, useEffect } from "react";
import { Station, FareCalculation } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { StationSelect } from "@/components/ui/station-select";
import { saveFormCache, getFormCache, CACHE_KEYS } from "@/lib/form-cache";

interface FareCalculatorCacheData {
  sourceId?: string;
  destId?: string;
  passengerCount?: number;
}

export function FareCalculator() {
  const [stations, setStations] = useState<Station[]>([]);
  const cached = getFormCache<FareCalculatorCacheData>(CACHE_KEYS.FARE_CALCULATOR);

  const [sourceId, setSourceId] = useState(cached?.sourceId || "");
  const [destId, setDestId] = useState(cached?.destId || "");
  const [passengerCount, setPassengerCount] = useState(cached?.passengerCount || 1);
  const [fareResult, setFareResult] = useState<FareCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStations() {
      const res = await apiFetch<Station[]>("/stations");
      if (res.success && res.data && res.data.length > 0) {
        setStations(res.data);
        if (!sourceId || !destId) {
          const first = res.data[0].id;
          const last = res.data[res.data.length - 1].id;
          if (!sourceId) setSourceId(first);
          if (!destId) setDestId(first !== last ? last : (res.data[1]?.id || first));
        }
      }
    }
    loadStations();
  }, []);

  // Save to cache as inputs change
  useEffect(() => {
    if (sourceId || destId || passengerCount) {
      saveFormCache(CACHE_KEYS.FARE_CALCULATOR, {
        sourceId,
        destId,
        passengerCount,
      });
    }
  }, [sourceId, destId, passengerCount]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !destId) {
      setError("Please select source and destination stations");
      return;
    }
    if (sourceId === destId) {
      setError("From Station and To Station must be different");
      return;
    }

    setError("");
    setLoading(true);

    const res = await apiFetch<FareCalculation>("/fares/calculate", {
      method: "POST",
      body: JSON.stringify({
        source_station_id: sourceId,
        dest_station_id: destId,
        passenger_count: passengerCount,
      }),
    });

    setLoading(false);
    if (res.success && res.data) {
      setFareResult(res.data);
    } else {
      setError(res.message || res.error?.message || "Failed to calculate fare");
    }
  };

  return (
    <Card className="max-w-xl mx-auto border border-slate-200 shadow-xl bg-white rounded-3xl p-6">
      <CardHeader>
        <CardTitle className="text-center text-slate-900 font-black text-2xl">
          Metro Fare Estimator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCalculate} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Source Station
            </label>
            <StationSelect
              stations={stations}
              value={sourceId}
              onChange={setSourceId}
              iconColor="text-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Destination Station
            </label>
            <StationSelect
              stations={stations}
              value={destId}
              onChange={setDestId}
              iconColor="text-rose-600"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
              Number of Passengers
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={passengerCount}
              onChange={(e) => setPassengerCount(parseInt(e.target.value) || 1)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-slate-900 text-sm font-extrabold focus:border-amber-500 focus:outline-none shadow-sm"
            />
          </div>

          {error && <p className="text-xs text-rose-600 text-center font-bold">{error}</p>}

          <Button type="submit" isLoading={loading} className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl">
            Calculate Fare
          </Button>
        </form>

        {fareResult && (
          <div className="mt-6 p-5 rounded-2xl bg-amber-50 border border-amber-300 text-center space-y-1">
            <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">Estimated Total Fare</h4>
            <div className="text-3xl font-black text-amber-600">
              {formatCurrency(fareResult.total_fare)}
            </div>
            <p className="text-xs font-bold text-slate-600">
              {fareResult.stop_count} stops • {formatCurrency(fareResult.base_fare_per_passenger)} / passenger
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
