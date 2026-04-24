import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DentIndia — Find Trusted Dental Clinics",
  description: "Book appointments with top-rated dental clinics across India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans antialiased bg-stone-50 text-stone-900`}>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-stone-200 mt-20 py-10 text-center text-sm text-stone-400">
          <p className="font-display italic text-stone-500 text-base mb-1">DentIndia</p>
          <p>© {new Date().getFullYear()} · Connecting patients with trusted dental care across India</p>
        </footer>
      </body>
    </html>
  );
}
