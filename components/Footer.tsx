"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/lib/content";
import { useStats } from "@/context/StatsContext";

export default function Footer() {
  const { subBase } = useStats();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.7 }}
      className="relative isolate overflow-hidden px-6 pb-10 pt-28 md:px-8"
    >
      <motion.div
        initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.08 }}
        whileInView={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="/images/footer-bg.avif"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-black/40" />

      <div className="relative z-[2] mb-14 grid grid-cols-1 gap-7 sm:grid-cols-2 md:grid-cols-3">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.platform}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group flex flex-col gap-1.5 pb-4 transition-transform hover:translate-x-1"
          >
            <span className="text-[11px] uppercase tracking-[0.1em] text-white/0 transition-colors group-hover:text-accent">
              {link.platform}
            </span>
            <span className="text-[15px] font-semibold text-white">{link.handle}</span>
            <span className="text-xs font-bold text-accent">
              {link.statId === "yt" ? `${(subBase / 1000).toFixed(1)}K Subscribers` : link.stat}
            </span>
          </a>
        ))}
      </div>

      <div className="relative z-[2] flex flex-col items-center gap-3 border-t border-white/10 pt-8">
        <div className="font-display text-[28px] tracking-[0.08em] text-white/85">YOU KNOW ME</div>
        <div className="flex gap-4">
          <a href="#" className="text-[11px] text-white/55 transition-colors hover:text-accent">
            Privacy
          </a>
          <a href="#" className="text-[11px] text-white/55 transition-colors hover:text-accent">
            Terms
          </a>
        </div>
        <div className="text-[11px] text-white/45">&copy; 2026 Niladri Day. All rights reserved.</div>
      </div>
    </motion.footer>
  );
}
