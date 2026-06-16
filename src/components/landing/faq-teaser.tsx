import { ChevronDownIcon } from "@/components/icons";

// Canonical FAQ. This is the single source of truth — the landing renders these
// and emits the FAQPage JSON-LD (see src/app/page.tsx).
export const FAQ_ITEMS = [
  {
    q: "How accurate is the charger data?",
    a: "All charger data is contributed and verified by Pakistan's EV community. We display real-time open/closed status based on each station's configured operating hours. If you find an error, please use the Contact page to let us know.",
  },
  {
    q: "Can I add a new charging station?",
    a: "Yes — authorized contributors can add, edit, and update chargers directly on the map. Sign in with your account and use the Add Charger button. If you'd like contributor access, reach out to us via the Contact page.",
  },
  {
    q: "Are the prices live or manually entered?",
    a: "Prices are manually entered by contributors and may not reflect real-time changes. We recommend confirming pricing at the station before charging.",
  },
  {
    q: "What is the difference between AC and DC charging?",
    a: "AC (Alternating Current) chargers are slower and suitable for overnight or workplace charging. DC (Direct Current) fast chargers can charge most EVs to 80% in 20–60 minutes and are ideal for highway stops and quick top-ups.",
  },
  {
    q: "Do I need to register to leave comments or reactions?",
    a: "You don't need a full account — just enter your name and solve a simple math captcha on any charger's detail page. This one-time step enables commenting and liking/disliking reviews for that session.",
  },
  {
    q: "Is there a mobile app?",
    a: "ChargeMap PK is a Progressive Web App (PWA) — you can install it on your home screen from any modern browser on Android or iOS for an app-like experience without needing to visit an app store.",
  },
  {
    q: "How do I report incorrect information?",
    a: "Use the Contact page to report inaccurate data. If you are an authorized contributor, you can edit the charger directly on the map.",
  },
];

export function FaqTeaser() {
  return (
    <section className="mx-auto max-w-3xl px-5 md:px-8 py-20 md:py-28">
      <h2 className="ld-display text-center text-[clamp(2rem,4.5vw,3rem)] font-bold" style={{ color: "var(--ld-text)" }}>
        Questions, answered
      </h2>

      <div className="mt-10 flex flex-col gap-3">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl px-5 py-4"
            style={{ background: "var(--ld-surface)", border: "1px solid var(--ld-border)" }}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="font-semibold text-[16px]" style={{ color: "var(--ld-text)" }}>{item.q}</span>
              <ChevronDownIcon
                className="w-5 h-5 shrink-0 transition-transform group-open:rotate-180"
                style={{ color: "var(--ld-text-dim)" }}
              />
            </summary>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--ld-text-muted)" }}>
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
