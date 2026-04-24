import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export const Faqs = () => {
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

  return (
    <section className="py-16 lg:py-24 bg-transparent relative">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          <div className="w-full lg:w-[40%] flex flex-col items-start pr-0 lg:pr-4">
            <span className="text-[15px] font-semibold text-brand-graphite/60 uppercase tracking-[0.2em] mb-4 block">
              FAQS
            </span>
            <h3 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold leading-[1.1] text-brand-primary tracking-tight">
              Everything you need to know before booking.
            </h3>
          </div>

          <div className="w-full lg:w-[60%] flex flex-col">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="border-b border-black/[0.06] py-6 cursor-pointer flex flex-col group"
                >
                  <div className="flex justify-between items-center w-full gap-8">
                    <h4 className="text-[18px] md:text-[20px] font-bold text-brand-graphite group-hover:text-brand-accent transition-colors tracking-tight">
                      {faq.q}
                    </h4>
                    <div className="flex items-center justify-center shrink-0">
                      {isOpen ? (
                        <Minus className="w-6 h-6 text-brand-graphite" strokeWidth={1.5} />
                      ) : (
                        <Plus className="w-6 h-6 text-brand-graphite" strokeWidth={1.5} />
                      )}
                    </div>
                  </div>
                  
                  <div 
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.82,0,0.18,1)] ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-4 text-[15px] text-brand-primary leading-relaxed font-semibold">
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
