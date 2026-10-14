import type { Metadata } from "next";
import { Terms } from "../../src/views/Terms";

export const metadata: Metadata = {
  title: "Terms & Conditions | Cardiff Taxis Ltd",
  description:
    "Read our booking terms, cancellation policies, passenger guidelines, and airport transfer terms.",
  alternates: {
    canonical: "https://cardifftaxisltd.co.uk/terms",
  },
};

export default function TermsPage() {
  return <Terms />;
}
