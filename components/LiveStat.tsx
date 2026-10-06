"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface LiveStatProps {
  base: number;
  format: (n: number) => string;
  label: string;
  isLoading?: boolean;
  onTick?: (n: number) => void;
}

export default function LiveStat({ base, format, label, isLoading, onTick }: LiveStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "0px 0px -30px 0px" });
  const [value, setValue] = useState(base);

  // Sync value when live API data arrives (base changes from fallback → real number)
  useEffect(() => {
    setValue(base);
  }, [base]);

  // Tick counter only when in-view and not loading
  useEffect(() => {
    if (!isInView || isLoading) return;
    const interval = setInterval(() => {
      setValue((v) => {
        const next = v + Math.floor(Math.random() * 3);
        onTick?.(next);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, isLoading]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex items-baseline gap-3.5 overflow-hidden"
    >
      {isLoading ? (
        /* Skeleton shimmer while first API call is in-flight */
        <span className="skeleton-shimmer inline-block h-[1em] w-[120px] rounded-md bg-[#222] font-display text-[clamp(48px,10vw,80px)] leading-none" />
      ) : (
        <motion.span
          key={value}
          initial={{ opacity: 0.6, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="font-display text-[clamp(48px,10vw,80px)] leading-none tracking-[-0.01em] text-white"
        >
          {format(value)}
        </motion.span>
      )}
      <span className="text-xs uppercase tracking-[0.06em] text-muted">{label}</span>
    </motion.div>
  );
}
