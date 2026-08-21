import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LaSu — Your AI Language Support",
    short_name: "LaSu",
    description:
      "Translate, understand, and actually remember every word you look up while you browse.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdfcfa",
    theme_color: "#241a63",
    orientation: "portrait",
    categories: ["education", "productivity", "utilities"],
    icons: [
      { src: "/brand/lasu-mark-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/lasu-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/brand/lasu-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
