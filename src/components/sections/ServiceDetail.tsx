import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const ServiceDetail = () => {
  // SVG path for a 24x24 inverse corner (solid bottom-left, transparent curve top-right)
  const inverseCorner = (
    <svg className="w-6 h-6 text-[#f9fafb] fill-current" viewBox="0 0 24 24">
      <path d="M0 24H24C10.7452 24 0 13.2548 0 0V24Z" />
    </svg>
  );

  return (
    <section className="pt-16 lg:pt-24 pb-0 bg-transparent relative">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px]">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center justify-between">
          
          {/* Image Container with Custom Corner Cutout */}
          <div className="flex-1 w-full lg:max-w-[720px] relative">
            <div className="rounded-[32px] overflow-hidden aspect-[4/3] lg:aspect-[1.3] w-full bg-[#f3f4f6]">
                <img
                  src="/images/airport_transfer_1776973607405.png"
                  alt="Airport Transfer Service"
                  className="w-full h-full object-cover"
                />
            </div>
            
            {/* Overlay Button Container */}
            <div className="absolute bottom-0 left-0 bg-[#f9fafb] pt-4 pr-4 sm:pt-5 sm:pr-5 drop-shadow-none rounded-tr-[32px] z-10 w-fit">
                 {/* Top-left inverse corner (above the cutout) */}
                 <div className="absolute bottom-full left-0">
                   {inverseCorner}
                 </div>
                 
                 {/* Bottom-right inverse corner (to the right of the cutout) */}
                 <div className="absolute bottom-0 left-full">
                   {inverseCorner}
                 </div>
                 
                 <div className="relative z-10 flex h-full">
                   <Link to="/book" className="flex items-center justify-between gap-4 bg-[#2d3748] hover:bg-[#1a202c] text-white font-bold text-[13px] h-11 pl-6 pr-1.5 rounded-full hover:rounded-2xl transition-all w-fit shadow-md border-none">
                      Book a trip
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2d3748] shrink-0">
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </div>
                   </Link>
                 </div>
              </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 flex flex-col items-start text-left lg:max-w-xl">
            <span className="text-[10px] md:text-[11px] font-bold text-[#1a202c]/60 uppercase tracking-[0.2em] mb-4 block">
              ALWAYS READY, ALWAYS ON TIME
            </span>
            <h3 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold leading-[1.1] text-[#2d3748] mb-8 tracking-tight">
              Friendly and reliable private hire services
            </h3>
            
            <div className="space-y-6 text-[14px] text-[#2d3748]/70 leading-relaxed font-medium mb-10 pr-0 md:pr-10">
              <p>
                We offer a dedicated meet and greet service for all airport pickups. A driver will be waiting at arrivals to assist with heavy luggage and guide you directly to the car.
              </p>
              <p>
                Every journey we provide operates on a fixed price basis. This guarantees you will never pay extra charges because of bad traffic or unexpected road diversions.
              </p>
              <p>
                We handle pick up and drop off services for London, Bristol, and Cardiff airports, alongside complete private hire capabilities for the entire city of Cardiff.
              </p>
            </div>
          </div>

        </div>
        
        {/* Bottom divider matching the design */}
        <div className="mt-16 lg:mt-24 border-t border-[#e5e7eb] w-full"></div>
      </div>
    </section>
  );
};
