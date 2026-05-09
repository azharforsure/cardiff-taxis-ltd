import { ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { BookingProvider, useBooking } from "../../context/BookingContext";
import { StepJourney } from "../booking/StepJourney";
import { useNavigate } from "react-router-dom";

/**
 * Inner component that has access to BookingProvider context.
 */
const HeroBookingForm = () => {
  const navigate = useNavigate();
  const booking = useBooking();

  const handleNext = () => {
    // Build query params to carry data to booking page
    const params = new URLSearchParams();
    if (booking.pickup) {
      params.set("pickup", JSON.stringify(booking.pickup));
    }
    if (booking.dropoff) {
      params.set("dropoff", JSON.stringify(booking.dropoff));
    }
    params.set("service", booking.serviceType);
    if (booking.date) params.set("date", booking.date);
    if (booking.time) params.set("time", booking.time);
    
    navigate(`/book?${params.toString()}`);
  };

  return (
    <StepJourney compact onNext={handleNext} />
  );
};

export const Hero = () => {
  return (
    <div className="w-full relative">
      <div className="relative pt-[140px] pb-[32px] md:pt-[150px] lg:pt-[180px] md:pb-[48px] w-full flex flex-col justify-start min-h-auto transition-all duration-500">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/main-hero.png')",
          }}
        >
          <div className="absolute inset-0 bg-brand-primary/60 mix-blend-multiply"></div>
          <div 
            className="absolute inset-0 backdrop-blur-[12px]"
            style={{
              maskImage: 'linear-gradient(to right, black 30%, transparent 75%)',
              WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 75%)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px] mt-0 md:mt-2 lg:mt-4 transition-all duration-500">
          <div className="max-w-[640px]">
            <span className="text-white text-[15px] font-semibold tracking-[0.2em] uppercase mb-4 block">
              SERVING CARDIFF, BRISTOL & LONDON
            </span>

            <h1 className="text-[30px] sm:text-3xl md:text-[38px] lg:text-[44.4px] font-bold text-white mb-5 leading-[1.1] tracking-tight">
              24/7 Airport Transfers and Private Hire in Cardiff
            </h1>

            <p className="text-[15px] text-white/80 mb-8 max-w-[480px] font-semibold leading-relaxed">
              We provide reliable pick up and drop off services to and from Cardiff, Bristol, and London airports. We also offer a complete private hire service covering the entire city of Cardiff, ensuring you reach any destination safely.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a href="tel:07817385655" className="w-full sm:w-auto">
                <Button
                  variant="accent"
                  className="text-brand-graphite pl-6 pr-2 py-2 font-bold h-[56px] w-full flex items-center justify-between gap-4 text-[16px] rounded-full hover:rounded-2xl shadow-lg hover:bg-brand-accent-hover transition-all"
                >
                  Give us a call
                  <div className="w-10 h-10 rounded-full bg-brand-graphite flex items-center justify-center text-white shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Button>
              </a>
              <a 
                href="https://wa.me/447817385655" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="glass"
                  className="bg-brand-secondary/90 hover:bg-brand-secondary text-brand-graphite border-none pl-6 pr-3 font-bold h-[56px] w-full flex items-center justify-between gap-3 rounded-full hover:rounded-2xl text-[16px]"
                >
                  WhatsApp us
                  <svg
                    className="w-[32px] h-[32px] text-brand-graphite opacity-80"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </Button>
              </a>
            </div>


          </div>

          <div className="mt-[42px] md:mt-[64px] lg:mt-[101px] mb-5 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img
                src="/images/avatar_1.png"
                alt="Review"
                className="w-[36px] h-[36px] rounded-full border-2 border-brand-primary object-cover shadow-md"
              />
              <img
                src="/images/avatar_2.png"
                alt="Review"
                className="w-[36px] h-[36px] rounded-full border-2 border-brand-primary object-cover shadow-md"
              />
              <img
                src="/images/avatar_3.png"
                alt="Review"
                className="w-[36px] h-[36px] rounded-full border-2 border-brand-primary object-cover shadow-md"
              />
            </div>
            <span className="text-white text-[13px] font-bold tracking-[0.05em] uppercase">
              READ OUR GOOGLE REVIEWS (5/5)
            </span>
          </div>

          {/* Booking Widget */}
          <div className="mt-0 relative z-20 transition-all duration-500">
            <div className="bg-brand-section md:bg-white/95 md:backdrop-blur-sm rounded-[24px] md:rounded-[32px] p-2 md:p-3 shadow-2xl flex flex-col gap-2 lg:gap-3 transition-all duration-300">
              <BookingProvider>
                <HeroBookingForm />
              </BookingProvider>
            </div>

            {/* Error space handled inside StepJourney */}
          </div>
        </div>
      </div>
    </div>
  );
};
