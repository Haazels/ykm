"use client";

import { motion } from "framer-motion";

export default function Bio() {
  return (
    <section id="about" className="relative mx-auto w-full max-w-[1440px] px-6 pt-24 pb-16 md:px-8 md:pt-36 md:pb-24">
      <div className="flex w-full justify-end">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -30px 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[540px] text-left text-[15px] font-normal leading-[1.85] text-[#dcdcdc] md:text-[16px]"
        >
          &ldquo;I&apos;m Niladri Day, a passionate tech creator building
          innovative electronics, custom 3D prototypes, and futuristic
          engineering projects. I share creative ideas, experiments, and
          technology-driven solutions through thoughtful design and hands-on
          innovation.&rdquo;
        </motion.p>
      </div>

      {/* Section divider line with center accent mark exactly like the image */}
      <div className="relative mt-20 w-full border-t border-[#1e1c21] md:mt-28">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 50 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="absolute -top-[1.5px] left-1/2 h-[3px] -translate-x-1/2 rounded-full bg-accent shadow-[0_0_12px_rgba(255,215,0,0.5)]"
        />
      </div>
    </section>
  );
}
