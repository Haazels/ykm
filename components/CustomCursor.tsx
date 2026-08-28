"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let cx = 0,
      cy = 0,
      rx = 0,
      ry = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
    };
    document.addEventListener("mousemove", onMove);

    function loop() {
      cursor!.style.left = cx + "px";
      cursor!.style.top = cy + "px";
      rx += (cx - rx) * 0.13;
      ry += (cy - ry) * 0.13;
      ring!.style.left = rx + "px";
      ring!.style.top = ry + "px";
      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    const grow = () => {
      cursor!.style.width = "20px";
      cursor!.style.height = "20px";
      ring!.style.width = "54px";
      ring!.style.height = "54px";
      ring!.style.borderColor = "var(--accent)";
    };
    const shrink = () => {
      cursor!.style.width = "12px";
      cursor!.style.height = "12px";
      ring!.style.width = "36px";
      ring!.style.height = "36px";
      ring!.style.borderColor = "rgba(255,61,0,.45)";
    };

    const attachHoverListeners = () => {
      const targets = document.querySelectorAll(
        "a, button, .shop-card, .review-card, [data-cursor-grow]"
      );
      targets.forEach((el) => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
      return targets;
    };

    let targets = attachHoverListeners();
    // Re-attach when DOM changes (shop grid re-renders on tab switch, modal opens, etc.)
    const mo = new MutationObserver(() => {
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
      targets = attachHoverListeners();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      mo.disconnect();
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-[9999] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent [mix-blend-mode:difference] hidden md:block"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[rgba(255,61,0,.45)] transition-[width,height,border-color] duration-300 hidden md:block"
        aria-hidden="true"
      />
    </>
  );
}
