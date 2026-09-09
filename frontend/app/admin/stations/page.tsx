"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Check, X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Station } from "@/types";
import { toast } from "sonner";

export default function AdminStationsPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  async function loadStations() {
    const res = await apiFetch<Station[]>("/stations");
    if (res.success && res.data) setStations(res.data);
  }

  useEffect(() => {
    loadStations();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const res = await apiFetch(`/stations/${editingId}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          latitude: parseFloat(lat) || 0,
          longitude: parseFloat(lng) || 0,
          status,
        }),
      });
      if (res.success) {
        toast.success("Station updated successfully!");
        setShowModal(false);
        loadStations();
      } else {
        toast.error(res.error?.message || "Failed to update station");
      }
    } else {
      const res = await apiFetch("/stations", {
        method: "POST",
        body: JSON.stringify({
          name,
          code,
          line_name: "Yellow Line",
          latitude: parseFloat(lat) || 0,
          longitude: parseFloat(lng) || 0,
          status,
        }),
      });
      if (res.success) {
        toast.success("Station created successfully!");
        setShowModal(false);
        loadStations();
      } else {
        toast.error(res.error?.message || "Failed to create station");
      }
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName("");
    setCode("");
    setLat("");
    setLng("");
    setStatus("ACTIVE");
    setShowModal(true);
  };

  const openEditModal = (st: Station) => {
    setEditingId(st.id);
    setName(st.name);
    setCode(st.code);
    setLat(st.latitude ? st.latitude.toString() : "");
    setLng(st.longitude ? st.longitude.toString() : "");
    setStatus(st.status);
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Station Management</h1>
          <p className="text-slate-400 text-sm mt-1">Configure metro stations and operational statuses</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl metro-gradient-bg text-white font-bold text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Station
        </button>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/90 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10">
            <tr>
              <th className="py-4 px-6">Code</th>
              <th className="py-4 px-6">Station Name</th>
              <th className="py-4 px-6">Line</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {stations.map((st) => (
              <tr key={st.id} className="hover:bg-white/5 transition">
                <td className="py-4 px-6 font-mono font-bold text-amber-400">{st.code}</td>
                <td className="py-4 px-6 font-bold text-white">{st.name}</td>
                <td className="py-4 px-6 text-slate-400">{st.line_name}</td>
                <td className="py-4 px-6">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    st.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400"
                  }`}>
                    {st.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => openEditModal(st)}
                    className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-white/10 space-y-4">
            <h3 className="text-xl font-bold text-white">{editingId ? "Edit Station" : "Create New Station"}</h3>
            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Station Code</label>
                <input
                  type="text"
                  required
                  disabled={!!editingId}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="ST17"
                  className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Station Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Khajrana Square"
                  className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="22.75"
                    className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="75.88"
                    className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase block mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="UNDER_CONSTRUCTION">UNDER_CONSTRUCTION</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl metro-gradient-bg text-white font-bold"
                >
                  Save Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
