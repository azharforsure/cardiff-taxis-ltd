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
      console.error("Status update error:", err);
    }
  };

  const handleDeleteDriver = async (driver: any) => {
    if (!confirm(`Remove driver "${driver.name}" from the fleet?`)) return;
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
      name: driver.name,
      phone: driver.phone,
      email: driver.email || "",
      callsign: driver.callsign || "",
      vehicleMake: driver.vehicleMake || "",
      vehiclePlate: driver.vehiclePlate || "",
      vehicleType: driver.vehicleType,
      status: driver.status,
    });
    setShowAddModal(true);
  };

  const filteredDrivers =
    filterType === "ALL"
      ? drivers
      : drivers.filter(
          (d) => d.vehicleType.toLowerCase() === filterType.toLowerCase()
        );

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Fleet
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage authorized vehicles, driver profiles, and live availability
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
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm shadow-2xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Driver</span>
        </button>
      </div>

      {/* 1. Fleet Vehicle Categories Showcase with Minimal Border Radius */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Vehicle Categories
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {FLEET_CLASSES.length} Active Classes
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {FLEET_CLASSES.map((fleet) => {
            const isSelected =
              filterType.toLowerCase() === fleet.id.toLowerCase();

            return (
              <div
                key={fleet.id}
                onClick={() => setFilterType(isSelected ? "ALL" : fleet.id)}
                className={`p-3.5 rounded-md border transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-50 border-amber-300 shadow-2xs"
                    : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                }`}
              >
                <div>
                  <div className="w-full h-18 rounded-md bg-slate-50 flex items-center justify-center mb-2.5 border border-slate-100">
                    <img
                      src={fleet.image}
                      alt={fleet.name}
                      className="h-full w-auto object-contain p-1"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{fleet.name}</h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {fleet.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-600">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-600" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Dispatch Roster ({filteredDrivers.length})
            </h2>
            {drivers.length === 1 && (
              <span className="text-xs font-mono text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
                Owner-Operated
              </span>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-sm">
            <span className="text-slate-500 text-xs mr-1 flex items-center gap-1 font-mono">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {["ALL", "Saloon", "Estate", "MPV", "Minibus"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  filterType === t
                    ? "bg-slate-900 text-white shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm font-mono">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-500 mx-auto mb-2" />
            Loading driver roster...
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-sm rounded-md bg-white border border-slate-200/90 shadow-2xs">
            <Car className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p>No drivers found matching this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDrivers.map((d) => {
              const vehicleImg = getVehicleImage(d.vehicleType);
              const isOwner =
                d.callsign?.toLowerCase() === "owner" ||
                d.name?.toLowerCase().includes("owner") ||
                d.name?.toLowerCase().includes("admin");

              return (
                <div
                  key={d.id}
                  className="rounded-md bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 overflow-hidden transition-colors flex flex-col justify-between"
                >
                  <div>
                    {/* Top Image Banner */}
                    <div className="relative h-32 bg-slate-50 p-2.5 flex items-center justify-center border-b border-slate-100">
                      <img
                        src={vehicleImg}
                        alt={d.vehicleType}
                        className="h-full w-auto object-contain"
                      />

                      {/* Callsign Tag */}
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono text-xs font-semibold flex items-center gap-1 shadow-2xs">
                        {isOwner && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
                        {d.callsign || "CAR"}
                      </span>

                      {/* Status Selector */}
                      <div className="absolute top-2.5 right-2.5">
                        <select
                          value={d.status}
                          onChange={(e) => handleToggleStatus(d, e.target.value)}
                          className="text-xs font-medium py-1 px-2.5 rounded-md bg-white text-slate-800 border border-slate-200 shadow-2xs focus:outline-none cursor-pointer"
                        >
                          <option value="AVAILABLE">Available</option>
                          <option value="ON_TRIP">On Trip</option>
                          <option value="OFF_DUTY">Off Duty</option>
                        </select>
                      </div>
                    </div>

                    {/* Driver & Vehicle Details */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">
                              {d.name}
                            </h3>
                            {isOwner && (
                              <span className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
                                Owner
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {d.vehicleMake || d.vehicleType}
                          </p>
                        </div>

                        {/* Registration Plate */}
                        {d.vehiclePlate && (
                          <div className="px-2.5 py-1 rounded bg-[#f5c518] text-black font-mono font-bold text-xs tracking-wider border border-black/20 uppercase shadow-2xs">
                            {d.vehiclePlate}
                          </div>
                        )}
                      </div>

                      <div className="p-3 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span>Vehicle Class:</span>
                        <span className="font-semibold text-slate-900">
                          {d.vehicleType}
                        </span>
                      </div>

                      {/* Contact Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={`tel:${d.phone}`}
                          className="py-2 px-3 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-800 flex items-center justify-center gap-1.5 text-xs font-semibold border border-slate-200 transition-colors shadow-2xs"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${d.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors shadow-2xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono">{d._count?.bookings || 0} jobs</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(d)}
                        className="p-1.5 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Edit Profile"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {!isOwner && (
                        <button
                          onClick={() => handleDeleteDriver(d)}
                          className="p-1.5 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
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
              <div className="rounded-md border border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center bg-white shadow-2xs">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-3">
                  <Users className="w-5 h-5 text-slate-600" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Owner-Operated Fleet
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
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
                  className="mt-4 px-4 py-2 rounded-md bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>+ Add Driver</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add / Edit Driver Modal with Minimal Border Radius */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-slate-900">
                {editingDriver ? "Edit Driver Profile" : "Register Fleet Driver"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDriver} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. John Davies"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Callsign / Badge
                  </label>
                  <input
                    type="text"
                    value={form.callsign}
                    onChange={(e) =>
                      setForm({ ...form, callsign: e.target.value })
                    }
                    placeholder="e.g. Car 02"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="07..."
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="driver@cardifftaxisltd.co.uk"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vehicle Class
                  </label>
                  <select
                    value={form.vehicleType}
                    onChange={(e) =>
                      setForm({ ...form, vehicleType: e.target.value })
                    }
                    className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none"
                  >
                    <option value="Saloon">Saloon</option>
                    <option value="Estate">Estate</option>
                    <option value="Executive">Executive</option>
                    <option value="MPV">MPV</option>
                    <option value="Minibus">Minibus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vehicle Make
                  </label>
                  <input
                    type="text"
                    value={form.vehicleMake}
                    onChange={(e) =>
                      setForm({ ...form, vehicleMake: e.target.value })
                    }
                    placeholder="e.g. Skoda Superb"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    value={form.vehiclePlate}
                    onChange={(e) =>
                      setForm({ ...form, vehiclePlate: e.target.value })
                    }
                    placeholder="e.g. CF23 XYZ"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Initial Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="ON_TRIP">On Trip</option>
                  <option value="OFF_DUTY">Off Duty</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm transition-colors cursor-pointer shadow-2xs"
                >
                  {saving
                    ? "Saving..."
                    : editingDriver
                      ? "Update Driver"
                      : "Register Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
