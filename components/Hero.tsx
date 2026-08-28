"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-40 md:px-8 md:pt-48">
      <div
        className="pointer-events-none absolute -bottom-20 -right-20 h-[380px] w-[380px] animate-orbFloat rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,61,0,.16) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <h1 className="relative z-[1] font-display text-[clamp(72px,18vw,200px)] leading-[0.9] tracking-[-0.01em]">
        <span className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          >
            YOU KNOW ME
          </motion.span>
        </span>
      </h1>
    </section>
  );
}
