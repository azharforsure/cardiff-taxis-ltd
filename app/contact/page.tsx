import type { Metadata } from "next";
import { Contact } from "../../src/views/Contact";

export const metadata: Metadata = {
  title: "Contact Us | 24/7 Cardiff Taxi Dispatch & Customer Support",
  description:
    "Contact Cardiff Taxis Ltd. Available 24 hours a day, 7 days a week for immediate taxi bookings, quotes, and enquiries. Call 07817 385655 or WhatsApp us.",
  alternates: {
    canonical: "https://cardifftaxisltd.co.uk/contact",
  },
  openGraph: {
    title: "Contact Us | Cardiff Taxis Ltd",
    description:
      "Get in touch with Cardiff Taxis Ltd. 24/7 dispatch phone, email, and WhatsApp support.",
    url: "https://cardifftaxisltd.co.uk/contact",
    images: ["/images/main-hero.png"],
  },
};

export default function ContactPage() {
  return <Contact />;
}
