import { ImageResponse } from "next/og";
import { fetchChargers, findChargerByIdSuffix } from "@/lib/charger-fetch";
import { formatPower, formatCost } from "@/lib/format";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function idSuffixFromSlug(slug: string): string {
  return slug.slice(-5);
}

export default async function ChargerOgImage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city, slug } = await params;
  const chargers = await fetchChargers();
  const charger = findChargerByIdSuffix(chargers, idSuffixFromSlug(slug));

  const cityName = city
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const title = charger
    ? `${formatPower(charger.power_kw)} kW ${charger.charger_type} Charger`
    : "EV Charger";
  const subtitle = charger ? charger.address : cityName;
  const cost = charger ? `${formatCost(charger.cost_per_kwh)}/kWh` : "";
  const type = charger?.charger_type ?? "";
  const typeColor = type === "DC" ? "#f59e0b" : "#3b82f6";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #003820 0%, #005c30 60%, #00C853 100%)",
          fontFamily: "sans-serif",
          padding: 60,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#00C853",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" />
            </svg>
          </div>
          <span style={{ fontSize: 28, fontWeight: 700, color: "white" }}>
            ChargeMap<span style={{ color: "#00C853" }}>PK</span>
          </span>
          {type && (
            <div
              style={{
                marginLeft: "auto",
                background: typeColor,
                color: "white",
                borderRadius: 8,
                padding: "6px 16px",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {type}
            </div>
          )}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: "white", lineHeight: 1.1, marginBottom: 20 }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.75)", marginBottom: 16 }}>
            {subtitle}
          </div>
          {cityName && (
            <div style={{ fontSize: 22, color: "rgba(255,255,255,0.55)" }}>
              {cityName}, Pakistan
            </div>
          )}
        </div>

        {/* Footer */}
        {cost && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              paddingTop: 24,
              marginTop: 24,
            }}
          >
            <span style={{ fontSize: 24, color: "#00C853", fontWeight: 700 }}>{cost}</span>
            <span style={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }}>chargemap-pk.zeeshanai.cloud</span>
          </div>
        )}
      </div>
    ),
    size
  );
}
