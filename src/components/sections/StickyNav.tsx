"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function StickyNav() {
  const [entered, setEntered] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      // Only hide/show on mobile
      if (window.innerWidth >= 640) {
        setNavVisible(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      const current = window.scrollY;
      if (current > lastScrollY.current && current > 80) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: entered && !navVisible ? -110 : 0 }}
      transition={{
        duration: entered ? 0.3 : 0.6,
        ease: entered ? [0.4, 0, 0.2, 1] : [0.25, 0.1, 0.25, 1],
      }}
      onAnimationComplete={() => setEntered(true)}
      className="fixed top-6 left-4 right-4 z-50 pointer-events-none"
    >
      <div className="max-w-content mx-auto">
        <div className="pointer-events-auto flex items-center justify-between pl-5 pr-2.5 py-2.5 rounded-full bg-obsidian/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

          {/* Logo — always visible */}
          <a href="/" aria-label="LUMÉ home" className="hover:opacity-75 transition-opacity duration-200 flex items-center">
            <Image
              src="/images/wordmark-gradient.svg"
              alt="LUMÉ"
              width={120}
              height={30}
              className="h-6 sm:h-7 w-auto"
            />
          </a>

          {/* CTA — pill button */}
          <a
            href="/checkout"
            className="inline-flex items-center gap-1.5 bg-gold hover:bg-gold/90 active:scale-95 text-obsidian font-body font-semibold text-[11px] uppercase tracking-[0.06em] px-4 py-2 rounded-full transition-all duration-200"
          >
            Enroll
            <span className="hidden sm:inline">— $97</span>
          </a>

        </div>
      </div>
    </motion.nav>
  );
}
