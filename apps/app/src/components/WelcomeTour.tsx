"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WordmarkGradient } from "@lume/ui/logos";

const STORAGE_KEY = "lume-tour-seen";

export default function WelcomeTour() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Card */}
          <motion.div
            className="relative bg-surface border border-hairline/40 rounded-sm p-10 max-w-md w-full text-center"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <WordmarkGradient className="h-8 w-auto mx-auto mb-8" />

            <h2 className="font-display text-2xl text-cream mb-3">
              Welcome to LUMÉ
            </h2>
            <p className="font-body font-light text-muted text-sm mb-8">
              Everything you need is right here. A quick look around:
            </p>

            <div className="space-y-4 text-left mb-10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A45A" strokeWidth="1.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div>
                  <p className="font-body text-sm text-cream">Sidebar navigation</p>
                  <p className="font-body font-light text-xs text-muted">Browse modules and lessons on the left. Pick up where you left off.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A45A" strokeWidth="1.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <p className="font-body text-sm text-cream">Progress tracking</p>
                  <p className="font-body font-light text-xs text-muted">Your progress is saved automatically as you watch. The bar at the top shows how far along you are.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A45A" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
                <div>
                  <p className="font-body text-sm text-cream">Downloads</p>
                  <p className="font-body font-light text-xs text-muted">Grab the Lightroom presets and monetization workbook from the Downloads section.</p>
                </div>
              </div>
            </div>

            <button
              onClick={dismiss}
              className="w-full bg-gold text-obsidian font-body font-medium text-sm py-3 rounded-sm hover:bg-gold/90 transition-colors"
            >
              Get started
            </button>

            <button
              onClick={dismiss}
              className="mt-3 text-xs text-muted/60 hover:text-muted font-body transition-colors"
            >
              Skip tour
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
