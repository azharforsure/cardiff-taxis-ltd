import React from "react";
import { redirect } from "next/navigation";
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

  // If user is not logged in, AdminNavShell handles login view or redirect
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500/30">
      <AdminNavShell user={admin}>{children}</AdminNavShell>
    </div>
  );
}
