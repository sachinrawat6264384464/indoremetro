"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

interface TimetableSlot {
  id: string;
  route_id: string;
  train_number: string;
  departure_time: string;
  arrival_time: string;
  frequency_mins: number;
  is_active: boolean;
}

export default function AdminTimetablePage() {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimetable() {
      const res = await apiFetch<TimetableSlot[]>("/timetable");
      if (res.success && res.data) {
        setSlots(res.data);
      } else {
        // Mock default slots if backend endpoint empty
        setSlots([
          { id: "1", route_id: "YL-UP", train_number: "IND-101", departure_time: "06:00 AM", arrival_time: "06:45 AM", frequency_mins: 10, is_active: true },
          { id: "2", route_id: "YL-UP", train_number: "IND-102", departure_time: "06:10 AM", arrival_time: "06:55 AM", frequency_mins: 10, is_active: true },
          { id: "3", route_id: "YL-DOWN", train_number: "IND-201", departure_time: "06:05 AM", arrival_time: "06:50 AM", frequency_mins: 10, is_active: true },
        ]);
      }
      setLoading(false);
    }
    loadTimetable();
  }, []);

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Timetable & Schedule Management"
        subtitle="Configure train departure frequency and active running slots."
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Metro Running Slots</CardTitle>
          <span className="text-xs text-amber-400 font-mono font-semibold">Total: {slots.length} Trains</span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-slate-400 py-8">Loading timetable schedules...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Train No.</th>
                    <th className="py-3 px-4">Route ID</th>
                    <th className="py-3 px-4">Departure</th>
                    <th className="py-3 px-4">Arrival</th>
                    <th className="py-3 px-4">Frequency</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {slots.map((slot) => (
                    <tr key={slot.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-semibold text-amber-400">{slot.train_number}</td>
                      <td className="py-3 px-4 font-medium">{slot.route_id}</td>
                      <td className="py-3 px-4 text-slate-200">{slot.departure_time}</td>
                      <td className="py-3 px-4 text-slate-200">{slot.arrival_time}</td>
                      <td className="py-3 px-4">{slot.frequency_mins} mins</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant={slot.is_active ? "success" : "danger"}>
                          {slot.is_active ? "Running" : "Suspended"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
