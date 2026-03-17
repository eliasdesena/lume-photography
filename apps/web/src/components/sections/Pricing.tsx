"use client";

import { motion } from "motion/react";
import { CheckCircle, Lock } from "lucide-react";
import { fadeUp, scaleIn, staggerContainer, viewportConfig } from "@/lib/motion";
import { includes } from "@/data/includes";
import Button from "@/components/ui/Button";

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28 sm:py-36 px-6 bg-surface overflow-hidden">
      {/* Subtle gold glow for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <motion.div
        className="max-w-content mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        {/* Two-column: copy left, card right */}
        <div className="lg:flex lg:items-center lg:gap-20">
          {/* Left — the pitch */}
          <motion.div variants={fadeUp} className="lg:w-[45%] mb-16 lg:mb-0">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
              Everything you need.{" "}
              <em className="italic bg-gradient-to-r from-gold to-[#E8D5A3] bg-clip-text text-transparent">Nothing you don&apos;t.</em>
            </h2>
            <p className="font-body font-light text-muted text-base leading-relaxed mb-6 max-w-sm">
              Most photography courses cost $300–$500. A DSLR starts at $1,200.
              LUMÉ gives you professional results from your iPhone — for a fraction of the price.
            </p>
            <ul className="space-y-3">
              {includes.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <CheckCircle
                    size={16}
                    className="text-gold/70 shrink-0 mt-0.5"
                  />
                  <span className="font-body text-cream/70 text-sm">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — the price card */}
          <motion.div
            variants={scaleIn}
            className="lg:w-[55%] lg:max-w-lg lg:ml-auto"
          >
            <div className="relative bg-obsidian rounded-sm p-8 sm:p-10 text-center ring-1 ring-gold/10 shadow-[0_0_80px_-20px_rgba(200,164,90,0.08)]">
              <p className="font-display text-[80px] sm:text-[96px] leading-none text-cream mb-6">
                $97
              </p>
              <p className="text-[11px] text-muted/50 font-body uppercase tracking-[0.08em] mb-10">
                One-time payment · Lifetime access · Instant delivery
              </p>

              <Button href="/checkout" fullWidth className="mb-5">
                Get instant access →
              </Button>

              <p className="text-xs text-muted/50 mb-8">
                30-day money-back guarantee · No questions asked
              </p>

              <div className="flex items-center justify-center gap-2 text-muted/30">
                <Lock size={12} />
                <span className="text-[10px] font-body uppercase tracking-wider">Secured by Stripe</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
