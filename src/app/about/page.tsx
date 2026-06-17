import type { Metadata } from "next";
import Link from "next/link";
import { InfoShell, InfoHeader } from "@/components/landing/info-shell";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ChargeMap PK — Pakistan's community-driven platform for discovering and sharing EV charging stations. Our mission, features, the community, and the technology behind the map.",
  alternates: { canonical: "/about" },
};

const ld = {
  text: { color: "var(--ld-text)" },
  muted: { color: "var(--ld-text-muted)" },
  dim: { color: "var(--ld-text-dim)" },
  card: { background: "var(--ld-surface)", border: "1px solid var(--ld-border)" },
  iconWrap: { background: "color-mix(in oklch, var(--ld-green) 14%, transparent)", color: "var(--ld-green-bright)" },
} as const;

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="ld-display text-2xl font-semibold pt-4" style={ld.text}>
      {children}
    </h2>
  );
}

export default function AboutPage() {
  return (
    <InfoShell>
      <InfoHeader
        title="About ChargeMap PK"
        lede="Pakistan's dedicated platform for discovering and sharing electric vehicle charging stations across the country. As Pakistan transitions toward cleaner transportation, finding reliable charging infrastructure remains a challenge — and that's exactly the problem we're solving."
      />

      <div className="space-y-6 text-[16px] leading-relaxed" style={ld.muted}>
        <H2>Our Mission</H2>
        <p>
          To accelerate EV adoption in Pakistan by making charging station information
          accessible, accurate, and community-driven. We believe that removing range
          anxiety is key to helping more people make the switch to electric vehicles.
        </p>

        <H2>What You Can Do</H2>
        <ul className="list-disc list-outside pl-5 space-y-2">
          <li>Browse an interactive map of EV charging stations across all provinces/territories</li>
          <li>Filter chargers by province, city, charger type (AC/DC), power output, cost, location type, availability, and open status</li>
          <li>View real-time open/closed status based on each station&apos;s operating hours</li>
          <li>See detailed info per station — power, cost, peak-hour pricing, operating hours, phone number, and notes</li>
          <li>Open any charger&apos;s location directly in Google Maps</li>
          <li>View a dedicated details page for each charger with full info, record history, and community comments</li>
          <li>Leave comments and like/dislike reactions on any charger (quick one-time name registration required)</li>
          <li>Use your current location to find nearby charging stations</li>
          <li>Explore live stats — total chargers, DC/AC breakdown, 24-hour availability, and more on the Stats page</li>
          <li>Add new charging stations including AC/DC type, peak-hour pricing, and per-day operating hours (requires sign-in)</li>
          <li>Edit charging stations you have added (requires sign-in)</li>
          <li>Right-click on the map to quickly place a new charger at any location (requires sign-in)</li>
        </ul>

        <H2>Community Powered</H2>
        <p>
          ChargeMap PK is built on community contributions. Every charging station listed
          on our platform is added by users like you. Whether you own a charging station,
          work at one, or simply discovered one during your travels — your contributions
          help the entire EV community in Pakistan.
        </p>

        <H2>Technology</H2>
        <p>
          Built with modern web technologies including Next.js, React, and Leaflet for an
          interactive mapping experience. The platform works across all devices and
          provides real-time data about charging stations nationwide.
        </p>

        <H2>Credits</H2>
        <p>
          ChargeMap PK would not exist without the people who dedicate their time to growing
          Pakistan&apos;s EV community. We are deeply grateful to the following individuals
          and groups.
        </p>

        <div className="space-y-4 not-prose">
          {/* Fawad Hassan */}
          <div className="rounded-xl p-6" style={ld.card}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={ld.iconWrap}>
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h3 className="ld-display text-base font-semibold" style={ld.text}>Fawad Hassan</h3>
                <p className="text-xs" style={ld.dim}>EV Enthusiast &amp; EV Cars Community Admin</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={ld.muted}>
              For maintaining the up-to-date list of EV chargers in Pakistan — the
              foundational dataset that powers this platform.
            </p>
          </div>

          {/* PAK EVs Community */}
          <div className="rounded-xl p-6" style={ld.card}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={ld.iconWrap}>
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3 className="ld-display text-base font-semibold" style={ld.text}>PAK EVs Community — Admin Team</h3>
                <p className="text-xs">
                  <a href="https://pakevs.com/about-us/#team" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--ld-green-bright)" }}>
                    View admin team &rarr;
                  </a>
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={ld.muted}>
              For providing the platform to share technical details, information, reviews,
              expert opinions, and technical advice related to EVs — thus supporting a
              cleaner, greener future for Pakistan.
            </p>
          </div>
        </div>

        <H2>About the Developer</H2>
        <div className="not-prose">
          <div className="rounded-xl p-6" style={ld.card}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={ld.iconWrap}>
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div>
                <h3 className="ld-display text-base font-semibold" style={ld.text}>Zeeshan Altaf</h3>
                <p className="text-xs" style={ld.dim}>Creator &amp; Developer of ChargeMap PK</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={ld.muted}>
              Designed and built ChargeMap PK with 💖 for the PAK EVs Community — to
              make EV charging information across Pakistan accessible, accurate, and
              open to everyone. Learn more about other projects at{" "}
              <a href="https://www.zeeshanai.cloud" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--ld-green-bright)" }}>
                zeeshanai.cloud
              </a>
              .
            </p>
          </div>
        </div>

        <div className="pt-8 mt-4" style={{ borderTop: "1px solid var(--ld-border)" }}>
          <p className="text-sm" style={ld.muted}>
            Have questions or suggestions?{" "}
            <Link href="/contact" className="underline" style={{ color: "var(--ld-green-bright)" }}>
              Get in touch with us
            </Link>
            .
          </p>
        </div>
      </div>
    </InfoShell>
  );
}
