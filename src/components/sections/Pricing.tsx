import { Phone, ArrowRight, User, Briefcase } from "lucide-react";
import { Link } from "../ui/Link";

export const Pricing = () => {
  const priceList = [
    {
      vehicle: "Saloon",
      firstMile: "£35",
      remaining: "£1.50/mile",
      passengers: 4,
      suitcases: 2,
      note: "Standard saloon for up to 4 passengers",
    },
    {
      vehicle: "Executive",
      firstMile: "£60",
      remaining: "£1.80/mile",
      passengers: 4,
      suitcases: 2,
      note: "Premium corporate saloon",
    },
    {
      vehicle: "Estate",
      firstMile: "£45",
      remaining: "£1.60/mile",
      passengers: 4,
      suitcases: 3,
      note: "Extra boot capacity (max 3 suitcases)",
    },
    {
      vehicle: "People Carrier",
      firstMile: "£50",
      remaining: "£1.70/mile",
      passengers: 6,
      suitcases: 4,
      note: "Spacious MPV for family journeys",
    },
    {
      vehicle: "Executive People Carrier",
      firstMile: "£60",
      remaining: "£2.00/mile",
      passengers: 6,
      suitcases: 4,
      note: "Luxury VIP group transfer",
    },
    {
      vehicle: "8 Seater Mini Bus",
      firstMile: "£60",
      remaining: "£2.00/mile",
      passengers: 7,
      suitcases: 7,
      note: "Max 7 passengers & 7 suitcases",
    },
  ];

  return (
    <section className="py-16 md:py-24 px-6 md:px-12 w-full max-w-[1400px] mx-auto">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="text-brand-muted text-[13px] md:text-[14px] font-semibold tracking-[0.2em] uppercase mb-3 block">
          TRANSPARENT PRICING
        </span>
        <h2 className="text-[28px] md:text-[34px] lg:text-[42px] font-bold text-brand-graphite mb-4 leading-[1.1] tracking-tight">
          Vehicle Pricing Table
        </h2>
        <p className="text-[15px] md:text-[16px] text-brand-muted font-semibold max-w-2xl mx-auto leading-relaxed">
          Straightforward pricing with clear first-mile and remaining-mile charges. Return bookings receive an additional <strong>5% discount</strong> on the total fare.
        </p>
      </div>

      {/* Pricing Table Card */}
      <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden max-w-5xl mx-auto mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-primary text-white border-b border-brand-primary/20">
                <th className="py-4 px-5 md:px-6 font-bold text-[14px] md:text-[15px]">
                  Vehicle Type
                </th>
                <th className="py-4 px-4 font-bold text-[14px] md:text-[15px] text-center">
                  First Mile
                </th>
                <th className="py-4 px-4 font-bold text-[14px] md:text-[15px] text-center">
                  Remaining Journey
                </th>
                <th className="py-4 px-4 font-bold text-[14px] md:text-[15px] text-center">
                  Capacity
                </th>
                <th className="py-4 px-5 font-bold text-[14px] md:text-[15px] text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {priceList.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-brand-section/50 transition-colors"
                >
                  <td className="py-4 px-5 md:px-6">
                    <p className="font-bold text-brand-graphite text-[15px] md:text-[16px]">
                      {item.vehicle}
                    </p>
                    <p className="text-[12px] text-brand-muted font-medium">
                      {item.note}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block bg-brand-section text-brand-graphite font-bold px-3 py-1 rounded-full text-[14px] md:text-[15px]">
                      {item.firstMile}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-semibold text-brand-graphite text-[14px] md:text-[15px]">
                      {item.remaining}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-3 text-[13px] text-brand-muted font-semibold">
                      <span className="flex items-center gap-1" title={`${item.passengers} Passengers`}>
                        <User className="w-3.5 h-3.5" />
                        {item.passengers}
                      </span>
                      <span className="flex items-center gap-1" title={`${item.suitcases} Suitcases`}>
                        <Briefcase className="w-3.5 h-3.5" />
                        {item.suitcases}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Link
                      to="/book"
                      className="inline-flex items-center gap-1.5 text-[13px] font-bold text-brand-primary hover:text-brand-accent transition-colors"
                    >
                      Book <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a
          href="tel:02922649844"
          className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-primary text-white text-[16px] font-bold shadow-lg shadow-brand-primary/20 transition-all duration-300 hover:scale-105 hover:bg-brand-graphite w-full sm:w-auto"
        >
          <Phone className="w-5 h-5" strokeWidth={2.5} />
          Call Us (029 2264 9844)
        </a>
        <Link
          to="/book"
          className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-brand-accent text-brand-graphite text-[16px] font-bold shadow-md hover:bg-brand-accent-hover transition-all duration-300 hover:scale-105 w-full sm:w-auto"
        >
          Get an Instant Quote
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};
