"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Coins,
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
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-400">
        <div className="flex items-center gap-2.5 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
          Authenticating session...
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

  const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/bookings", label: "Bookings & Dispatch", icon: CalendarDays },
    { href: "/admin/drivers", label: "Fleet & Drivers", icon: Users },
    { href: "/admin/pricing", label: "Rates & Tariffs", icon: Coins },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] text-zinc-100 antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:inset-y-0 bg-[#0e0e11] border-r border-white/[0.07]">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Brand header */}
          <div className="px-5 pb-5 border-b border-white/[0.06]">
            <Link href="/admin" className="block">
              <img
                src="/logo-concept-3-motion-light.svg"
                alt="Cardiff Taxis Ltd"
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex items-center gap-2 mt-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-mono text-zinc-400 tracking-wide">
                OPERATIONS DESK
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 flex-1 px-2.5 space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                    active
                      ? "bg-white/[0.08] text-white border border-white/[0.08]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active ? "text-amber-400" : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* External links */}
          <div className="px-2.5 pt-3 border-t border-white/[0.06] space-y-0.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 rounded-md hover:bg-white/[0.03] transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                Live Customer Site
              </span>
              <span className="text-[10px] text-zinc-400">↗</span>
            </Link>

            <a
              href="tel:02920454545"
              className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 rounded-md hover:bg-white/[0.03] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-zinc-400" />
              Office: 029 2045 4545
            </a>
          </div>

          {/* User profile & logout */}
          <div className="p-3 mx-2.5 mt-3 bg-white/[0.02] border border-white/[0.06] rounded-md">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-200 truncate">{user.name}</p>
                <p className="text-[10px] font-mono text-zinc-400 truncate mt-0.5">
                  {user.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header Bar */}
        <header className="md:hidden h-12 flex items-center justify-between px-4 bg-[#0e0e11] border-b border-white/[0.07] z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1 -ml-1 text-zinc-400 hover:text-white"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-mono text-zinc-400">Online</span>
          </div>
        </header>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-64 bg-[#0e0e11] border-r border-white/[0.07] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <img
                      src="/logo-concept-3-motion-light.svg"
                      alt="Cardiff Taxis Ltd"
                      className="h-7 w-auto"
                    />
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-4 space-y-1">
                  {navItems.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                          active
                            ? "bg-white/[0.08] text-white border border-white/[0.08]"
                            : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-3 border-t border-white/[0.06]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-white/[0.04] text-zinc-300 hover:text-white text-xs font-medium border border-white/[0.06]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main dynamic workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#09090b]">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
