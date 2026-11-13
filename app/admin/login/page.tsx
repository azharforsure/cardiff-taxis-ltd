"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Invalid login credentials.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 text-zinc-100 antialiased">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <Link href="/" className="inline-block mb-3">
          <img
            src="/logo-concept-3-motion-light.svg"
            alt="Cardiff Taxis Ltd"
            className="h-9 w-auto mx-auto"
          />
        </Link>
        <h2 className="text-base font-semibold tracking-tight text-zinc-100">
          Operations Portal
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Sign in to access dispatch and fleet controls
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-[#121215] border border-white/[0.08] p-6 rounded-lg shadow-xl">
          {error && (
            <div className="mb-4 p-2.5 rounded-md bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                Authorized Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-md text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 shadow-sm disabled:opacity-50 transition-colors cursor-pointer"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-white/[0.06] text-center">
            <span className="text-[11px] font-mono text-zinc-500 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
              Protected Hostinger MySQL Database
            </span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
