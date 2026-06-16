import { SearchIcon, PhoneIcon, PlusIcon } from "@/components/icons";

const STEPS = [
  {
    n: "01",
    icon: <SearchIcon className="w-5 h-5" />,
    title: "Find a charger",
    body: "Open the map, filter for the connector and power you need, and spot the nearest station that's open along your route.",
  },
  {
    n: "02",
    icon: <PhoneIcon className="w-5 h-5" />,
    title: "Check & confirm",
    body: "Review power, hours, and tentative pricing. Prices are community-entered, so a quick call to the listed number confirms the exact rate.",
  },
  {
    n: "03",
    icon: <PlusIcon className="w-5 h-5" />,
    title: "Give back",
    body: "Found a new station or a price change? Leave a comment, react, or add a listing so the next driver arrives informed.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--ld-green-bright)" }}>
          How it works
        </p>
        <h2 className="ld-display mt-3 text-[clamp(2rem,4.5vw,3rem)] font-bold" style={{ color: "var(--ld-text)" }}>
          From range anxiety to road trip in three steps
        </h2>
      </div>

      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <li key={s.n} className="relative rounded-2xl p-7" style={{ background: "var(--ld-surface)", border: "1px solid var(--ld-border)" }}>
            <span className="ld-display absolute right-6 top-5 text-5xl font-bold" style={{ color: "var(--ld-border-strong)" }}>
              {s.n}
            </span>
            <span
              className="relative flex items-center justify-center w-11 h-11 rounded-xl"
              style={{ background: "color-mix(in oklch, var(--ld-green) 14%, transparent)", color: "var(--ld-green-bright)" }}
            >
              {s.icon}
            </span>
            <h3 className="ld-display mt-5 text-xl font-semibold" style={{ color: "var(--ld-text)" }}>{s.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--ld-text-muted)" }}>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
