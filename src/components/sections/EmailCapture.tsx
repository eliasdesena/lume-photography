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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (dismissed) return;

    if (sessionStorage.getItem("lume-email-dismissed")) {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      const scrollPct =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPct > 0.55) {
        setShow(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-[380px] z-40 bg-surface border border-hairline/60 rounded-sm p-6 shadow-2xl shadow-obsidian/80"
        >
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-muted/40 hover:text-cream transition-colors"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>

          {submitted ? (
            <div className="text-center py-2">
              <p className="font-display text-lg text-gold mb-1">Check your inbox.</p>
              <p className="text-xs text-muted font-body">Your tips are on the way.</p>
            </div>
          ) : (
            <>
              <p className="font-display text-base text-cream mb-1">
                Not ready yet?
              </p>
              <p className="text-xs text-muted/70 font-body mb-4">
                Get 3 free iPhone photography tips — works with any model.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 bg-obsidian border border-hairline rounded-sm px-3 py-2.5 text-cream font-body text-sm placeholder:text-muted/30 focus:outline-none focus:ring-1 focus:ring-gold/40 focus:border-gold/20 transition-colors min-w-0"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                <Button type="submit" className="shrink-0 px-4 py-2.5 text-[10px]">
                  Send
                </Button>
              </form>
              {errors.email && (
                <p className="text-error text-xs mt-2 font-body">
                  {errors.email.message}
                </p>
              )}
              <p className="text-[9px] text-muted/30 mt-2 font-body uppercase tracking-wider">
                No spam · Unsubscribe anytime
              </p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
