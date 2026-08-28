"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORDS = ["YOU", "KNOW", "ME"];

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-6 bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          aria-hidden={hidden}
          role="status"
          aria-label="Loading YOU KNOW ME"
        >
          <div className="flex font-display text-[clamp(48px,14vw,120px)] tracking-[0.06em]">
            {WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1 + i * 0.12,
                }}
                className="inline-block"
              >
                {word}
                {i < WORDS.length - 1 && "\u00a0"}
              </motion.span>
            ))}
          </div>
          <div className="h-[2px] w-[200px] overflow-hidden rounded-full bg-[#222]">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
