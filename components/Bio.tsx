"use client";

import { motion } from "framer-motion";

export default function Bio() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-20 md:px-8">
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -30px 0px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="ml-auto max-w-[520px] text-left text-[15px] italic leading-[1.9] text-[#ccc] md:w-[520px]"
      >
        &ldquo;I&apos;m Niladri Day, a passionate tech creator building
        innovative electronics, custom gadgets, and futuristic engineering
        projects. I share creative ideas, experiments, and technology-driven
        solutions through thoughtful design and hands-on innovation.&rdquo;
      </motion.p>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: 36 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        className="mx-auto mt-10 h-[3px] bg-accent"
      />
    </section>
  );
}
