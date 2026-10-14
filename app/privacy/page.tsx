import type { Metadata } from "next";
import { Privacy } from "../../src/views/Privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | Cardiff Taxis Ltd",
  description:
    "How Cardiff Taxis Ltd collects, protects, and handles personal data and booking information.",
  alternates: {
    canonical: "https://cardifftaxisltd.co.uk/privacy",
  },
};

export default function PrivacyPage() {
  return <Privacy />;
}
