"use client";

import { Phone, ArrowRight } from "lucide-react";
import { Link } from "../ui/Link";
import { trackPhoneCall } from "../../lib/gtag";

export const Pricing = () => {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 w-full max-w-[1400px] mx-auto">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-brand-muted text-[13px] md:text-[14px] font-semibold tracking-[0.2em] uppercase mb-3 block">
          PRICING
        </span>
        <h2 className="text-[28px] md:text-[34px] lg:text-[42px] font-bold text-brand-graphite mb-6 leading-[1.1] tracking-tight">
          Competitive & Fixed Fares
        </h2>
        <p className="text-[16px] text-brand-muted/80 leading-relaxed mb-10 font-semibold max-w-2xl mx-auto">
          Every journey is quoted upfront before you confirm. With no running meters and no surprise fees, you receive honest, fixed pricing based on your route and vehicle choice.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="tel:07817385655"
            onClick={() => trackPhoneCall("07817385655", "pricing_section")}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-primary text-white text-[16px] font-bold shadow-lg shadow-brand-primary/20 transition-all duration-300 hover:scale-105 hover:bg-brand-graphite w-full sm:w-auto"
          >
            <Phone className="w-5 h-5" strokeWidth={2.5} />
            Call Us (07817 385655)
          </a>
          <Link
            to="/book"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-accent text-brand-graphite text-[16px] font-bold shadow-md hover:bg-brand-accent-hover transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            Get an Instant Quote
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
