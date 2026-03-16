"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function StickyNav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed top-5 left-4 right-4 z-50 pointer-events-none"
    >
      <div className="max-w-content mx-auto">
        <div className="pointer-events-auto flex items-center justify-between px-4 py-2.5 rounded-2xl bg-obsidian/75 backdrop-blur-xl border border-white/[0.07] shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
          <a
            href="/"
            className="hidden sm:block hover:opacity-80 transition-opacity"
            aria-label="LUMÉ home"
          >
            <Image
              src="/images/wordmark-gradient.svg"
              alt="LUMÉ"
              width={120}
              height={32}
              className="h-7 w-auto"
            />
          </a>
          <Button
            href="/checkout"
            className="text-[10px] px-5 py-2 ml-auto tracking-[0.15em]"
          >
            Enroll — $97
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
