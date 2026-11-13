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
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

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

  const handleSyncResend = async () => {
    setSyncing(true);
    setSyncNotice(null);
    try {
      const res = await fetch("/api/admin/resend/sync", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setSyncNotice(`Synced ${json.syncedCount} booking(s) from Resend.`);
        fetchStats();
      } else {
        setSyncNotice(`Sync notice: ${json.error || "Unable to sync"}`);
      }
    } catch {
      setSyncNotice("Connection error syncing Resend.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-500">
        <div className="flex items-center gap-2 text-xs font-mono">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily bookings, live dispatch, and revenue summary
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncResend}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            title="Import bookings from Resend notification emails"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-amber-500" : "text-slate-400"}`}
            />
            <span>{syncing ? "Syncing..." : "Sync Resend"}</span>
          </button>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchStats();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : "text-slate-400"}`}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/bookings?new=true"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs shadow-2xs transition-colors"
          >
            + Phone Booking
          </Link>
        </div>
      </div>

      {/* Sync feedback notice */}
      {syncNotice && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center justify-between">
          <span>{syncNotice}</span>
          <button
            onClick={() => setSyncNotice(null)}
            className="text-amber-600 hover:text-amber-900 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Unassigned Dispatch Alert */}
      {metrics.needsDriverCount > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs font-medium">
              <span className="font-bold text-slate-900">
                {metrics.needsDriverCount} booking{metrics.needsDriverCount > 1 ? "s" : ""}
              </span>{" "}
              pending driver assignment.
            </p>
          </div>
          <Link
            href="/admin/bookings?status=NEEDS_DRIVER"
            className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap shadow-2xs"
          >
            View Rides →
          </Link>
        </div>
      )}

      {/* KPI Metrics in Hybrid White Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Rides */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Today's Bookings
            </span>
            <CalendarDays className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-slate-900">
            {metrics.todayBookings}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Scheduled for today</p>
        </div>

        {/* Total Revenue */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Total Revenue
            </span>
            <PoundSterling className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-emerald-600">
            £{Number(metrics.totalRevenue || 0).toFixed(2)}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Today: £{Number(metrics.todayRevenue || 0).toFixed(2)}
          </p>
        </div>

        {/* Unassigned Rides */}
        <Link
          href="/admin/bookings?status=NEEDS_DRIVER"
          className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors block group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Unassigned
            </span>
            <AlertTriangle
              className={`w-4 h-4 ${
                metrics.needsDriverCount > 0 ? "text-amber-500" : "text-slate-400"
              }`}
            />
          </div>
          <div
            className={`mt-2 text-2xl font-bold font-mono tracking-tight ${
              metrics.needsDriverCount > 0 ? "text-amber-600" : "text-slate-900"
            }`}
          >
            {metrics.needsDriverCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Pending driver assignment</p>
        </Link>

        {/* Active Driver */}
        <Link
          href="/admin/drivers"
          className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors block group"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Active Fleet
            </span>
            <Car className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tracking-tight text-slate-900">
            {metrics.activeDriversCount}
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {metrics.activeDriversCount === 1
              ? "Owner-operator active"
              : "Registered drivers"}
          </p>
        </Link>
      </div>

      {/* Recent Bookings Table */}
      <div className="rounded-xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Bookings
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Online reservations and phone bookings
            </p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 transition-colors"
          >
            <span>View All ({metrics.totalBookings})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No bookings recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-2.5 px-4">Ref</th>
                  <th className="py-2.5 px-4">Passenger</th>
                  <th className="py-2.5 px-4">Journey</th>
                  <th className="py-2.5 px-4">Date & Time</th>
                  <th className="py-2.5 px-4">Driver</th>
                  <th className="py-2.5 px-4 text-right">Fare</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recent.map((b: any) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {b.bookingReference}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {b.customerName}
                      </div>
                      <a
                        href={`tel:${b.customerPhone}`}
                        className="text-[11px] font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        {b.customerPhone}
                      </a>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-900 truncate flex items-center gap-1.5 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="truncate">{b.pickupAddress}</span>
                      </div>
                      <div className="text-slate-500 text-[11px] truncate flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                        <span className="truncate">{b.dropoffAddress}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-900 font-medium">
                        {b.pickupDate}
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {b.pickupTime}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {b.driver ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          {b.driver.callsign || b.driver.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-right whitespace-nowrap">
                      £{Number(b.price).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
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
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/admin/bookings?selected=${b.id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-800 border border-slate-200/80 transition-colors"
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
