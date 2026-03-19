"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export default function MobileStickyFooter() {
  const [visible, setVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const heroHeight = window.innerHeight;
      const scrollingDown = current > lastScrollY.current;
      const pastHero = current > heroHeight;
      const nearBottom = current + window.innerHeight >= document.documentElement.scrollHeight - 200;

      // Show only after hero, while scrolling down, and not near bottom
      if (nearBottom || !pastHero || !scrollingDown) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      animate={{ y: visible ? 0 : 120 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40"
    >
      {/* Fade-out gradient so it doesn't hard-cut over content */}
      <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-obsidian/80 to-transparent pointer-events-none" />

      <div className="bg-obsidian/95 backdrop-blur-xl border-t border-white/[0.06] px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <a
          href="/checkout"
          className="flex items-center justify-between w-full bg-gold hover:bg-cream text-obsidian font-body font-medium text-xs uppercase tracking-[0.04em] px-5 py-3.5 transition-colors duration-200"
        >
          <span>Get instant access</span>
          <span className="font-body font-medium text-xs">$47 →</span>
        </a>
        <p className="text-center text-[10px] text-muted/40 font-body mt-2 tracking-wide">
          30-day money-back guarantee · No questions asked
        </p>
      </div>
    </motion.div>
  );
}
