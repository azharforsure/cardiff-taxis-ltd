import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowRight as ArrowRightIcon } from "lucide-react";

const reviews = [
  {
    name: "Sian Roberts",
    text: "This made travelling so much easier. The car arrived early, the journey was smooth, and we didn't have to think about anything on the day. It was especially reassuring after a long return flight to know someone was waiting.",
    rating: 5,
    avatar: "/images/avatar_1.png",
    numReviews: "3 reviews"
  },
  {
    name: "Gareth Davies",
    text: "Cardiff Taxis Ltd makes my corporate travel seamless. Booking is easy, and I can rely on them for all my Bristol and London trips.",
    rating: 5,
    avatar: "/images/avatar_2.png",
    numReviews: "7 reviews"
  },
  {
    name: "Elin Thomas",
    text: "I use them for private hire around Cardiff. They are consistently punctual, and the prices are very clear with no hidden shocks.",
    rating: 5,
    avatar: "/images/avatar_3.png",
    numReviews: "12 reviews"
  },
];

export const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  return (
    <div className="relative w-full min-h-[600px] flex flex-col py-16 lg:py-24 px-6 md:px-12 lg:px-[80px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/main-hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Glassy Overlay */}
      <div className="absolute inset-0 z-0 bg-white/20 backdrop-blur-[40px] border-t border-white/30" />

      <div className="relative z-10 flex flex-col h-full flex-1">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div className="max-w-2xl">
            <span className="text-white text-[15px] font-bold tracking-[0.1em] uppercase mb-4 block">
              OUR REVIEWS
            </span>
            <h1 className="text-[32px] sm:text-4xl md:text-[38px] lg:text-[44px] font-bold text-white leading-[1.1] tracking-tight">
              Highly rated by passengers across Cardiff and beyond
            </h1>
          </div>

          <button className="bg-white hover:bg-white/90 text-brand-graphite pl-6 pr-1.5 py-1.5 font-bold rounded-full hover:rounded-2xl flex justify-between w-full sm:w-auto items-center gap-4 text-[16px] h-14 transition-all group shrink-0">
            Book a trip now
            <div className="w-10 h-10 rounded-full bg-brand-graphite flex items-center justify-center text-white shrink-0">
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="mt-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-2">
          {/* Quote Card */}
          <div className="max-w-[620px] w-full">
            <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 lg:p-8 md:p-[48px] shadow-2xl relative">
              <p className="text-brand-graphite text-[18px] leading-relaxed font-medium mb-12">
                "{currentReview.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-[56px] h-[64px] bg-[#f8f9fa] border border-brand-border/40 flex items-center justify-center p-1 rounded-sm overflow-hidden">
                  <img src={currentReview.avatar} alt={currentReview.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-graphite text-[15px] mb-0.5 tracking-tight">{currentReview.name}</h4>
                  <p className="text-[13px] text-brand-muted font-normal uppercase tracking-wider">{currentReview.numReviews}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows & Google Reviews */}
          <div className="flex flex-col sm:flex-row items-center justify-between flex-1 gap-10">
            {/* Navigation Arrows - Aligned to be horizontally after the card */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevReview}
                className="w-11 h-11 bg-white border border-white/20 rounded-full hover:rounded-xl flex items-center justify-center hover:bg-white/90 transition-all shadow-sm"
                aria-label="Previous review"
              >
                <ArrowLeft className="w-5 h-5 text-brand-graphite" strokeWidth={2} />
              </button>
              <button
                onClick={nextReview}
                className="w-11 h-11 bg-brand-accent rounded-full hover:rounded-xl flex items-center justify-center hover:bg-brand-accent-hover transition-all shadow-lg"
                aria-label="Next review"
              >
                <ArrowRight className="w-5 h-5 text-brand-graphite" strokeWidth={2} />
              </button>
            </div>

            {/* Google Reviews - Far Right */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  src="/images/avatar_1.png"
                  alt="Review"
                  className="w-[28px] h-[28px] rounded-full border-2 border-white/20 object-cover"
                />
                <img
                  src="/images/avatar_2.png"
                  alt="Review"
                  className="w-[28px] h-[28px] rounded-full border-2 border-white/20 object-cover z-10"
                />
                <img
                  src="/images/avatar_3.png"
                  alt="Review"
                  className="w-[28px] h-[28px] rounded-full border-2 border-white/20 object-cover z-20"
                />
              </div>
              <span className="text-white text-[13px] font-bold tracking-[0.05em] uppercase whitespace-nowrap">
                READ OUR GOOGLE REVIEWS (5/5)
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
