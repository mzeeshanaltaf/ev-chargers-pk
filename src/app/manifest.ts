import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ChargeMap PK",
    short_name: "ChargeMap PK",
    description:
      "Pakistan's community-driven EV charging station directory — find, add, and share charging stations nationwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#00C853",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
