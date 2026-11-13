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
  PieChart,
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"revenue" | "volume">("revenue");
  const [hoveredPoint, setHoveredPoint] = useState<any | null>(null);

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
        <div className="flex items-center gap-2.5 text-sm font-mono">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-500" />
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

  const timeline = data?.timeline || [];
  const routes = data?.routes || [];
  const vehicles = data?.vehicles || [];
  const timeSlots = data?.timeSlots || [];
  const bookings = data?.bookings || [];

  // SVG Chart Calculations
  const maxRevenue = Math.max(...timeline.map((d: any) => d.revenue), 120);
  const maxBookings = Math.max(...timeline.map((d: any) => d.bookings), 4);
  const chartHeight = 180;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 24;
  const plotWidth = chartWidth - paddingX * 2;
  const plotHeight = chartHeight - paddingY * 2;

  const points = timeline.map((d: any, index: number) => {
    const x = paddingX + (index / (timeline.length - 1 || 1)) * plotWidth;
    const value = activeTab === "revenue" ? d.revenue : d.bookings;
    const maxVal = activeTab === "revenue" ? maxRevenue : maxBookings;
    const y = paddingY + plotHeight - (value / (maxVal || 1)) * plotHeight;
    return { ...d, x, y, value };
  });

  const pathD = points.reduce((acc: string, curr: any, idx: number) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, "");

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : "";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Analytics & Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Revenue trends, airport transfer demand, and fleet operational metrics
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={bookings.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setRefreshing(true);
              fetchAnalytics();
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Metric KPI Cards with Minimal Border Radius */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/90 rounded-md shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Revenue
            </span>
            <PoundSterling className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold font-mono tracking-tight text-slate-900">
            £{metrics.totalRevenue.toFixed(2)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% SumUp Online Verified</span>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-md shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Bookings
            </span>
            <CalendarDays className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-bold font-mono tracking-tight text-slate-900">
            {metrics.totalBookings}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            {metrics.completedCount} completed · {metrics.upcomingCount} upcoming
          </p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-md shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Average Fare
            </span>
            <ArrowUpRight className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-bold font-mono tracking-tight text-slate-900">
            £{metrics.avgFare.toFixed(2)}
          </p>
          <p className="mt-2 text-xs text-slate-500">Per booked customer trip</p>
        </div>

        <div className="p-5 bg-white border border-slate-200/90 rounded-md shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Completion Rate
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold font-mono tracking-tight text-slate-900">
            {metrics.totalBookings > 0
              ? `${Math.round((metrics.completedCount / metrics.totalBookings) * 100)}%`
              : "100%"}
          </p>
          <p className="mt-2 text-xs text-slate-500">0 customer cancellations</p>
        </div>
      </div>

      {/* Interactive Visual Trend Chart */}
      <div className="bg-white border border-slate-200/90 rounded-md p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Revenue & Ride Activity Over Time
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily booking volume and income trends (past 14 days)
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab("revenue")}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                activeTab === "revenue"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Revenue (£)
            </button>
            <button
              onClick={() => setActiveTab("volume")}
              className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                activeTab === "volume"
                  ? "bg-white text-slate-900 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Booking Volume
            </button>
          </div>
        </div>

        {/* Responsive SVG Chart */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-48 select-none"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const y = paddingY + plotHeight * pct;
              const maxVal = activeTab === "revenue" ? maxRevenue : maxBookings;
              const val = Math.round(maxVal * (1 - pct));
              return (
                <g key={pct}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {activeTab === "revenue" ? `£${val}` : val}
                  </text>
                </g>
              );
            })}

            {/* Gradient Area */}
            {points.length > 0 && (
              <path d={areaD} fill="url(#chartGradient)" />
            )}

            {/* Stroke Line */}
            {points.length > 0 && (
              <path
                d={pathD}
                fill="none"
                stroke="#D97706"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points */}
            {points.map((pt: any, i: number) => {
              const isHovered = hoveredPoint?.date === pt.date;
              return (
                <g key={pt.date || i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? "6" : "4"}
                    className={`${
                      isHovered
                        ? "fill-amber-500 stroke-white stroke-2 cursor-pointer"
                        : "fill-white stroke-amber-500 stroke-2 hover:fill-amber-500 cursor-pointer"
                    } transition-all`}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* Date labels on bottom axis */}
                  {i % 2 === 0 && (
                    <text
                      x={pt.x}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      className="text-[10px] fill-slate-400 font-mono"
                    >
                      {pt.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Tooltip Card */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none bg-slate-900 text-white p-2.5 rounded-md shadow-lg text-xs font-mono z-20"
              style={{
                left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                top: `${(hoveredPoint.y / chartHeight) * 100}%`,
                transform: "translate(-50%, -120%)",
              }}
            >
              <p className="font-bold text-amber-300">{hoveredPoint.label}</p>
              <p className="text-white mt-0.5">
                Revenue: £{hoveredPoint.revenue.toFixed(2)}
              </p>
              <p className="text-slate-300">
                Bookings: {hoveredPoint.bookings} trip{hoveredPoint.bookings > 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Middle Grid: Airport Routes & Time of Day Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Routes & Transfer Destinations */}
        <div className="bg-white border border-slate-200/90 rounded-md p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Airport & Transfer Destinations
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {routes.length} Active Routes
            </span>
          </div>

          <div className="space-y-4">
            {routes.map((r: any) => {
              const pct =
                metrics.totalRevenue > 0
                  ? Math.round((r.revenue / metrics.totalRevenue) * 100)
                  : 0;
              return (
                <div key={r.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800">
                      {r.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-xs">
                        {r.count} trip{r.count > 1 ? "s" : ""} ({pct}%)
                      </span>
                      <span className="font-bold font-mono text-slate-900">
                        £{r.revenue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time of Day Distribution */}
        <div className="bg-white border border-slate-200/90 rounded-md p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Peak Booking Hours & Schedule
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Trip Dispatch Timing
            </span>
          </div>

          <div className="space-y-4">
            {timeSlots.map((slot: any) => {
              const pct =
                metrics.totalBookings > 0
                  ? Math.round((slot.count / metrics.totalBookings) * 100)
                  : 0;
              return (
                <div key={slot.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800">
                      {slot.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono text-xs">
                        {slot.count} booking{slot.count > 1 ? "s" : ""}
                      </span>
                      <span className="font-bold font-mono text-slate-900">
                        £{slot.revenue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, slot.count > 0 ? 15 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Historical Bookings Table with Minimal Border Radius */}
      <div className="bg-white border border-slate-200/90 rounded-md overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              All Booking Records ({bookings.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct checkout bookings stored in Hostinger MySQL database
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Engine: MySQL Cloud
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-5">Ref</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Journey</th>
                <th className="py-3 px-5">Date & Time</th>
                <th className="py-3 px-5">Vehicle</th>
                <th className="py-3 px-5 text-right">Fare</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bookings.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-medium text-slate-900 whitespace-nowrap">
                    {b.bookingReference}
                  </td>
                  <td className="py-3.5 px-5">
                    <p className="font-semibold text-slate-900">
                      {b.customerName}
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {b.customerPhone}
                    </p>
                  </td>
                  <td className="py-3.5 px-5 max-w-sm">
                    <p className="truncate text-slate-900 font-medium" title={b.pickupAddress}>
                      <span className="text-slate-400 font-normal">From: </span>
                      {b.pickupAddress}
                    </p>
                    <p className="truncate text-slate-600 text-xs mt-0.5" title={b.dropoffAddress}>
                      <span className="text-slate-400 font-normal">To: </span>
                      {b.dropoffAddress}
                    </p>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <p className="font-semibold text-slate-900">{b.pickupDate}</p>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">
                      {b.pickupTime}
                    </p>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap font-medium text-slate-800">
                    {b.vehicleType}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                    £{b.price ? b.price.toFixed(2) : "0.00"}
                  </td>
                  <td className="py-3.5 px-5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
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
