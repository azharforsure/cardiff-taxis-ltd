import { Plus, Minus, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export const AirportFaqs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "How far in advance should I book my airport transfer?",
      a: "We recommend booking your transfer as early as possible. We can also handle short notice if we have a car available.",
    },
    {
      q: "What are your rates for airport transfers?",
      a: "Our rates are fixed depending on the car you choose. Please see our pricing list. You will not pay any extra hidden fees.",
    },
    {
      q: "Do you monitor flight times for delays?",
      a: "Yes, we track your flight using your flight number. If your flight is delayed or early, we alter the pickup time so a driver is always waiting for you.",
    },
    {
      q: "What vehicles do you use?",
      a: "We provide Saloons, Estates, Executive cars, People Carriers, and 8-Seater minibuses. All our cars are clean and comfortable.",
    },
    {
      q: "Are you available for early morning and late night flights?",
      a: "Yes, we are available 24/7 for early departures and late arrivals.",
    },
    {
      q: "How do I pay?",
      a: "You can pay by card or cash directly to the driver at the end of the journey.",
    },
  ];

  // SVG path for a 24x24 inverse corner (solid bottom-left, transparent curve top-right)
  const inverseCorner = (
    <svg className="w-6 h-6 text-brand-section fill-current" viewBox="0 0 24 24">
      <path d="M0 24H24C10.7452 24 0 13.2548 0 0V24Z" />
    </svg>
  );

  return (
    <section className="py-16 lg:py-24 bg-transparent relative">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px]">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          <div className="w-full lg:w-[45%] flex flex-col items-start pr-0">
            <span className="text-[15px] font-semibold text-brand-graphite/60 uppercase tracking-[0.2em] mb-4 block">
              FAQS
            </span>
            <h3 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold leading-[1.1] text-brand-graphite tracking-tight mb-12">
              Everything you need to know before booking.
            </h3>
            
            {/* Image Container with Custom Corner Cutout */}
            <div className="relative w-full max-w-[480px]">
              <div className="rounded-[32px] overflow-hidden aspect-[4/3] w-full bg-brand-section">
                <img
                  src="/images/airport_faq_1776973728050.png"
                  alt="Chauffeur greeting passenger at airport terminal"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay Button Container */}
              <div className="absolute bottom-0 left-0 bg-brand-section pt-4 pr-4 sm:pt-5 sm:pr-5 drop-shadow-none rounded-tr-[32px] z-10 w-fit">
                   {/* Top-left inverse corner (above the cutout) */}
                   <div className="absolute bottom-full left-0">
                     {inverseCorner}
                   </div>
                   
                   {/* Bottom-right inverse corner (to the right of the cutout) */}
                   <div className="absolute bottom-0 left-full">
                     {inverseCorner}
                   </div>
                   
                   <div className="relative z-10 flex h-full">
                     <Link to="/book" className="flex items-center justify-between gap-4 bg-brand-graphite hover:bg-brand-primary text-white font-bold text-[16px] h-[56px] pl-6 pr-2 rounded-full hover:rounded-2xl transition-all w-fit shadow-md border-none">
                        Book a trip
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-primary shrink-0">
                          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                        </div>
                     </Link>
                   </div>
                </div>
            </div>
          </div>

          <div className="w-full lg:w-[55%] flex flex-col mt-4 lg:mt-0">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="border-b border-brand-border py-6 sm:py-8 cursor-pointer flex flex-col group first:pt-0"
                >
                  <div className="flex justify-between items-center w-full gap-8">
                    <h4 className="text-[17px] md:text-[18px] font-bold text-brand-primary group-hover:text-brand-accent transition-colors tracking-tight leading-snug">
                      {faq.q}
                    </h4>
                    <div className="flex items-center justify-center shrink-0">
                      {isOpen ? (
                        <Minus className="w-5 h-5 text-brand-primary stroke-[2px]" />
                      ) : (
                        <Plus className="w-5 h-5 text-brand-primary stroke-[2px]" />
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-4 text-[15px] font-semibold text-brand-primary/70 leading-[1.6]">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </div>
    </section>
  );
};
