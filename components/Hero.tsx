"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden p-0 m-0 bg-[#0a0a0a]">
      <div className="w-full flex items-center justify-center p-0 m-0">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="w-full m-0 p-0 leading-none select-none">
            <span className="sr-only">YOU KNOW ME</span>
            <svg
              viewBox="0 0 1397 210"
              className="w-full h-auto block select-none overflow-visible"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <text
                x="50%"
                y="83%"
                textAnchor="middle"
                fill="#ffffff"
                style={{
                  fontFamily:
                    'var(--font-roboto-condensed), "Roboto Condensed", var(--font-bebas), sans-serif',
                  fontWeight: 700,
                  fontSize: "258px",
                  letterSpacing: "-0.045em",
                  textTransform: "uppercase",
                }}
              >
                YOU KNOW ME
              </text>
            </svg>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
