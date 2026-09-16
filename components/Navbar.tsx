"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { NAV_EMAIL } from "@/lib/content";
import AccountButton from "@/components/auth/AccountButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { totalQty, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ${
        scrolled
          ? "border-b border-[#1e1e1e] bg-[rgba(10,10,10,0.92)] shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-2.5 sm:px-6 md:px-8 md:py-3.5">
        {/* Home */}
        <a
          href="/"
          className="rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white hover:bg-white/10 sm:px-5 sm:text-sm"
        >
          Home
        </a>

        {/* About */}
        <a
          href="#about"
          className="rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white hover:bg-white/10 sm:px-5 sm:text-sm"
        >
          About
        </a>

        {/* Shop */}
        <a
          href="#shop"
          className="rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white hover:bg-white/10 sm:px-5 sm:text-sm"
        >
          Shop
        </a>

        {/* Right side: Contact + Account + Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`mailto:${NAV_EMAIL}`}
            className="rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white hover:bg-white/10 sm:px-5 sm:text-sm"
          >
            Contact
          </a>
          <AccountButton />
          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-black shadow-[0_2px_14px_rgba(255,215,0,0.3)] transition-transform hover:-translate-y-0.5 hover:opacity-90 sm:px-4 sm:text-sm"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Cart</span>
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black text-[10px] font-bold text-accent">
              {totalQty}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
