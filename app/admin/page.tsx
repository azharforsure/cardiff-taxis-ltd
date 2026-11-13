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
  TrendingUp,
  MapPin,
  PlusCircle,
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
      <div className="py-24 flex flex-col items-center justify-center text-slate-500">
        <div className="flex items-center gap-2.5 text-sm font-mono">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
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
    totalBookings: 0,
  };

  const recent = data?.recentBookings || [];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time reservations, live dispatch, and revenue summary
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchStats();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin text-amber-500" : "text-slate-400"}`}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/bookings?new=true"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm shadow-2xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Phone Booking</span>
          </Link>
        </div>
      </div>

      {/* Unassigned Dispatch Alert */}
      {metrics.needsDriverCount > 0 && (
        <div className="p-4 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-amber-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-sm font-medium">
              <span className="font-bold text-slate-900">
                {metrics.needsDriverCount} booking{metrics.needsDriverCount > 1 ? "s" : ""}
              </span>{" "}
              pending driver assignment.
            </p>
          </div>
          <Link
            href="/admin/bookings?status=NEEDS_DRIVER"
            className="px-3.5 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap shadow-2xs"
          >
            Assign Drivers →
          </Link>
        </div>
      )}

      {/* KPI Metrics in Crisp Minimal Rounded Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Rides */}
        <div className="p-5 rounded-md bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Today's Bookings
            </span>
            <CalendarDays className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono tracking-tight text-slate-900">
            {metrics.todayBookings}
          </div>
          <p className="mt-2 text-xs text-slate-500">Scheduled for today</p>
        </div>

        {/* Total Revenue */}
        <div className="p-5 rounded-md bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Revenue
            </span>
            <PoundSterling className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono tracking-tight text-emerald-600">
            £{Number(metrics.totalRevenue || 0).toFixed(2)}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Today: £{Number(metrics.todayRevenue || 0).toFixed(2)}
          </p>
        </div>

        {/* Unassigned Rides */}
        <Link
          href="/admin/bookings?status=NEEDS_DRIVER"
          className="p-5 rounded-md bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors block group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Unassigned
            </span>
            <AlertTriangle
              className={`w-4 h-4 ${
                metrics.needsDriverCount > 0 ? "text-amber-500" : "text-slate-400"
              }`}
            />
          </div>
          <div
            className={`mt-2 text-3xl font-bold font-mono tracking-tight ${
              metrics.needsDriverCount > 0 ? "text-amber-600" : "text-slate-900"
            }`}
          >
            {metrics.needsDriverCount}
          </div>
          <p className="mt-2 text-xs text-slate-500">Pending driver assignment</p>
        </Link>

        {/* Active Driver */}
        <Link
          href="/admin/drivers"
          className="p-5 rounded-md bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors block group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Active Fleet
            </span>
            <Car className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-3xl font-bold font-mono tracking-tight text-slate-900">
            {metrics.activeDriversCount}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {metrics.activeDriversCount === 1
              ? "Owner-operator active"
              : "Registered fleet drivers"}
          </p>
        </Link>
      </div>

      {/* Recent Bookings Table with Minimal Border Radius */}
      <div className="rounded-md bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Recent Bookings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customer reservations recorded automatically upon payment
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-sm font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All ({metrics.totalBookings})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No bookings recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[980px]">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-5 whitespace-nowrap">Ref</th>
                  <th className="py-3 px-5 min-w-[190px]">Passenger</th>
                  <th className="py-3 px-5 min-w-[240px]">Journey</th>
                  <th className="py-3 px-5 whitespace-nowrap">Date & Time</th>
                  <th className="py-3 px-5 whitespace-nowrap">Driver</th>
                  <th className="py-3 px-5 text-right whitespace-nowrap">Fare</th>
                  <th className="py-3 px-5 text-center whitespace-nowrap">Status</th>
                  <th className="py-3 px-5 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recent.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {b.bookingReference}
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap min-w-[190px]">
                      <div className="font-semibold text-slate-900 whitespace-nowrap">
                        {b.customerName}
                      </div>
                      <a
                        href={`tel:${b.customerPhone}`}
                        className="text-xs font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1 mt-0.5 whitespace-nowrap"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {b.customerPhone}
                      </a>
                    </td>
                    <td className="py-3.5 px-5 min-w-[240px] max-w-xs">
                      <div
                        className="text-slate-900 truncate flex items-center gap-1.5 font-medium max-w-[280px]"
                        title={b.pickupAddress}
                      >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="truncate">{b.pickupAddress}</span>
                      </div>
                      <div
                        className="text-slate-500 text-xs truncate flex items-center gap-1.5 mt-0.5 max-w-[280px]"
                        title={b.dropoffAddress}
                      >
                        <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
                        <span className="truncate">{b.dropoffAddress}</span>
                      </div>
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
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900 text-right whitespace-nowrap">
                      £{Number(b.price).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5 text-center whitespace-nowrap">
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
                      <Link
                        href={`/admin/bookings?selected=${b.id}`}
                        className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-800 border border-slate-200/80 transition-colors"
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
