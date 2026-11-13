"use client";

import React, { useState, useEffect } from "react";
import { Coins, Save, CheckCircle2, Plane, Car, Clock, RefreshCw } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            Rates & Tariffs
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Configure vehicle base fares, mileage rates and fixed airport prices
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Settings Saved
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-zinc-400 text-xs font-mono">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-400 mx-auto mb-2" />
          Loading tariff settings...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {/* Base Fares & Mileage */}
          <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06] text-xs font-mono uppercase tracking-wider text-zinc-300">
              <Car className="w-3.5 h-3.5 text-zinc-400" />
              <span>Standard Vehicle Fares & Mileage</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {fares.map((item) => (
                <div key={item.key} className="p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1.5 truncate">
                    {item.label}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-500 font-mono text-xs">
                      £
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full pl-6 pr-2.5 py-1 bg-zinc-900 border border-white/[0.08] rounded-md text-xs font-mono font-medium text-zinc-100 focus:border-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Airport Fixed Tariffs */}
          <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06] text-xs font-mono uppercase tracking-wider text-zinc-300">
              <Plane className="w-3.5 h-3.5 text-zinc-400" />
              <span>Fixed Airport Transfers (From Cardiff Central)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {airports.map((item) => (
                <div key={item.key} className="p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1.5 truncate">
                    {item.label}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-500 font-mono text-xs">
                      £
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full pl-6 pr-2.5 py-1 bg-zinc-900 border border-white/[0.08] rounded-md text-xs font-mono font-medium text-emerald-400 focus:border-zinc-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Surcharges & Multipliers */}
          <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.06] space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06] text-xs font-mono uppercase tracking-wider text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Time & Night Surcharges</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {surcharges.map((item) => (
                <div key={item.key} className="p-3 rounded-md bg-white/[0.02] border border-white/[0.06]">
                  <label className="block text-[11px] font-medium text-zinc-300 mb-1.5">
                    {item.label}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-500 font-mono text-xs">
                      ×
                    </span>
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full pl-6 pr-2.5 py-1 bg-zinc-900 border border-white/[0.08] rounded-md text-xs font-mono font-medium text-amber-300 focus:border-zinc-500 focus:outline-none"
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
