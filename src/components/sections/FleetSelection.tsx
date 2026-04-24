import { ArrowRight, User, Luggage, Briefcase } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export const FleetSelection = () => {
  const fleet = [
    {
      name: "8 seater",
      image: "/images/fleet_minibus_1776973773526.png",
      specs: [
        { icon: <User className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "8" },
        { icon: <Luggage className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "6" },
        { icon: <Briefcase className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "4" },
      ],
      altSpecs: [
        { icon: <User className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "8" },
        { icon: <Luggage className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "8" },
      ]
    },
    {
      name: "Estate",
      image: "/images/fleet_estate_new_1776975140733.png",
      specs: [
        { icon: <User className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "4" },
        { icon: <Luggage className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "3" },
        { icon: <Briefcase className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "2" },
      ],
      altSpecs: [
        { icon: <User className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "4" },
        { icon: <Luggage className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "4" },
      ]
    },
    {
      name: "Car",
      image: "/images/fleet_saloon_new_1776975126069.png",
      specs: [
        { icon: <User className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "4" },
        { icon: <Luggage className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "2" },
        { icon: <Briefcase className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "1" },
      ],
      altSpecs: [
        { icon: <User className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "4" },
        { icon: <Luggage className="w-[18px] h-[18px]" strokeWidth={1.5} />, val: "4" },
      ]
    }
  ];

  return (
    <section className="bg-brand-graphite rounded-[32px] overflow-hidden py-16 lg:py-24 lg:px-4">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px]">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div className="max-w-xl">
            <span className="text-[15px] font-semibold text-white/80 tracking-[0.2em] uppercase mb-4 block">
              OUR FLEET
            </span>
            <h2 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Choose the perfect vehicle for<br className="hidden lg:block"/> passengers and luggage
            </h2>
            <p className="text-[15px] text-white/80 font-semibold leading-relaxed max-w-[480px]">
              Every vehicle in our fleet is well maintained, spacious, and driven by an experienced local professional.
            </p>
          </div>
          
          <Link to="/book" className="rounded-full hover:rounded-2xl pl-6 pr-2 py-2 bg-white text-brand-primary font-bold flex items-center justify-between gap-4 hover:bg-gray-100 transition-all text-[16px] h-[56px] shadow-md w-fit">
            Book a trip
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center shrink-0">
              <ArrowRight className="w-4 h-4 text-white" strokeWidth={2.5}/>
            </div>
          </Link>
        </div>

        {/* Fleet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {fleet.map((vehicle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[24px] p-4 flex flex-col min-h-[380px]"
            >
              <div className="flex-1 flex items-center justify-center mb-6 bg-brand-section rounded-[16px] w-full pt-12 pb-10 px-4 h-[240px]">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-contain mix-blend-multiply drop-shadow-md" 
                />
              </div>
              
              <div className="flex justify-between items-end pb-4 px-2">
                <h4 className="text-[15px] font-bold text-brand-graphite mb-1">{vehicle.name}</h4>
                
                <div className="space-y-2.5">
                  <div className="flex items-center justify-end gap-3.5">
                    {vehicle.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-brand-muted">
                        {spec.icon}
                        <span className="text-[15px] font-bold">{spec.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-end gap-3.5">
                    {vehicle.altSpecs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-brand-muted">
                        {spec.icon}
                        <span className="text-[15px] font-bold">{spec.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-brand-secondary rounded-[24px] p-2 pl-2 flex flex-col sm:flex-row items-center gap-5 lg:w-fit cursor-pointer hover:bg-brand-muted transition-colors">
          <div className="w-[60px] h-[60px] rounded-[18px] overflow-hidden shrink-0">
            <img 
              src="/images/about_taxi_new_1776975028206.png" 
              alt="Info"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-brand-graphite text-[15px] font-semibold pr-8 pt-1 sm:pt-0 pb-2 sm:pb-0">
            Child seats are exempt in UK public transport. Need help choosing a vehicle? Give us a call to discuss passenger and luggage requirements.
          </p>
        </div>
      </div>
    </section>
  );
};
