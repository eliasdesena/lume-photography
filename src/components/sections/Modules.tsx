"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { modules } from "@/data/modules";
import { fadeUp, staggerContainer, accordionContent, viewportConfig } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function Modules() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="modules" className="py-24 sm:py-32 px-6 bg-surface">
      <motion.div
        className="max-w-content mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Section header — full width, editorial */}
        <motion.div variants={fadeUp} className="mb-16 sm:mb-20 lg:flex lg:items-end lg:justify-between lg:gap-16">
          <div className="lg:max-w-md">
            <SectionLabel>What&apos;s inside</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Five modules.{" "}
              <em className="text-gold italic">Zero filler.</em>
            </h2>
          </div>
          <p className="font-body font-light text-muted text-base leading-relaxed mt-4 lg:mt-0 lg:max-w-sm">
            From your first shot to your first paid gig. Watch at your own pace, revisit anytime.
          </p>
        </motion.div>

        {/* Module grid */}
        <motion.div variants={fadeUp}>
          {modules.map((mod, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={mod.number}
                className={cn(
                  "border-t border-hairline/60 transition-colors",
                  i === modules.length - 1 && "border-b",
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center gap-6 sm:gap-8 py-6 sm:py-7 text-left group"
                  aria-expanded={isOpen}
                  aria-controls={`module-${mod.number}`}
                >
                  <span
                    className={cn(
                      "font-display italic text-2xl sm:text-3xl shrink-0 w-12 transition-colors duration-300",
                      isOpen ? "text-gold" : "text-hairline group-hover:text-gold-dim"
                    )}
                  >
                    {mod.number}
                  </span>
                  <span
                    className={cn(
                      "font-display text-lg sm:text-xl flex-1 transition-colors duration-300",
                      isOpen ? "text-cream" : "text-cream/60 group-hover:text-cream"
                    )}
                  >
                    {mod.title}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-muted/40 shrink-0"
                  >
                    <ChevronDown size={18} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`module-${mod.number}`}
                      variants={accordionContent}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="overflow-hidden"
                    >
                      <p className="font-body font-light text-muted text-[15px] leading-relaxed pb-7 pl-[4.5rem] sm:pl-[5rem] max-w-xl">
                        {mod.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-14 sm:mt-16 text-center">
          <Button href="/checkout">Get instant access — $97</Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
