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
  Inbox,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

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

      setPasswordStatus({
        success: true,
        message: "Profile updated successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      fetchSettings();
    } catch (err: any) {
      setPasswordStatus({ success: false, message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncNotice(null);
    try {
      const res = await fetch("/api/admin/resend/sync", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setSyncNotice(`Synced ${json.syncedCount} booking(s) from Resend.`);
        fetchSettings();
      } else {
        setSyncNotice(`Sync issue: ${json.error || "Unable to sync"}`);
      }
    } catch {
      setSyncNotice("Connection error syncing Resend.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-500 text-xs font-mono">
        <RefreshCw className="w-4 h-4 animate-spin text-amber-500 mx-auto mb-2" />
        Loading system configuration...
      </div>
    );
  }

  const sys = data?.system || {};
  const admin = data?.admin || {};

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Connected database configuration, business profiles, and access credentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Database Infrastructure Status */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <Database className="w-4 h-4 text-amber-500" />
            <span>Database & Cloud Engine</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Database Engine</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Hostinger Cloud MySQL
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Host Server</span>
              <span className="font-mono text-slate-800">{sys.databaseHost}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Stored Bookings</span>
              <span className="font-mono font-bold text-slate-900">
                {sys.totalBookings} records
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Active Driver Profile</span>
              <span className="font-mono font-bold text-slate-900">
                {sys.totalDrivers} active
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Pricing Keys</span>
              <span className="font-mono font-bold text-slate-900">
                {sys.pricingKeys} configured
              </span>
            </div>
          </div>
        </div>

        {/* Business Office Details */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <Building className="w-4 h-4 text-amber-500" />
            <span>Business Profile</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Company Name</span>
              <span className="font-semibold text-slate-900">
                {sys.businessName}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Phone Helpline</span>
              <span className="font-mono font-medium text-slate-900">
                {sys.phoneOffice}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Mobile / Dispatch</span>
              <span className="font-mono font-medium text-slate-900">
                {sys.phoneMobile}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Bookings Email</span>
              <span className="font-mono font-medium text-slate-900">
                {sys.emailSupport}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-500">Companies House Reg</span>
              <span className="font-mono font-medium text-slate-900">
                {sys.companyNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Data Sync Tool & Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Resend Sync Tool */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <Inbox className="w-4 h-4 text-amber-500" />
            <span>Historical Bookings Sync</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Synchronize past customer reservations sent through Resend notification emails directly into the Hostinger MySQL database.
          </p>

          {syncNotice && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
              {syncNotice}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-amber-400" : ""}`}
              />
              <span>{syncing ? "Syncing Resend..." : "Run Resend Sync"}</span>
            </button>
          </div>
        </div>

        {/* Admin Credentials & Password Change */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-700">
            <Lock className="w-4 h-4 text-amber-500" />
            <span>Access Credentials</span>
          </div>

          {passwordStatus && (
            <div
              className={`p-3 rounded-lg text-xs font-medium ${
                passwordStatus.success
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {passwordStatus.message}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Admin Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-amber-400 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                Account Email
              </label>
              <input
                type="email"
                disabled
                value={admin.email || ""}
                className="w-full py-1.5 px-2.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-500 cursor-not-allowed font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update Credentials"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
