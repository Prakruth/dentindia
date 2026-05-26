import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GoogleAnalytics from "@/components/GoogleAnalytics";

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
  metadataBase: new URL("https://dentobook.in"),
  title: {
    default: "Dentobook — Find Trusted Dental Clinics in India",
    template: "%s | Dentobook",
  },
  description:
    "Book appointments with top-rated dental clinics across India. Find dentists for teeth cleaning, braces, root canal, implants, whitening & more in Mumbai, Delhi, Bengaluru, Chennai.",
  keywords: [
    "dental clinics India",
    "dentist near me India",
    "dental appointment booking India",
    "teeth cleaning India",
    "dental implants India",
    "orthodontist India",
    "root canal treatment India",
    "teeth whitening India",
    "best dentist Mumbai",
    "best dentist Delhi",
    "best dentist Bengaluru",
    "best dentist Chennai",
    "dental care India",
    "affordable dentist India",
    "dentobook",
    "Dentobook",
  ],
  authors: [{ name: "Dentobook", url: "https://dentobook.in" }],
  creator: "Dentobook",
  publisher: "Dentobook",
  category: "health",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dentobook.in",
    siteName: "Dentobook",
    title: "Dentobook — Find Trusted Dental Clinics in India",
    description:
      "Book appointments with top-rated dental clinics across India. Compare dentists by price, rating & location.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Dentobook — Find Trusted Dental Clinics in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dentobook — Find Trusted Dental Clinics in India",
    description:
      "Book appointments with top-rated dental clinics across India. Compare dentists by price, rating & location.",
    images: ["/opengraph-image"],
    creator: "@Dentobook",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://dentobook.in",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en-IN">
      <body className={`${playfair.variable} ${dmSans.variable} font-sans antialiased bg-stone-50 text-stone-900`}>
        {gaId && <GoogleAnalytics measurementId={gaId} />}
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-stone-200 mt-20 py-10 text-center text-sm text-stone-400">
          <p className="font-display italic text-stone-500 text-base mb-1">Dentobook</p>
          <p>© {new Date().getFullYear()} · Connecting patients with trusted dental care across India</p>
        </footer>
      </body>
    </html>
  );
}
