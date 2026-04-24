import { useState } from "react";
import { ArrowRight, Loader2, PhoneCall, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";

export const Hero = () => {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState("airport");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [flightConfig, setFlightConfig] = useState({ number: "", luggage: "" });
  const [contactInfo, setContactInfo] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNextStep = () => {
    if (!pickup || !dropoff) {
      setError("Please enter both pickup and drop-off locations.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmitRequest = async () => {
    if (!contactInfo.name || !contactInfo.phone) {
      setError("Please provide your name and phone number so we can call you back.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://api.staticforms.xyz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessKey: "sf_a185997c08c3aee04f0e9794",
          subject: `New Callback Request: ${contactInfo.name}`,
          name: contactInfo.name,
          phone: contactInfo.phone,
          message: `
            Service: ${serviceType}
            Pickup: ${pickup}
            Drop-off: ${dropoff}
            Flight: ${flightConfig.number || 'N/A'}
            Luggage: ${flightConfig.luggage || '0'}
          `,
          replyTo: "@", // Required by some providers
        }),
      });

      if (response.ok) {
        setLoading(false);
        setStep(3); // Show Success State
      } else {
        throw new Error("Failed to send request");
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try calling us directly.");
    }
  };

  const resetForm = () => {
    setPickup("");
    setDropoff("");
    setFlightConfig({ number: "", luggage: "" });
    setContactInfo({ name: "", phone: "" });
    setStep(1);
  };

  return (
    <div className="w-full relative">
      <div className="relative pt-[140px] pb-[32px] md:pt-[150px] lg:pt-[180px] md:pb-[48px] w-full flex flex-col justify-start min-h-auto transition-all duration-500">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/main-hero.png')",
          }}
        >
          <div className="absolute inset-0 bg-brand-primary/60 mix-blend-multiply"></div>
          <div 
            className="absolute inset-0 backdrop-blur-[12px]"
            style={{
              maskImage: 'linear-gradient(to right, black 30%, transparent 75%)',
              WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 75%)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 lg:px-[80px] mt-0 md:mt-2 lg:mt-4 transition-all duration-500">
          <div className="max-w-[640px]">
            <span className="text-white text-[15px] font-semibold tracking-[0.2em] uppercase mb-4 block">
              SERVING CARDIFF, BRISTOL & LONDON
            </span>

            <h1 className="text-[30px] sm:text-3xl md:text-[38px] lg:text-[44.4px] font-bold text-white mb-5 leading-[1.1] tracking-tight">
              24/7 Airport Transfers and Private Hire in Cardiff
            </h1>

            <p className="text-[15px] text-white/80 mb-8 max-w-[480px] font-semibold leading-relaxed">
              We provide reliable pick up and drop off services to and from Cardiff, Bristol, and London airports. We also offer a complete private hire service covering the entire city of Cardiff, ensuring you reach any destination safely.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a href="tel:07817385655" className="w-full sm:w-auto">
                <Button
                  variant="accent"
                  className="text-brand-graphite pl-5 pr-1.5 py-1.5 font-bold h-[44px] w-full flex items-center justify-between gap-4 text-[13px] rounded-full hover:rounded-2xl shadow-lg hover:bg-brand-accent-hover transition-all"
                >
                  Give us a call
                  <div className="w-8 h-8 rounded-full bg-brand-graphite flex items-center justify-center text-white shrink-0">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Button>
              </a>
              <a 
                href="https://wa.me/447817385655" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="glass"
                  className="bg-brand-secondary/90 hover:bg-brand-secondary text-brand-graphite border-none pl-6 pr-3 font-bold h-[56px] w-full flex items-center justify-between gap-3 rounded-full hover:rounded-2xl text-[16px]"
                >
                  WhatsApp us
                  <svg
                    className="w-[32px] h-[32px] text-brand-graphite opacity-80"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </Button>
              </a>
            </div>


          </div>

          <div className="mt-[42px] md:mt-[64px] lg:mt-[101px] mb-5 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img
                src="/images/avatar_1.png"
                alt="Review"
                className="w-[36px] h-[36px] rounded-full border-2 border-brand-primary object-cover shadow-md"
              />
              <img
                src="/images/avatar_2.png"
                alt="Review"
                className="w-[36px] h-[36px] rounded-full border-2 border-brand-primary object-cover shadow-md"
              />
              <img
                src="/images/avatar_3.png"
                alt="Review"
                className="w-[36px] h-[36px] rounded-full border-2 border-brand-primary object-cover shadow-md"
              />
            </div>
            <span className="text-white text-[13px] font-bold tracking-[0.05em] uppercase">
              READ OUR GOOGLE REVIEWS (5/5)
            </span>
          </div>

          {/* Booking Widget Wrapper */}
          <div className="mt-0 relative z-20 transition-all duration-500">
            <div className="bg-brand-section md:bg-white/95 md:backdrop-blur-sm rounded-[24px] md:rounded-[32px] p-2 md:p-3 shadow-2xl flex flex-col xl:flex-row gap-2 lg:gap-3 transition-all duration-300">

              {step === 1 && (
                <div className="flex flex-col xl:flex-row w-full gap-2 lg:gap-3">
                    <div className="w-full xl:w-[170px] bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 transition-colors">
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-black text-[15px] font-semibold cursor-pointer"
                    >
                      <option value="airport">Airport Transfer</option>
                      <option value="city">City Private Hire</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 flex-[1.5] w-full gap-2">
                    <div className="w-full bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 min-w-0 transition-colors">
                      <input
                        type="text"
                        value={pickup}
                        onChange={(e) => setPickup(e.target.value)}
                        placeholder="Enter pickup or postcode"
                        className="w-full bg-transparent focus:outline-none text-black placeholder:text-gray-500 text-[15px] font-semibold placeholder:truncate"
                      />
                    </div>

                    <div className="w-full bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 min-w-0 transition-colors">
                      <input
                        type="text"
                        value={dropoff}
                        onChange={(e) => setDropoff(e.target.value)}
                        placeholder="Enter drop-off or postcode"
                        className="w-full bg-transparent focus:outline-none text-black placeholder:text-gray-500 text-[15px] font-semibold placeholder:truncate"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-[1] w-full gap-2">
                    <div className="w-full sm:flex-1 bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 min-w-0 transition-colors relative shrink-0">
                      <input
                        type="time"
                        defaultValue="21:40"
                        className="w-full h-full bg-transparent focus:outline-none text-black text-[15px] font-semibold"
                        style={{ colorScheme: 'light' }}
                      />
                    </div>

                    <div className="w-full sm:flex-1 bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 min-w-0 transition-colors shrink-0">
                      <input
                        type="date"
                        defaultValue="2025-10-30"
                        className="w-full h-full bg-transparent focus:outline-none text-black text-[15px] font-semibold uppercase"
                        style={{ colorScheme: 'light' }}
                      />
                    </div>
                  </div>

                  <Button
                    variant="accent"
                    onClick={handleNextStep}
                    className="w-full xl:w-auto h-[60px] md:h-[64px] pl-6 pr-2 py-2 text-brand-graphite shadow-sm whitespace-nowrap font-bold rounded-[16px] md:rounded-[22px] hover:rounded-[12px] md:hover:rounded-[14px] text-[16px] hover:bg-brand-accent-hover flex items-center justify-between gap-4 shrink-0 mt-1 md:mt-0"
                  >
                    Get free quote
                    <div className="w-[44px] h-[44px] md:w-[46px] md:h-[46px] rounded-[14px] md:rounded-[18px] bg-brand-graphite flex items-center justify-center text-white shrink-0">
                      <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                    </div>
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="w-full flex flex-col lg:flex-row flex-wrap items-center gap-2 p-1 md:p-0 animate-in fade-in slide-in-from-right-4">
                  <div className="w-full lg:w-auto px-4 md:px-4 py-2 flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-[#eefcf3] flex items-center justify-center border border-[#0d8a43]/20">
                      <PhoneCall className="w-5 h-5 text-[#0d8a43]" />
                    </div>
                    <div className="lg:block">
                      <h4 className="text-[14px] md:text-[15px] font-bold text-brand-graphite whitespace-nowrap">Final Details</h4>
                      <p className="text-[12px] font-semibold text-brand-graphite/60 lg:hidden">Where should we send your quote?</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row w-full lg:flex-[0.8] gap-2 mt-[3px] md:mt-0 shrink-0 min-w-0">
                    {serviceType === "airport" && (
                      <>
                        <div className="w-full bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 min-w-0">
                          <input
                            type="text"
                            value={flightConfig.number}
                            onChange={(e) => setFlightConfig({ ...flightConfig, number: e.target.value })}
                            placeholder="Flight Number"
                            className="w-full bg-transparent focus:outline-none text-black placeholder:text-gray-500 text-[15px] font-semibold placeholder:truncate"
                          />
                        </div>
                        <div className="w-full md:w-[120px] bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 shrink-0">
                          <input
                            type="number"
                            value={flightConfig.luggage}
                            onChange={(e) => setFlightConfig({ ...flightConfig, luggage: e.target.value })}
                            placeholder="Luggage"
                            min="0"
                            className="w-full bg-transparent focus:outline-none text-black placeholder:text-gray-500 text-[15px] font-semibold"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row w-full lg:flex-[1.5] gap-2 mt-[3px] lg:mt-0 min-w-0">
                    <div className="flex-[1] w-full bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 min-w-0">
                      <input
                        type="text"
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                        placeholder="Your Name"
                        className="w-full bg-transparent focus:outline-none text-black placeholder:text-gray-500 text-[15px] font-semibold placeholder:truncate"
                      />
                    </div>

                    <div className="flex-[1] w-full bg-white md:bg-brand-section border border-gray-200 rounded-[12px] md:rounded-[20px] h-[54px] md:h-[64px] flex items-center px-4 min-w-0">
                      <input
                        type="tel"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        placeholder="Phone Number"
                        className="w-full bg-transparent focus:outline-none text-black placeholder:text-gray-500 text-[15px] font-semibold placeholder:truncate"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2 w-full lg:w-auto mt-2 lg:mt-0 shrink-0 justify-end">
                    <Button
                      variant="glass"
                      onClick={() => setStep(1)}
                      className="w-full lg:w-auto h-[60px] md:h-[64px] px-0 lg:px-8 text-brand-graphite text-[16px] font-bold rounded-[16px] md:rounded-[22px] hover:rounded-[12px] md:hover:rounded-[14px] bg-brand-section md:bg-black/5 hover:bg-black/10 transition-colors border-none md:border"
                    >
                      Back
                    </Button>
                    <Button
                      variant="accent"
                      onClick={handleSubmitRequest}
                      disabled={loading}
                      className="flex-1 lg:w-auto h-[60px] md:h-[64px] pl-6 pr-2 py-2 text-brand-graphite shadow-sm whitespace-nowrap font-bold rounded-[16px] md:rounded-[22px] hover:rounded-[12px] md:hover:rounded-[14px] text-[16px] hover:bg-brand-accent-hover flex items-center justify-between gap-4 shrink-0 transition-colors"
                    >
                      {loading ? "Sending..." : "Request Callback"}
                      <div className="w-[44px] h-[44px] md:w-[46px] md:h-[46px] rounded-[16px] md:rounded-[18px] bg-brand-graphite flex items-center justify-center text-white shrink-0">
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                        )}
                      </div>
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-2 animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0d8a43] flex items-center justify-center shrink-0 shadow-lg shadow-[#0d8a43]/20">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-brand-graphite leading-tight mb-1">Request Sent Successfully!</h4>
                      <p className="text-[14px] font-semibold text-brand-graphite/70">
                        Our dispatch team is calculating the best route and will call you on <strong>{contactInfo.phone}</strong> shortly.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="glass"
                    onClick={resetForm}
                    className="w-full md:w-auto h-[56px] px-8 text-brand-graphite text-[16px] font-bold rounded-[16px] hover:rounded-[10px] bg-black/5 border border-black/10 hover:bg-black/10 transition-colors whitespace-nowrap"
                  >
                    Start new request
                  </Button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && step === 1 && (
              <div className="mt-4 bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 text-[14px] font-semibold animate-in fade-in slide-in-from-top-2">
                <span className="shrink-0 text-lg">⚠️</span>
                {error}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
