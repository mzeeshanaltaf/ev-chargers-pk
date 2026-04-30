import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ChargeMap PK — EV Chargers in Pakistan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #003820 0%, #005c30 50%, #00C853 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "#00C853",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
            boxShadow: "0 0 40px rgba(0,200,83,0.5)",
          }}
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="white">
            <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" />
          </svg>
        </div>

        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 64, fontWeight: 800, color: "white", letterSpacing: -2 }}>
            ChargeMap
          </span>
          <span style={{ fontSize: 64, fontWeight: 800, color: "#00C853", letterSpacing: -2 }}>
            PK
          </span>
        </div>

        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.75)",
            marginTop: 16,
            letterSpacing: 0.5,
          }}
        >
          EV Charging Stations in Pakistan
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 40,
          }}
        >
          {["Interactive Map", "AC & DC Chargers", "Community Driven"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(255,255,255,0.12)",
                borderRadius: 100,
                padding: "8px 20px",
                fontSize: 18,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
