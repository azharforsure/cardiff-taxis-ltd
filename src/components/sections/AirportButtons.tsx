import { Link } from "react-router-dom";

export const AirportButtons = () => {
  const topButtons = [
    "Cardiff Airport Transfers",
    "Bristol Airport Transfers",
    "London Heathrow Transfers",
    "London Gatwick Transfers",
    "London Stansted Transfers",
    "London Luton Transfers",
  ];

  return (
    <div className="w-full max-w-[1500px] mx-auto overflow-hidden relative mb-0">
      <div className="flex overflow-x-auto gap-3.5 pb-2 px-6 md:px-12 lg:px-[80px] items-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {topButtons.map((btn, i) => (
          <Link
            key={i}
            to="/book"
            className="flex-shrink-0 inline-flex items-center justify-center bg-[#EBECEE] hover:bg-[#e1e2e4] text-[#36404a] font-bold text-[16px] px-[26px] h-12 rounded-full hover:rounded-xl transition-all shadow-sm"
          >
            {btn}
          </Link>
        ))}
      </div>
    </div>
  );
};
