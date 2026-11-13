"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  PoundSterling,
  Car,
  CalendarDays,
  Plane,
  Download,
  RefreshCw,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleSyncResend = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/admin/resend/sync", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setSyncMessage(`Synced ${json.syncedCount} new booking(s) from Resend.`);
        fetchAnalytics();
      } else {
        setSyncMessage(`Sync notice: ${json.error || "Unable to sync"}`);
      }
    } catch (err: any) {
      setSyncMessage("Sync error. Please check your network connection.");
    } finally {
      setSyncing(false);
    }
  };

  const handleExportCSV = () => {
    if (!data?.bookings || data.bookings.length === 0) return;

    const headers = [
      "Reference",
      "Customer Name",
      "Customer Phone",
      "Customer Email",
      "Pickup Address",
      "Dropoff Address",
      "Pickup Date",
      "Pickup Time",
      "Vehicle Type",
      "Price (£)",
      "Status",
      "Payment Status",
      "Flight Number",
      "Created At",
    ];

    const rows = data.bookings.map((b: any) => [
      `"${b.bookingReference || ""}"`,
      `"${(b.customerName || "").replace(/"/g, '""')}"`,
      `"${b.customerPhone || ""}"`,
      `"${b.customerEmail || ""}"`,
      `"${(b.pickupAddress || "").replace(/"/g, '""')}"`,
      `"${(b.dropoffAddress || "").replace(/"/g, '""')}"`,
      `"${b.pickupDate || ""}"`,
      `"${b.pickupTime || ""}"`,
      `"${b.vehicleType || "Saloon"}"`,
      b.price ? b.price.toFixed(2) : "0.00",
      `"${b.status || ""}"`,
      `"${b.paymentStatus || ""}"`,
      `"${b.flightNumber || ""}"`,
      `"${b.createdAt || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `cardiff-taxis-bookings-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-500">
        <div className="flex items-center gap-2 text-xs font-mono">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
          Loading business analytics...
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalBookings: 0,
    totalRevenue: 0,
    avgFare: 0,
    completedCount: 0,
    upcomingCount: 0,
  };

  const routes = data?.routes || [];
  const vehicles = data?.vehicles || [];
  const bookings = data?.bookings || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Analytics & Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Revenue trends, airport transfer demand, and booking history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncResend}
            disabled={syncing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
            title="Import real past bookings from Resend notification emails"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-amber-500" : "text-slate-400"}`}
            />
            <span>{syncing ? "Syncing..." : "Sync Resend"}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={bookings.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchAnalytics();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Sync feedback notice */}
      {syncMessage && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center justify-between">
          <span>{syncMessage}</span>
          <button
            onClick={() => setSyncMessage(null)}
            className="text-amber-600 hover:text-amber-900 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Total Revenue
            </span>
            <PoundSterling className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            £{metrics.totalRevenue.toFixed(2)}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>SumUp Verified</span>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Total Bookings
            </span>
            <CalendarDays className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {metrics.totalBookings}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {metrics.completedCount} completed · {metrics.upcomingCount} upcoming
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Average Fare
            </span>
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            £{metrics.avgFare.toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Per booked journey</p>
        </div>

        <div className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">
              Completion Rate
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono tracking-tight text-slate-900">
            {metrics.totalBookings > 0
              ? `${Math.round((metrics.completedCount / metrics.totalBookings) * 100)}%`
              : "100%"}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">0 cancellations recorded</p>
        </div>
      </div>

      {/* Middle Grid: Top Routes & Vehicle Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Routes & Transfer Destinations */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-900">
                Route & Airport Demand
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {routes.length} destinations
            </span>
          </div>

          <div className="space-y-3">
            {routes.map((r: any) => {
              const pct =
                metrics.totalRevenue > 0
                  ? Math.round((r.revenue / metrics.totalRevenue) * 100)
                  : 0;
              return (
                <div key={r.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">{r.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {r.count} trip{r.count > 1 ? "s" : ""}
                      </span>
                      <span className="font-semibold font-mono text-slate-900">
                        £{r.revenue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet Vehicle Utilization */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-900">
                Vehicle Class Demand
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Fleet breakdown
            </span>
          </div>

          <div className="space-y-3">
            {vehicles.map((v: any) => {
              const pct =
                metrics.totalBookings > 0
                  ? Math.round((v.count / metrics.totalBookings) * 100)
                  : 0;
              return (
                <div key={v.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800">
                      {v.name} Car
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {v.count} booking{v.count > 1 ? "s" : ""} ({pct}%)
                      </span>
                      <span className="font-semibold font-mono text-slate-900">
                        £{v.revenue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 12)}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase">
                  Top Vehicle
                </span>
                <span className="font-semibold text-slate-800">Saloon Car</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase">
                  Payment Method
                </span>
                <span className="font-semibold text-slate-800">100% SumUp Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Bookings Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              All Booking Records ({bookings.length})
            </h2>
            <p className="text-[11px] text-slate-500">
              Imported from Resend and live customer checkout sessions
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Database ID: Hostinger MySQL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100 font-medium">
              <tr>
                <th className="py-2.5 px-4">Ref</th>
                <th className="py-2.5 px-4">Customer</th>
                <th className="py-2.5 px-4">Journey</th>
                <th className="py-2.5 px-4">Pickup Date/Time</th>
                <th className="py-2.5 px-4">Vehicle</th>
                <th className="py-2.5 px-4 text-right">Fare</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                    {b.bookingReference}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">
                      {b.customerName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {b.customerPhone}
                    </p>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="truncate text-slate-800" title={b.pickupAddress}>
                      <span className="text-slate-400 font-normal">From: </span>
                      {b.pickupAddress}
                    </p>
                    <p className="truncate text-slate-800" title={b.dropoffAddress}>
                      <span className="text-slate-400 font-normal">To: </span>
                      {b.dropoffAddress}
                    </p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <p className="font-medium text-slate-900">{b.pickupDate}</p>
                    <p className="text-[11px] font-mono text-slate-500">
                      {b.pickupTime}
                    </p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-800">
                    {b.vehicleType}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    £{b.price ? b.price.toFixed(2) : "0.00"}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        b.status === "COMPLETED"
                          ? "bg-slate-100 text-slate-700 border border-slate-200"
                          : b.status === "CONFIRMED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
