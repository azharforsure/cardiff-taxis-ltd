import { Helmet } from "react-helmet-async";

export const Privacy = () => {
  return (
    <div className="flex flex-col pb-24 min-h-[70vh]">
      <Helmet>
        <title>Privacy Policy | Cardiff Taxis Ltd</title>
        <meta name="description" content="Read our privacy policy to understand how Cardiff Taxis Ltd collects, uses, and protects your personal information." />
      </Helmet>
      <div className="px-1 md:px-1.5 pt-1 md:pt-1.5">
        <div className="relative pt-[180px] pb-[140px] md:pt-[260px] md:pb-[200px] bg-[#36404a] overflow-hidden rounded-[12px] md:rounded-[22px] shadow-md ring-1 ring-black/[0.05]">
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
             <img 
                src="/images/hero_bg_new_1776974956001.png" 
                alt="Data Protection" 
                className="w-full h-full object-cover"
             />
          </div>
          <div className="absolute inset-0 z-10 bg-[#36404a]/60 backdrop-blur-[4px] mix-blend-multiply"></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#36404a] via-[#36404a]/20 to-transparent"></div>
          <div className="text-center w-full max-w-[1400px] mx-auto px-6 relative z-20">
            <span className="text-white/60 text-[15px] font-semibold tracking-[0.2em] uppercase mb-4 block">
              DATA PROTECTION
            </span>
            <h1 className="text-[30px] sm:text-3xl md:text-[38px] lg:text-[44.4px] font-bold text-white mb-5 leading-[1.05] tracking-tight">Privacy Policy</h1>
            <p className="text-[15px] text-white/80 max-w-2xl mx-auto font-semibold leading-relaxed">
              Last Updated: {new Date().toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 w-full max-w-[1400px] mx-auto -mt-16 md:-mt-20 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-xl ring-1 ring-black/5 prose prose-slate">
          <h3 className="text-[18px] md:text-[20px] font-bold text-[#1a202c] mb-3 tracking-tight">1. Information We Collect</h3>
          <p className="text-[#4a5568]/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Cardiff Taxis Ltd collects personal information when you make a booking, use our contact forms, or interact with our services. This includes your name, phone number, email address, pickup and drop-off locations, and flight details if applicable. We require this data to fulfill your booking effectively.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-[#1a202c] mb-3 tracking-tight">2. How We Use Your Data</h3>
          <p className="text-[#4a5568]/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            We use your information exclusively to process your reservations, communicate with you regarding your journey (such as sending driver updates or tracking flights), and to handle customer service inquiries. We may also use it for internal record-keeping and regulatory compliance.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-[#1a202c] mb-3 tracking-tight">3. Data Sharing and Security</h3>
          <p className="text-[#4a5568]/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            Your personal data is shared only with our dispatch team and the assigned vehicle driver for the purpose of completing your trip. We do not sell, rent, or trade your personal information to third parties. We employ appropriate security measures to protect your data against unauthorized access or disclosure.
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-[#1a202c] mb-3 tracking-tight">4. Retention Period</h3>
          <p className="text-[#4a5568]/80 text-[15px] font-semibold leading-relaxed mb-6 border-b border-gray-100 pb-6">
            We retain your personal data for as long as necessary to fulfill the purposes outlined in this policy or to conform to legal and accounting requirements (e.g., maintaining transport records).
          </p>

          <h3 className="text-[18px] md:text-[20px] font-bold text-[#1a202c] mb-3 tracking-tight">5. Your Rights</h3>
          <p className="text-[#4a5568]/80 text-[15px] font-semibold leading-relaxed">
            Under the GDPR, you have the right to request access to the personal data we hold about you, request corrections to inaccurate data, or request the deletion of your data. To exercise these rights, please contact us at bookings@cardifftaxisltd.co.uk.
          </p>
        </div>
      </div>
    </div>
  );
};
