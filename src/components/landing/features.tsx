import {
  FilterIcon,
  LightningIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  PlusIcon,
} from "@/components/icons";

const tileBase =
  "relative flex flex-col rounded-2xl p-6 md:p-7 overflow-hidden";
const tileStyle = {
  background: "var(--ld-surface)",
  border: "1px solid var(--ld-border)",
} as const;

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="flex items-center justify-center w-10 h-10 rounded-xl mb-4"
      style={{
        background: "color-mix(in oklch, var(--ld-green) 14%, transparent)",
        color: "var(--ld-green-bright)",
      }}
    >
      {children}
    </span>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="ld-display text-xl font-semibold" style={{ color: "var(--ld-text)" }}>
      {children}
    </h3>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 text-[15px] leading-relaxed" style={{ color: "var(--ld-text-muted)" }}>
      {children}
    </p>
  );
}

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--ld-green-bright)" }}>
          Built for range confidence
        </p>
        <h2 className="ld-display mt-3 text-[clamp(2rem,4.5vw,3rem)] font-bold" style={{ color: "var(--ld-text)" }}>
          Everything you need to find the right charger
        </h2>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {/* Large feature: map + filters */}
        <div className={`${tileBase} md:col-span-2 md:row-span-2`} style={tileStyle}>
          <div
            className="ld-grid pointer-events-none absolute inset-0 opacity-60"
            aria-hidden
          />
          <div className="relative">
            <Icon><FilterIcon className="w-5 h-5" /></Icon>
            <Title>One map, every filter that matters</Title>
            <Body>
              Narrow thousands of stations by province, city, connector (AC or DC),
              minimum power, price range, location type, and 24-hour availability.
              Tap any pin for full details and turn-by-turn directions.
            </Body>
          </div>
          <div className="relative mt-auto pt-8 flex flex-wrap gap-2">
            {["AC / DC", "kW power", "Price/kWh", "Open now", "24/7", "Motorway"].map((chip) => (
              <span
                key={chip}
                className="rounded-full px-3 py-1.5 text-[13px] font-medium"
                style={{
                  background: "var(--ld-surface-2)",
                  border: "1px solid var(--ld-border)",
                  color: "var(--ld-text-muted)",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Real-time status */}
        <div className={tileBase} style={tileStyle}>
          <Icon><ClockIcon className="w-5 h-5" /></Icon>
          <Title>Open right now</Title>
          <Body>
            Live open / closed status from each station&apos;s real operating hours, so you
            only drive to chargers you can actually use.
          </Body>
        </div>

        {/* Pricing transparency */}
        <div className={tileBase} style={tileStyle}>
          <Icon><LightningIcon className="w-5 h-5" fill="currentColor" /></Icon>
          <Title>Power &amp; price upfront</Title>
          <Body>
            See output in kW and tentative cost per kWh, including peak pricing, before
            you go. Call the listed number to confirm the exact rate.
          </Body>
        </div>

        {/* Community + transparency */}
        <div className={`${tileBase} md:col-span-2`} style={tileStyle}>
          <Icon><UserIcon className="w-5 h-5" /></Icon>
          <Title>Community-built, fully transparent</Title>
          <Body>
            Every station is contributed and maintained by Pakistan&apos;s EV community.
            Each listing shows who added or last updated it, and anyone can leave comments
            and reactions to keep the data honest.
          </Body>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]" style={{ color: "var(--ld-text-dim)" }}>
            <span className="inline-flex items-center gap-1.5"><PhoneIcon className="w-3.5 h-3.5" /> Direct station contact</span>
            <span className="inline-flex items-center gap-1.5"><PlusIcon className="w-3.5 h-3.5" /> Add &amp; edit listings</span>
          </div>
        </div>
      </div>
    </section>
  );
}
