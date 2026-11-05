import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import LoadingScreen from "./components/LoadingScreen";
import SmoothScroll from "./components/SmoothScroll";
import CursorTrail from "./components/ui/CursorTrail";

const bankGothic = localFont({
  src: "../fonts/BankGothic/bank-gothic-medium-bt.ttf",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_URL
  ? new URL(`https://${process.env.VERCEL_URL}`)
  : new URL("https://who-is-lavi-sharma.vercel.app");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Lavi Sharma – Portfolio",
    template: "%s | Lavi Sharma",
  },
  description:
    "Designer, full stack developer and blockchain developer – portfolio and selected work.",
  keywords: [
    "Lavi Sharma",
    "Portfolio",
    "Full Stack Developer",
    "Blockchain Developer",
    "Software Engineer",
    "Web3",
    "Next.js",
    "React",
  ],
  authors: [{ name: "Lavi Sharma" }],
  creator: "Lavi Sharma",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl.toString(),
    title: "Lavi Sharma – Portfolio",
    description:
      "Designer, full stack developer and blockchain developer – portfolio and selected work.",
    siteName: "Lavi Sharma Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1917,
        height: 867,
        alt: "Lavi Sharma – Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lavi Sharma – Portfolio",
    description:
      "Designer, full stack developer and blockchain developer – portfolio and selected work.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="/images/avatar.webp"
          type="image/webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@800&family=Noto+Serif+JP:wght@900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@800&family=Noto+Serif+JP:wght@900&display=swap"
        />
      </head>
      <body className={`${bankGothic.className} antialiased`}>
        <LoadingScreen />
        <CursorTrail />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
