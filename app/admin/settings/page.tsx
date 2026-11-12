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
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <svg className="animate-spin h-8 w-8 text-amber-400 mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <p className="text-sm">Loading system configuration...</p>
      </div>
    );
  }

  const sys = data?.system || {};
  const admin = data?.admin || {};

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          System & Business Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Connected database infrastructure, company information and admin credentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Infrastructure Status */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-base">
            <Database className="w-5 h-5 text-emerald-400" />
            <span>Database Infrastructure</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Database Engine:</span>
              <span className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Hostinger Cloud MySQL (Active)
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Host Server:</span>
              <span className="font-mono text-amber-400">{sys.databaseHost}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Bookings in Database:</span>
              <span className="font-bold text-white">{sys.totalBookings} records</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Active Drivers in Fleet:</span>
              <span className="font-bold text-white">{sys.totalDrivers} drivers</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Pricing Matrix Items:</span>
              <span className="font-bold text-white">{sys.pricingKeys} rate keys</span>
            </div>
          </div>
        </div>

        {/* Business Office Details */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-base">
            <Building className="w-5 h-5 text-amber-400" />
            <span>Business Information</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Trading Name:</span>
              <span className="font-semibold text-white">{sys.businessName}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Customer Helpline:</span>
              <a href="tel:02920454545" className="font-bold text-amber-400 hover:underline">
                {sys.businessPhone}
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Notification Email:</span>
              <span className="font-mono text-white">{sys.businessEmail}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">Office Location:</span>
              <span className="text-white">{sys.registeredOffice}</span>
            </div>
          </div>
        </div>

        {/* Admin Profile & Password Change */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-white font-bold text-base">
            <Lock className="w-5 h-5 text-sky-400" />
            <span>Admin Account Credentials</span>
          </div>

          {passwordStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                passwordStatus.success
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }`}
            >
              {passwordStatus.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {passwordStatus.message}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep same"
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {saving ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
