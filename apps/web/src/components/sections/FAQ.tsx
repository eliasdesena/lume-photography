"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/faqs";
import { fadeUp, staggerContainer, accordionContent, viewportConfig } from "@/lib/motion";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(-1);

  return (
    <section className="pt-28 sm:pt-36 pb-20 sm:pb-28 px-6">
      <motion.div
        className="max-w-narrow mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <motion.div variants={fadeUp} className="mb-14 sm:mb-16">
          <p className="text-label text-gold mb-5">FAQ</p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight">
            Questions? <em className="italic bg-gradient-to-r from-gold to-[#E8D5A3] bg-clip-text text-transparent">Answered.</em>
          </h2>
        </motion.div>

        <motion.div variants={fadeUp}>
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={cn(
                  "border-t border-hairline/60",
                  i === faqs.length - 1 && "border-b"
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 sm:py-6 text-left group"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${i}`}
                >
                  <span
                    className={cn(
                      "font-display text-base sm:text-lg transition-colors duration-300",
                      isOpen ? "text-cream" : "text-cream/60 group-hover:text-cream"
                    )}
                  >
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-muted/40 shrink-0"
                  >
                    <ChevronDown size={16} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      variants={accordionContent}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="overflow-hidden"
                    >
                      <p className="font-body font-light text-muted text-sm leading-relaxed pb-6 pr-8">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* Final CTA */}
        <motion.div variants={fadeUp} className="mt-16 sm:mt-20">
          <div className="section-rule mb-16" />
          <div className="text-center">
            <p className="font-display text-xl sm:text-2xl text-cream/80 mb-6">
              Still deciding? Enroll risk-free.
            </p>
            <p className="font-body font-light text-muted text-sm mb-8 max-w-sm mx-auto">
              You have 30 days to explore everything. If it&apos;s not for you, get a full refund — no questions.
            </p>
            <Button href="/checkout">Try it risk-free — $47</Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
