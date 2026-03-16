"use client";

import { motion } from "framer-motion";
import { checkmarkDraw } from "@/lib/motion";
import Button from "@/components/ui/Button";
import { course } from "@/config/course";

export default function SuccessContent() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-card mx-auto text-center">
        {/* Animated checkmark */}
        <div className="w-24 h-24 mx-auto mb-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#C8A45A"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.path
              d="M30 52 L44 66 L70 38"
              fill="none"
              stroke="#C8A45A"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={checkmarkDraw}
              initial="hidden"
              animate="visible"
            />
          </svg>
        </div>

        <motion.h1
          className="font-display text-5xl sm:text-6xl text-cream mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          You&apos;re in.
        </motion.h1>

        <motion.p
          className="font-body font-light text-lg text-muted mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          Your access link is on its way to your inbox.
        </motion.p>

        <motion.div
          className="font-body font-light text-muted text-sm leading-relaxed mb-10 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p>
            Welcome to LUMÉ. You now have lifetime access to all five modules,
            the Lightroom preset pack, the monetization workbook, and the
            private student community. Check your email for your personal
            access link.
          </p>
          <p className="mt-4 text-gold-dim">— {course.instructorName}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6 }}
        >
          <Button
            href={`https://instagram.com/${course.instagramHandle}`}
            className="mb-8"
          >
            Follow LUMÉ on Instagram →
          </Button>
        </motion.div>

        {/* Upsell card */}
        <motion.div
          className="bg-surface border border-hairline rounded p-8 text-left mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <p className="text-label text-gold-dim mb-3">Accelerate your results</p>
          <h3 className="font-display text-xl text-cream mb-2">
            1:1 Coaching Call with {course.instructorName}
          </h3>
          <p className="font-body font-light text-muted text-sm mb-6">
            A 45-minute private session to review your portfolio, refine your
            editing style, and build a personalized action plan. One-time —
            $47.
          </p>
          {/* TODO: Integrate a proper one-click upsell flow. For now, link to a separate Stripe Payment Link. */}
          <Button
            variant="ghost"
            href={`https://buy.stripe.com/${course.upsellPaymentLink}`}
          >
            Add to your order
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
