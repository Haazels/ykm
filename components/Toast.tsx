"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "@/context/ToastContext";

export default function Toast() {
  const { message, visible, tone } = useToast();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 40, x: "-50%" }}
          transition={{ duration: 0.3 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-[9999] whitespace-nowrap rounded-[10px] border border-[#333] bg-[#1e1e1e] px-5 py-3 text-[13px] font-medium text-white"
        >
          {tone === "accent" ? (
            <>
              <span className="text-accent">{message.split(" added to cart")[0]}</span>
              {" added to cart"}
            </>
          ) : (
            message
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
