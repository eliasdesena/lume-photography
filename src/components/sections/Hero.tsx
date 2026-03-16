"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { heroImageReveal, heroTextReveal } from "@/lib/motion";
import Button from "@/components/ui/Button";
import { course } from "@/config/course";

export default function Hero() {
  const scrollToModules = () => {
    document.getElementById("modules")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      {/* Background — image + cinematic overlay */}
      <motion.div
        className="absolute inset-0 z-0"
        variants={heroImageReveal}
        initial="hidden"
        animate="visible"
      >
        <Image
          src="/images/after2.webp"
          alt="Striking photograph shot entirely on iPhone"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Multi-layer gradient for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/40 to-transparent" />
      </motion.div>

      {/* Content — bottom-anchored, left-aligned */}
      <div className="relative z-10 w-full">
        <div className="max-w-content mx-auto px-6 pb-14 sm:pb-20 lg:pb-24">
          <motion.p
            className="text-label text-gold mb-6"
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            The iPhone Photography Course
          </motion.p>

          <motion.h1
            className="font-display text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.05] tracking-tight mb-5 max-w-2xl"
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Your phone.{" "}
            <br className="hidden sm:block" />
            <em className="text-gold italic">Your portfolio.</em>{" "}
            <br className="hidden sm:block" />
            Your income.
          </motion.h1>

          <motion.p
            className="font-body font-light text-base sm:text-lg text-cream/70 mb-8 max-w-md leading-relaxed"
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Master the camera in your pocket — light, composition, Lightroom workflows, and the business of selling what you shoot.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-start gap-4 mb-10"
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Button href="/checkout">Start for $97</Button>
            <Button variant="ghost" onClick={scrollToModules}>
              See the curriculum ↓
            </Button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-cream/35 font-body tracking-wide uppercase"
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <span>5 modules</span>
            <span className="text-gold/30">·</span>
            <span>Lifetime access</span>
            <span className="text-gold/30">·</span>
            <span>30-day money-back</span>
            <span className="text-gold/30">·</span>
            <span>{course.studentCount}+ students</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
