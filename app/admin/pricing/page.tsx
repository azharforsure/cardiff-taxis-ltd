"use client";

import React, { useState, useEffect } from "react";
import { Coins, Save, CheckCircle2, AlertCircle, Plane, Car, Clock } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pricing & Tariffs Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update base fares, mileage rates, and fixed airport transfer tariffs
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Pricing Updated & Saved!
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <svg className="animate-spin h-6 w-6 text-amber-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Loading pricing matrix...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Base Fares & Mileage */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-base">
              <Car className="w-5 h-5 text-amber-400" />
              <span>Standard Vehicle Fares & Per-Mile Rates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fares.map((item) => (
                <div key={item.key} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    {item.label}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-sm">
                      £
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Airport Fixed Tariffs */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-base">
              <Plane className="w-5 h-5 text-sky-400" />
              <span>Fixed Airport Transfer Rates (From Cardiff Central)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {airports.map((item) => (
                <div key={item.key} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    {item.label}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 text-sm">
                      £
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-sm font-bold text-emerald-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Surcharges & Multipliers */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-base">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Night-time & Weekend Multiplier</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {surcharges.map((item) => (
                <div key={item.key} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    {item.label}
                  </label>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleChange(item.key, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Example: 1.25 equals a 25% surcharge applied between 23:00 and 06:00.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 disabled:opacity-50 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Pricing Matrix"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
