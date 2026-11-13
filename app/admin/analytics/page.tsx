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
  Clock,
  Search,
  Filter,
} from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeMetric, setActiveMetric] = useState<"revenue" | "volume">("revenue");
  const [daysRange, setDaysRange] = useState<number>(14);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tableSearch, setTableSearch] = useState("");

  const fetchAnalytics = async (days = daysRange) => {
    try {
      const res = await fetch(`/api/admin/analytics?days=${days}`);
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
    fetchAnalytics(daysRange);
  }, [daysRange]);

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
      `cardiff-taxis-analytics-${new Date().toISOString().split("T")[0]}.csv`
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
          Loading analytics...
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalBookings: 0,
    totalRevenue: 0,
    avgFare: 0,
  };

  const timeline: any[] = data?.timeline || [];
  const routes = data?.routes || [];
  const vehicles = data?.vehicles || [];
  const timeSlots = data?.timeSlots || [];
  const bookings: any[] = data?.bookings || [];

  // Filtered bookings in table
  const filteredBookings = bookings.filter((b) => {
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return (
      b.bookingReference?.toLowerCase().includes(q) ||
      b.customerName?.toLowerCase().includes(q) ||
      b.customerPhone?.toLowerCase().includes(q) ||
      b.pickupAddress?.toLowerCase().includes(q) ||
      b.dropoffAddress?.toLowerCase().includes(q)
    );
  });

  // SVG Chart Geometry Calculations (True Full-Width 1000 x 260)
  const svgWidth = 1000;
  const svgHeight = 260;
  const padLeft = 60;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 40;
  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const rawMax = Math.max(
    ...timeline.map((d: any) =>
      activeMetric === "revenue" ? d.revenue : d.bookings
    ),
    0
  );
  // Round up to nice round ceiling
  const yMax =
    activeMetric === "revenue"
      ? Math.max(Math.ceil((rawMax * 1.25) / 20) * 20, 80)
      : Math.max(Math.ceil((rawMax * 1.3) / 2) * 2, 4);

  const points = timeline.map((d: any, i: number) => {
    const x = padLeft + (i / Math.max(timeline.length - 1, 1)) * chartW;
    const val = activeMetric === "revenue" ? d.revenue : d.bookings;
    const y = padTop + chartH - (val / yMax) * chartH;
    return { ...d, x, y, val };
  });

  const linePath = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, "");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`
      : "";

  const hoveredData =
    hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  return (
    <div className="space-y-6">
      {/* Header (No KPI Cards) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Revenue trends, airport corridors, fleet utilization, and trip history
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

      {/* 1. Main Full-Width Performance Chart Card */}
      <div className="bg-white border border-slate-200/90 rounded-md p-6 shadow-2xs">
        {/* Chart Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-5 h-5 text-amber-500 shrink-0" />
              <h2 className="text-base font-bold text-slate-900">
                Performance Over Time
              </h2>
            </div>

            {/* Dynamic Live Readout */}
            <div className="mt-1.5 flex items-center gap-2 text-sm">
              {hoveredData ? (
                <div className="flex items-center gap-2 font-mono">
                  <span className="font-bold text-slate-900">
                    {hoveredData.label}:
                  </span>
                  <span className="text-amber-600 font-bold">
                    £{hoveredData.revenue.toFixed(2)}
                  </span>
                  <span className="text-slate-500 font-normal">
                    ({hoveredData.bookings} booking
                    {hoveredData.bookings === 1 ? "" : "s"})
                  </span>
                </div>
              ) : (
                <div className="text-slate-500 text-xs">
                  <span>Selected {daysRange}-day total: </span>
                  <span className="font-bold font-mono text-slate-900">
                    £{metrics.totalRevenue.toFixed(2)}
                  </span>{" "}
                  across{" "}
                  <span className="font-bold font-mono text-slate-900">
                    {metrics.totalBookings}
                  </span>{" "}
                  rides
                </div>
              )}
            </div>
          </div>

          {/* Controls: Metric Toggle + Time Range Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Metric Mode */}
            <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 text-xs">
              <button
                onClick={() => setActiveMetric("revenue")}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  activeMetric === "revenue"
                    ? "bg-white text-slate-900 shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Revenue (£)
              </button>
              <button
                onClick={() => setActiveMetric("volume")}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                  activeMetric === "volume"
                    ? "bg-white text-slate-900 shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Booking Volume
              </button>
            </div>

            {/* Range Selectors */}
            <div className="flex items-center bg-slate-100 p-1 rounded-md border border-slate-200 text-xs">
              {[7, 14, 30].map((num) => (
                <button
                  key={num}
                  onClick={() => setDaysRange(num)}
                  className={`px-2.5 py-1.5 rounded font-medium transition-colors cursor-pointer ${
                    daysRange === num
                      ? "bg-white text-slate-900 shadow-2xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {num}D
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 100% Full-Width Clean SVG Graph */}
        <div className="w-full mt-4 select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-64 overflow-visible"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <defs>
              <linearGradient id="areaAmberGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
              const y = padTop + chartH * pct;
              const val = Math.round(yMax * (1 - pct));
              return (
                <g key={pct}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[11px] fill-slate-400 font-mono"
                  >
                    {activeMetric === "revenue" ? `£${val}` : val}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            {points.length > 0 && (
              <path d={areaPath} fill="url(#areaAmberGrad)" />
            )}

            {/* Stroke Line */}
            {points.length > 0 && (
              <path
                d={linePath}
                fill="none"
                stroke="#D97706"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Activity Highlight Circles (Only for non-zero points or hovered points) */}
            {points.map((pt, i) => {
              const hasActivity = pt.val > 0;
              const isHovered = hoveredIndex === i;

              if (!hasActivity && !isHovered) return null;

              return (
                <circle
                  key={pt.date || i}
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "6" : "4.5"}
                  className={`${
                    isHovered
                      ? "fill-amber-500 stroke-white stroke-2"
                      : "fill-white stroke-amber-500 stroke-2"
                  } transition-all`}
                />
              );
            })}

            {/* Bottom X-Axis Date Labels */}
            {points.map((pt, i) => {
              // Show evenly spaced date markers
              const step = daysRange <= 7 ? 1 : daysRange <= 14 ? 2 : 4;
              const isLabelVisible = i % step === 0 || i === points.length - 1;

              if (!isLabelVisible) return null;

              return (
                <text
                  key={pt.date}
                  x={pt.x}
                  y={svgHeight - 12}
                  textAnchor="middle"
                  className="text-[11px] fill-slate-400 font-mono"
                >
                  {pt.label}
                </text>
              );
            })}

            {/* Hover Crosshair Guide Line (Pure SVG, Zero Glitch) */}
            {hoveredData && (
              <g pointerEvents="none">
                <line
                  x1={hoveredData.x}
                  y1={padTop}
                  x2={hoveredData.x}
                  y2={padTop + chartH}
                  stroke="#94A3B8"
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                />

                {/* SVG-Anchored Tooltip Bubble */}
                <g
                  transform={`translate(${
                    hoveredData.x > svgWidth - 140
                      ? hoveredData.x - 130
                      : hoveredData.x < padLeft + 70
                        ? hoveredData.x + 10
                        : hoveredData.x - 60
                  }, ${Math.max(hoveredData.y - 55, padTop + 5)})`}
                >
                  <rect
                    width="120"
                    height="44"
                    rx="4"
                    fill="#0F172A"
                    className="shadow-lg"
                  />
                  <text
                    x="60"
                    y="17"
                    textAnchor="middle"
                    fill="#F59E0B"
                    fontSize="11"
                    fontWeight="bold"
                    className="font-mono"
                  >
                    {hoveredData.label}
                  </text>
                  <text
                    x="60"
                    y="33"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="12"
                    fontWeight="bold"
                    className="font-mono"
                  >
                    £{hoveredData.revenue.toFixed(2)} ({hoveredData.bookings})
                  </text>
                </g>
              </g>
            )}

            {/* Interactive Slices for Seamless Hover Hit Testing Across Entire Chart */}
            {points.map((pt, i) => {
              const sliceWidth = chartW / points.length;
              const sliceX = pt.x - sliceWidth / 2;

              return (
                <rect
                  key={`slice-${i}`}
                  x={sliceX}
                  y={padTop}
                  width={sliceWidth}
                  height={chartH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. Middle Row: Airport Transfer Corridors & Time Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Airport Transfer Corridors */}
        <div className="bg-white border border-slate-200/90 rounded-md p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Airport & Destination Corridors
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {routes.length} Active Corridors
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
                      style={{ width: `${Math.max(pct, 12)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak Dispatch Hours Schedule */}
        <div className="bg-white border border-slate-200/90 rounded-md p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Peak Dispatch Hours
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Trip Timing Distribution
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
                      style={{
                        width: `${Math.max(pct, slot.count > 0 ? 15 : 0)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Detailed Booking Records & Audit Log Table with Search */}
      <div className="bg-white border border-slate-200/90 rounded-md overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Financial Booking Records ({filteredBookings.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct checkout and verified sumup transactions stored in database
            </p>
          </div>

          {/* Quick Search inside Table */}
          <div className="relative sm:w-64">
            <input
              type="text"
              placeholder="Search reference or name..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-xs border-b border-slate-200 font-semibold">
              <tr>
                <th className="py-3 px-5">Ref</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Journey</th>
                <th className="py-3 px-5">Pickup Date & Time</th>
                <th className="py-3 px-5">Vehicle</th>
                <th className="py-3 px-5 text-right">Fare</th>
                <th className="py-3 px-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                    No matching booking records found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b: any) => (
                  <tr
                    key={b.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
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
                      <p
                        className="truncate text-slate-900 font-medium"
                        title={b.pickupAddress}
                      >
                        <span className="text-slate-400 font-normal">From: </span>
                        {b.pickupAddress}
                      </p>
                      <p
                        className="truncate text-slate-600 text-xs mt-0.5"
                        title={b.dropoffAddress}
                      >
                        <span className="text-slate-400 font-normal">To: </span>
                        {b.dropoffAddress}
                      </p>
                    </td>
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <p className="font-semibold text-slate-900">
                        {b.pickupDate}
                      </p>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
