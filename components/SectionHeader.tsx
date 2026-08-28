"use client";

import { motion } from "framer-motion";

export default function SectionHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="px-6 pb-10 pt-20 text-center md:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -30px 0px" }}
        transition={{ duration: 0.7 }}
        className="mb-4 font-display text-[clamp(32px,7vw,56px)] leading-[1.1] tracking-[0.02em] text-accent"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto max-w-[420px] text-sm leading-[1.8] text-muted"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
