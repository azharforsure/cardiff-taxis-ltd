/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AirportButtons } from "./components/sections/AirportButtons";
import { Home } from "./pages/Home";
import { Booking } from "./pages/Booking";
import { Fleet } from "./pages/Fleet";
import { AirportTransfers } from "./pages/AirportTransfers";
import { Contact } from "./pages/Contact";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white font-sans text-brand-graphite selection:bg-brand-accent/30 relative overflow-hidden">
          {/* Background base */}
          <div className="fixed inset-0 bg-brand-white z-[0]"></div>

          {/* Background Vertical Lines Overlay */}
          <div className="fixed inset-x-0 top-0 bottom-0 pointer-events-none hidden md:flex justify-center z-[1]">
            <div className="w-full max-w-[1400px] h-full px-[30px] relative">
              <div className="w-full h-full border-l border-r border-black/[0.08] relative"></div>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full flex flex-col">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/book" element={<Booking />} />
                <Route path="/fleet" element={<Fleet />} />
                <Route path="/airport-transfers" element={<AirportTransfers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
            </main>

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
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
