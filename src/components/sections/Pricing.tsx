import { ArrowRight, Plane, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export const Pricing = ({ hideCta = false }: { hideCta?: boolean }) => {
  const fleetRates = [
    { name: "Saloon", firstMile: "£28", perMile: "£1.20" },
    { name: "Estate", firstMile: "£32", perMile: "£1.25" },
    { name: "Executive", firstMile: "£37", perMile: "£1.60" },
    { name: "People Carrier", firstMile: "£37", perMile: "£1.60" },
    { name: "Executive People Carrier", firstMile: "£53", perMile: "£2.00" },
    { name: "8-Seater Minibus", firstMile: "£55", perMile: "£2.00" },
  ];

  return (
    <section className="py-16 lg:py-24 bg-transparent" id="pricing">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px]">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-16 items-start lg:items-center">
          <div className="flex-1 max-w-3xl">
            <span className="text-[10px] md:text-[11px] font-bold text-[#2d3748]/60 uppercase tracking-[0.2em] mb-4 block">
              FLEET & PRICING
            </span>
            <h3 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-[#1a202c] mb-6 leading-[1.1] tracking-tight">
              Clear and competitive rates
            </h3>
            <p className="text-[#4a5568]/80 text-[14px] font-medium leading-relaxed max-w-[800px]">
              Our pricing is structured to be clear and straightforward, based heavily on the vehicle chosen. Every journey starts with a fixed first-mile rate, followed by a flat per-mile charge for the rest of the trip.
            </p>
          </div>
          <div className="flex gap-3 flex-col sm:flex-row shrink-0 lg:pt-8 w-full lg:w-auto">
            <button className="rounded-full hover:rounded-2xl pl-6 pr-1.5 py-1.5 bg-[#cbd5e1] text-[#0f172a] font-bold flex items-center justify-between gap-4 hover:bg-[#94a3b8] transition-all w-full lg:w-auto text-[13px] h-11">
              View full pricing
              <div className="w-8 h-8 rounded-full bg-[#1e293b] flex items-center justify-center shrink-0">
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </div>
            </button>
            <Link to="/book" className="w-full lg:w-auto">
              <button className="rounded-full hover:rounded-2xl pl-6 pr-1.5 py-1.5 bg-[#2d3748] text-white font-bold flex items-center justify-between gap-4 hover:bg-[#1a202c] transition-all w-full text-[13px] h-11">
                Book now
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-[#2d3748]" />
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
              className="group bg-[#f0f2f5] hover:bg-[#2c3543] border border-[#e2e8f0] hover:border-[#2c3543] rounded-[24px] p-6 lg:p-8 flex flex-col justify-between min-h-[200px] transition-colors duration-300 pointer-events-none"
            >
              <div>
                <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center -ml-1.5 mb-5 bg-transparent group-hover:bg-[#ffb320] transition-colors duration-300">
                  <Car className="w-[20px] h-[20px] text-[#1a202c]" strokeWidth={1.5} />
                </div>
                <h4 className="text-[17px] font-medium text-[#1a202c] group-hover:text-white transition-colors duration-300">
                  {vehicle.name}
                </h4>
              </div>
              <div className="flex flex-col gap-2 mt-6">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] group-hover:border-white/10 pb-2 transition-colors duration-300">
                  <span className="text-[14px] text-[#4a5568] group-hover:text-white/80 font-medium transition-colors duration-300">First mile</span>
                  <span className="text-[18px] font-bold text-[#1a202c] group-hover:text-white transition-colors duration-300">
                    {vehicle.firstMile}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[14px] text-[#4a5568] group-hover:text-white/80 font-medium transition-colors duration-300">Remaining journey</span>
                  <span className="text-[16px] font-bold text-[#1a202c] group-hover:text-[#f2ba4d] transition-colors duration-300">
                    {vehicle.perMile} <span className="text-[13px] font-medium">/ mile</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        {!hideCta && (
          <div className="bg-[#ebeef0] border border-[#e2e8f0] rounded-[24px] md:rounded-[32px] p-6 md:p-14 flex flex-col lg:flex-row gap-8 lg:gap-16 w-full">
            <div className="flex-1 lg:max-w-[420px]">
              <h3 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#1a202c] mb-4 leading-[1.2]">
                Need help arranging a specific transfer route
              </h3>
              <p className="text-[#4a5568] text-[14px] leading-[1.6] mb-10 font-medium">
                If the journey you have in mind does not fit the standard options above, speak to our team directly and we will arrange a suitable vehicle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:07459466835" className="w-full sm:w-auto">
                  <button className="rounded-full hover:rounded-xl pl-6 pr-2 py-1.5 bg-[#2d3748] text-white font-semibold flex items-center justify-between gap-4 hover:bg-[#1a202c] transition-all w-full sm:w-auto text-[15px]">
                    Give us a call
                    <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center shrink-0">
                      <ArrowRight className="w-4 h-4 text-[#2d3748]" />
                    </div>
                  </button>
                </a>
                <Link to="/book" className="w-full sm:w-auto">
                  <button className="rounded-full hover:rounded-xl pl-6 pr-2 py-1.5 bg-[#2d3748] text-white font-semibold flex items-center justify-between gap-4 hover:bg-[#1a202c] transition-all w-full sm:w-auto text-[15px]">
                    Book now
                    <div className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center shrink-0">
                      <ArrowRight className="w-4 h-4 text-[#2d3748]" />
                    </div>
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 lg:gap-12 flex-1 lg:pt-2">
              <div className="flex-1">
                <Plane className="w-7 h-7 text-[#1a202c] mb-6" strokeWidth={1.5} />
                <h4 className="text-[20px] font-medium text-[#1a202c] mb-3 leading-[1.3]">
                  Flight tracking included.
                </h4>
                <p className="text-[#4a5568] text-[14px] leading-[1.6] font-medium">
                  We monitor your flight in real time and adjust pickup times automatically, so delays don't become your problem.
                </p>
              </div>

              <div className="flex-1">
                <Car className="w-7 h-7 text-[#1a202c] mb-6" strokeWidth={1.5} />
                <h4 className="text-[20px] font-medium text-[#1a202c] mb-3 leading-[1.3]">
                  Local, Licensed Drivers.
                </h4>
                <p className="text-[#4a5568] text-[14px] leading-[1.6] font-medium">
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
