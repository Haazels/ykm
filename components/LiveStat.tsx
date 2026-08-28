"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface LiveStatProps {
  base: number;
  format: (n: number) => string;
  label: string;
  onTick?: (n: number) => void;
}

export default function LiveStat({ base, format, label, onTick }: LiveStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "0px 0px -30px 0px" });
  const [value, setValue] = useState(base);

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setValue((v) => {
        const next = v + Math.floor(Math.random() * 3);
        onTick?.(next);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex items-baseline gap-3.5 overflow-hidden"
    >
      <span className="font-display text-[clamp(48px,10vw,80px)] leading-none tracking-[-0.01em] text-white">
        {format(value)}
      </span>
      <span className="text-xs uppercase tracking-[0.06em] text-muted">{label}</span>
    </motion.div>
  );
}
