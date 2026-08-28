"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";

export default function Reviews() {
  return (
    <section className="bg-[#0d0d0d] px-4 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center font-display text-[clamp(28px,6vw,48px)] leading-[1.1] tracking-[0.02em] text-accent"
      >
        User Stories &amp; Reviews
      </motion.h2>

      <div
        className="flex gap-4 overflow-x-auto pb-4 [-webkit-overflow-scrolling:touch] [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {TESTIMONIALS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="review-card flex-shrink-0 basis-[280px] scroll-snap-start rounded-2xl border border-[#222] bg-card p-5 transition-[border-color,box-shadow] duration-300 hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(255,61,0,0.08)]"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="mb-3 flex items-center gap-3">
              {r.avatar ? (
                <div className="relative h-11 w-11 overflow-hidden rounded-full bg-[#333]">
                  <Image src={r.avatar} alt={r.name} fill sizes="44px" className="object-cover" />
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2a2a2a] text-xl">
                  &#128100;
                </div>
              )}
              <div>
                <div className="text-[13px] font-semibold">{r.name}</div>
                <div className="text-[11px] text-muted">{r.role}</div>
              </div>
            </div>
            <div className="mb-2 flex items-center gap-0.5">
              {Array.from({ length: r.rating }).map((_, idx) => (
                <Star key={idx} size={14} className="fill-[#ff7a00] text-[#ff7a00]" />
              ))}
              {r.hasHalf && <Star size={14} className="text-[#555]" />}
              <span className="ml-1.5 text-[11px] text-muted">{r.ratingLabel}</span>
            </div>
            <div className="mt-2.5 font-serif text-[32px] leading-none text-accent">&ldquo;</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
