import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2 } from "lucide-react";

export const Booking = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    serviceType: "airport",
    pickup: "",
    dropoff: "",
    date: "",
    time: "",
    vehicle: "saloon",
    flightNumber: "",
    luggage: "",
    name: "",
    phone: "",
    email: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.staticforms.xyz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessKey: "sf_a185997c08c3aee04f0e9794",
          subject: `New Booking Request: ${formData.name}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `
            SERVICE DETAILS:
            - Type: ${formData.serviceType}
            - Vehicle: ${formData.vehicle}
            - Date: ${formData.date}
            - Time: ${formData.time}
            
            JOURNEY:
            - From: ${formData.pickup}
            - To: ${formData.dropoff}
            
            ADDITIONAL INFO:
            - Flight: ${formData.flightNumber || 'N/A'}
            - Luggage: ${formData.luggage || '0'}
            
            CONTACT:
            - Name: ${formData.name}
            - Phone: ${formData.phone}
            - Email: ${formData.email}
          `,
          replyTo: "@",
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error("Failed to send");
      }
    } catch (err) {
      setError("Failed to submit booking. Please call our dispatch team directly.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col pb-24 min-h-[70vh] items-center justify-center px-6">
        <div className="bg-white p-12 rounded-[32px] shadow-xl text-center max-w-lg w-full animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-8 mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-[#1a202c] mb-4">Booking Requested!</h2>
          <p className="text-[#4a5568] font-medium mb-8">
            Thank you, {formData.name}. Our dispatch team is reviewing your details and will contact you shortly to confirm the price and booking.
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setFormData({ ...formData, pickup: "", dropoff: "" });
            }}
            className="w-full h-[60px] rounded-[20px] bg-[#f2ba4d] text-[#1a202c] font-bold hover:bg-[#e0a83b] transition-all"
          >
            Make another booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-24 min-h-[70vh]">
      <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
        <div className="relative pt-[110px] pb-20 md:pt-[130px] md:pb-28 bg-[#36404a] overflow-hidden rounded-[12px] md:rounded-[22px] shadow-md ring-1 ring-black/[0.05]">
          <div className="text-center w-full max-w-[1400px] mx-auto px-6 relative z-10">
            <span className="text-white/60 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">
              SECURE YOUR TRANSFER
            </span>
            <h1 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-white mb-5 leading-[1.05] tracking-tight">Book a Transfer Today</h1>
            <p className="text-[14px] text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Submit the details below to request a ride. Our dispatch team will review the information and confirm the final price.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-[80px] w-full max-w-[1400px] mx-auto -mt-16 md:-mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white rounded-[24px] shadow-xl ring-1 ring-black/5 p-6 md:p-12">
            <h2 className="text-2xl font-bold text-[#1a202c] mb-6">Journey Details</h2>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#1a202c]">Service Type *</label>
                <select 
                  className="w-full h-[54px] rounded-[14px] bg-[#f8f9fa] border-none px-4 text-[#1a202c] focus:ring-2 focus:ring-[#f2ba4d] cursor-pointer"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  required
                >
                  <option value="airport">Airport Transfer (Cardiff, Bristol, London)</option>
                  <option value="city">City Private Hire (Cardiff only)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a202c]">Pickup Location *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.pickup}
                    onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                    className="w-full h-[54px] rounded-[14px] bg-[#f8f9fa] border-none px-4 text-[#1a202c] focus:ring-2 focus:ring-[#f2ba4d]" 
                    placeholder="Airport, City, or Postcode" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a202c]">Drop-off Location *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.dropoff}
                    onChange={(e) => setFormData({...formData, dropoff: e.target.value})}
                    className="w-full h-[54px] rounded-[14px] bg-[#f8f9fa] border-none px-4 text-[#1a202c] focus:ring-2 focus:ring-[#f2ba4d]" 
                    placeholder="Airport, City, or Postcode" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a202c]">Date *</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full h-[54px] rounded-[14px] bg-[#f8f9fa] border-none px-4 text-[#1a202c] focus:ring-2 focus:ring-[#f2ba4d]" 
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#1a202c]">Time *</label>
                  <input 
                    type="time" 
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full h-[54px] rounded-[14px] bg-[#f8f9fa] border-none px-4 text-[#1a202c] focus:ring-2 focus:ring-[#f2ba4d]" 
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-bold text-[#1a202c]">Select Vehicle *</label>
                <select 
                  required
                  value={formData.vehicle}
                  onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                  className="w-full h-[54px] rounded-[14px] bg-[#f8f9fa] border-none px-4 text-[#1a202c] focus:ring-2 focus:ring-[#f2ba4d] cursor-pointer"
                >
                  <option value="saloon">Saloon (up to 4 passengers)</option>
                  <option value="estate">Estate (extra luggage space)</option>
                  <option value="executive">Executive</option>
                  <option value="people_carrier">People Carrier</option>
                  <option value="executive_pc">Executive People Carrier</option>
                  <option value="8_seater">8-Seater Minibus</option>
                </select>
              </div>

              {formData.serviceType === "airport" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#1a202c]">Flight Number</label>
                    <input 
                      type="text" 
                      value={formData.flightNumber}
                      onChange={(e) => setFormData({...formData, flightNumber: e.target.value})}
                      className="w-full h-[54px] rounded-[14px] bg-[#f8f9fa] border-none px-4 text-[#1a202c] focus:ring-2 focus:ring-[#f2ba4d]" 
                      placeholder="e.g. BA1234" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#1a202c]">Luggage Count</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={formData.luggage}
                      onChange={(e) => setFormData({...formData, luggage: e.target.value})}
                      className="w-full h-[54px] rounded-[14px] bg-[#f8f9fa] border-none px-4 text-[#1a202c] focus:ring-2 focus:ring-[#f2ba4d]" 
                      placeholder="Number of bags" 
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-100">
                <h3 className="text-xl font-bold text-[#1a202c] mb-6">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full h-[54px] rounded-[14px] bg-[#f8f9fa] border-none px-4 text-[#1a202c] focus:ring-2 focus:ring-[#f2ba4d]" 
                      placeholder="Full Name *" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full h-[54px] rounded-[14px] bg-[#f8f9fa] border-none px-4 text-[#1a202c] focus:ring-2 focus:ring-[#f2ba4d]" 
                      placeholder="Phone Number *" 
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full h-[54px] rounded-[14px] bg-[#f8f9fa] border-none px-4 text-[#1a202c] focus:ring-2 focus:ring-[#f2ba4d]" 
                      placeholder="Email Address *" 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-[13px] text-[#4a5568]/70 mb-6 font-medium">By requesting a booking, you agree to our <Link to="/terms" className="text-black font-bold underline">Terms & Conditions</Link>.</p>
                
                {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}
                
                <button 
                  disabled={loading}
                  className="w-full h-[60px] md:h-[64px] rounded-[16px] md:rounded-[22px] bg-[#f2ba4d] text-brand-graphite font-bold text-[14px] hover:bg-[#e0a83b] hover:rounded-xl transition-all mt-2 shadow-lg flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing Request...
                    </>
                  ) : "Request Booking"}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white rounded-[24px] shadow-xl ring-1 ring-black/5 p-8 border-t-4 border-[#f2ba4d]">
              <h3 className="text-xl font-bold text-[#1a202c] mb-6">Why Choose Our Service</h3>
              <ul className="flex flex-col gap-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f8f9fa] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#1a202c]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a202c] mb-1">Fixed Fares</h4>
                    <p className="text-sm text-[#4a5568] leading-snug">The quoted price remains fixed with no hidden fees or surge charges.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f8f9fa] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#1a202c]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a202c] mb-1">Flight Tracking</h4>
                    <p className="text-sm text-[#4a5568] leading-snug">Our dispatch team monitors flight numbers to adjust for delays automatically.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f8f9fa] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#1a202c]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a202c] mb-1">Pay the Driver Directly</h4>
                    <p className="text-sm text-[#4a5568] leading-snug">Complete payment by card or cash directly to the driver at the end of the journey.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-[#2d3748] rounded-[24px] shadow-xl p-8 text-white relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 opacity-10">
                 <svg className="w-40 h-40" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.19v6.72zm14 0v-6.72l-6 3.39v6.71l6-3.38z"/></svg>
               </div>
               <h3 className="text-xl font-bold mb-3 relative z-10">Need an immediate pick up</h3>
               <p className="text-white/80 text-sm mb-6 relative z-10 leading-relaxed">If a vehicle is required within the next two hours in Cardiff, please call our dispatch team directly for immediate assistance.</p>
               <a href="tel:07459466835" className="inline-flex items-center justify-center w-full h-[54px] rounded-full hover:rounded-2xl bg-white text-[#1a202c] font-bold relative z-10 hover:bg-gray-100 transition-all">
                  07459 466835
               </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
