import { Calendar, BarChart2, Car, ArrowRight } from "lucide-react";

export const Process = () => {
  return (
    <section className="py-16 lg:py-24 bg-brand-primary relative z-10 font-sans">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px]">
        <div className="flex flex-col items-center text-center max-w-[700px] mx-auto mb-12 md:mb-16">
          <span className="text-[10px] md:text-[11px] font-bold text-white/60 uppercase tracking-[0.2em] mb-4 block">
            HOW IT WORKS
          </span>
          <h3 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-white mb-6 leading-[1.1] tracking-tight">
            3 simple steps to <br className="hidden md:block"/> book a ride today
          </h3>
          <p className="text-white/70 text-[14px] font-medium leading-relaxed">
            Booking a ride takes just a few minutes. We manage the driving while you relax, offering fixed prices and consistent flight monitoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative mb-12 md:mb-16">
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
              className="bg-[#35414d] border border-white/[0.08] rounded-[24px] p-8 lg:p-10 relative"
            >
              <div className="mb-6">
                <step.icon className="w-6 h-6 md:w-7 md:h-7 text-white stroke-[1.5]" />
              </div>
              <h4 className="text-[18px] md:text-[20px] font-semibold text-white mb-2 md:mb-3 leading-snug">
                {step.title}
              </h4>
              <p className="text-white/70 font-medium leading-relaxed text-[14px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
          <button className="bg-white hover:bg-gray-50 text-brand-primary h-11 pl-6 pr-1.5 rounded-full hover:rounded-2xl font-bold text-[13px] flex items-center justify-between gap-4 transition-all w-full sm:w-auto">
            View airport pricing
            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-white">
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </button>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center -space-x-2">
              <img src="https://i.pravatar.cc/100?img=47" alt="Reviewer" className="w-[28px] h-[28px] rounded-full border-2 border-brand-primary object-cover relative z-[3]" />
              <img src="https://i.pravatar.cc/100?img=12" alt="Reviewer" className="w-[28px] h-[28px] rounded-full border-2 border-brand-primary object-cover relative z-[2]" />
              <img src="https://i.pravatar.cc/100?img=32" alt="Reviewer" className="w-[28px] h-[28px] rounded-full border-2 border-brand-primary object-cover relative z-[1]" />
            </div>
            <span className="text-white font-bold text-[10px] uppercase tracking-[0.1em] opacity-60">
              READ OUR GOOGLE REVIEWS (5/5)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
