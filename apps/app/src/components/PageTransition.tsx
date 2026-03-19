"use client";

import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

/**
 * Lightweight page transition that fades content in on route change.
 * Uses CSS animations instead of Framer Motion key-based unmount/remount
 * to prevent layout flashes and blank frames during navigation.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setAnimKey((k) => k + 1);
      // Scroll to top on route change
      const scroller = document.getElementById("app-scroll");
      if (scroller) scroller.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname]);

  return (
    <div key={animKey} className="animate-fade-in">
      {children}
    </div>
  );
}
