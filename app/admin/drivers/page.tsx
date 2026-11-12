"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  PlusCircle,
  Phone,
  Mail,
  Car,
  CheckCircle2,
  X,
  Edit2,
  Trash2,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    callsign: "",
    vehicleMake: "",
    vehiclePlate: "",
    vehicleType: "Saloon",
    status: "AVAILABLE",
  });

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/drivers");
      if (res.ok) {
        const json = await res.json();
        setDrivers(json.drivers || []);
      }
    } catch (err) {
      console.error("Failed to load drivers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSaveDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingDriver
        ? `/api/admin/drivers/${editingDriver.id}`
        : "/api/admin/drivers";
      const method = editingDriver ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setShowAddModal(false);
        setEditingDriver(null);
        fetchDrivers();
        setForm({
          name: "",
          phone: "",
          email: "",
          callsign: "",
          vehicleMake: "",
          vehiclePlate: "",
          vehicleType: "Saloon",
          status: "AVAILABLE",
        });
      }
    } catch (err) {
      console.error("Save driver error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (driver: any, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/drivers/${driver.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setDrivers((prev) =>
          prev.map((d) => (d.id === driver.id ? { ...d, status: newStatus } : d))
        );
      }
    } catch (err) {
      console.error("Toggle driver status error:", err);
    }
  };

  const openEdit = (driver: any) => {
    setEditingDriver(driver);
    setForm({
      name: driver.name || "",
      phone: driver.phone || "",
      email: driver.email || "",
      callsign: driver.callsign || "",
      vehicleMake: driver.vehicleMake || "",
      vehiclePlate: driver.vehiclePlate || "",
      vehicleType: driver.vehicleType || "Saloon",
      status: driver.status || "AVAILABLE",
    });
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fleet & Drivers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage authorized fleet drivers, vehicles and availability
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDriver(null);
            setForm({
              name: "",
              phone: "",
              email: "",
              callsign: "",
              vehicleMake: "",
              vehiclePlate: "",
              vehicleType: "Saloon",
              status: "AVAILABLE",
            });
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      {/* Drivers Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <svg className="animate-spin h-6 w-6 text-amber-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Loading fleet roster...
        </div>
      ) : drivers.length === 0 ? (
        <div className="p-16 text-center text-slate-500 rounded-2xl bg-slate-900 border border-slate-800">
          <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <p className="text-sm">No drivers registered yet. Click &quot;Add Driver&quot; above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((d) => (
            <div
              key={d.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition shadow-lg flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                      {d.callsign || "CAR"}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{d.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">{d.callsign || "Driver"}</p>
                    </div>
                  </div>

                  {/* Status Badge Dropdown */}
                  <select
                    value={d.status}
                    onChange={(e) => handleToggleStatus(d, e.target.value)}
                    className={`text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none ${
                      d.status === "AVAILABLE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : d.status === "ON_TRIP"
                        ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="ON_TRIP">ON TRIP</option>
                    <option value="OFF_DUTY">OFF DUTY</option>
                  </select>
                </div>

                {/* Vehicle Details */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Vehicle:</span>
                    <span className="font-medium text-white">{d.vehicleMake || "Not specified"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Plate:</span>
                    <span className="font-mono text-amber-400 font-semibold">{d.vehiclePlate || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="font-medium text-white">{d.vehicleType}</span>
                  </div>
                </div>

                {/* Contact Links */}
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <a
                    href={`tel:${d.phone}`}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-1.5 font-medium transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${d.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 flex items-center justify-center gap-1.5 font-medium transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>{d._count?.bookings || 0} total jobs</span>
                <button
                  onClick={() => openEdit(d)}
                  className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title="Edit Driver"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editingDriver ? "Edit Fleet Driver" : "Register New Fleet Driver"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDriver} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Tariq Hussain"
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Callsign</label>
                  <input
                    type="text"
                    value={form.callsign}
                    onChange={(e) => setForm({ ...form, callsign: e.target.value })}
                    placeholder="e.g. Car 01 / D-01"
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="07..."
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Category</label>
                  <select
                    value={form.vehicleType}
                    onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Saloon">Saloon</option>
                    <option value="Estate">Estate</option>
                    <option value="MPV">6-Seater MPV</option>
                    <option value="Minibus">8-Seater Minibus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Make & Model</label>
                  <input
                    type="text"
                    value={form.vehicleMake}
                    onChange={(e) => setForm({ ...form, vehicleMake: e.target.value })}
                    placeholder="e.g. Skoda Superb"
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle Plate (Reg)</label>
                  <input
                    type="text"
                    value={form.vehiclePlate}
                    onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value })}
                    placeholder="e.g. CF23 TQX"
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
