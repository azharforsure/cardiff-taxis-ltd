import { Helmet } from "react-helmet-async";

export const Terms = () => {
  return (
    <div className="flex flex-col pb-24 min-h-[70vh]">
      <Helmet>
        <title>Terms & Conditions | Cardiff Taxis Ltd</title>
        <meta name="description" content="Read the terms and conditions for using Cardiff Taxis Ltd services. Information on bookings, cancellations, and passenger responsibilities." />
      </Helmet>
      <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
        <div className="relative pt-[180px] pb-[140px] md:pt-[260px] md:pb-[200px] bg-brand-primary overflow-hidden rounded-[12px] md:rounded-[22px] shadow-md ring-1 ring-black/[0.05]">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
             <img
                src="/images/hero_bg_new_1776974956001.png"
                alt="Legal Information"
                className="w-full h-full object-cover"
             />
          </div>
          <div className="absolute inset-0 z-10 bg-brand-primary/60 backdrop-blur-[2px] mix-blend-multiply"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-primary via-brand-primary/20 to-transparent"></div>
          <div className="text-center w-full max-w-[1400px] mx-auto px-6 relative z-20">
            <span className="text-white/60 text-[15px] font-semibold tracking-[0.2em] uppercase mb-4 block">
              LEGAL INFORMATION
            </span>
            <h1 className="text-[30px] sm:text-3xl md:text-[38px] lg:text-[44.4px] font-bold text-white mb-5 leading-[1.05] tracking-tight">Terms & Conditions</h1>
            <p className="text-[15px] text-white/80 max-w-2xl mx-auto font-semibold leading-relaxed">
              Last Updated: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 w-full max-w-[1400px] mx-auto -mt-16 md:-mt-20 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-xl ring-1 ring-black/5 prose prose-slate">

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">1. Journey Acknowledgement & Details</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            You will receive a "Journey Acknowledgement" email for the journey(s) you have paid for. It is your responsibility to check that all booking details provided are correct.
            <br /><br />
            You will receive a "Journey Details" email once your booking has been assigned to a driver. This email will include pickup instructions and the driver's contact number. Cardiff Taxis Ltd cannot be held responsible if you fail to retain these details.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">2. Missed Flights & Airport Transfers</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Cardiff Taxis Ltd accepts no responsibility for missed flights caused by traffic delays, accidents, vehicle breakdowns, severe weather conditions, or any other unforeseen circumstances.
            <br /><br />
            Passengers are advised to allow sufficient travel time and aim to arrive at the airport at least 2 hours before their flight departure time. Cardiff Taxis Ltd will not accept responsibility for missed flights where insufficient check-in time has been allowed.
            <br /><br />
            Passengers may choose a pickup time that allows less than 2 hours before departure; however, Cardiff Taxis Ltd accepts no liability for any resulting missed flights.
            <br /><br />
            All passengers are strongly advised to obtain adequate travel insurance before making a booking.
            <br /><br />
            Please ensure that arrival flight details provided relate to your arrival into the UK and not your departure information. If your flight is significantly delayed, please inform us as soon as possible.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">3. Waiting Time</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            For airport pickups, Cardiff Taxis Ltd allows the first 60 minutes of waiting time free of charge from the flight landing time.
            <br /><br />
            After the first hour, waiting time will be charged at £20 per hour pro rata, regardless of the reason for delay.
            <br /><br />
            For all non-airport journeys, waiting time will be charged at 40 pence per minute from the scheduled pickup time.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">4. Pricing</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Prices are calculated based on journey distance, travel time, vehicle type, and the number of passengers travelling.
            <br /><br />
            Cardiff Taxis Ltd reserves the right to provide an upgraded vehicle where the selected vehicle is unavailable.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">5. Amendments & Re-Booking</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Any amendments to bookings must be made directly through our office via telephone or email. Confirmation of the amendment will be sent by email. Amendments should not be arranged directly with drivers.
            <br /><br />
            All bookings must be made through the office via the website, telephone, or email to ensure confirmation and insurance coverage.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">6. Cancellations</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Cardiff Taxis Ltd accepts cancellations provided at least 12 hours' notice is given. A cancellation fee of £10 or 10% of the booking value (whichever is greater) will apply.
            <br /><br />
            All cancellation requests must be submitted by email, and confirmation will be provided upon receipt. If you do not receive confirmation of cancellation, please contact our out-of-hours number immediately.
            <br /><br />
            Refunds will not be issued in the following circumstances:
          </p>
          <ul className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6 list-disc list-inside space-y-1">
            <li>Passenger no-shows for prepaid bookings</li>
            <li>Cancellations made with less than 12 hours' notice</li>
            <li>Any other circumstances deemed non-refundable under company policy</li>
          </ul>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Any exceptional refund requests should be directed to Cardiff Taxis Ltd customer services.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">7. Luggage & Vehicle Capacity</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Cardiff Taxis Ltd accepts no responsibility where passenger numbers or luggage exceed the capacity of the vehicle booked. If you are unsure which vehicle type is suitable, please contact our customer service team before travel.
            <br /><br />
            For safety and compliance with taxi licensing regulations, all luggage must be securely stored within the vehicle. Please take this into consideration when selecting your vehicle.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">8. Animals</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Cardiff Taxis Ltd reserves the right to refuse transportation of animals that were not declared at the time of booking. Any approved animals must be transported in a secure and suitable carrier or crate. Cardiff Taxis Ltd accepts no responsibility for costs incurred due to failure to comply with these requirements.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">9. Routes</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            The route taken during the journey will be at the driver's discretion based on traffic and road conditions on the day of travel. Alternative routes may be requested and will be considered where reasonably possible.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">10. Third-Party Operators & Upgrades</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Cardiff Taxis Ltd may use third-party operators where necessary to fulfil bookings.
            <br /><br />
            Cardiff Taxis Ltd reserves the right to provide an upgraded vehicle category where the originally booked vehicle is unavailable.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">11. Surcharges</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Bookings scheduled during the following periods may be subject to a 50% surcharge:
          </p>
          <ul className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6 list-disc list-inside space-y-1">
            <li>24 December from 18:00 until 26 December at 23:59</li>
            <li>31 December from 18:00 until 1 January at 23:59</li>
            <li>Additional peak dates may also be subject to surcharges.</li>
          </ul>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">12. Payments</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            All card payments are processed securely through SumUp using industry-standard security and authentication measures.
            <br /><br />
            Customer-initiated payments may be repeated for authorised additional services or adjustments related to an existing booking. For example, if a passenger requests an additional service after the original booking has been confirmed, Cardiff Taxis Ltd may process the additional charge using the original payment method, subject to applicable security checks and customer authorisation. Refunds, where applicable, may also be issued back to the original payment method.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">13. Vehicle Damage & Cleaning</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Passengers are responsible for any costs incurred in restoring a vehicle to working condition where damage or excessive cleaning is required beyond normal wear and tear.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">14. Privacy</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            We use personal information only for the purposes of providing and managing the services requested. Information may also be used for auditing, research, and service improvement purposes.
            <br /><br />
            Where necessary to complete your booking, selected information may be shared with trusted third-party service providers.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">15. Conduct</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Cardiff Taxis Ltd is committed to maintaining a safe and respectful environment for employees, drivers, and passengers.
            <br /><br />
            Harassment, abuse, threatening behaviour, or inappropriate conduct of any kind will not be tolerated. Cardiff Taxis Ltd reserves the right to refuse or terminate service where these standards are breached.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-brand-graphite mb-3 tracking-tight">16. Call Recording</h3>
          <p className="text-brand-muted/80 text-[15px] font-semibold leading-relaxed">
            Please note that calls may be recorded for training and quality assurance purposes.
          </p>

        </div>
      </div>
    </div>
  );
};
