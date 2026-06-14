"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const HIDDEN_PATHS = ['/login', '/register']

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)}>
          <Image
            src="/logo.jpeg"
            alt="Dentobook"
            width={200}
            height={200}
            className="h-20 w-20 object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link href="#how-it-works" className="hover:text-stone-900 transition-colors">How It Works</Link>
          <a
            href="mailto:onboard@dentobook.in"
            className="px-4 py-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors text-sm"
          >
            List Your Clinic
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-stone-600 hover:bg-stone-100 transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-4 flex flex-col gap-4 text-sm font-medium text-stone-700">
          <Link href="/" onClick={() => setOpen(false)} className="hover:text-blue-600">Home</Link>
          <Link href="#how-it-works" onClick={() => setOpen(false)} className="hover:text-stone-900">How It Works</Link>
          <a
            href="mailto:onboard@dentobook.in"
            className="inline-block px-4 py-2 rounded-full bg-teal-600 text-white text-center hover:bg-teal-700 transition"
            onClick={() => setOpen(false)}
          >
            List Your Clinic
          </a>
        </div>
      )}
    </header>
  );
}
