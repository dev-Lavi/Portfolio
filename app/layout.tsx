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

export const metadata: Metadata = {
  title: "Lavi Sharma – Portfolio",
  description:
    "Designer, full stack developer and blockchain developer – portfolio and selected work.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@800&family=Noto+Serif+JP:wght@900&display=swap"
          rel="stylesheet"
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