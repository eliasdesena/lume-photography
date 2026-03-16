"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";

interface FormData {
  email: string;
}

export default function EmailCapture() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (dismissed) return;
    if (sessionStorage.getItem("lume-email-dismissed")) {
      setDismissed(true);
      return;
    }

    const mobile = window.innerWidth < 640;
    setIsMobile(mobile);

    if (mobile) {
      // Fullscreen popup after 3 minutes
      const timer = setTimeout(() => setShow(true), 3 * 60 * 1000);
      return () => clearTimeout(timer);
    } else {
      // Desktop: bottom-right card at 55% scroll depth
      const handleScroll = () => {
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        if (pct > 0.55) {
          setShow(true);
          window.removeEventListener("scroll", handleScroll);
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [dismissed]);

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem("lume-email-dismissed", "1");
  };

  const onSubmit = (data: FormData) => {
    // TODO: Connect to email provider (ConvertKit, Mailchimp, etc.)
    console.log("Email captured:", data.email);
    setSubmitted(true);
    setTimeout(dismiss, 2000);
  };

  const content = submitted ? (
    <div className="text-center py-4">
      <p className="font-display text-2xl text-gold mb-2">Check your inbox.</p>
      <p className="text-sm text-muted font-body">Your tips are on the way.</p>
    </div>
  ) : (
    <>
      <p className="font-display text-2xl sm:text-base text-cream mb-1">
        Not ready yet?
      </p>
      <p className="text-sm sm:text-xs text-muted/70 font-body mb-5 sm:mb-4 leading-relaxed">
        Get 3 free iPhone photography tips that work with any model — no gear required.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3 sm:gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 bg-obsidian border border-hairline rounded-full sm:rounded-sm px-4 py-3 sm:py-2.5 text-cream font-body text-sm placeholder:text-muted/30 focus:outline-none focus:ring-1 focus:ring-gold/40 focus:border-gold/20 transition-colors min-w-0"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
          })}
        />
        <Button type="submit" className="shrink-0 px-6 py-3 sm:px-4 sm:py-2.5 text-[11px] rounded-full sm:rounded-none">
          Send
        </Button>
      </form>
      {errors.email && (
        <p className="text-error text-xs mt-2 font-body">{errors.email.message}</p>
      )}
      <p className="text-[10px] text-muted/30 mt-3 font-body uppercase tracking-wider text-center sm:text-left">
        No spam · Unsubscribe anytime
      </p>
    </>
  );

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <>
          {/* Mobile: fullscreen overlay */}
          {isMobile ? (
            <motion.div
              key="mobile-capture"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-end sm:hidden"
            >
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm"
                onClick={dismiss}
              />
              {/* Sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full bg-surface border-t border-hairline/60 rounded-t-3xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-2xl"
              >
                {/* Handle */}
                <div className="w-10 h-1 bg-muted/20 rounded-full mx-auto mb-6" />
                <button
                  onClick={dismiss}
                  className="absolute top-5 right-5 text-muted/40 hover:text-cream transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={18} />
                </button>
                {content}
              </motion.div>
            </motion.div>
          ) : (
            /* Desktop: bottom-right card */
            <motion.div
              key="desktop-capture"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="hidden sm:block fixed bottom-6 right-6 w-[380px] z-40 bg-surface border border-hairline/60 rounded-sm p-6 shadow-2xl shadow-obsidian/80"
            >
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 text-muted/40 hover:text-cream transition-colors"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
              {content}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
