import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Pricing } from "../components/sections/Pricing";
import { ServiceDetail } from "../components/sections/ServiceDetail";
import { FleetSelection } from "../components/sections/FleetSelection";
import { Reviews } from "../components/sections/Reviews";
import { AirportFaqs } from "../components/sections/AirportFaqs";

export const AirportTransfers = () => {
  return (
    <div className="flex flex-col min-h-[70vh] pb-0">
      <Helmet>
        <title>Airport Transfers Cardiff | To Bristol, Heathrow & London | Cardiff Taxis</title>
        <meta name="description" content="Fixed-rate airport transfers from Cardiff to Bristol, Heathrow, Gatwick, and Stansted. 24/7 service with flight tracking and professional drivers. Get a free quote now." />
        <meta name="keywords" content="cardiff to bristol airport taxi, cardiff to heathrow taxi, cardiff airport transfer, gatwick taxi cardiff, stansted airport transfer cardiff" />
      </Helmet>
      
      {/* Hero Header */}
      <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
        <div className="relative pt-[180px] pb-[140px] md:pt-[260px] md:pb-[200px] bg-brand-primary overflow-hidden rounded-[12px] md:rounded-[22px] shadow-md ring-1 ring-black/[0.05]">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
             <img 
                src="/images/airport_transfer_new_1776974974543.png" 
                alt="Airplane wing" 
                className="w-full h-full object-cover"
             />
          </div>
          <div className="absolute inset-0 z-10 bg-brand-primary/60 backdrop-blur-[2px] mix-blend-multiply"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-primary via-brand-primary/20 to-transparent"></div>
          <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 text-center">
            <span className="text-white/60 text-[15px] font-semibold tracking-[0.2em] uppercase mb-4 block">
              CARDIFF, BRISTOL & LONDON TRANSFERS
            </span>
            <h1 className="text-[30px] sm:text-3xl md:text-[38px] lg:text-[44.4px] font-bold text-white mb-5 tracking-tight max-w-[720px] mx-auto leading-[1.1]">
              Reliable Airport Transfers for Cardiff
            </h1>
            <p className="text-[15px] text-white/80 max-w-[520px] mx-auto font-semibold mb-10 leading-relaxed">
              We handle pick up and drop off services connecting Cardiff with Bristol, Cardiff Airport, and major London airports.
            </p>
            <Link to="/book" className="inline-flex items-center justify-between gap-4 bg-brand-accent hover:bg-brand-accent-hover text-brand-graphite font-bold text-[16px] h-[56px] px-2 pl-6 rounded-full hover:rounded-2xl transition-all mx-auto shadow-lg group">
              Book a transfer
              <div className="w-10 h-10 rounded-full bg-brand-graphite flex items-center justify-center flex-shrink-0 text-white shadow-sm group-hover:scale-105 transition-transform">
                 <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px] pt-16 lg:pt-24 pb-8 lg:pb-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between">
          <div className="flex-1 lg:max-w-xl">
            <span className="text-[15px] font-semibold text-brand-graphite/60 uppercase tracking-[0.2em] mb-4 block">
              RELIABLE AIRPORT TRANSFERS
            </span>
            <h2 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-brand-primary mb-6 leading-[1.1] tracking-tight">
              Flight tracking and flexible pickups
            </h2>
            
            <div className="space-y-6 mb-10 text-[15px] text-brand-primary/70 font-semibold">
              <p className="leading-relaxed">
                We monitor flight arrival times closely. If a flight is delayed or arrives early, our drivers adjust their schedule to ensure they are waiting when passengers land.
              </p>
              <p className="leading-relaxed">
                We provide ample waiting time so passengers can collect luggage and pass through customs without feeling rushed.
              </p>
            </div>

            <Link to="/book" className="inline-flex items-center justify-between gap-4 bg-brand-primary hover:bg-brand-graphite text-white font-bold text-[16px] h-[56px] pl-6 pr-2 rounded-full hover:rounded-2xl transition-all w-fit shadow-md group">
              Book now
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-primary shrink-0 group-hover:scale-105 transition-transform">
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </Link>
          </div>
          
          <div className="flex-1 w-full flex lg:justify-end relative">
            <div className="rounded-[32px] overflow-hidden w-full aspect-[4/3] relative">
              <img 
                src="/images/fixed_fares_new_1776975008336.png" 
                alt="Professional driver" 
                className="w-full h-full object-cover aspect-[4/3] lg:aspect-[1.35]" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-1 md:px-1.5 py-1">
        <FleetSelection />
      </div>

      <ServiceDetail />
      <Pricing hideCta />

      {/* Reviews Card - Matches Home card wrapper rhythm */}
      <div className="px-1 md:px-1.5 py-1 md:py-1.5">
        <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-brand-graphite">
          <Reviews />
        </div>
      </div>

      <AirportFaqs />
    </div>
  );
};

