import { ArrowRight, Plane, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export const Pricing = ({ hideCta = false }: { hideCta?: boolean }) => {
  const fleetRates = [
    { name: "Saloon", startPrice: "£4", perMile: "£2.50" },
    { name: "Estate", startPrice: "£8", perMile: "£2.50" },
    { name: "Executive", startPrice: "£8", perMile: "£3.00" },
    { name: "People Carrier", startPrice: "£10", perMile: "£3.00" },
    { name: "Executive People Carrier", startPrice: "£15", perMile: "£3.00" },
    { name: "8-Seater Minibus", startPrice: "£12", perMile: "£3.00" },
  ];

  return (
    <section className="py-16 lg:py-24 bg-transparent" id="pricing">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16 items-start lg:items-end justify-between">
          <div className="flex-1 max-w-3xl">
            <span className="text-[15px] font-bold text-brand-primary/60 uppercase tracking-[0.2em] mb-4 block">
              FLEET & PRICING
            </span>
            <h3 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-brand-graphite mb-6 leading-[1.1] tracking-tight">
              Clear and competitive rates
            </h3>
            <p className="text-brand-muted/80 text-[15px] font-normal leading-relaxed max-w-[800px]">
              Our pricing is structured to be clear and straightforward, based heavily on the vehicle chosen. Every journey starts with a fixed first-mile rate, followed by a flat per-mile charge for the rest of the trip.
            </p>
          </div>
          <div className="flex gap-3 flex-col sm:flex-row shrink-0 lg:pt-8 w-full lg:w-auto ml-auto">
            <Link to="/book" className="w-full lg:w-auto">
              <button className="rounded-full hover:rounded-2xl pl-6 pr-1.5 py-1.5 bg-brand-primary text-white font-bold flex items-center justify-between gap-4 hover:bg-brand-graphite transition-all w-full text-[16px] h-12 shadow-md">
                Book a transfer now
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-brand-primary stroke-[2.5]" />
                </div>
              </button>
            </Link>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${hideCta ? 'mb-0' : 'mb-24'}`}>
          {fleetRates.map((vehicle, index) => (
            <div
              key={index}
              className="group bg-brand-section hover:bg-brand-primary border border-brand-border hover:border-brand-primary rounded-[24px] p-6 lg:p-8 flex flex-col justify-between min-h-[200px] transition-all duration-300 shadow-sm hover:shadow-xl cursor-default"
            >
              <div>
                <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center -ml-1.5 mb-5 bg-transparent group-hover:bg-brand-accent transition-colors duration-300">
                  <Car className="w-[20px] h-[20px] text-brand-graphite" strokeWidth={1.5} />
                </div>
                <h4 className="text-[18px] font-semibold text-brand-graphite group-hover:text-brand-accent transition-colors duration-300">
                  {vehicle.name}
                </h4>
              </div>
              <div className="flex flex-col gap-2 mt-6">
                <div className="flex items-center justify-between border-b border-brand-border group-hover:border-white/10 pb-2 transition-colors duration-300">
                  <span className="text-[14px] text-brand-muted group-hover:text-white/60 font-medium transition-colors duration-300">Start price</span>
                  <span className="text-[18px] font-bold text-brand-graphite group-hover:text-white transition-colors duration-300">
                    {vehicle.startPrice}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[14px] text-brand-muted group-hover:text-white/60 font-medium transition-colors duration-300">Per mile</span>
                  <span className="text-[16px] font-bold text-brand-graphite group-hover:text-white transition-colors duration-300">
                    {vehicle.perMile} <span className="text-[13px] font-medium">/ mile</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        {!hideCta && (
          <div className="bg-brand-section border border-brand-border rounded-[24px] md:rounded-[32px] p-6 md:p-14 flex flex-col lg:flex-row gap-8 lg:gap-16 w-full">
            <div className="flex-1 lg:max-w-[420px]">
              <h3 className="text-[26px] font-bold text-brand-graphite mb-4 leading-[1.2]">
                Need help arranging a specific transfer route
              </h3>
              <p className="text-brand-muted text-[14px] leading-[1.6] mb-10 font-normal">
                If the journey you have in mind does not fit the standard options above, speak to our team directly and we will arrange a suitable vehicle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:07817385655" className="w-full sm:w-auto">
                  <button className="rounded-full hover:rounded-xl pl-6 pr-2 py-1.5 bg-brand-primary text-white font-bold flex items-center justify-between gap-4 hover:bg-brand-graphite transition-all w-full sm:w-auto text-[16px] h-12">
                    Give us a call
                    <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center shrink-0">
                      <ArrowRight className="w-4 h-4 text-brand-primary" />
                    </div>
                  </button>
                </a>
                <Link to="/book" className="w-full sm:w-auto">
                  <button className="rounded-full hover:rounded-xl pl-6 pr-2 py-1.5 bg-brand-primary text-white font-bold flex items-center justify-between gap-4 hover:bg-brand-graphite transition-all w-full sm:w-auto text-[16px] h-12">
                    Book now
                    <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center shrink-0">
                      <ArrowRight className="w-4 h-4 text-brand-primary" />
                    </div>
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 lg:gap-12 flex-1 lg:pt-2">
              <div className="flex-1">
                <Plane className="w-7 h-7 text-brand-graphite mb-6" strokeWidth={1.5} />
                <h4 className="text-[18px] font-medium text-brand-graphite mb-3 leading-[1.3]">
                  Flight tracking included.
                </h4>
                <p className="text-brand-muted text-[13px] leading-[1.6] font-normal">
                  We monitor your flight in real time and adjust pickup times automatically, so delays don't become your problem.
                </p>
              </div>

              <div className="flex-1">
                <Car className="w-7 h-7 text-brand-graphite mb-6" strokeWidth={1.5} />
                <h4 className="text-[18px] font-medium text-brand-graphite mb-3 leading-[1.3]">
                  Local, Licensed Drivers.
                </h4>
                <p className="text-brand-muted text-[13px] leading-[1.6] font-normal">
                  Our local drivers are fully licensed, insured, and know the best routes to keep your journey on time.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
