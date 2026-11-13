"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  PoundSterling,
  Car,
  AlertTriangle,
  Clock,
  UserCheck,
  RefreshCw,
  Phone,
  ArrowRight,
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
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-zinc-400">
        <div className="flex items-center gap-2 text-xs font-mono">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
          Loading dispatch data...
        </div>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Overview
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Daily bookings, live dispatch and revenue summary
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchStats();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-amber-400" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/bookings?new=true"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs shadow-sm transition-colors"
          >
            + Phone Booking
          </Link>
        </div>
      </div>

      {/* Unassigned Dispatch Alert */}
      {metrics.needsDriverCount > 0 && (
        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 flex items-center justify-between gap-3 text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs font-medium">
              <span className="font-semibold text-white">
                {metrics.needsDriverCount} booking{metrics.needsDriverCount > 1 ? "s" : ""}
              </span>{" "}
              pending driver assignment.
            </p>
          </div>
          <Link
            href="/admin/bookings?status=NEEDS_DRIVER"
            className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-[11px] transition-colors whitespace-nowrap"
          >
            View Rides →
          </Link>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Today's Rides */}
        <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Today's Bookings
            </span>
            <CalendarDays className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 font-mono">
            {metrics.todayBookings}
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">Scheduled for today</p>
        </div>

        {/* Today's Revenue */}
        <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Today's Revenue
            </span>
            <PoundSterling className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-emerald-400 font-mono">
            £{metrics.todayRevenue.toFixed(2)}
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">Paid trips today</p>
        </div>

        {/* Unassigned Rides */}
        <Link
          href="/admin/bookings?status=NEEDS_DRIVER"
          className="p-4 rounded-lg bg-[#121215] border border-white/[0.06] hover:border-white/[0.12] transition-colors block group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Unassigned
            </span>
            <AlertTriangle
              className={`w-3.5 h-3.5 ${
                metrics.needsDriverCount > 0 ? "text-amber-400" : "text-zinc-400"
              }`}
            />
          </div>
          <div
            className={`mt-2 text-2xl font-semibold tracking-tight font-mono ${
              metrics.needsDriverCount > 0 ? "text-amber-300" : "text-zinc-100"
            }`}
          >
            {metrics.needsDriverCount}
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">Pending driver dispatch</p>
        </Link>

        {/* Active Fleet */}
        <Link
          href="/admin/drivers"
          className="p-4 rounded-lg bg-[#121215] border border-white/[0.06] hover:border-white/[0.12] transition-colors block group"
        >
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Active Driver
            </span>
            <Car className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 font-mono">
            {metrics.activeDriversCount}
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">
            {metrics.activeDriversCount === 1 ? "Owner-operator active" : "Fleet registered"}
          </p>
        </Link>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-lg bg-[#121215] border border-white/[0.06] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 font-mono">
              Recent Reservations
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Latest customer bookings from website and phone
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-medium text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 transition-colors"
          >
            <span>View All ({metrics.totalBookings})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-xs">
            No bookings recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="py-2.5 px-4 font-medium">Ref</th>
                  <th className="py-2.5 px-4 font-medium">Passenger</th>
                  <th className="py-2.5 px-4 font-medium">Route</th>
                  <th className="py-2.5 px-4 font-medium">Date & Time</th>
                  <th className="py-2.5 px-4 font-medium">Assigned</th>
                  <th className="py-2.5 px-4 font-medium">Fare</th>
                  <th className="py-2.5 px-4 font-medium">Status</th>
                  <th className="py-2.5 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300">
                {recent.map((b: any) => (
                  <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] font-medium text-zinc-200">
                      {b.bookingReference}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-zinc-100">{b.customerName}</div>
                      <a
                        href={`tel:${b.customerPhone}`}
                        className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3 text-zinc-400" />
                        {b.customerPhone}
                      </a>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <div className="text-zinc-200 truncate flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                        <span className="truncate">{b.pickupAddress}</span>
                      </div>
                      <div className="text-zinc-400 text-[11px] truncate flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                        <span className="truncate">{b.dropoffAddress}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-zinc-200 font-mono text-[11px]">{b.pickupDate}</div>
                      <div className="text-zinc-400 text-[11px] font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        {b.pickupTime}
                      </div>
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
                      <Link
                        href={`/admin/bookings?selected=${b.id}`}
                        className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white border border-white/[0.08] transition-colors"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
