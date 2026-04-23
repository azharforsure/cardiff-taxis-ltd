
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
          <a
            key={i}
            href="#"
            className="flex-shrink-0 inline-flex items-center justify-center bg-[#EBECEE] hover:bg-[#e1e2e4] text-[#36404a] font-bold text-[13px] px-[26px] h-11 rounded-full hover:rounded-xl transition-all shadow-sm"
          >
            {btn}
          </a>
        ))}
      </div>
    </div>
  );
};
