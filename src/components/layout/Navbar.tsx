import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, PlaneTakeoff } from "lucide-react";
import { Button } from "../ui/Button";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Our Fleet", href: "/fleet" },
    { name: "Airport Transfers", href: "/airport-transfers" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 pt-8 pb-4 text-white">
      <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between px-6 md:px-12 lg:px-[80px]">
        <Link to="/" className="flex items-center shrink-0">
          <img src="/logo-concept-3-motion-light.svg" alt="Cardiff Taxis Ltd" className="h-14 md:h-16 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7 translate-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-[13px] font-bold transition-colors hover:text-white/80 flex items-center gap-1.5 text-white"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-8">
          <Link to="/book">
            <Button
              variant="accent"
              className="text-brand-graphite px-6 font-bold rounded-full hover:rounded-xl h-11 text-[13px] hover:bg-brand-accent-hover transition-all"
            >
              Book now
            </Button>
          </Link>
        </div>

        <button
          className="lg:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-8 h-8" />
          ) : (
            <Menu className="w-8 h-8" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 p-4 bg-brand-primary border-b border-white/10 shadow-xl lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-base font-bold text-white hover:text-brand-accent"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
              <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="accent"
                  className="w-full text-brand-graphite font-bold h-12 rounded-full hover:rounded-xl text-[14px] transition-all"
                >
                  Book now
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
