import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

export const Features = () => {
  return (
    <section className="pt-16 lg:pt-24 pb-0 bg-transparent relative w-full overflow-hidden">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px] relative z-10">
        {/* Top Split */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24 items-center">
          <div className="flex-[1.2] w-full">
            <span className="text-[10px] md:text-[11px] font-bold text-brand-graphite/60 uppercase tracking-[0.2em] mb-4 block">
              WHY CHOOSE CARDIFF TAXIS LTD
            </span>
            <h3 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold leading-[1.1] text-brand-graphite max-w-[600px] tracking-tight">
              Dependable travel services focused on comfort and punctuality
            </h3>
          </div>

          <div className="flex-[1.5] w-full relative">
            <div className="w-full h-[240px] md:h-[320px] rounded-[24px] overflow-hidden bg-gray-100">
              <img
                src="/images/features_family.png"
                alt="Family arriving at airport terminal"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Cutout overlapping button wrapper */}
            <div className="absolute bottom-0 right-0 bg-[#f9fafb] pt-4 pl-4 sm:pt-5 sm:pl-5 rounded-tl-[16px] md:rounded-tl-[24px] w-[80%] sm:w-auto">
              <Button className="bg-brand-graphite hover:bg-[#1a232c] text-white rounded-full hover:rounded-2xl pl-6 pr-1.5 py-1.5 h-11 font-bold text-[13px] flex items-center justify-between gap-4 w-full shadow-md transition-all">
                View prices
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-graphite stroke-[2.5]" />
                </div>
              </Button>
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
              <div className="h-[1px] w-full bg-black/[0.06] mb-6"></div>
              <h4 className="text-[16px] font-bold text-brand-graphite mb-3">
                {item.title}
              </h4>
              <p className="text-[14px] text-brand-graphite/60 font-medium leading-[1.6]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Plane and Dashed Lines spanning width */}
      <div className="w-full mt-16 md:mt-12 mb-2 md:mb-4 flex flex-row items-end justify-between gap-1 sm:gap-2 px-0 relative z-20 overflow-hidden">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={`left-${i}`}
            className="w-full h-[2px] bg-brand-graphite shrink"
          ></div>
        ))}
        <img
          src="https://cdn.prod.website-files.com/69173812d9ec8417630f5fe1/6967b4eb9cf04f284090ab17_Logo%20maker%20project-5.png"
          alt=""
          className="w-[60px] md:w-[5rem] shrink-0 rotate-[-15deg] translate-y-1 md:translate-y-2.5"
        />
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={`right-${i}`}
            className="w-full h-[2px] bg-brand-graphite shrink"
          ></div>
        ))}
      </div>
    </section>
  );
};
