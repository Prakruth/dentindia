"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const HIDDEN_PATHS = ['/login', '/register']

export default function Navbar() {
  const pathname = usePathname();

  if (HIDDEN_PATHS.includes(pathname)) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
            <Stethoscope size={16} className="text-white" />
          </div>
          <span className="font-display text-xl font-bold text-stone-900 italic">
            Dento<span className="text-teal-600">book</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
          <Link href="#how-it-works" className="hover:text-stone-900 transition-colors">How It Works</Link>
          <Button
            variant="outline"
            size="sm"
            render={<a href="mailto:onboard@dentobook.in" />}
          >
            List Your Clinic
          </Button>
        </div>

        {/* Mobile hamburger — Sheet trigger */}
        <Sheet>
          <SheetTrigger
            className="md:hidden p-2 rounded-md text-stone-600 hover:bg-stone-100 transition"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </SheetTrigger>

          <SheetContent side="right" className="w-72 p-0">
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
              <SheetTitle className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
                  <Stethoscope size={14} className="text-white" />
                </div>
                <span className="font-display text-lg font-bold text-stone-900 italic">
                  Dento<span className="text-teal-600">book</span>
                </span>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex flex-col gap-1 px-4 py-4 text-sm font-medium text-stone-700">
              <SheetClose
                render={
                  <Link
                    href="/"
                    className="px-3 py-2.5 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
                  />
                }
              >
                Home
              </SheetClose>
              <SheetClose
                render={
                  <Link
                    href="#how-it-works"
                    className="px-3 py-2.5 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors"
                  />
                }
              >
                How It Works
              </SheetClose>
              <div className="mt-3 pt-3 border-t border-stone-100">
                <Button
                  className="w-full"
                  render={<a href="mailto:onboard@dentobook.in" />}
                >
                  List Your Clinic
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
