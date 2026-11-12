"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AirportButtons } from "../sections/AirportButtons";

export function PublicLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <div className="w-full min-h-screen bg-slate-950">{children}</div>;
  }

  return (
    <>
      {/* Background base for public customer site */}
      <div className="fixed inset-0 bg-brand-white z-[0]"></div>

      {/* Background Vertical Lines Overlay */}
      <div className="fixed inset-x-0 top-0 bottom-0 pointer-events-none hidden md:flex justify-center z-[1]">
        <div className="w-full max-w-[1400px] h-full px-[30px] relative">
          <div className="w-full h-full border-l border-r border-black/[0.08] relative"></div>
        </div>
      </div>

      {/* Public Site Layout */}
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>

        <div className="mt-4 mb-1">
          <AirportButtons />
        </div>

        {/* Footer Card */}
        <div className="px-1 md:px-1.5 pb-1 md:pb-1.5">
          <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05]">
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
