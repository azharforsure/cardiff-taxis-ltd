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
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState(searchParams.get("date") || "");

  // Modals
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [showNewModal, setShowNewModal] = useState(
    searchParams.get("new") === "true"
  );
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
  });

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "ALL") {
        params.set("status", statusFilter);
      }
      if (dateFilter) {
        params.set("date", dateFilter);
      }
      if (searchQuery) {
        params.set("q", searchQuery);
      }

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setBookings(json.bookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch("/api/admin/drivers");
      if (res.ok) {
        const json = await res.json();
        setDrivers(json.drivers || []);
      }
    } catch (err) {
      console.error("Failed to fetch drivers:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFilter]);

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Check if a specific booking was requested via URL ?selected=ID
  useEffect(() => {
    const selectedId = searchParams.get("selected");
    if (selectedId && bookings.length > 0) {
      const found = bookings.find((b) => b.id === selectedId);
      if (found) setSelectedBooking(found);
    }
  }, [searchParams, bookings]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
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
        const updated = await res.json();
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ...updated.booking } : b))
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev: any) => ({ ...prev, ...updated.booking }));
        }
      }
    } catch (err) {
      console.error("Update failed:", err);
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
        fetchBookings();
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
        });
      }
    } catch (err) {
      console.error("Create booking failed:", err);
    } finally {
      setSavingAction(false);
    }
  };

  const generateWhatsAppMessage = (b: any, driverPhone: string) => {
    const text = encodeURIComponent(
      `🚕 *CARDIFF TAXIS DISPATCH*\n\n` +
        `*Ref:* ${b.bookingReference}\n` +
        `*Passenger:* ${b.customerName} (${b.customerPhone})\n` +
        `*Pickup:* ${b.pickupAddress}\n` +
        `*Dropoff:* ${b.dropoffAddress}\n` +
        `*Date/Time:* ${b.pickupDate} at ${b.pickupTime}\n` +
        `*Vehicle:* ${b.vehicleType} (${b.passengers} pax, ${b.luggage} bags)\n` +
        (b.flightNumber ? `*Flight:* ${b.flightNumber}\n` : "") +
        `*Fare:* £${Number(b.price).toFixed(2)} (${b.paymentStatus})\n` +
        (b.notes ? `*Notes:* ${b.notes}\n` : "") +
        `\nPlease reply to accept trip.`
    );
    const cleanPhone = driverPhone.replace(/[^0-9]/g, "");
    const formatted = cleanPhone.startsWith("0")
      ? "44" + cleanPhone.slice(1)
      : cleanPhone;
    return `https://wa.me/${formatted}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Bookings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage reservations, driver assignment, and manual phone bookings
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm shadow-2xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Manual Phone Booking</span>
        </button>
      </div>

      {/* Filter and Search Bar with Minimal Rounded Corners */}
      <div className="p-4 rounded-md bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-sm">
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
              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-slate-900 text-white shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-800 font-mono focus:border-amber-400 focus:bg-white focus:outline-none"
          />

          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search ref, passenger, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </form>
        </div>
      </div>

      {/* Bookings List with Minimal Border Radius */}
      <div className="rounded-md bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-500 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-amber-500 mx-auto mb-2" />
            Loading reservations...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-16 text-center text-slate-500 text-sm">
            <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p>No bookings found matching current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[1050px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-5 whitespace-nowrap">Ref</th>
                  <th className="py-3 px-5 whitespace-nowrap">Date & Time</th>
                  <th className="py-3 px-5 min-w-[190px]">Passenger</th>
                  <th className="py-3 px-5 min-w-[240px]">Route</th>
                  <th className="py-3 px-5 whitespace-nowrap">Vehicle</th>
                  <th className="py-3 px-5 whitespace-nowrap">Assigned</th>
                  <th className="py-3 px-5 text-right whitespace-nowrap">Fare</th>
                  <th className="py-3 px-5 text-center whitespace-nowrap">Status</th>
                  <th className="py-3 px-5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-5 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {b.bookingReference}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="text-slate-900 font-semibold">
                        {b.pickupDate}
                      </div>
                      <div className="text-xs text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {b.pickupTime}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap min-w-[190px]">
                      <div className="font-semibold text-slate-900 whitespace-nowrap">
                        {b.customerName}
                      </div>
                      <div className="text-xs font-mono text-slate-500 flex items-center gap-1 mt-0.5 whitespace-nowrap">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {b.customerPhone}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 min-w-[240px] max-w-xs">
                      <div
                        className="truncate text-slate-900 text-sm flex items-center gap-1.5 font-medium max-w-[280px]"
                        title={b.pickupAddress}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="truncate">{b.pickupAddress}</span>
                      </div>
                      <div
                        className="truncate text-slate-500 text-xs flex items-center gap-1.5 mt-0.5 max-w-[280px]"
                        title={b.dropoffAddress}
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
                        <span className="truncate">{b.dropoffAddress}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium">
                        {b.vehicleType}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {b.driver ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {b.driver.callsign || b.driver.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900 whitespace-nowrap text-right">
                      £{Number(b.price).toFixed(2)}
                      <div className="text-[11px] text-slate-500 font-normal">
                        {b.paymentStatus}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                          b.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : b.status === "COMPLETED"
                              ? "bg-slate-100 text-slate-700 border border-slate-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(b);
                        }}
                        className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-800 border border-slate-200/80 transition-colors cursor-pointer"
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

      {/* Booking Details Modal with Minimal Border Radius */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
              <div>
                <span className="text-xs font-mono font-bold text-amber-600">
                  {selectedBooking.bookingReference}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Booking Management
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Passenger Info */}
              <div className="p-4 rounded-md bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {selectedBooking.customerName}
                    </h4>
                    {selectedBooking.customerEmail && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedBooking.customerEmail}
                      </p>
                    )}
                  </div>
                  <a
                    href={`tel:${selectedBooking.customerPhone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    {selectedBooking.customerPhone}
                  </a>
                </div>
              </div>

              {/* Journey Route */}
              <div className="space-y-2">
                <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200/80">
                  <p className="text-xs uppercase font-mono tracking-wider text-slate-500 font-semibold">
                    Pickup Location
                  </p>
                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {selectedBooking.pickupAddress}
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    {selectedBooking.pickupDate} at {selectedBooking.pickupTime}
                  </p>
                </div>

                <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200/80">
                  <p className="text-xs uppercase font-mono tracking-wider text-slate-500 font-semibold">
                    Destination Location
                  </p>
                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {selectedBooking.dropoffAddress}
                  </p>
                </div>

                {selectedBooking.returnDate && (
                  <div className="p-3.5 rounded-md bg-amber-50 border border-amber-200">
                    <p className="text-xs uppercase font-mono tracking-wider text-amber-800 font-semibold">
                      Return Trip Details
                    </p>
                    <p className="text-sm font-medium text-slate-900 mt-1">
                      {selectedBooking.returnDate} at {selectedBooking.returnTime}
                    </p>
                  </div>
                )}
              </div>

              {/* Trip Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-sm">
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200/80">
                  <span className="text-xs uppercase text-slate-500 font-mono">
                    Vehicle
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {selectedBooking.vehicleType}
                  </p>
                </div>
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200/80">
                  <span className="text-xs uppercase text-slate-500 font-mono">
                    Pax / Bags
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {selectedBooking.passengers} Pax / {selectedBooking.luggage} Bags
                  </p>
                </div>
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200/80">
                  <span className="text-xs uppercase text-slate-500 font-mono">
                    Fare
                  </span>
                  <p className="font-bold text-emerald-600 mt-0.5 font-mono">
                    £{Number(selectedBooking.price).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200/80">
                  <span className="text-xs uppercase text-slate-500 font-mono">
                    Payment
                  </span>
                  <p className="font-bold text-slate-900 mt-0.5 font-mono">
                    {selectedBooking.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Driver Assignment Section */}
              <div className="p-4 rounded-md bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold">
                    Driver Assignment
                  </span>
                  {selectedBooking.driver && (
                    <span className="text-xs text-slate-600 font-mono">
                      {selectedBooking.driver.name} ({selectedBooking.driver.phone})
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedBooking.driverId || ""}
                    onChange={(e) =>
                      handleUpdateBooking(selectedBooking.id, {
                        driverId: e.target.value,
                      })
                    }
                    disabled={savingAction}
                    className="flex-1 py-2 px-3 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">-- No Driver Assigned --</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.callsign ? `[${d.callsign}] ` : ""}
                        {d.name} ({d.vehicleType} - {d.phone})
                      </option>
                    ))}
                  </select>

                  {selectedBooking.driver && (
                    <a
                      href={generateWhatsAppMessage(
                        selectedBooking,
                        selectedBooking.driver.phone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-2xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Dispatch via WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Status Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 mb-1 font-semibold">
                    Ride Status
                  </label>
                  <select
                    value={selectedBooking.status}
                    onChange={(e) =>
                      handleUpdateBooking(selectedBooking.id, {
                        status: e.target.value,
                      })
                    }
                    disabled={savingAction}
                    className="w-full py-2 px-3 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="DISPATCHED">DISPATCHED (On Way)</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-700 mb-1 font-semibold">
                    Payment Status
                  </label>
                  <select
                    value={selectedBooking.paymentStatus}
                    onChange={(e) =>
                      handleUpdateBooking(selectedBooking.id, {
                        paymentStatus: e.target.value,
                      })
                    }
                    disabled={savingAction}
                    className="w-full py-2 px-3 bg-white border border-slate-200 rounded-md text-sm text-slate-900 focus:border-amber-400 focus:outline-none"
                  >
                    <option value="PAID">PAID</option>
                    <option value="UNPAID">UNPAID</option>
                    <option value="CASH">CASH (Pay to Driver)</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Phone Booking Modal with Minimal Border Radius */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-md w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Manual Phone Reservation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Log a phone booking directly into dispatch
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-5 space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.customerName}
                    onChange={(e) =>
                      setNewForm({ ...newForm, customerName: e.target.value })
                    }
                    placeholder="e.g. John Smith"
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newForm.customerPhone}
                    onChange={(e) =>
                      setNewForm({ ...newForm, customerPhone: e.target.value })
                    }
                    placeholder="07..."
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pickup Address *
                </label>
                <input
                  type="text"
                  required
                  value={newForm.pickupAddress}
                  onChange={(e) =>
                    setNewForm({ ...newForm, pickupAddress: e.target.value })
                  }
                  placeholder="e.g. Cardiff Central Station / Postcode..."
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  required
                  value={newForm.dropoffAddress}
                  onChange={(e) =>
                    setNewForm({ ...newForm, dropoffAddress: e.target.value })
                  }
                  placeholder="e.g. Heathrow Terminal 5 / Bristol Airport..."
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newForm.pickupDate}
                    onChange={(e) =>
                      setNewForm({ ...newForm, pickupDate: e.target.value })
                    }
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 font-mono focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pickup Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={newForm.pickupTime}
                    onChange={(e) =>
                      setNewForm({ ...newForm, pickupTime: e.target.value })
                    }
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 font-mono focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vehicle
                  </label>
                  <select
                    value={newForm.vehicleType}
                    onChange={(e) =>
                      setNewForm({ ...newForm, vehicleType: e.target.value })
                    }
                    className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none"
                  >
                    <option value="Saloon">Saloon</option>
                    <option value="Estate">Estate</option>
                    <option value="MPV">6-Seater MPV</option>
                    <option value="Minibus">8-Seater Minibus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fare (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newForm.price}
                    onChange={(e) =>
                      setNewForm({
                        ...newForm,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 font-mono focus:border-amber-400 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assign
                  </label>
                  <select
                    value={newForm.driverId}
                    onChange={(e) =>
                      setNewForm({ ...newForm, driverId: e.target.value })
                    }
                    className="w-full py-2 px-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none"
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

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-sm font-medium text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAction}
                  className="px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm transition-colors cursor-pointer shadow-2xs"
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
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 text-sm">
          Loading bookings...
        </div>
      }
    >
      <BookingsContent />
    </Suspense>
  );
}
