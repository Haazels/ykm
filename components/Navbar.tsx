"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Menu, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { NAV_EMAIL } from "@/lib/content";
import AccountButton from "@/components/auth/AccountButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalQty, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on desktop resize or Escape key
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <nav
      className={`sticky top-0 z-[100] w-full transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ${
        scrolled || mobileMenuOpen
          ? "border-b border-[#1e1e1e] bg-[rgba(10,10,10,0.92)] shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-3.5 py-2.5 sm:px-6 md:px-8 md:py-3.5">
        {/* Mobile Logo (< 768px) */}
        <div className="flex items-center md:hidden">
          <a
            href="/"
            className="select-none font-display text-xl font-bold tracking-[0.08em] text-white transition-colors hover:text-accent"
          >
            <span className="sm:hidden">YKM</span>
            <span className="hidden sm:inline">YOU KNOW ME</span>
          </a>
        </div>

        {/* Desktop Links (>= 768px): Home, About, Shop */}
        <a
          href="/"
          className="hidden rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white hover:bg-white/10 md:inline-flex sm:px-5 sm:text-sm"
        >
          Home
        </a>

        <a
          href="#about"
          className="hidden rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white hover:bg-white/10 md:inline-flex sm:px-5 sm:text-sm"
        >
          About
        </a>

        <a
          href="#shop"
          className="hidden rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white hover:bg-white/10 md:inline-flex sm:px-5 sm:text-sm"
        >
          Shop
        </a>

        {/* Controls row: Contact (desktop) + Account + Cart + Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3">
          <a
            href={`mailto:${NAV_EMAIL}`}
            className="hidden rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-200 hover:border-white hover:bg-white/10 md:inline-flex sm:px-5 sm:text-sm"
          >
            Contact
          </a>

          <AccountButton />

          <button
            type="button"
            onClick={openCart}
            aria-label="Open cart"
            className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-black shadow-[0_2px_14px_rgba(255,215,0,0.3)] transition-transform hover:-translate-y-0.5 hover:opacity-90 sm:px-4 sm:text-sm"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Cart</span>
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black text-[10px] font-bold text-accent">
              {totalQty}
            </span>
          </button>

          {/* Mobile Hamburger toggle button (< 768px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-colors hover:border-accent hover:text-accent md:hidden"
          >
            {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-[#1e1e1e] bg-[rgba(10,10,10,0.96)] px-4 py-3 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1.5">
              <a
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white transition-all hover:border-accent hover:bg-accent/10 hover:text-accent sm:text-sm"
              >
                <span>Home</span>
                <ArrowRight size={13} className="text-muted" />
              </a>

              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white transition-all hover:border-accent hover:bg-accent/10 hover:text-accent sm:text-sm"
              >
                <span>About</span>
                <ArrowRight size={13} className="text-muted" />
              </a>

              <a
                href="#shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white transition-all hover:border-accent hover:bg-accent/10 hover:text-accent sm:text-sm"
              >
                <span>Shop</span>
                <ArrowRight size={13} className="text-muted" />
              </a>

              <a
                href={`mailto:${NAV_EMAIL}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white transition-all hover:border-accent hover:bg-accent/10 hover:text-accent sm:text-sm"
              >
                <span>Contact</span>
                <ArrowRight size={13} className="text-muted" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
