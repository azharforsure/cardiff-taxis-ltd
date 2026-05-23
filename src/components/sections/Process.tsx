import { Calendar, BarChart2, Car, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Process = () => {
  return (
    <section className="py-16 lg:py-24 bg-brand-primary relative z-10 font-sans">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px]">
        <div className="flex flex-col items-center text-center max-w-[700px] mx-auto mb-12 md:mb-16">
          <span className="text-[15px] font-bold text-white/60 uppercase tracking-[0.2em] mb-4 block">
            HOW IT WORKS
          </span>
          <h3 className="text-[32px] sm:text-[38px] md:text-[44px] lg:text-[48px] font-bold text-white mb-6 leading-[1.1] tracking-tight">
            Secure your journey in <br className="hidden md:block"/> three simple steps
          </h3>
          <p className="text-white/70 text-[15px] font-normal leading-relaxed">
            Booking a ride takes just a few minutes. We manage the driving while you relax, offering fixed prices and consistent flight monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative mb-12 md:mb-16">
          {[
            {
              icon: Calendar,
              title: "Book with us",
              description: "Select pick up, drop off, and flight details to get a quick and accurate quote."
            },
            {
              icon: BarChart2,
              title: "We track flights",
              description: "If you are heading from an airport, we monitor the arrival time and adjust the pick up."
            },
            {
              icon: Car,
              title: "Pick up and go",
              description: "Our driver arrives promptly to handle luggage and complete the journey safely."
            }
          ].map((step, index) => (
            <div
              key={index}
              className="bg-brand-graphite border border-white/[0.08] rounded-[24px] p-10 lg:p-12 relative shadow-2xl shadow-black/40"
            >
              <div className="mb-6">
                <step.icon className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[1.5]" />
              </div>
              <h4 className="text-[26px] font-medium text-white mb-2 md:mb-3 leading-snug">
                {step.title}
              </h4>
              <p className="text-white/70 font-normal leading-relaxed text-[15px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
          <Link to="/airport-transfers" className="bg-white hover:bg-gray-50 text-brand-primary h-[56px] pl-6 pr-2 rounded-full hover:rounded-2xl font-bold text-[16px] flex items-center justify-between gap-4 transition-all w-full sm:w-auto shadow-lg group">
            Book an airport transfer
            <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </Link>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center -space-x-2">
              <img src="/images/avatar_1.png" alt="Reviewer" className="w-[36px] h-[36px] rounded-full border-2 border-brand-primary object-cover relative z-[3]" />
              <img src="/images/avatar_2.png" alt="Reviewer" className="w-[36px] h-[36px] rounded-full border-2 border-brand-primary object-cover relative z-[2]" />
              <img src="/images/avatar_3.png" alt="Reviewer" className="w-[36px] h-[36px] rounded-full border-2 border-brand-primary object-cover relative z-[1]" />
            </div>
            <span className="text-white font-bold text-[13px] uppercase tracking-[0.1em]">
              READ OUR GOOGLE REVIEWS (5/5)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
