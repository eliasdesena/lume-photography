"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const STORAGE_KEY = "lume-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Don't show if already installed as PWA
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    // Don't show if already dismissed
    if (localStorage.getItem(STORAGE_KEY)) return;
    // Only on mobile
    if (window.innerWidth >= 1024) return;

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    if (ios) {
      // iOS doesn't have beforeinstallprompt — show our custom prompt after a delay
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer);
    }

    // Android/Chrome: listen for the native install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, "true");
  }

  async function handleInstall() {
    if (deferredPrompt.current) {
      await deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === "accepted") dismiss();
    }
    // On iOS, just dismiss — they need to use the manual Share → Add to Home Screen flow
    dismiss();
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[80] p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] lg:hidden"
        >
          <div className="bg-surface border border-hairline/60 rounded-2xl p-4 shadow-2xl shadow-obsidian/80">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8A45A" strokeWidth="1.5">
                  <path d="M12 5v14M5 12l7-7 7 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-cream mb-0.5">
                  Install to your homescreen
                </p>
                <p className="font-body text-xs text-muted leading-relaxed">
                  {isIOS
                    ? "Tap the share button, then \"Add to Home Screen\" for the best experience."
                    : "Get the full app experience — instant access from your homescreen."}
                </p>
              </div>
              <button
                onClick={dismiss}
                className="text-muted/60 hover:text-cream p-1 shrink-0"
                aria-label="Dismiss"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {!isIOS && (
              <button
                onClick={handleInstall}
                className="mt-3 w-full bg-gold text-obsidian font-body font-medium text-xs py-2.5 rounded-lg hover:bg-gold/90 transition-colors"
              >
                Install app
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
