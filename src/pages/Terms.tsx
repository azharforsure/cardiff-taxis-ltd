export const Terms = () => {
  return (
    <div className="flex flex-col pb-24 min-h-[70vh]">
      <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
        <div className="relative pt-[110px] pb-20 md:pt-[130px] md:pb-28 bg-[#36404a] overflow-hidden rounded-[12px] md:rounded-[22px] shadow-md ring-1 ring-black/[0.05]">
          <div className="text-center w-full max-w-[1400px] mx-auto px-6 relative z-10">
            <span className="text-white/60 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">
              LEGAL INFORMATION
            </span>
            <h1 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-white mb-5 leading-[1.05] tracking-tight">Terms & Conditions</h1>
            <p className="text-[14px] text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Last Updated: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 w-full max-w-[1400px] mx-auto -mt-16 md:-mt-20 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-xl ring-1 ring-black/5 prose prose-slate">
          <h3 className="text-[16px] md:text-[18px] font-bold text-[#1a202c] mb-3 tracking-tight">1. General Bookings</h3>
          <p className="text-[#4a5568]/80 text-[14px] font-medium leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Cardiff Taxis Ltd provides pre-booked private hire services. All bookings must be made through our official channels (website, app, or phone) and are subject to availability. By placing a booking, the customer agrees to these terms.
          </p>

          <h3 className="text-[16px] md:text-[18px] font-bold text-[#1a202c] mb-3 tracking-tight">2. Airport Transfers & Waiting Times</h3>
          <p className="text-[#4a5568]/80 text-[14px] font-medium leading-relaxed mb-6 border-b border-gray-100 pb-6">
            For airport pickups, we monitor flight arrivals. The standard fixed price includes 45 minutes of waiting time after the flight has landed to allow for luggage collection and customs. Additional waiting time beyond this will be charged at our standard hourly rate.
          </p>

          <h3 className="text-[16px] md:text-[18px] font-bold text-[#1a202c] mb-3 tracking-tight">3. Cancellations</h3>
          <p className="text-[#4a5568]/80 text-[14px] font-medium leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Cancellations must be made at least 24 hours prior to the scheduled pickup time for a full refund. Cancellations made within 24 hours of the pickup time may be subject to a cancellation fee of up to 100% of the journey cost.
          </p>

          <h3 className="text-[16px] md:text-[18px] font-bold text-[#1a202c] mb-3 tracking-tight">4. Luggage & Vehicle Capacity</h3>
          <p className="text-[#4a5568]/80 text-[14px] font-medium leading-relaxed mb-6 border-b border-gray-100 pb-6">
            It is the customer's responsibility to select a vehicle with adequate capacity for all passengers and luggage. Cardiff Taxis Ltd reserves the right to decline carriage if the vehicle is overloaded or if luggage poses a safety hazard. We will not be responsible for any extra costs if an additional vehicle is required due to un-notified excess luggage.
          </p>

          <h3 className="text-[16px] md:text-[18px] font-bold text-[#1a202c] mb-3 tracking-tight">5. Conduct & Cleaning</h3>
          <p className="text-[#4a5568]/80 text-[14px] font-medium leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Eating and drinking in the vehicles is generally prohibited unless explicitly authorized by the driver. Customers are responsible for any damage or soiling of the vehicle interior. A valeting fee of up to £80 may be charged in the event of severe soiling.
          </p>

          <h3 className="text-[16px] md:text-[18px] font-bold text-[#1a202c] mb-3 tracking-tight">6. Liability</h3>
          <p className="text-[#4a5568]/80 text-[14px] font-medium leading-relaxed">
            Cardiff Taxis Ltd aims to transport passengers to their destinations on time but accepts no liability for delays caused by circumstances beyond our control, including but not limited to traffic congestion, road closures, adverse weather conditions, or vehicle breakdowns.
          </p>
        </div>
      </div>
    </div>
  );
};
