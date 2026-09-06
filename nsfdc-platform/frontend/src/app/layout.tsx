import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SamriddhiSetu — Intelligent Financial Assistance for SC Beneficiaries",
  description:
    "AI-powered scheme recommender, EMI calculator, and geo-spatial partner locator for NSFDC credit schemes. Empowering Scheduled Caste communities with digital financial access.",
  keywords: [
    "NSFDC",
    "SC beneficiaries",
    "financial assistance",
    "scheme recommender",
    "EMI calculator",
    "channel partner",
    "Samriddhi Setu",
  ],
};

import SmoothScroll from "@/components/SmoothScroll";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative">
        <SmoothScroll>
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
