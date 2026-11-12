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
  ExternalLink,
  Filter,
  DollarSign,
  AlertCircle,
  FileText,
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

        const selectId = searchParams.get("selected");
        if (selectId) {
          const found = (jsonB.bookings || []).find((b: any) => b.id === selectId);
          if (found) setSelectedBooking(found);
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
      console.error("Update error:", err);
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
        // Reset form
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
      (b.returnDate ? `*Return Trip:* ${b.returnDate} at ${b.returnTime}\n` : "") +
      `*Vehicle:* ${b.vehicleType} | Pax: ${b.passengers} | Bags: ${b.luggage}\n` +
      (b.flightNumber ? `*Flight #:* ${b.flightNumber}\n` : "") +
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Bookings & Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage passenger rides, assign fleet drivers, and log phone bookings
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          + Manual Phone Booking
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
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
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
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
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
          />

          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-60">
            <input
              type="text"
              placeholder="Search ref, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </form>
        </div>
      </div>

      {/* Bookings List */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <svg className="animate-spin h-6 w-6 text-amber-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <FileText className="w-8 h-8 mx-auto text-slate-600 mb-2" />
            <p className="text-sm">No bookings found for the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ref</th>
                  <th className="py-3 px-4 font-semibold">Pickup Date/Time</th>
                  <th className="py-3 px-4 font-semibold">Passenger</th>
                  <th className="py-3 px-4 font-semibold">Route</th>
                  <th className="py-3 px-4 font-semibold">Vehicle</th>
                  <th className="py-3 px-4 font-semibold">Assigned Driver</th>
                  <th className="py-3 px-4 font-semibold">Fare</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-amber-400 text-xs whitespace-nowrap">
                      {b.bookingReference}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-white font-medium">{b.pickupDate}</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {b.pickupTime}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{b.customerName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {b.customerPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="truncate text-white text-xs">
                        <span className="text-emerald-400 font-bold">FROM:</span> {b.pickupAddress}
                      </div>
                      <div className="truncate text-slate-400 text-[11px] mt-0.5">
                        <span className="text-rose-400 font-bold">TO:</span> {b.dropoffAddress}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs">
                        {b.vehicleType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {b.driver ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                          <UserCheck className="w-3.5 h-3.5" />
                          {b.driver.callsign || b.driver.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                      £{Number(b.price).toFixed(2)}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {b.paymentStatus}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : b.status === "DISPATCHED"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                            : b.status === "COMPLETED"
                            ? "bg-slate-800 text-slate-300"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                  {selectedBooking.bookingReference}
                </span>
                <h3 className="text-lg font-bold text-white">Booking Management & Dispatch</h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Passenger Info & Click to Call */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Passenger Contact
                </span>
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-white">{selectedBooking.customerName}</h4>
                    {selectedBooking.customerEmail && (
                      <p className="text-xs text-slate-400 mt-0.5">{selectedBooking.customerEmail}</p>
                    )}
                  </div>
                  <a
                    href={`tel:${selectedBooking.customerPhone}`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 text-xs font-bold transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call: {selectedBooking.customerPhone}
                  </a>
                </div>
              </div>

              {/* Journey Route */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-emerald-400">Pickup Location</p>
                      <p className="text-xs text-white mt-0.5">{selectedBooking.pickupAddress}</p>
                      <p className="text-[11px] text-slate-400 mt-1 font-mono">
                        Pickup: {selectedBooking.pickupDate} at {selectedBooking.pickupTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-rose-400">Destination</p>
                      <p className="text-xs text-white mt-0.5">{selectedBooking.dropoffAddress}</p>
                    </div>
                  </div>
                </div>

                {selectedBooking.returnDate && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-amber-400">Return Trip Details</p>
                    <p className="text-xs text-white mt-0.5">
                      Date: {selectedBooking.returnDate} at {selectedBooking.returnTime}
                    </p>
                  </div>
                )}
              </div>

              {/* Trip Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
                  <img
                    src={getVehicleImage(selectedBooking.vehicleType)}
                    alt={selectedBooking.vehicleType}
                    className="h-10 w-auto object-contain"
                  />
                  <div>
                    <span className="text-[10px] uppercase text-slate-400">Vehicle</span>
                    <p className="text-xs font-bold text-white mt-0.5">{selectedBooking.vehicleType}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400">Passengers / Bags</span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {selectedBooking.passengers} Pax / {selectedBooking.luggage} Luggage
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400">Fare</span>
                  <p className="text-xs font-bold text-emerald-400 mt-0.5">
                    £{Number(selectedBooking.price).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400">Payment</span>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {selectedBooking.paymentStatus} ({selectedBooking.paymentMethod})
                  </p>
                </div>
              </div>

              {/* Driver Assignment Section */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    Fleet Driver Assignment
                  </span>
                  {selectedBooking.driver && (
                    <span className="text-[11px] text-slate-400">
                      Assigned: {selectedBooking.driver.name} ({selectedBooking.driver.phone})
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedBooking.driverId || ""}
                    onChange={(e) => handleUpdateBooking(selectedBooking.id, { driverId: e.target.value })}
                    disabled={savingAction}
                    className="flex-1 py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
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
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Send Job via WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Change Status & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Ride Status
                  </label>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) => handleUpdateBooking(selectedBooking.id, { status: e.target.value })}
                    disabled={savingAction}
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="DISPATCHED">DISPATCHED (Driver on Way)</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={selectedBooking.paymentStatus}
                    onChange={(e) => handleUpdateBooking(selectedBooking.id, { paymentStatus: e.target.value })}
                    disabled={savingAction}
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="PAID">PAID</option>
                    <option value="UNPAID">UNPAID</option>
                    <option value="CASH">CASH (Pay to Driver)</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Phone Booking Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Log Manual Phone Booking</h3>
                <p className="text-xs text-slate-400">Record a phone or walk-in reservation</p>
              </div>
              <button onClick={() => setShowNewModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newForm.customerName}
                    onChange={(e) => setNewForm({ ...newForm, customerName: e.target.value })}
                    placeholder="e.g. John Smith"
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newForm.customerPhone}
                    onChange={(e) => setNewForm({ ...newForm, customerPhone: e.target.value })}
                    placeholder="07..."
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Pickup Address *</label>
                <input
                  type="text"
                  required
                  value={newForm.pickupAddress}
                  onChange={(e) => setNewForm({ ...newForm, pickupAddress: e.target.value })}
                  placeholder="e.g. Cardiff Central Station / NP26 3YL..."
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Destination *</label>
                <input
                  type="text"
                  required
                  value={newForm.dropoffAddress}
                  onChange={(e) => setNewForm({ ...newForm, dropoffAddress: e.target.value })}
                  placeholder="e.g. Heathrow Terminal 5 / Bristol Airport..."
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pickup Date *</label>
                  <input
                    type="date"
                    required
                    value={newForm.pickupDate}
                    onChange={(e) => setNewForm({ ...newForm, pickupDate: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pickup Time *</label>
                  <input
                    type="time"
                    required
                    value={newForm.pickupTime}
                    onChange={(e) => setNewForm({ ...newForm, pickupTime: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Vehicle</label>
                  <select
                    value={newForm.vehicleType}
                    onChange={(e) => setNewForm({ ...newForm, vehicleType: e.target.value })}
                    className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Saloon">Saloon</option>
                    <option value="Estate">Estate</option>
                    <option value="MPV">6-Seater MPV</option>
                    <option value="Minibus">8-Seater Minibus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fare (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newForm.price}
                    onChange={(e) => setNewForm({ ...newForm, price: parseFloat(e.target.value) || 0 })}
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assign Driver</label>
                  <select
                    value={newForm.driverId}
                    onChange={(e) => setNewForm({ ...newForm, driverId: e.target.value })}
                    className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">None (Unassigned)</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.callsign || d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAction}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  {savingAction ? "Saving..." : "Save & Create Booking"}
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
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading bookings interface...</div>}>
      <BookingsContent />
    </Suspense>
  );
}
