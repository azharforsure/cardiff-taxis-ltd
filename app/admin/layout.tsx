import React from "react";
import { getCurrentAdmin } from "@/lib/admin-auth";
import AdminNavShell from "@/components/admin/AdminNavShell";

export const metadata = {
  title: "Admin Portal | Cardiff Taxis Ltd",
  description: "Operations, Dispatch and Bookings Management for Cardiff Taxis Ltd",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 antialiased selection:bg-amber-500/30">
      <AdminNavShell user={admin}>{children}</AdminNavShell>
    </div>
  );
}
