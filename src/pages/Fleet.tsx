import { Pricing } from "../components/sections/Pricing";
import { Reviews } from "../components/sections/Reviews";
import { Faqs } from "../components/sections/Faqs";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Baby, Accessibility, Dog, Briefcase } from "lucide-react";

export const Fleet = () => {
  const fleetDetails = [
    {
      name: "Saloon",
      capacity: "4 Passengers, 2 Suitcases",
      image: "/images/fleet_saloon_new_1776975126069.png",
      description: "Our Saloon cars are perfect for individual travellers, couples, or small families. A comfortable and simple ride for any journey.",
      features: ["Air Conditioning", "Free Wi-Fi", "Phone Charging", "Comfortable Seating"],
    },
    {
      name: "Estate",
      capacity: "4 Passengers, 4 Suitcases",
      image: "/images/fleet_estate_new_1776975140733.png",
      description: "Designed for those who need extra luggage space. The Estate gives you an extended boot for heavier bags or long trips.",
      features: ["Extra Luggage Space", "Spacious Interior", "Air Conditioning", "Foldable Rear Seats"],
    },
    {
      name: "Executive",
      capacity: "3 Passengers, 2 Suitcases",
      image: "/images/fleet_saloon_new_1776975126069.png",
      description: "Travel in premium style. Our Executive vehicles are top-of-the-range cars for corporate travel or when you just want a bit of luxury.",
      features: ["Premium Leather Interior", "Complimentary Water", "Tinted Windows", "Professional Driver"],
    },
    {
      name: "People Carrier",
      capacity: "6 Passengers, 4 Suitcases",
      image: "/images/fleet_minibus_1776973773526.png",
      description: "A great choice for groups or family trips. It comfortably seats up to 6 passengers with enough room for luggage.",
      features: ["Ample Legroom", "Sliding Doors", "Climate Control", "Ideal for Families"],
    },
    {
      name: "8-Seater Minibus",
      capacity: "8 Passengers, 8 Suitcases",
      image: "/images/about_taxi_new_1776975028206.png",
      description: "Our largest option for up to 8 people. The Minibus means you can all travel together safely without needing multiple taxis.",
      features: ["Large Group Capacity", "Extra Luggage Space", "Elevated Seating", "Cost-effective"],
    }
  ];

  return (
    <div className="flex flex-col pb-0 min-h-[70vh]">
      <Helmet>
        <title>Our Fleet & Pricing | Cardiff Taxis Ltd | Saloon, Estate, Minibus</title>
        <meta name="description" content="View our range of Cardiff taxi vehicles. From standard saloons to 8-seater minibuses. Competitive fixed pricing for all journey types." />
      </Helmet>
      {/* Hero Header Card - Matches Home hero wrapper */}
      <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
        <div className="relative pt-[180px] pb-[140px] md:pt-[260px] md:pb-[200px] bg-brand-primary overflow-hidden rounded-[12px] md:rounded-[22px] shadow-md ring-1 ring-black/[0.05]">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
             <img 
                src="/images/fleet_minibus_1776973773526.png" 
                alt="Cardiff Taxis Fleet" 
                className="w-full h-full object-cover"
             />
          </div>
          <div className="absolute inset-0 z-10 bg-brand-primary/60 backdrop-blur-[4px] mix-blend-multiply"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-primary via-brand-primary/20 to-transparent"></div>
          <div className="text-center w-full max-w-[1400px] mx-auto px-6 relative z-20">
            <span className="text-white/60 text-[15px] font-semibold tracking-[0.2em] uppercase mb-4 block">
              CARDIFF TAXI FLEET
            </span>
            <h1 className="text-[30px] sm:text-3xl md:text-[38px] lg:text-[44.4px] font-bold text-white mb-6 leading-[1.1] tracking-tight">Fleet and Pricing Options</h1>
            <p className="text-[15px] font-semibold text-white/80 max-w-[600px] mx-auto leading-relaxed mb-10">
              We offer comfortable saloons for solo travellers and spacious minibuses for larger groups. Select the ideal vehicle for any journey.
            </p>
            <Link to="/book" className="inline-flex items-center justify-between gap-4 bg-brand-accent hover:bg-brand-accent/90 text-brand-graphite font-bold text-[16px] h-[56px] px-2 pl-6 rounded-full hover:rounded-2xl transition-all mx-auto shadow-lg">
              Book your vehicle
              <div className="w-10 h-10 rounded-full bg-brand-graphite flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                 <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Fleet Vehicles List - Matches Home naked section rhythm */}
      <div className="w-full relative z-20 pt-16 pb-12 lg:pt-24 lg:pb-20">
        <div className="w-full max-w-[1400px] mx-auto flex flex-col px-6 md:px-12 lg:px-[80px] gap-16 lg:gap-24">
          {fleetDetails.map((vehicle, i) => {
            const isEven = i % 2 !== 0;
            return (
              <div 
                key={i} 
                className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 lg:gap-20 items-center`}
              >
                <div className="flex-1 w-full relative">
                   {/* Image Box */}
                   <div className="w-full rounded-[24px] overflow-hidden bg-white shadow-lg shadow-black/5 ring-1 ring-black/[0.04]">
                      <img 
                        src={vehicle.image} 
                        alt={vehicle.name}
                        className="w-full aspect-[4/3] object-cover"
                      />
                   </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-center w-full">
                   {/* Content */}
                   <div className="mb-4">
                     <span className="text-brand-graphite/60 text-[15px] font-semibold tracking-[0.2em] uppercase">
                       {vehicle.capacity}
                     </span>
                   </div>
                   <h2 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-brand-graphite mb-5 leading-[1.1] tracking-tight">
                     {vehicle.name}
                   </h2>
                   <p className="text-brand-graphite/60 text-[15px] leading-relaxed mb-10 max-w-xl font-semibold">
                     {vehicle.description}
                   </p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-12">
                     {vehicle.features.map((feature, idx) => (
                       <div key={idx} className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0"></div>
                         <span className="text-[15px] font-bold text-brand-graphite">{feature}</span>
                       </div>
                     ))}
                   </div>
                   
                   <div>
                     <Link to="/book" className="inline-flex bg-transparent border-2 border-brand-graphite hover:bg-brand-graphite hover:text-white text-brand-graphite rounded-full hover:rounded-2xl pl-6 pr-2 py-2 h-[56px] font-bold text-[16px] items-center justify-between gap-4 w-full sm:w-auto transition-all group">
                       Book this vehicle
                       <div className="w-10 h-10 rounded-full bg-brand-graphite group-hover:bg-white flex items-center justify-center shrink-0 transition-colors group-hover:scale-105">
                         <ArrowRight className="w-4 h-4 text-white group-hover:text-brand-graphite stroke-[2.5]" />
                       </div>
                     </Link>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fleet Extras & Information Card - Matches Home card wrapper rhythm */}
      <div className="px-1 md:px-1.5 py-1 md:py-1.5">
        <div className="bg-brand-primary rounded-[12px] md:rounded-[22px] p-6 md:p-12 lg:p-[80px] flex flex-col lg:flex-row gap-12 lg:gap-24 shadow-md ring-1 ring-black/[0.05]">
          <div className="flex-1 w-full max-w-xl">
            <span className="text-white/60 text-[15px] font-semibold tracking-[0.2em] uppercase mb-4 block">
              SPECIAL REQUIREMENTS
            </span>
            <h2 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold leading-[1.1] text-white tracking-tight mb-5">Special Requirements and Extras</h2>
            <p className="text-[15px] text-white/70 font-semibold mb-10 md:mb-12 leading-[1.6]">
              We accommodate specific vehicle requirements to ensure every passenger travels comfortably. Please mention any necessary extras when booking.
            </p>
            
            <ul className="flex flex-col gap-8 md:gap-10">
              <li className="flex items-start gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Baby className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-bold text-[16px] md:text-[18px] text-white mb-1.5">Child & Infant Seats</h4>
                  <p className="text-[15px] text-white/70 font-semibold leading-[1.6] mt-1">Provided free of charge upon request. Subject to availability.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Accessibility className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-bold text-[16px] md:text-[18px] text-white mb-1.5">Wheelchair Accessibility</h4>
                  <p className="text-[15px] text-white/70 font-semibold leading-[1.6] mt-1">We have a selection of wheelchair-accessible minivans available.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 md:gap-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <Dog className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-bold text-[16px] md:text-[18px] text-white mb-1.5">Pet Friendly</h4>
                  <p className="text-[15px] text-white/70 font-semibold leading-[1.6] mt-1">Pets are welcome as long as they are kept in a secure carrier and you inform us beforehand.</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 w-full lg:max-w-[480px]">
            <div className="bg-[#35414d] border border-white/10 rounded-[24px] p-8 md:p-10 shadow-sm h-full">
              <h3 className="text-[20px] font-bold mb-8 text-white inline-flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-white" strokeWidth={1.5} />
                Luggage Guide
              </h3>
              <div className="flex flex-col gap-6">
                <div className="pb-6 border-b border-white/10">
                  <div className="font-bold text-[13px] text-white uppercase tracking-[0.1em] mb-2.5">Standard Cabin Bag</div>
                  <div className="text-[15px] text-white/70 font-semibold leading-[1.6]">Approx 56 x 45 x 25 cm. Counts as a secondary item alongside large suitcases.</div>
                </div>
                <div className="pb-6 border-b border-white/10">
                  <div className="font-bold text-[13px] text-white uppercase tracking-[0.1em] mb-2.5">Large Check-in Suitcase</div>
                  <div className="text-[15px] text-white/70 font-semibold leading-[1.6]">Up to 23kg. Our stated vehicle capacities refer to this size.</div>
                </div>
                <div>
                  <div className="font-bold text-[13px] text-white uppercase tracking-[0.1em] mb-2.5">Prams & Golf Clubs</div>
                  <div className="text-[15px] text-white/70 font-semibold leading-[1.6]">Count as one large suitcase. Please ensure your chosen vehicle has enough overhead space.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Module - Matches Home naked section structure */}
      <Pricing hideCta />

      {/* Reviews Card - Matches Home card wrapper rhythm */}
      <div className="px-1 md:px-1.5 py-1 md:py-1.5">
        <div className="rounded-[12px] md:rounded-[22px] overflow-hidden shadow-md relative ring-1 ring-black/[0.05] bg-[#1e252a]">
          <Reviews />
        </div>
      </div>

      <Faqs />

    </div>
  );
};
