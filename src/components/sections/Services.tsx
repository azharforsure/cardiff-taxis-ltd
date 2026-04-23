import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Services = () => {
  const [activeCard, setActiveCard] = useState(0);

  const services = [
    {
      id: "airport",
      title: "Airport\nTransfers",
      fullTitle: "Cardiff, Bristol, and London Airports",
      label: "Airport transfers",
      description: "We handle complete pick up and drop off trips for Cardiff, Bristol, and London airports. We actively track flights to ensure we arrive right on time, even if there are delays. When booking, please include flight and luggage details so we can send the perfect vehicle.",
      image: "/images/airport_transfer_new_1776974974543.png",
      link: "/airport-transfers"
    },
    {
      id: "city",
      title: "City\nPrivate Hire",
      fullTitle: "Cardiff Private Hire",
      label: "City Private Hire",
      description: "Our drivers are available for private hire across the entire city of Cardiff. Whether you need transportation for a local meeting, a day trip, or an evening out, we have a reliable vehicle ready for you.",
      image: "/images/city_private_hire_new_1776974990983.png",
      link: "/book"
    },
    {
      id: "fixed",
      title: "Fixed\nFares",
      fullTitle: "Fixed Prices",
      label: "No Hidden Costs",
      description: "We believe in straightforward pricing for every single journey. You will know the exact cost before confirming the booking, ensuring no sudden charges during unexpected traffic or road closures.",
      image: "/images/fixed_fares_new_1776975008336.png",
      link: "/fleet"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#323d4a]" id="services">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center mb-16">
          <div className="max-w-2xl">
            <span className="text-[10px] md:text-[11px] font-bold text-white/60 uppercase tracking-[0.2em] mb-4 block">
              OUR SERVICES
            </span>
            <h3 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-white leading-[1.1] tracking-tight">
              Private hire services for <br className="hidden md:block"/> airports and the city
            </h3>
          </div>
          <div>
            <Link to="/book" className="block w-full sm:w-auto">
              <button className="rounded-full hover:rounded-2xl pl-6 pr-1.5 py-1.5 bg-[#ffb320] text-[#1a202c] font-bold flex items-center justify-between gap-4 hover:bg-[#ffc34d] transition-all w-full sm:w-auto text-[13px] h-11">
                Book a trip now
                <div className="w-8 h-8 rounded-full bg-[#1a202c] flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </button>
            </Link>
          </div>
        </div>

        {/* Accordion Grid */}
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[540px]">
          {services.map((service, index) => {
            const isActive = activeCard === index;

            return (
              <div
                key={service.id}
                onMouseEnter={() => setActiveCard(index)}
                onClick={() => setActiveCard(index)}
                className={`relative bg-[#f8f9fa] rounded-[32px] overflow-hidden transition-[width] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex cursor-pointer group ${
                  isActive ? "lg:w-[66%] flex-col lg:flex-row" : "lg:w-[17%] flex-col hidden lg:flex"
                } ${!isActive && "hidden lg:flex"}`} // Hide inactive entirely on mobile
              >
                {/* Active Content overlay */}
                <div 
                  className={`flex flex-col lg:flex-row w-full h-full absolute inset-0 transition-opacity duration-700 delay-150 ${
                    isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center lg:min-w-[320px]">
                    <span className="text-[10px] text-[#4a5568] font-bold uppercase tracking-wider mb-4 whitespace-nowrap">{service.label}</span>
                    <h4 className="text-[28px] md:text-[32px] font-bold text-[#1a202c] leading-[1.1] tracking-tight mb-8 pb-8 border-b border-[#e2e8f0]">
                      {service.fullTitle}
                    </h4>
                    <p className="text-[#4a5568] text-[14px] leading-relaxed mb-8 line-clamp-4 font-medium">
                      {service.description}
                    </p>
                    <div>
                      <Link to={service.link}>
                        <button className="rounded-full hover:rounded-xl px-7 h-11 bg-[#2d3748] text-white font-bold text-[13px] hover:bg-[#1a202c] transition-all">
                          Learn more
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex-1 relative hidden lg:block p-2 lg:min-w-[320px]">
                    <div className="w-full h-full rounded-[26px] overflow-hidden relative">
                      <img 
                        src={service.image} 
                        alt={service.fullTitle} 
                        className="w-full h-full object-cover absolute inset-0"
                      />
                    </div>
                  </div>
                </div>

                {/* Inactive Vertical Content (Desktop) */}
                <div 
                  className={`absolute inset-0 p-6 md:p-8 lg:p-10 flex flex-col justify-between transition-opacity duration-300 ${
                    !isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <h4 className="text-[22px] md:text-[26px] xl:text-[30px] font-bold text-[#1a202c] leading-[1.2] whitespace-pre-line">
                    {service.title}
                  </h4>
                  <div className="flex justify-end mt-auto">
                    <div className="w-[36px] h-[36px] rounded-full bg-[#1a202c] flex items-center justify-center group-hover:bg-[#ffb320] group-hover:rounded-xl transition-all shadow-sm">
                      <ArrowRight className="w-4 h-4 text-white group-hover:text-[#1a202c]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Mobile Layout Fallback - Stacked list below active item if needed, but for simplicity we will just render standard stacked cards on mobile below if we want, or just let them expand vertically. Let's fix mobile behavior cleanly. */}
        </div>
        
        {/* Mobile Accordion Alternative (Visible only on mobile/tablet) */}
        <div className="flex flex-col gap-4 lg:hidden mt-4">
          {services.map((service, index) => {
            const isActive = activeCard === index;
            if (isActive) return null; // already rendered above
            return (
              <div 
                key={service.id + "-mobile"}
                onClick={() => setActiveCard(index)}
                className="bg-[#f8f9fa] rounded-[32px] p-6 flex justify-between items-center cursor-pointer hover:bg-white transition-colors"
              >
                <h4 className="text-[22px] font-bold text-[#1a202c]">
                  {service.title.replace('\n', ' ')}
                </h4>
                <div className="w-[36px] h-[36px] rounded-full bg-[#1a202c] flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
