"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CalendarDays,
  Search,
  PlusCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Car,
  UserCheck,
  CheckCircle2,
  X,
  MessageSquare,
  Filter,
  FileText,
  RefreshCw,
} from "lucide-react";
import { getVehicleImage } from "@/lib/fleet-data";

function BookingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(searchParams.get("date") || "");

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [showNewModal, setShowNewModal] = useState(searchParams.get("new") === "true");
  const [savingAction, setSavingAction] = useState(false);

  // Form for new booking
  const [newForm, setNewForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    pickupAddress: "",
    dropoffAddress: "",
    pickupDate: new Date().toISOString().split("T")[0],
    pickupTime: "12:00",
    isReturn: false,
    returnDate: "",
    returnTime: "",
    vehicleType: "Saloon",
    passengers: 1,
    luggage: 1,
    price: 35.0,
    flightNumber: "",
    paymentMethod: "cash",
    paymentStatus: "UNPAID",
    driverId: "",
    notes: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (statusFilter && statusFilter !== "ALL") queryParams.set("status", statusFilter);
      if (searchQuery) queryParams.set("search", searchQuery);
      if (dateFilter) queryParams.set("date", dateFilter);

      const [resB, resD] = await Promise.all([
        fetch(`/api/admin/bookings?${queryParams.toString()}`),
        fetch("/api/admin/drivers"),
      ]);

      if (resB.ok) {
        const jsonB = await resB.json();
        setBookings(jsonB.bookings || []);
        const paramSelected = searchParams.get("selected");
        if (paramSelected && !selectedBooking) {
          const match = jsonB.bookings?.find((x: any) => x.id === paramSelected);
          if (match) setSelectedBooking(match);
        }
      }

      if (resD.ok) {
        const jsonD = await resD.json();
        setDrivers(jsonD.drivers || []);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, dateFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleUpdateBooking = async (id: string, updates: any) => {
    setSavingAction(true);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        const json = await res.json();
        setSelectedBooking(json.booking);
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? json.booking : b))
        );
      }
    } catch (err) {
      console.error("Update booking failed:", err);
    } finally {
      setSavingAction(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAction(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newForm),
      });

      if (res.ok) {
        setShowNewModal(false);
        fetchData();
        setNewForm({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          pickupAddress: "",
          dropoffAddress: "",
          pickupDate: new Date().toISOString().split("T")[0],
          pickupTime: "12:00",
          isReturn: false,
          returnDate: "",
          returnTime: "",
          vehicleType: "Saloon",
          passengers: 1,
          luggage: 1,
          price: 35.0,
          flightNumber: "",
          paymentMethod: "cash",
          paymentStatus: "UNPAID",
          driverId: "",
          notes: "",
        });
      }
    } catch (err) {
      console.error("Create booking error:", err);
    } finally {
      setSavingAction(false);
    }
  };

  // Generate WhatsApp dispatch message for a driver
  const generateWhatsAppMessage = (b: any, driverPhone: string) => {
    const text = encodeURIComponent(
      `🚖 *CARDIFF TAXIS LTD - DISPATCH JOB*\n\n` +
      `*Ref:* ${b.bookingReference}\n` +
      `*Date/Time:* ${b.pickupDate} at ${b.pickupTime}\n` +
      `*Passenger:* ${b.customerName} (${b.customerPhone})\n` +
      `*Pickup:* ${b.pickupAddress}\n` +
      `*Destination:* ${b.dropoffAddress}\n` +
      (b.flightNumber ? `*Flight:* ${b.flightNumber}\n` : "") +
      `*Vehicle:* ${b.vehicleType} (${b.passengers} Pax, ${b.luggage} Bags)\n` +
      `*Fare:* £${Number(b.price).toFixed(2)} (${b.paymentStatus})\n` +
      (b.notes ? `*Notes:* ${b.notes}\n\n` : "\n") +
      `Please confirm once accepted!`
    );

    const cleanPhone = driverPhone.replace(/\D/g, "");
    const formatted = cleanPhone.startsWith("0") ? "44" + cleanPhone.slice(1) : cleanPhone;
    return `https://wa.me/${formatted}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Bookings & Dispatch
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage reservations, assign dispatch and log phone bookings
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs shadow-sm transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Manual Phone Booking</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-lg bg-[#121215] border border-white/[0.06] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs">
          {[
            { id: "ALL", label: "All Rides" },
            { id: "NEEDS_DRIVER", label: "Needs Driver" },
            { id: "CONFIRMED", label: "Confirmed" },
            { id: "DISPATCHED", label: "Dispatched" },
            { id: "COMPLETED", label: "Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-white/[0.08] text-white border border-white/[0.08]"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Date & Search */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-2.5 py-1 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-200 font-mono focus:border-zinc-500 focus:outline-none"
          />

          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-60">
            <input
              type="text"
              placeholder="Search ref, passenger, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-3 py-1 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-200 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
            />
            <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-2" />
          </form>
        </div>
      </div>

      {/* Bookings List */}
      <div className="rounded-lg bg-[#121215] border border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-zinc-400 text-xs">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400 mx-auto mb-2" />
            Loading reservations...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center text-zinc-500 text-xs">
            <FileText className="w-6 h-6 mx-auto text-zinc-600 mb-2" />
            <p>No bookings found matching current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Ref</th>
                  <th className="py-2.5 px-4 font-medium">Date & Time</th>
                  <th className="py-2.5 px-4 font-medium">Passenger</th>
                  <th className="py-2.5 px-4 font-medium">Route</th>
                  <th className="py-2.5 px-4 font-medium">Vehicle</th>
                  <th className="py-2.5 px-4 font-medium">Assigned</th>
                  <th className="py-2.5 px-4 font-medium">Fare</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-medium text-zinc-200 text-xs whitespace-nowrap">
                      {b.bookingReference}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-zinc-200 font-mono text-[11px]">{b.pickupDate}</div>
                      <div className="text-zinc-400 text-[11px] font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        {b.pickupTime}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-zinc-100">{b.customerName}</div>
                      <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-zinc-400" />
                        {b.customerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <div className="truncate text-zinc-200 text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                        <span className="truncate">{b.pickupAddress}</span>
                      </div>
                      <div className="truncate text-zinc-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                        <span className="truncate">{b.dropoffAddress}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-300 text-[11px] font-mono">
                        {b.vehicleType}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {b.driver ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-white/[0.04] border border-white/[0.06] text-zinc-200 font-mono">
                          <UserCheck className="w-3 h-3 text-emerald-400" />
                          {b.driver.callsign || b.driver.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-950/40 text-amber-300 border border-amber-800/40">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-zinc-100 whitespace-nowrap">
                      £{Number(b.price).toFixed(2)}
                      <div className="text-[10px] text-zinc-400 font-normal">
                        {b.paymentStatus}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-950/50 text-emerald-400 border border-emerald-800/40"
                            : b.status === "DISPATCHED"
                            ? "bg-sky-950/50 text-sky-400 border border-sky-800/40"
                            : b.status === "COMPLETED"
                            ? "bg-white/[0.04] text-zinc-400 border border-white/[0.06]"
                            : "bg-amber-950/50 text-amber-300 border border-amber-800/40"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                        }}
                        className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white border border-white/[0.08] transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Details Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#121215] border border-white/[0.08] rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between sticky top-0 bg-[#121215]/95 backdrop-blur z-10">
              <div>
                <span className="text-[11px] font-mono font-medium text-amber-400">
                  {selectedBooking.bookingReference}
                </span>
                <h3 className="text-sm font-semibold text-zinc-100">Booking Management</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Passenger Info */}
              <div className="p-3.5 rounded-md bg-white/[0.02] border border-white/[0.06]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100">{selectedBooking.customerName}</h4>
                    {selectedBooking.customerEmail && (
                      <p className="text-xs text-zinc-400 mt-0.5">{selectedBooking.customerEmail}</p>
                    )}
                  </div>
                  <a
                    href={`tel:${selectedBooking.customerPhone}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-200 text-xs font-medium transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    {selectedBooking.customerPhone}
                  </a>
                </div>
              </div>

              {/* Journey Route */}
              <div className="space-y-2">
                <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Pickup</p>
                  <p className="text-xs text-zinc-100 mt-1">{selectedBooking.pickupAddress}</p>
                  <p className="text-[11px] text-zinc-400 font-mono mt-1">
                    {selectedBooking.pickupDate} at {selectedBooking.pickupTime}
                  </p>
                </div>

                <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Destination</p>
                  <p className="text-xs text-zinc-100 mt-1">{selectedBooking.dropoffAddress}</p>
                </div>

                {selectedBooking.returnDate && (
                  <div className="p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-[10px] uppercase font-mono tracking-wider text-amber-400">Return Trip</p>
                    <p className="text-xs text-zinc-100 mt-1">
                      {selectedBooking.returnDate} at {selectedBooking.returnTime}
                    </p>
                  </div>
                )}
              </div>

              {/* Trip Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] uppercase text-zinc-400 font-mono">Vehicle</span>
                  <p className="font-semibold text-zinc-100 mt-0.5">{selectedBooking.vehicleType}</p>
                </div>
                <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] uppercase text-zinc-400 font-mono">Pax / Bags</span>
                  <p className="font-semibold text-zinc-100 mt-0.5">
                    {selectedBooking.passengers} Pax / {selectedBooking.luggage} Bags
                  </p>
                </div>
                <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] uppercase text-zinc-400 font-mono">Fare</span>
                  <p className="font-semibold text-emerald-400 mt-0.5 font-mono">
                    £{Number(selectedBooking.price).toFixed(2)}
                  </p>
                </div>
                <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] uppercase text-zinc-400 font-mono">Payment</span>
                  <p className="font-semibold text-zinc-100 mt-0.5 font-mono">
                    {selectedBooking.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Driver Assignment Section */}
              <div className="p-3.5 rounded-md bg-white/[0.02] border border-white/[0.06] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                    Driver Assignment
                  </span>
                  {selectedBooking.driver && (
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {selectedBooking.driver.name} ({selectedBooking.driver.phone})
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedBooking.driverId || ""}
                    onChange={(e) => handleUpdateBooking(selectedBooking.id, { driverId: e.target.value })}
                    disabled={savingAction}
                    className="flex-1 py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  >
                    <option value="">-- No Driver Assigned --</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.callsign ? `[${d.callsign}] ` : ""}{d.name} ({d.vehicleType} - {d.phone})
                      </option>
                    ))}
                  </select>

                  {selectedBooking.driver && (
                    <a
                      href={generateWhatsAppMessage(selectedBooking, selectedBooking.driver.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Dispatch via WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Status Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Ride Status
                  </label>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => handleUpdateBooking(selectedBooking.id, { status: e.target.value })}
                    disabled={savingAction}
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="DISPATCHED">DISPATCHED (On Way)</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={selectedBooking.paymentStatus}
                    onChange={(e) => handleUpdateBooking(selectedBooking.id, { paymentStatus: e.target.value })}
                    disabled={savingAction}
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  >
                    <option value="PAID">PAID</option>
                    <option value="UNPAID">UNPAID</option>
                    <option value="CASH">CASH (Pay to Driver)</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-white/[0.06] flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Phone Booking Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#121215] border border-white/[0.08] rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Manual Phone Reservation</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Log a phone booking directly into dispatch</p>
              </div>
              <button onClick={() => setShowNewModal(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newForm.customerName}
                    onChange={(e) => setNewForm({ ...newForm, customerName: e.target.value })}
                    placeholder="e.g. John Smith"
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newForm.customerPhone}
                    onChange={(e) => setNewForm({ ...newForm, customerPhone: e.target.value })}
                    placeholder="07..."
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Pickup Address *</label>
                <input
                  type="text"
                  required
                  value={newForm.pickupAddress}
                  onChange={(e) => setNewForm({ ...newForm, pickupAddress: e.target.value })}
                  placeholder="e.g. Cardiff Central Station / Postcode..."
                  className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-300 mb-1">Destination *</label>
                <input
                  type="text"
                  required
                  value={newForm.dropoffAddress}
                  onChange={(e) => setNewForm({ ...newForm, dropoffAddress: e.target.value })}
                  placeholder="e.g. Heathrow Terminal 5 / Bristol Airport..."
                  className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Pickup Date *</label>
                  <input
                    type="date"
                    required
                    value={newForm.pickupDate}
                    onChange={(e) => setNewForm({ ...newForm, pickupDate: e.target.value })}
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 font-mono focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Pickup Time *</label>
                  <input
                    type="time"
                    required
                    value={newForm.pickupTime}
                    onChange={(e) => setNewForm({ ...newForm, pickupTime: e.target.value })}
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 font-mono focus:border-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Vehicle</label>
                  <select
                    value={newForm.vehicleType}
                    onChange={(e) => setNewForm({ ...newForm, vehicleType: e.target.value })}
                    className="w-full py-1.5 px-2 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  >
                    <option value="Saloon">Saloon</option>
                    <option value="Estate">Estate</option>
                    <option value="MPV">6-Seater MPV</option>
                    <option value="Minibus">8-Seater Minibus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Fare (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newForm.price}
                    onChange={(e) => setNewForm({ ...newForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 font-mono focus:border-zinc-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1">Assign</label>
                  <select
                    value={newForm.driverId}
                    onChange={(e) => setNewForm({ ...newForm, driverId: e.target.value })}
                    className="w-full py-1.5 px-2 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.callsign || d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAction}
                  className="px-3.5 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs transition-colors cursor-pointer"
                >
                  {savingAction ? "Saving..." : "Create Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-zinc-400 text-xs">Loading bookings...</div>}>
      <BookingsContent />
    </Suspense>
  );
}
