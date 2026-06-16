import type { Metadata } from "next";
import { InfoShell } from "@/components/landing/info-shell";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the ChargeMap PK team — report a bug, suggest a feature, or ask a question about Pakistan's EV charging station directory.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <InfoShell>
      <ContactClient />
    </InfoShell>
  );
}
