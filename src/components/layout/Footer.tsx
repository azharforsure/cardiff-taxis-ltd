import { Link } from "react-router-dom";
import { Mail, Phone, ArrowRight, PlaneTakeoff } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#36404a] text-white pt-[64px] lg:pt-[80px] pb-8 px-6 md:px-12 lg:px-[80px] font-sans">
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-0 mb-32">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start lg:pr-10">
            {/* Logo area */}
            <div className="flex items-start mb-16">
              <Link to="/">
                <img src="/logo-concept-3-motion-light.svg" alt="Cardiff Taxis Ltd" className="h-16 md:h-20 w-auto" />
              </Link>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-[14px] text-[14.5px] text-white font-semibold">
              <a
                href="mailto:bookings@cardifftaxisltd.co.uk"
                className="flex items-center gap-3 hover:text-[#f2ba4d] transition-colors"
              >
                <Mail className="w-[18px] h-[18px] font-light" strokeWidth={2} />
                bookings@cardifftaxisltd.co.uk
              </a>
              <a
                href="tel:07459466835"
                className="flex items-center gap-3 hover:text-[#f2ba4d] transition-colors"
              >
                <Phone className="w-[18px] h-[18px] font-light" strokeWidth={2} />
                07459 466835
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="lg:col-span-3 lg:pl-10 lg:border-l lg:border-white/10 pt-4 lg:pt-0">
            <h4 className="text-white/50 text-[12px] uppercase font-bold tracking-wider mb-6">Company</h4>
            <ul className="space-y-[18px] text-[14.5px] font-semibold text-white">
              <li>
                <Link to="/" className="hover:text-[#f2ba4d] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/fleet" className="hover:text-[#f2ba4d] transition-colors">
                  Our Fleet & Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#f2ba4d] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="lg:col-span-3 lg:pl-10 lg:border-l lg:border-white/10 pt-4 lg:pt-0">
            <h4 className="text-white/50 text-[12px] uppercase font-bold tracking-wider mb-6">Services</h4>
            <ul className="space-y-[18px] text-[14.5px] font-semibold text-white">
              <li>
                <Link to="/airport-transfers" className="hover:text-[#f2ba4d] transition-colors">
                  Airport Transfers
                </Link>
              </li>
              <li>
                <Link to="/airport-transfers" className="hover:text-[#f2ba4d] transition-colors">
                  Meet & Greets
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#f2ba4d] transition-colors">
                  City Private Hire
                </Link>
              </li>
            </ul>
          </div>

          {/* Booking / CTA Column flex-end aligned */}
          <div className="lg:col-span-2 flex flex-col items-start lg:items-end pt-4 lg:pt-0">
            <Link
              to="/book"
              className="inline-flex items-center justify-between gap-4 bg-[#f2ba4d] hover:bg-[#e0a83b] text-[#2a3036] font-bold text-[13px] h-11 px-1.5 pl-6 rounded-full hover:rounded-2xl transition-all w-full lg:min-w-[170px]"
            >
              Book now
              <div className="w-8 h-8 rounded-full bg-[#36404a] flex items-center justify-center flex-shrink-0 text-white shadow-sm border border-[#2a3036]/10">
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 font-medium text-white text-[14px]">
          <div className="flex flex-col items-center lg:items-start min-w-[250px] gap-0.5">
            <p>
              &copy; Cardiff Taxis Ltd. All rights reserved.
            </p>
            <p className="text-[12px] text-white/50">
              Company Registration No: 16436130
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center flex-1 justify-around max-w-2xl px-10 gap-4 lg:gap-0">
            <Link to="/privacy" className="hover:text-[#f2ba4d] border-b border-transparent hover:border-[#f2ba4d] transition-all">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-[#f2ba4d] border-b border-transparent hover:border-[#f2ba4d] transition-all">
              Terms & Conditions
            </Link>
          </div>
          <p className="min-w-[250px] text-right">
            Website built by Cardiff Taxis
          </p>        </div>
      </div>
    </footer>
  );
};

