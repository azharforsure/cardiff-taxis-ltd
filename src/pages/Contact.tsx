import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.staticforms.xyz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessKey: "sf_f96289f14e8fff1fc664b7dd",
          subject: `New Message from ${formData.name}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          replyTo: "@",
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error("Failed to send");
      }
    } catch (err) {
      setError("Failed to send message. Please call us instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pb-24 min-h-[70vh]">
      <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
        <div className="relative pt-[110px] pb-20 md:pt-[130px] md:pb-28 bg-[#36404a] overflow-hidden rounded-[12px] md:rounded-[22px] shadow-md ring-1 ring-black/[0.05]">
          <div className="text-center w-full max-w-[1400px] mx-auto px-6 relative z-10">
            <span className="text-white/60 text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">
              GET IN TOUCH
            </span>
            <h1 className="text-[30px] sm:text-3xl md:text-[34px] lg:text-[40px] font-bold text-white mb-5 leading-[1.05] tracking-tight">Get in Touch</h1>
            <p className="text-[14px] text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Reach out regarding upcoming journeys, lost property, or setting up a corporate account. Our dispatch team is available around the clock.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 w-full max-w-[1400px] mx-auto -mt-16 md:-mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-5xl mx-auto bg-white rounded-[32px] shadow-xl ring-1 ring-black/5 overflow-hidden">
          
          {/* Contact Info */}
          <div className="p-8 md:p-12 bg-[#2d3748] text-white flex flex-col justify-between rounded-t-[32px] lg:rounded-tr-none lg:rounded-l-[32px]">
            <div>
              <h3 className="text-2xl font-bold mb-8">Cardiff Taxis Ltd</h3>
              <div className="flex flex-col gap-6">
                <a href="tel:07459466835" className="flex items-start gap-4 hover:text-[#f2ba4d] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#f2ba4d]/20">
                    <svg className="w-5 h-5 text-white group-hover:text-[#f2ba4d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold mb-1">Phone</div>
                    <div className="text-white/80">07459 466835</div>
                  </div>
                </a>

                <a href="mailto:bookings@cardifftaxisltd.co.uk" className="flex items-start gap-4 hover:text-[#f2ba4d] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#f2ba4d]/20">
                    <svg className="w-5 h-5 text-white group-hover:text-[#f2ba4d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold mb-1">Email</div>
                    <div className="text-white/80">bookings@cardifftaxisltd.co.uk</div>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold mb-1">Company Registered Details</div>
                    <div className="text-white/80">Reg No: 16436130<br/>Cardiff, Wales</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 text-sm text-white/50">
              Available 24 hours a day, 7 days a week.
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-12">
            <h3 className="text-2xl font-bold text-[#1a202c] mb-6 tracking-tight">Send a Message</h3>
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center animate-in fade-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-[#1a202c] mb-2">Message Sent!</h4>
                <p className="text-[#4a5568] font-medium">Thank you for reaching out. Our team will get back to you shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-sm font-bold text-[#f2ba4d] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#1a202c] uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full h-[54px] rounded-[16px] bg-[#f8f9fa] border-none px-4 text-[14px] md:text-[15px] font-bold text-[#1a202c]" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#1a202c] uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full h-[54px] rounded-[16px] bg-[#f8f9fa] border-none px-4 text-[14px] md:text-[15px] font-bold text-[#1a202c]" 
                    placeholder="john@example.com" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#1a202c] uppercase tracking-wider">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full h-[54px] rounded-[16px] bg-[#f8f9fa] border-none px-4 text-[14px] md:text-[15px] font-bold text-[#1a202c]" 
                    placeholder="Your phone number" 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#1a202c] uppercase tracking-wider">Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full min-h-[140px] rounded-[16px] bg-[#f8f9fa] border-none p-4 resize-y text-[14px] md:text-[15px] font-bold text-[#1a202c]" 
                    placeholder="How can we help?"
                  ></textarea>
                </div>
                
                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                
                <button 
                  disabled={loading}
                  className="h-[60px] md:h-[64px] rounded-[16px] md:rounded-[22px] bg-[#f2ba4d] text-[#1a202c] font-bold text-[15px] hover:bg-[#e0a83b] hover:rounded-xl transition-all mt-2 shadow-lg flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : "Send Message"}
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Quick Help */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="text-center mb-12 px-6">
            <h2 className="text-[26px] md:text-[32px] font-bold text-[#1a202c] leading-[1.1] tracking-tight">Quick Answers</h2>
            <p className="text-[#4a5568]/80 mt-4 text-[14px] font-medium leading-relaxed">Helpful information regarding bookings and services.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] p-8 shadow-sm ring-1 ring-black/5">
              <h4 className="font-bold text-[#1a202c] mb-3 text-[17px]">Amending a booking</h4>
              <p className="text-[#4a5568] text-[14px] md:text-[15px] font-medium leading-[1.6]">You can amend a booking by calling our dispatch line directly. Please provide at least 2 hours notice for local changes.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-sm ring-1 ring-black/5">
              <h4 className="font-bold text-[#1a202c] mb-3 text-[17px]">Public holiday operations</h4>
              <p className="text-[#4a5568] text-[14px] md:text-[15px] font-medium leading-[1.6]">We operate 24 hours a day, 365 days a year, including Christmas and New Year. Please note special peak rates may apply.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-sm ring-1 ring-black/5">
              <h4 className="font-bold text-[#1a202c] mb-3 text-[17px]">Setting up a multi-stop ride</h4>
              <p className="text-[#4a5568] text-[14px] md:text-[15px] font-medium leading-[1.6]">Yes. If you need multiple drop-offs for a group, please outline this in the message box when booking for an accurate quote.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 shadow-sm ring-1 ring-black/5">
              <h4 className="font-bold text-[#1a202c] mb-3 text-[17px]">Lost property</h4>
              <p className="text-[#4a5568] text-[14px] md:text-[15px] font-medium leading-[1.6]">Please call dispatch immediately with your booking reference. We log all found items securely at our head office.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
