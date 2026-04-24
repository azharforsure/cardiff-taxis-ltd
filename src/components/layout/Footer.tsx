import { Link } from "react-router-dom";
import { Mail, Phone, ArrowRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-brand-primary text-white pt-[64px] lg:pt-[80px] pb-8 px-6 md:px-12 lg:px-[80px] font-sans">
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-0 mb-16 md:mb-24 lg:mb-[135px]">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start lg:pr-10">
            {/* Logo area */}
            <div className="flex items-start mb-16">
              <Link to="/">
                <img src="/logo-concept-3-motion-light.svg" alt="Cardiff Taxis Ltd" className="h-11 md:h-14 w-auto" />
              </Link>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-[14px] text-[15px] text-white font-semibold">
              <a
                href="mailto:bookings@cardifftaxisltd.co.uk"
                className="flex items-center gap-3 hover:text-brand-accent transition-colors"
              >
                <Mail className="w-[18px] h-[18px] font-light" strokeWidth={2} />
                bookings@cardifftaxisltd.co.uk
              </a>
              <a
                href="tel:07817385655"
                className="flex items-center gap-3 hover:text-brand-accent transition-colors"
              >
                <Phone className="w-[18px] h-[18px] font-light" strokeWidth={2} />
                07817 385655
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="lg:col-span-2 lg:pl-6 lg:border-l lg:border-white/10 pt-4 lg:pt-0">
            <ul className="space-y-[18px] text-[15px] font-semibold text-white">
              <li>
                <Link to="/" className="hover:text-brand-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/fleet" className="hover:text-brand-accent transition-colors">
                  Our Fleet & Pricing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="lg:col-span-2 lg:pl-6 lg:border-l lg:border-white/10 pt-4 lg:pt-0">
            <ul className="space-y-[18px] text-[15px] font-semibold text-white">
              <li>
                <Link to="/airport-transfers" className="hover:text-brand-accent transition-colors">
                  Airport Transfers
                </Link>
              </li>
              <li>
                <Link to="/airport-transfers" className="hover:text-brand-accent transition-colors">
                  Meet & Greets
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-accent transition-colors">
                  City Private Hire
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3 - Socials */}
          <div className="lg:col-span-2 lg:pl-6 lg:border-l lg:border-white/10 pt-4 lg:pt-0">
            <ul className="space-y-[18px] text-[15px] font-semibold text-white">
              <li>
                <a href="#" className="hover:text-brand-accent transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-accent transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-accent transition-colors">
                  Twitter (X)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-accent transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Booking / CTA Column flex-end aligned */}
          <div className="lg:col-span-2 flex flex-col items-start lg:items-end pt-4 lg:pt-0">
            <Link
              to="/book"
              className="inline-flex items-center justify-between gap-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-graphite font-bold text-[16px] h-[56px] px-2 pl-6 rounded-full hover:rounded-2xl transition-all w-full lg:min-w-[170px] shadow-lg group"
            >
              Book now
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0 text-white shadow-sm border border-brand-graphite/10 group-hover:scale-105 transition-transform">
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 font-medium text-white text-[15px]">
          <div className="flex flex-col items-center lg:items-start min-w-[250px] gap-0.5">
            <p>
              &copy; Cardiff Taxis Ltd. All rights reserved.
            </p>
            <p className="text-[13px] text-white/50">
              Company Registration No: 16436130
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-center flex-1 justify-around max-w-2xl px-10 gap-4 lg:gap-0">
            <Link to="/privacy" className="hover:text-brand-accent border-b border-transparent hover:border-brand-accent transition-all">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-brand-accent border-b border-transparent hover:border-brand-accent transition-all">
              Terms & Conditions
            </Link>
          </div>
          <p className="min-w-[250px] text-right">
            Website built by Cardiff Taxis
          </p>
        </div>
      </div>
    </footer>
  );
};
