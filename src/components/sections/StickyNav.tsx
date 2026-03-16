"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

export default function StickyNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="fixed top-0 left-0 right-0 z-50 bg-obsidian/90 backdrop-blur-xl border-b border-hairline/30"
        >
          <div className="max-w-content mx-auto px-6 flex items-center justify-between h-12">
            <a
              href="/"
              className="hidden sm:block hover:opacity-80 transition-opacity"
              aria-label="LUMÉ home"
            >
              <Image
                src="/images/wordmark-gradient.svg"
                alt="LUMÉ"
                width={140}
                height={36}
                className="h-8 w-auto"
              />
            </a>
            <Button
              href="/checkout"
              className="text-[10px] px-5 py-2 ml-auto tracking-[0.15em]"
            >
              Enroll — $97
            </Button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
