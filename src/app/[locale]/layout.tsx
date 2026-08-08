import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/topbar/AuthProvider";
import { ThemeProvider } from "@/components/topbar/theme-provider";
import Providers from "./providers";
import ToastHub from "@/components/fixedComponents/ToastHub";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LaSu - Your AI Language Support",
    template: "%s | LaSu",
  },
  description:
    "Learn languages effortlessly with LaSu - the Chrome extension that offers AI-powered translations, real-life examples, and contextual understanding as you browse.",
  keywords: [
    "language learning",
    "AI translation",
    "chrome extension",
    "LaSu",
    "multilingual",
    "context-aware translation",
    "AI Language Support",
    "learn languages while browsing",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  authors: [{ name: "Motasem Abubaraka", url: "https://lasu.online" }],
  creator: "Motasem Abubaraka",
  metadataBase: new URL("https://lasu.online"),
  openGraph: {
    title: "LaSu - Your AI Language Support",
    description:
      "Translate, understand, and learn languages as you browse. The ultimate tool for polyglots and learners.",
    url: "https://lasu.online",
    siteName: "LaSu - Your AI Language Support",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://lasu.online/meta-img.png",
        width: 1200,
        height: 630,
        alt: "LaSu AI Language Support Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LaSu - Your AI Language Support",
    description:
      "AI-powered Chrome extension for smarter language learning and browsing.",
    images: ["https://lasu.online/meta-img.png"],
    creator: "@mota6em",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfcfa" },
    { media: "(prefers-color-scheme: dark)", color: "#111114" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "LaSu - Your AI Language Support",
          url: "https://lasu.online",
          description:
            "Learn languages effortlessly with LaSu - the Chrome extension that offers AI-powered translations, real-life examples, and contextual understanding as you browse.",
        })}
      </script>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AuthProvider>{children}</AuthProvider>
            <ToastHub />
            <Analytics />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
