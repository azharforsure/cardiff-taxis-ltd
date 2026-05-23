import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export const Features = () => {
  return (
    <section className="pt-16 lg:pt-24 pb-0 bg-transparent relative w-full overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px] relative z-10">
        {/* Top Split */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24 items-center">
          <div className="flex-[1.2] w-full">
            <span className="text-[14px] font-bold text-brand-graphite mb-3 uppercase tracking-wider opacity-60">
              WHY CHOOSE CARDIFF TAXIS LTD
            </span>
            <h3 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold leading-[1.1] text-brand-graphite max-w-[600px] tracking-tight">
              Dependable travel services focused on comfort and punctuality
            </h3>
          </div>

          <div className="flex-[1.5] w-full relative">
            <div className="w-full h-[240px] md:h-[320px] rounded-[24px] overflow-hidden bg-brand-section">
              <img
                src="/images/features_family.png"
                alt="Family arriving at airport terminal"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Cutout overlapping button wrapper */}
            <div className="absolute bottom-0 right-0 bg-white pt-4 pl-4 sm:pt-5 sm:pl-5 rounded-tl-[16px] md:rounded-tl-[24px] w-[80%] sm:w-auto">
              <Link to="/book" className="block w-full">
                <Button className="bg-brand-graphite hover:bg-brand-primary text-white rounded-full hover:rounded-2xl pl-6 pr-2 py-2 h-[56px] font-bold text-[16px] flex items-center justify-between gap-4 w-full shadow-lg transition-all group">
                  Get a quote
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ArrowRight className="w-4 h-4 text-brand-graphite stroke-[2.5]" />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mt-16 max-w-full">
          {[
            {
              title: "24/7 service",
              desc: "Available day or night to accommodate early flights or late evening city trips.",
            },
            {
              title: "Flight tracking",
              desc: "We monitor flight numbers to adjust pick up times automatically for all airport arrivals.",
            },
            {
              title: "Fixed prices",
              desc: "The price we quote is the exact amount you pay upon reaching the destination.",
            },
            {
              title: "Local drivers",
              desc: "Our drivers are fully licensed and hold extensive knowledge of the best Cardiff routes.",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col">
              <div className="h-[1px] w-full bg-brand-graphite/[0.06] mb-6"></div>
              <h4 className="text-[20px] font-bold text-brand-graphite mb-2">
                {item.title}
              </h4>
              <p className="text-brand-muted text-[15px] leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Plane and Dashed Lines spanning width */}
      <div className="w-full mt-16 md:mt-12 mb-2 md:mb-4 flex flex-row items-center justify-between px-0 relative z-20 overflow-hidden">
        <div className="flex-[0.4] h-[2px] border-t-2 border-dashed border-brand-graphite/30"></div>
        <img
          src="/images/plane.png"
          alt=""
          className="w-[80px] md:w-[7rem] shrink-0 rotate-[-15deg] px-4 opacity-70 hover:scale-110 hover:translate-x-2 transition-transform duration-500 cursor-pointer"
          style={{ filter: 'brightness(0)' }}
        />
        <div className="flex-[1] h-[2px] border-t-2 border-dashed border-brand-graphite/30"></div>
      </div>
    </section>
  );
};
