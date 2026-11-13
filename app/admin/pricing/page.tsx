"use client";

import React, { useState, useEffect } from "react";
import {
  Coins,
  Save,
  CheckCircle2,
  Plane,
  Car,
  Clock,
  RefreshCw,
} from "lucide-react";

export default function AdminPricingPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pricing");
      if (res.ok) {
        const json = await res.json();
        setSettings(json.settings || []);
      }
    } catch (err) {
      console.error("Failed to load pricing:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
    setSavedSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = settings.map((s) => ({ key: s.key, value: s.value }));
      const res = await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Failed to save pricing:", err);
    } finally {
      setSaving(false);
    }
  };

  const fares = settings.filter((s) => s.category === "FARES");
  const airports = settings.filter((s) => s.category === "AIRPORTS");
  const surcharges = settings.filter((s) => s.category === "SURCHARGES");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pricing
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure vehicle base fares, mileage rates, and fixed airport transfers
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Pricing Saved
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-sm shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Pricing"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-500 text-sm font-mono">
          <RefreshCw className="w-5 h-5 animate-spin text-amber-500 mx-auto mb-2" />
          Loading tariff settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          {/* Base Fares & Mileage with Minimal Border Radius */}
          <div className="p-6 rounded-md bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <Car className="w-4 h-4 text-amber-500" />
              <span>Standard Vehicle Fares & Mileage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {fares.map((item) => (
                <div
                  key={item.key}
                  className="p-3.5 rounded-md bg-slate-50 border border-slate-200/80"
                >
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 truncate">
                    {item.label}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono text-sm font-bold">
                      £
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-mono font-bold text-slate-900 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Airport Fixed Tariffs */}
          <div className="p-6 rounded-md bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <Plane className="w-4 h-4 text-amber-500" />
              <span>Fixed Airport Transfers (From Cardiff Central)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {airports.map((item) => (
                <div
                  key={item.key}
                  className="p-3.5 rounded-md bg-slate-50 border border-slate-200/80"
                >
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 truncate">
                    {item.label}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono text-sm font-bold">
                      £
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-mono font-bold text-emerald-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Surcharges & Multipliers */}
          <div className="p-6 rounded-md bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Time & Night Surcharges</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {surcharges.map((item) => (
                <div
                  key={item.key}
                  className="p-3.5 rounded-md bg-slate-50 border border-slate-200/80"
                >
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {item.label}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-mono text-sm font-bold">
                      ×
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-md text-sm font-mono font-bold text-amber-600 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
