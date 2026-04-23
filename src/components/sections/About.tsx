import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const About = () => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-transparent relative">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          
          {/* Text Content */}
          <div className="flex-1 flex flex-col items-start text-left max-w-2xl">
            <span className="text-[10px] md:text-[11px] font-bold text-[#1a202c]/60 uppercase tracking-[0.2em] mb-4 block">
              ABOUT CARDIFF TAXIS LTD
            </span>
            <h3 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold leading-[1.1] text-[#2d3748] mb-8 pr-4 tracking-tight">
              A local taxi service built on reliability
            </h3>
            
            <div className="space-y-6 text-[14px] text-[#2d3748]/70 leading-relaxed mb-10 pr-0 md:pr-10 font-medium">
              <p>
                We specialize in providing smooth airport transfers to and from Cardiff, Bristol, and London. Whether you are catching a flight or heading back home, our drivers ensure a comfortable journey from start to finish.
              </p>
              <p>
                Beyond airport runs, we handle private hires across the entire city of Cardiff. Every ride is managed by experienced local professionals who know the best routes and prioritize getting you to the destination safely.
              </p>
              <p>
                We price every journey fairly using fixed rates. This means no surprise charges at the end of the trip, just straightforward pricing you can count on.
              </p>
            </div>

            <Link to="/contact" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto justify-between rounded-full hover:rounded-2xl pl-6 pr-1.5 py-1.5 bg-[#2d3748] text-white font-bold flex items-center gap-4 hover:bg-[#1a202c] transition-all text-[13px] h-11">
                Contact us
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5 text-[#1a202c]" />
                </div>
              </button>
            </Link>
          </div>

          {/* Image */}
          <div className="flex-1 w-full relative">
            <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] w-full">
              <img
                src="/images/about_taxi_new_1776975028206.png"
                alt="Cardiff Taxis Fleet"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
