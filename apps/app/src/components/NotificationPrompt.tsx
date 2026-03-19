"use client";

import { useEffect, useState } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const DISMISSED_KEY = "lume-notif-dismissed";
const SUBSCRIBED_KEY = "lume-notif-subscribed";

export default function NotificationPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show if:
    // - No VAPID key configured
    // - Already subscribed or dismissed
    // - Browser doesn't support push
    // - Permission already denied
    if (!VAPID_PUBLIC_KEY) return;
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    if (Notification.permission === "denied") return;
    if (localStorage.getItem(SUBSCRIBED_KEY)) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    // If already granted (from a previous session), subscribe silently
    if (Notification.permission === "granted") {
      subscribe();
      return;
    }

    // Show the prompt after a short delay so it doesn't feel aggressive
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  async function subscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY!).buffer as ArrayBuffer,
      });

      // Send to our API
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: subscription.toJSON() }),
      });

      if (res.ok) {
        localStorage.setItem(SUBSCRIBED_KEY, "1");
      }
    } catch {
      // Permission denied or subscription failed — silently ignore
    }

    setShow(false);
  }

  async function handleEnable() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await subscribe();
    } else {
      handleDismiss();
    }
  }

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-[calc(var(--tab-bar-height)+env(safe-area-inset-bottom,0px)+12px)] left-4 right-4 lg:bottom-6 lg:left-auto lg:right-6 lg:w-[360px] z-50 animate-fade-in">
      <div className="bg-surface border border-hairline/60 rounded-sm p-4 shadow-lg shadow-obsidian/50">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gold"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-sm text-cream mb-1">
              Stay on track
            </p>
            <p className="font-body text-xs text-muted leading-relaxed">
              Get gentle reminders to keep up with your course. We&apos;ll only nudge you if you&apos;ve been away for a while.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 ml-12">
          <button
            onClick={handleEnable}
            className="px-4 py-2 bg-gold/10 text-gold border border-gold/20 text-xs font-body font-medium rounded-sm hover:bg-gold/20 transition-colors press-scale"
          >
            Enable reminders
          </button>
          <button
            onClick={handleDismiss}
            className="text-xs font-body text-muted/60 hover:text-muted transition-colors"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
