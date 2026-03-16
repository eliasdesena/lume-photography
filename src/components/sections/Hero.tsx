"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { heroImageReveal, heroTextReveal } from "@/lib/motion";
import Button from "@/components/ui/Button";
import { course } from "@/config/course";

export default function Hero() {
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
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/35 to-transparent" />
      </motion.div>

      {/* Content — bottom-anchored, left-aligned */}
      <div className="relative z-10 w-full">
        <div className="max-w-content mx-auto px-6 pb-12 sm:pb-20 lg:pb-24">
          <motion.p
            className="text-label text-gold mb-5"
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            The iPhone Photography Course
          </motion.p>

          <motion.h1
            className="font-display text-[2.5rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] leading-[1.05] tracking-tight mb-5 max-w-2xl"
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Turn your iPhone into a camera that{" "}
            <em className="text-gold italic">pays you.</em>
          </motion.h1>

          <motion.p
            className="font-body font-light text-base sm:text-lg text-cream/60 mb-8 max-w-md leading-relaxed"
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Learn composition, lighting, and mobile editing to create professional photos — and how to sell them.
          </motion.p>

          <motion.div
            className="mb-9"
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Button href="/checkout">Get instant access — $97</Button>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-cream/30 font-body tracking-wide uppercase"
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <span>Rated {course.averageRating}/5</span>
            <span className="text-gold/25">·</span>
            <span>{course.studentCount}+ students</span>
            <span className="text-gold/25">·</span>
            <span>30-day money-back guarantee</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
