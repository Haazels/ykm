"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Play } from "lucide-react";
import { SHORTS } from "@/lib/content";

export default function YtCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const updateIndexFromScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    setIndex(idx);
  };

  const goNext = () => {
    const track = trackRef.current;
    if (!track) return;
    const next = (index + 1) % SHORTS.length;
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
    setIndex(next);
  };

  return (
    <div className="mx-auto flex max-w-[320px] flex-col gap-3 md:mx-0">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div
          ref={trackRef}
          onScroll={() => requestAnimationFrame(updateIndexFromScroll)}
          className="flex overflow-x-auto rounded-2xl [-webkit-overflow-scrolling:touch] [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SHORTS.map((video) => (
            <a
              key={video.href}
              href={video.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-[9/16] w-full flex-shrink-0 basis-full scroll-snap-start overflow-hidden bg-[#111]"
              style={{ scrollSnapAlign: "start" }}
            >
              <Image
                src={video.thumbnail}
                alt="YKM video"
                fill
                sizes="320px"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg,rgba(0,0,0,.75) 0%,rgba(0,0,0,.05) 30%,rgba(0,0,0,.1) 60%,rgba(0,0,0,.85) 100%)",
                }}
              />
              <div className="absolute left-3.5 right-3.5 top-3.5 flex items-start gap-2.5">
                <div className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-yellow font-display text-[11px] font-bold tracking-[0.02em] text-black">
                  YKM
                </div>
                <div className="min-w-0">
                  <div className="line-clamp-2 text-[13px] font-bold leading-[1.3] text-white">
                    {video.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-white/65">{video.channel}</div>
                </div>
              </div>
              <div className="absolute left-1/2 top-1/2 flex h-[52px] w-[52px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600/90 shadow-[0_6px_20px_rgba(0,0,0,.4)] transition-transform hover:scale-[1.08]">
                <Play size={20} className="ml-0.5 fill-white text-white" />
              </div>
            </a>
          ))}
        </div>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next video"
          className="absolute right-2.5 top-1/2 z-[2] flex h-[34px] w-[34px] -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur transition-[background,transform] hover:scale-[1.08] hover:bg-accent"
        >
          <ChevronRight size={16} />
        </button>
      </motion.div>
      <div className="mx-auto h-[3px] w-[70%] overflow-hidden rounded-[3px] bg-[#222]">
        <motion.div
          className="h-full rounded-[3px] bg-accent"
          animate={{ x: `${index * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ width: `${100 / SHORTS.length}%` }}
        />
      </div>
    </div>
  );
}
