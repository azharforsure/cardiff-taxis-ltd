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
  Luggage,
  User,
  Filter,
} from "lucide-react";
import { FLEET_CLASSES, getVehicleImage } from "@/lib/fleet-data";

export default function AdminDriversPage() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("ALL");

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

  const handleDeleteDriver = async (driver: any) => {
    if (!confirm(`Are you sure you want to remove driver ${driver.name}?`)) return;
    try {
      const res = await fetch(`/api/admin/drivers/${driver.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchDrivers();
      }
    } catch (err) {
      console.error("Delete driver error:", err);
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

  const filteredDrivers = drivers.filter((d) => {
    if (filterType === "ALL") return true;
    return d.vehicleType?.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="space-y-8">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fleet & Drivers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official vehicle fleet categories, owner-operator profile, and dispatch roster
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDriver(null);
            setForm({
              name: "",
              phone: "",
              email: "",
              callsign: `Car 0${drivers.length + 1}`,
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

      {/* 1. Official Fleet Categories Showcase (from Website) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Official Website Fleet Classes
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {FLEET_CLASSES.length} Vehicle Categories
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {FLEET_CLASSES.map((fleet) => {
            const driverCount = drivers.filter(
              (d) => d.vehicleType?.toLowerCase() === fleet.id.toLowerCase()
            ).length;
            const isSelected = filterType.toLowerCase() === fleet.id.toLowerCase();

            return (
              <div
                key={fleet.id}
                onClick={() => setFilterType(isSelected ? "ALL" : fleet.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/30"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  {/* Vehicle Image */}
                  <div className="w-full h-20 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center mb-2.5 border border-slate-800">
                    <img
                      src={fleet.image}
                      alt={fleet.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  <h3 className="font-bold text-white text-xs leading-tight">
                    {fleet.name}
                  </h3>

                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      {fleet.passengers}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Luggage className="w-3 h-3 text-slate-500" />
                      {fleet.suitcases}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Drivers:</span>
                  <span className={`font-bold ${driverCount > 0 ? "text-emerald-400" : "text-slate-500"}`}>
                    {driverCount} active
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Fleet Drivers Roster with Vehicle Photos */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Fleet Drivers Roster ({filteredDrivers.length})
              {drivers.length === 1 && (
                <span className="ml-2 text-xs font-normal text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  Owner-Operated
                </span>
              )}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {["ALL", "Saloon", "Estate", "MPV", "Minibus"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                  filterType === t
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <svg className="animate-spin h-6 w-6 text-amber-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Loading fleet roster...
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="p-16 text-center text-slate-500 rounded-2xl bg-slate-900 border border-slate-800">
            <Car className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm">No drivers found matching this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDrivers.map((d) => {
              const vehicleImg = getVehicleImage(d.vehicleType);
              const isOwner =
                d.callsign?.toLowerCase() === "owner" ||
                d.name?.toLowerCase().includes("owner") ||
                d.name?.toLowerCase().includes("qasim");

              return (
                <div
                  key={d.id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div>
                    {/* Top Image Banner */}
                    <div className="relative h-36 bg-gradient-to-b from-slate-950 to-slate-900/60 p-3 flex items-center justify-center border-b border-slate-800/80">
                      <img
                        src={vehicleImg}
                        alt={d.vehicleType}
                        className="h-full w-auto object-contain drop-shadow-lg"
                      />

                      {/* Callsign Pill */}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs shadow-md flex items-center gap-1">
                        {isOwner && <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />}
                        {isOwner ? "OWNER" : d.callsign || "CAR"}
                      </span>

                      {/* Status Selector */}
                      <div className="absolute top-3 right-3">
                        <select
                          value={d.status}
                          onChange={(e) => handleToggleStatus(d, e.target.value)}
                          className={`text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none cursor-pointer ${
                            d.status === "AVAILABLE"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : d.status === "ON_TRIP"
                              ? "bg-sky-500/20 text-sky-400 border-sky-500/30"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          <option value="AVAILABLE">🟢 AVAILABLE</option>
                          <option value="ON_TRIP">🔵 ON TRIP</option>
                          <option value="OFF_DUTY">⚪ OFF DUTY</option>
                        </select>
                      </div>
                    </div>

                    {/* Driver & Vehicle Details */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">{d.name}</h3>
                            {isOwner && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                Owner
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{d.vehicleMake || d.vehicleType}</p>
                        </div>

                        {/* UK Style Yellow Registration Plate */}
                        {d.vehiclePlate && (
                          <div className="px-2.5 py-1 rounded bg-[#ffdb00] text-black font-mono font-black text-xs tracking-wider border border-black/30 shadow-sm uppercase">
                            {d.vehiclePlate}
                          </div>
                        )}
                      </div>

                      {/* Vehicle Spec Badges */}
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                        <span className="text-slate-400">Class:</span>
                        <span className="font-semibold text-white">{d.vehicleType}</span>
                      </div>

                      {/* Quick Contact Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={`tel:${d.phone}`}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center gap-1.5 text-xs font-semibold transition"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          {isOwner ? "Call Owner" : "Call Driver"}
                        </a>
                        <a
                          href={`https://wa.me/${d.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 flex items-center justify-center gap-1.5 text-xs font-semibold transition"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
                    <span>{d._count?.bookings || 0} jobs completed</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(d)}
                        className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition"
                        title="Edit Driver & Vehicle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!isOwner && (
                        <button
                          onClick={() => handleDeleteDriver(d)}
                          className="p-1.5 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                          title="Delete Driver"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Additional Drivers Prompt Card */}
            {drivers.length <= 1 && filterType === "ALL" && (
              <div className="rounded-2xl border-2 border-dashed border-slate-800 p-6 flex flex-col items-center justify-center text-center bg-slate-900/30 hover:border-slate-700 transition">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Owner-Operated Business</h4>
                <p className="text-xs text-slate-400 max-w-xs mt-1.5 leading-relaxed">
                  Cardiff Taxis is currently operated directly by the owner. When you recruit new team drivers or contractors, register them here to enable multi-driver dispatch.
                </p>
                <button
                  onClick={() => {
                    setEditingDriver(null);
                    setForm({
                      name: "",
                      phone: "",
                      email: "",
                      callsign: `Car 0${drivers.length + 1}`,
                      vehicleMake: "",
                      vehiclePlate: "",
                      vehicleType: "Saloon",
                      status: "AVAILABLE",
                    });
                    setShowAddModal(true);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                  + Add Driver
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <h3 className="text-base font-bold text-white">
                {editingDriver ? "Edit Driver & Assigned Vehicle" : "Register Fleet Driver & Vehicle"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDriver} className="p-6 space-y-4">
              {/* Selected Vehicle Class Preview */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-4">
                <img
                  src={getVehicleImage(form.vehicleType)}
                  alt={form.vehicleType}
                  className="h-14 w-auto object-contain"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400">Selected Fleet Class</span>
                  <p className="text-xs font-bold text-white">{form.vehicleType}</p>
                </div>
              </div>

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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fleet Category *</label>
                  <select
                    value={form.vehicleType}
                    onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Saloon">Saloon (4 Pax, 2 Bags)</option>
                    <option value="Estate">Estate (4 Pax, 3 Bags)</option>
                    <option value="Executive">Executive (4 Pax, 2 Bags)</option>
                    <option value="MPV">People Carrier MPV (6 Pax, 4 Bags)</option>
                    <option value="Minibus">8-Seater Minibus (8 Pax, 7 Bags)</option>
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
                    placeholder="e.g. Skoda Superb (2023)"
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">UK License Plate (Reg)</label>
                  <input
                    type="text"
                    value={form.vehiclePlate}
                    onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value.toUpperCase() })}
                    placeholder="e.g. CF23 TQX"
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono uppercase focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
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
