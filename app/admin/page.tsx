"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  PoundSterling,
  Car,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  MapPin,
  UserCheck,
  CheckCircle2,
  RefreshCw,
  Phone,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <svg className="animate-spin h-8 w-8 text-amber-400 mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p className="text-sm font-medium">Loading live dispatch operations...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    todayBookings: 0,
    todayRevenue: 0,
    totalRevenue: 0,
    needsDriverCount: 0,
    activeDriversCount: 0,
  };

  const recent = data?.recentBookings || [];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dispatch Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time fleet monitoring, bookings and revenue
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchStats();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-amber-400" : ""}`} />
            Refresh
          </button>

          <Link
            href="/admin/bookings?new=true"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition"
          >
            + Phone Booking
          </Link>
        </div>
      </div>

      {/* Unassigned Dispatch Alert */}
      {metrics.needsDriverCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start sm:items-center justify-between gap-3 text-amber-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {metrics.needsDriverCount} booking{metrics.needsDriverCount > 1 ? "s require" : " requires"} driver assignment!
              </p>
              <p className="text-xs text-amber-400/90">
                Confirm pickup details and assign to owner or driver for dispatch.
              </p>
            </div>
          </div>
          <Link
            href="/admin/bookings?status=NEEDS_DRIVER"
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition whitespace-nowrap shrink-0"
          >
            View Rides →
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Today's Rides */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Bookings</span>
            <CalendarDays className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {metrics.todayBookings}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Scheduled for today</p>
        </div>

        {/* Today's Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Revenue</span>
            <PoundSterling className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              £{metrics.todayRevenue.toFixed(2)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Paid trips today</p>
        </div>

        {/* Needs Driver */}
        <Link
          href="/admin/bookings?status=NEEDS_DRIVER"
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Unassigned</span>
            <AlertTriangle className={`w-4 h-4 ${metrics.needsDriverCount > 0 ? "text-amber-400" : "text-slate-500"} group-hover:scale-110 transition`} />
          </div>
          <div className="mt-3">
            <span className={`text-2xl sm:text-3xl font-extrabold ${metrics.needsDriverCount > 0 ? "text-amber-400" : "text-slate-300"}`}>
              {metrics.needsDriverCount}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Pending driver assignment</p>
        </Link>

        {/* Active Fleet */}
        <Link
          href="/admin/drivers"
          className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition relative overflow-hidden group"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Drivers</span>
            <Car className="w-4 h-4 text-sky-400 group-hover:scale-110 transition" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {metrics.activeDriversCount}
            </span>
            <span className="text-xs text-amber-400 font-medium">
              {metrics.activeDriversCount === 1 ? "Owner" : "Drivers"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {metrics.activeDriversCount === 1 ? "Owner-operator active" : "Registered fleet drivers"}
          </p>
        </Link>
      </div>

      {/* Recent Bookings Section */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Recent Bookings & Rides</h2>
            <p className="text-xs text-slate-400">Latest online and phone reservations</p>
          </div>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            View All ({metrics.totalBookings})
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-sm">No bookings recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800/80">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ref</th>
                  <th className="py-3 px-4 font-semibold">Passenger</th>
                  <th className="py-3 px-4 font-semibold">Pickup / Dropoff</th>
                  <th className="py-3 px-4 font-semibold">Date & Time</th>
                  <th className="py-3 px-4 font-semibold">Driver</th>
                  <th className="py-3 px-4 font-semibold">Fare</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recent.map((b: any) => {
                  const isUnassigned = !b.driver;
                  return (
                    <tr key={b.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4 font-mono font-semibold text-amber-400 text-xs">
                        {b.bookingReference}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{b.customerName}</div>
                        <a href={`tel:${b.customerPhone}`} className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {b.customerPhone}
                        </a>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate">
                        <div className="text-white truncate flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                          {b.pickupAddress}
                        </div>
                        <div className="text-slate-400 text-[11px] truncate flex items-center gap-1 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
                          {b.dropoffAddress}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="text-white font-medium">{b.pickupDate}</div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {b.pickupTime}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {b.driver ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{b.driver.callsign || b.driver.name}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        £{Number(b.price).toFixed(2)}
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
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/bookings?selected=${b.id}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
