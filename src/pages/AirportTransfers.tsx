export const AirportTransfers = () => {
  return (
    <div className="flex flex-col min-h-[70vh] pb-0">
      
      {/* Hero Header */}
      <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
        <div className="relative pt-[110px] pb-[70px] md:pt-[130px] md:pb-[90px] bg-[#2f3a43] overflow-hidden rounded-[12px] md:rounded-[22px] shadow-md ring-1 ring-black/[0.05]">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
             <img 
                src="/images/airport_transfer_new_1776974974543.png" 
                alt="Airplane wing" 
                className="w-full h-full object-cover"
             />
          </div>
          <div className="absolute inset-0 z-10 bg-[#2f3a43]/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#2f3a43] to-transparent"></div>
          <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 text-center">
            <span className="text-[#f2ba4d] text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">
              CARDIFF, BRISTOL & LONDON TRANSFERS
            </span>
            <h1 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-white mb-5 tracking-tight max-w-[640px] mx-auto leading-[1.1]">
              Reliable Airport Transfers for Cardiff
            </h1>
            <p className="text-[14px] text-white/80 max-w-[480px] mx-auto font-medium mb-10 leading-relaxed">
              We handle pick up and drop off services connecting Cardiff with Bristol, Cardiff Airport, and major London airports.
            </p>
            <Link to="/book" className="inline-flex items-center justify-between gap-4 bg-[#f2ba4d] hover:bg-[#e0a83b] text-[#2a3036] font-bold text-[13px] h-[44px] px-2 pl-5 rounded-full hover:rounded-2xl transition-all mx-auto shadow-lg">
              Book a transfer
              <div className="w-8 h-8 rounded-full bg-[#1a202c] flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                 <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px] pt-16 lg:pt-24 pb-8 lg:pb-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between">
          <div className="flex-1 lg:max-w-xl">
            <span className="text-[10px] md:text-[11px] font-bold text-[#1a202c]/60 uppercase tracking-[0.2em] mb-4 block">
              RELIABLE AIRPORT TRANSFERS
            </span>
            <h2 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-[#2d3748] mb-6 leading-[1.1] tracking-tight">
              Flight tracking and flexible pickups
            </h2>
            
            <div className="space-y-6 mb-10 text-[14px] text-[#2d3748]/70 font-medium">
              <p className="leading-relaxed">
                We monitor flight arrival times closely. If a flight is delayed or arrives early, our drivers adjust their schedule to ensure they are waiting when passengers land.
              </p>
              <p className="leading-relaxed">
                We provide ample waiting time so passengers can collect luggage and pass through customs without feeling rushed.
              </p>
            </div>

            <Link to="/book" className="inline-flex items-center justify-between gap-4 bg-[#2d3748] hover:bg-[#1a202c] text-white font-bold text-[13px] h-11 pl-6 pr-1.5 rounded-full hover:rounded-2xl transition-all w-fit shadow-md">
              Book now
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2d3748] shrink-0">
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
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
        <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-[#1e252a]">
          <Reviews />
        </div>
      </div>

      <AirportFaqs />
    </div>
  );
};
