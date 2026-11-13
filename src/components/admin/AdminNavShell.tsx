"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Car,
  Coins,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  PhoneCall,
} from "lucide-react";

interface AdminNavShellProps {
  user: { id: string; email: string; name: string; role: string } | null;
  children: React.ReactNode;
}

export default function AdminNavShell({ user, children }: AdminNavShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!user && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [user, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-400">
        <div className="flex items-center gap-2.5 text-sm font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          Checking session...
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const primaryNavItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
    { href: "/admin/drivers", label: "Fleet", icon: Car },
    { href: "/admin/pricing", label: "Pricing", icon: Coins },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] text-slate-900 antialiased">
      {/* Desktop Sidebar (Slimmer Dark Charcoal framing) */}
      <aside className="hidden md:flex md:w-52 md:flex-col md:inset-y-0 bg-[#0f1117] border-r border-slate-800 text-slate-200 shrink-0">
        <div className="flex flex-col flex-grow pt-4 pb-3 overflow-y-auto">
          {/* Brand header */}
          <div className="px-4 pb-4 border-b border-slate-800/80">
            <Link href="/admin" className="block">
              <img
                src="/logo-concept-3-motion-light.svg"
                alt="Cardiff Taxis Ltd"
                className="h-7 w-auto max-w-[150px] object-contain"
              />
            </Link>
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-mono text-slate-400 tracking-wide uppercase">
                Operations Desk
              </span>
            </div>
          </div>

          {/* Primary Navigation Links */}
          <nav className="mt-4 px-2 space-y-1">
            {primaryNavItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-md transition-colors ${
                    active
                      ? "bg-slate-800 text-white shadow-2xs font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      active ? "text-amber-400" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom section (Settings moved to bottom + Links + User card) */}
          <div className="mt-auto pt-3 flex flex-col space-y-2">
            {/* Settings link pinned right above external links */}
            <div className="px-2">
              <Link
                href="/admin/settings"
                className={`group flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-md transition-colors ${
                  pathname === "/admin/settings"
                    ? "bg-slate-800 text-white shadow-2xs font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]"
                }`}
              >
                <Settings
                  className={`w-4 h-4 shrink-0 ${
                    pathname === "/admin/settings"
                      ? "text-amber-400"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>Settings</span>
              </Link>
            </div>

            {/* Quick links */}
            <div className="px-2 pt-2.5 border-t border-slate-800/80 space-y-0.5">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-md hover:bg-white/[0.03] transition-colors"
              >
                <span className="flex items-center gap-2 truncate">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  Live Site
                </span>
                <span className="text-[10px] text-slate-500">↗</span>
              </Link>

              <a
                href="tel:02920454545"
                className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 rounded-md hover:bg-white/[0.03] transition-colors truncate"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">029 2045 4545</span>
              </a>
            </div>

            {/* User profile & logout */}
            <div className="p-2.5 mx-2 bg-slate-900/90 border border-slate-800 rounded-md">
              <div className="flex items-center justify-between gap-1.5">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {user.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex flex-col flex-1 overflow-hidden bg-[#f8fafc]">
        {/* Mobile Header Bar */}
        <header className="md:hidden h-14 flex items-center justify-between px-4 bg-[#0f1117] border-b border-slate-800 z-10 text-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 -ml-1 text-slate-400 hover:text-white"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/admin" className="flex items-center">
              <img
                src="/logo-concept-3-motion-light.svg"
                alt="Cardiff Taxis Ltd"
                className="h-6 w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-mono text-slate-300">Desk Online</span>
          </div>
        </header>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-xs">
            <div className="fixed inset-y-0 left-0 w-64 bg-[#0f1117] border-r border-slate-800 p-4 flex flex-col justify-between text-white">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <img
                      src="/logo-concept-3-motion-light.svg"
                      alt="Cardiff Taxis Ltd"
                      className="h-7 w-auto"
                    />
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-5 space-y-1">
                  {primaryNavItems.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                          active
                            ? "bg-slate-800 text-white"
                            : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                  <Link
                    href="/admin/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      pathname === "/admin/settings"
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </nav>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-slate-800 text-slate-300 hover:text-white text-sm font-medium border border-slate-700"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main dynamic workspace - scaled comfortably, no zoomed out look */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 lg:p-8 bg-[#f8fafc]">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
