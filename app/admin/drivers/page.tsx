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
  RefreshCw,
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
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Fleet & Drivers
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Website fleet categories, owner-operator profile and dispatch roster
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
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Driver</span>
        </button>
      </div>

      {/* 1. Fleet Vehicle Categories Showcase */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Fleet Vehicle Categories
            </h2>
          </div>
          <span className="text-[11px] font-mono text-zinc-400">
            {FLEET_CLASSES.length} Classes
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {FLEET_CLASSES.map((fleet) => {
            const isSelected = filterType.toLowerCase() === fleet.id.toLowerCase();

            return (
              <div
                key={fleet.id}
                onClick={() => setFilterType(isSelected ? "ALL" : fleet.id)}
                className={`p-3 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-400/[0.05] border-amber-400/40"
                    : "bg-[#121215] border-white/[0.06] hover:border-white/[0.12]"
                }`}
              >
                <div>
                  <div className="w-full h-16 rounded bg-black/40 flex items-center justify-center mb-2 border border-white/[0.04]">
                    <img
                      src={fleet.image}
                      alt={fleet.name}
                      className="h-full w-auto object-contain p-1"
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-zinc-100">{fleet.name}</h3>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">{fleet.description}</p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{fleet.passengers} Pax</span>
                  <span>{fleet.suitcases} Bags</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Drivers Roster */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300">
              Dispatch Roster ({filteredDrivers.length})
            </h2>
            {drivers.length === 1 && (
              <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                Owner-Operated
              </span>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <span className="text-zinc-500 text-[11px] mr-1 flex items-center gap-1 font-mono">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {["ALL", "Saloon", "Estate", "MPV", "Minibus"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                  filterType === t
                    ? "bg-white/[0.08] text-white border border-white/[0.08]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-zinc-400 text-xs font-mono">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400 mx-auto mb-2" />
            Loading driver roster...
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 text-xs rounded-lg bg-[#121215] border border-white/[0.06]">
            <Car className="w-6 h-6 mx-auto text-zinc-600 mb-2" />
            <p>No drivers found matching this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDrivers.map((d) => {
              const vehicleImg = getVehicleImage(d.vehicleType);
              const isOwner =
                d.callsign?.toLowerCase() === "owner" ||
                d.name?.toLowerCase().includes("owner") ||
                d.name?.toLowerCase().includes("admin");

              return (
                <div
                  key={d.id}
                  className="rounded-lg bg-[#121215] border border-white/[0.06] hover:border-white/[0.12] overflow-hidden transition-colors flex flex-col justify-between"
                >
                  <div>
                    {/* Top Image Banner */}
                    <div className="relative h-28 bg-black/40 p-2 flex items-center justify-center border-b border-white/[0.06]">
                      <img
                        src={vehicleImg}
                        alt={d.vehicleType}
                        className="h-full w-auto object-contain"
                      />

                      {/* Callsign Tag */}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-white/[0.08] text-white font-mono text-[10px] font-semibold border border-white/[0.08] flex items-center gap-1">
                        {isOwner && <ShieldCheck className="w-3 h-3 text-amber-400" />}
                        {d.callsign || "CAR"}
                      </span>

                      {/* Status Selector */}
                      <div className="absolute top-2.5 right-2.5">
                        <select
                          value={d.status}
                          onChange={(e) => handleToggleStatus(d, e.target.value)}
                          className="text-[10px] font-mono py-0.5 px-2 rounded bg-black/80 text-zinc-300 border border-white/[0.1] focus:outline-none cursor-pointer"
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="ON_TRIP">On Trip</option>
                          <option value="OFF_DUTY">Off Duty</option>
                        </select>
                      </div>
                    </div>

                    {/* Driver & Vehicle Details */}
                    <div className="p-4 space-y-2.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-semibold text-zinc-100">{d.name}</h3>
                            {isOwner && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                Owner
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {d.vehicleMake || d.vehicleType}
                          </p>
                        </div>

                        {/* Registration Plate */}
                        {d.vehiclePlate && (
                          <div className="px-2 py-0.5 rounded bg-[#f5c518] text-black font-mono font-bold text-[10px] tracking-wider border border-black/20 uppercase shadow-sm">
                            {d.vehiclePlate}
                          </div>
                        )}
                      </div>

                      <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Class:</span>
                        <span className="font-medium text-zinc-200">{d.vehicleType}</span>
                      </div>

                      {/* Contact Actions */}
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <a
                          href={`tel:${d.phone}`}
                          className="py-1.5 px-2 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 flex items-center justify-center gap-1 text-xs font-medium border border-white/[0.06] transition-colors"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${d.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-2 rounded bg-emerald-950/40 hover:bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 flex items-center justify-center gap-1 text-xs font-medium transition-colors"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-2 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-mono">{d._count?.bookings || 0} jobs</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(d)}
                        className="p-1 hover:text-white rounded hover:bg-white/[0.04] transition-colors"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!isOwner && (
                        <button
                          onClick={() => handleDeleteDriver(d)}
                          className="p-1 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
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
              <div className="rounded-lg border border-dashed border-white/[0.1] p-5 flex flex-col items-center justify-center text-center bg-white/[0.01]">
                <div className="w-9 h-9 rounded-md bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-zinc-400 mb-2.5">
                  <Users className="w-4 h-4 text-zinc-400" />
                </div>
                <h4 className="text-xs font-semibold text-zinc-200">Owner-Operated Fleet</h4>
                <p className="text-[11px] text-zinc-400 max-w-xs mt-1 leading-relaxed">
                  Cardiff Taxis is currently operated directly by the owner. When you add team drivers, register them here for multi-driver dispatch.
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
                  className="mt-3 px-3 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-zinc-200 text-xs font-medium inline-flex items-center gap-1.5 border border-white/[0.08] transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3 h-3 text-amber-400" />
                  <span>+ Add Driver</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#121215] border border-white/[0.08] rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between sticky top-0 bg-[#121215] z-10">
              <h3 className="text-sm font-semibold text-zinc-100">
                {editingDriver ? "Edit Driver Profile" : "Register Fleet Driver"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDriver} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. John Smith"
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Callsign</label>
                  <input
                    type="text"
                    value={form.callsign}
                    onChange={(e) => setForm({ ...form, callsign: e.target.value })}
                    placeholder="e.g. Car 01"
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="07..."
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Fleet Category *</label>
                  <select
                    value={form.vehicleType}
                    onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                    className="w-full py-1.5 px-2 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  >
                    <option value="Saloon">Saloon</option>
                    <option value="Estate">Estate</option>
                    <option value="Executive">Executive</option>
                    <option value="MPV">People Carrier MPV</option>
                    <option value="Minibus">8-Seater Minibus</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Vehicle Make & Model</label>
                  <input
                    type="text"
                    value={form.vehicleMake}
                    onChange={(e) => setForm({ ...form, vehicleMake: e.target.value })}
                    placeholder="e.g. Skoda Superb"
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">License Plate</label>
                  <input
                    type="text"
                    value={form.vehiclePlate}
                    onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value.toUpperCase() })}
                    placeholder="e.g. CF23 CTL"
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 font-mono uppercase focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3.5 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs transition-colors cursor-pointer"
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
