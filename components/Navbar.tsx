"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { NAV_EMAIL } from "@/lib/content";
import AccountButton from "@/components/auth/AccountButton";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "#shop", label: "Shop" },
  { href: "#info", label: "Info" },
  { href: `mailto:${NAV_EMAIL}`, label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalQty, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-5 py-4 transition-[background,backdrop-filter,border-color] duration-400 md:px-7 ${
        scrolled
          ? "border-b border-[#1e1e1e] bg-[rgba(10,10,10,.94)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Link
        href="/"
        className="font-display text-[22px] tracking-[0.08em] text-white transition-colors hover:text-accent"
      >
        YKM
      </Link>

      {/* Desktop links */}
      <div className="hidden items-center gap-6 md:flex">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className="group relative text-[13px] tracking-[0.04em] text-muted transition-colors hover:text-white"
          >
            {l.label}
            <span className="absolute -bottom-[3px] left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
        <AccountButton />
        <button
          type="button"
          onClick={openCart}
          className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-black transition-transform hover:-translate-y-0.5 hover:opacity-90"
        >
          <ShoppingCart size={14} />
          Cart
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black text-[10px] font-bold text-accent">
            {totalQty}
          </span>
        </button>
      </div>

      {/* Mobile controls */}
      <div className="flex items-center gap-2.5 md:hidden">
        <AccountButton />
        <button
          type="button"
          onClick={openCart}
          aria-label="Open cart"
          className="relative flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-xs font-bold text-black"
        >
          <ShoppingCart size={14} />
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-black text-[10px] font-bold text-accent">
            {totalQty}
          </span>
        </button>
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center text-white"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-0 top-full border-b border-[#1e1e1e] bg-[rgba(10,10,10,.98)] px-6 py-6 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-5">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm tracking-[0.04em] text-muted transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
