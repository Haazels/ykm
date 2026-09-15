"use client";

import ProductImage from "@/components/shop/ProductImage";
import { motion } from "framer-motion";
import YtCarousel from "@/components/YtCarousel";
import LiveStat from "@/components/LiveStat";
import CopyEmailButton from "@/components/CopyEmailButton";
import { useStats } from "@/context/StatsContext";
import { CONTACT_EMAIL } from "@/lib/content";

export default function AboutVideos() {
  const { setSubBase } = useStats();

  return (
    <section id="info" className="mx-auto max-w-[1200px] px-6 py-20 md:px-8">
      <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-[340px_1fr] md:gap-16">
        {/* Left: video carousel */}
        <div>
          <YtCarousel />
        </div>

        {/* Right: about column */}
        <div className="max-w-[600px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm tracking-[0.04em] text-muted"
          >
            ( About me )
          </motion.div>

          {[
            "I build innovative electronics, custom gadgets, and futuristic digital experiences by combining engineering, creativity, and technology. My work focuses on transforming ideas into functional creations through design, experimentation, and hands-on development.",
            "From creative tech projects to engineering-focused builds, I continuously explore new concepts, pushing beyond conventional ideas to create experiences that feel both innovative and inspiring.",
            "Through content creation, prototype development, and interactive projects, I share the journey of building, learning, and experimenting—turning imagination into real-world creations that connect with makers and technology enthusiasts worldwide.",
          ].map((paragraph, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="mb-3 text-sm leading-[1.8] text-[#ccc]"
            >
              {paragraph}
            </motion.p>
          ))}

          <div className="my-9 flex items-end gap-3.5">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.03 }}
              className="relative aspect-[4/5] w-[62%] overflow-hidden rounded-2xl"
            >
              <ProductImage
                src="https://framerusercontent.com/images/9XWpgjJf88CzI2OVdje9z6HqzoY.jpeg"
                alt="Niladri"
                fill
                sizes="(max-width: 768px) 60vw, 300px"
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              whileHover={{ scale: 1.03 }}
              className="relative aspect-square w-[28%] overflow-hidden rounded-[10px]"
            >
              <ProductImage
                src="https://framerusercontent.com/images/n2Ta9puFJY9t6ABZt8jQhhrxcM.jpeg"
                alt="YKM logo"
                fill
                sizes="(max-width: 768px) 28vw, 140px"
                className="object-cover"
              />
            </motion.div>
          </div>

          <div className="mb-10 mt-2 flex flex-col gap-6">
            <LiveStat
              base={21000}
              format={(n) => (n / 1000).toFixed(1) + "K+"}
              label="subscribed"
              onTick={setSubBase}
            />
            <LiveStat base={200000} format={(n) => (n / 1000).toFixed(0) + "K+"} label="views" />
          </div>

          <div className="border-t border-[#1e1e1e] pt-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-7 max-w-[420px] text-sm leading-[1.8] text-[#ccc]"
            >
              Ready to work together? Let&apos;s talk about freelance projects,
              collaborations, and full-time roles.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap items-center gap-3"
            >
              <div className="rounded-lg border border-[#333] bg-card px-4 py-2.5 text-[13px] text-muted">
                {CONTACT_EMAIL}
              </div>
              <CopyEmailButton />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
