"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Database,
  Lock,
  Building,
  CheckCircle2,
  AlertCircle,
  Save,
  Server,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setName(json.admin?.name || "");
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setPasswordStatus(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Update failed");
      }

      setPasswordStatus({ success: true, message: "Profile updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      fetchSettings();
    } catch (err: any) {
      setPasswordStatus({ success: false, message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-zinc-400 text-xs font-mono">
        <RefreshCw className="w-4 h-4 animate-spin text-amber-400 mx-auto mb-2" />
        Loading system configuration...
      </div>
    );
  }

  const sys = data?.system || {};
  const admin = data?.admin || {};

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-2 border-b border-white/[0.06]">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
          Settings & Infrastructure
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Connected database configuration, business profiles and access credentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Database Infrastructure Status */}
        <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.06] space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06] text-xs font-mono uppercase tracking-wider text-zinc-300">
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            <span>Database Infrastructure</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
              <span className="text-zinc-400">Database Engine</span>
              <span className="font-medium text-zinc-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Hostinger Cloud MySQL
              </span>
            </div>

            <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
              <span className="text-zinc-400">Host Server</span>
              <span className="font-mono text-zinc-300">{sys.databaseHost}</span>
            </div>

            <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
              <span className="text-zinc-400">Stored Bookings</span>
              <span className="font-mono font-medium text-zinc-200">{sys.totalBookings} records</span>
            </div>

            <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
              <span className="text-zinc-400">Active Driver Profile</span>
              <span className="font-mono font-medium text-zinc-200">{sys.totalDrivers} active</span>
            </div>

            <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
              <span className="text-zinc-400">Tariff Keys</span>
              <span className="font-mono font-medium text-zinc-200">{sys.pricingKeys} rates</span>
            </div>
          </div>
        </div>

        {/* Business Office Details */}
        <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.06] space-y-3">
          <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06] text-xs font-mono uppercase tracking-wider text-zinc-300">
            <Building className="w-3.5 h-3.5 text-zinc-400" />
            <span>Business Profile</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
              <span className="text-zinc-400">Company Name</span>
              <span className="font-medium text-zinc-200">{sys.businessName}</span>
            </div>

            <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
              <span className="text-zinc-400">Phone Helpline</span>
              <span className="font-mono text-zinc-300">{sys.phoneOffice}</span>
            </div>

            <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
              <span className="text-zinc-400">Mobile / Dispatch</span>
              <span className="font-mono text-zinc-300">{sys.phoneMobile}</span>
            </div>

            <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
              <span className="text-zinc-400">Bookings Email</span>
              <span className="font-mono text-zinc-300">{sys.emailSupport}</span>
            </div>

            <div className="p-2.5 rounded-md bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
              <span className="text-zinc-400">Companies House Reg</span>
              <span className="font-mono text-zinc-300">{sys.companyNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Credentials & Password Change */}
      <div className="p-4 rounded-lg bg-[#121215] border border-white/[0.06] max-w-xl space-y-3">
        <div className="flex items-center gap-2 pb-2.5 border-b border-white/[0.06] text-xs font-mono uppercase tracking-wider text-zinc-300">
          <Lock className="w-3.5 h-3.5 text-zinc-400" />
          <span>Access Credentials</span>
        </div>

        {passwordStatus && (
          <div
            className={`p-2.5 rounded-md text-xs font-medium ${
              passwordStatus.success
                ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
                : "bg-rose-950/40 text-rose-300 border border-rose-800/40"
            }`}
          >
            {passwordStatus.message}
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-zinc-300 mb-1">
              Admin Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-300 mb-1">
              Account Email
            </label>
            <input
              type="email"
              disabled
              value={admin.email || ""}
              className="w-full py-1.5 px-2.5 bg-zinc-950 border border-white/[0.04] rounded-md text-xs text-zinc-500 cursor-not-allowed font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full py-1.5 px-2.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? "Saving..." : "Update Credentials"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
