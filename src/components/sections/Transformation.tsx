"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/motion";
import ResponsiveBeforeAfterImage from "@/components/ui/ResponsiveBeforeAfterImage";
import Button from "@/components/ui/Button";

const pairs = [
  { before: "before1.webp", after: "after1.webp", beforePlaceholder: "BEFORE_1", afterPlaceholder: "AFTER_1", caption: "iPhone 14 Pro · Lightroom" },
  { before: "before2.webp", after: "after2.webp", beforePlaceholder: "BEFORE_2", afterPlaceholder: "AFTER_2", caption: "iPhone 14 Pro · Lightroom + Snapseed" },
  { before: "before3.webp", after: "after3.webp", beforePlaceholder: "BEFORE_3", afterPlaceholder: "AFTER_3", caption: "iPhone 14 Pro · Lightroom" },
];

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforePlaceholder: string;
  afterPlaceholder: string;
  caption: string;
}

function BeforeAfterSlider({ before, after, beforePlaceholder, afterPlaceholder, caption }: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPosition(pct);
  }, []);

  // ── Mouse: click/drag anywhere on the container ──────────────────────────
  const onMouseDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    setIsDragging(true);
    containerRef.current?.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onMouseMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const onMouseUp = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    setIsDragging(false);
  }, []);

  // ── Touch/pen: only the handle element responds (touch-action:none on it) ─
  const onTouchDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const onTouchMove = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse" || !isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const onTouchUp = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    setIsDragging(false);
  }, []);

  return (
    <motion.div variants={fadeUp} className="group">
      <div
        ref={containerRef}
        className="relative aspect-[3/4] overflow-hidden rounded-sm select-none cursor-ew-resize"
        role="slider"
        aria-label={`Before and after comparison: ${caption}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 2));
          if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 2));
        }}
        onPointerDown={onMouseDown}
        onPointerMove={onMouseMove}
        onPointerUp={onMouseUp}
        draggable={false}
      >
        {/* After image — explicitly clipped to right side */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        >
          <ResponsiveBeforeAfterImage
            filename={after}
            placeholderLabel={afterPlaceholder}
            alt={`After edit — ${caption}`}
            dimensions="600 × 800px"
          />
        </div>

        {/* Before image — explicitly clipped to left side */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <ResponsiveBeforeAfterImage
            filename={before}
            placeholderLabel={beforePlaceholder}
            alt={`Before edit — ${caption}`}
            dimensions="600 × 800px"
          />
        </div>

        {/* Handle — touch/pen hitbox + visual. touch-action:none scoped here only. */}
        <div
          className="absolute inset-y-0 z-10 cursor-ew-resize"
          style={{
            left: `${position}%`,
            width: "44px",
            marginLeft: "-22px",
            touchAction: "none",
          }}
          onPointerDown={onTouchDown}
          onPointerMove={onTouchMove}
          onPointerUp={onTouchUp}
          draggable={false}
        >
          <div className="relative h-full pointer-events-none">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-cream/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-obsidian/60 backdrop-blur-md border border-cream/30 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M5 3L2 8L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cream/70" />
                <path d="M11 3L14 8L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-cream/70" />
              </svg>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.08em] text-cream/50 bg-obsidian/50 backdrop-blur-sm px-2.5 py-1 rounded-full font-body font-medium">
            Before
          </span>
        </div>
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="text-[9px] uppercase tracking-[0.08em] text-cream/50 bg-obsidian/50 backdrop-blur-sm px-2.5 py-1 rounded-full font-body font-medium">
            After
          </span>
        </div>
      </div>

      <p className="text-[11px] text-muted/60 mt-3 font-body tracking-wide uppercase">{caption}</p>
    </motion.div>
  );
}

export default function Transformation() {
  return (
    <section className="pt-28 sm:pt-36 pb-20 sm:pb-28 px-6">
      <motion.div
        className="max-w-content mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <motion.div variants={fadeUp} className="max-w-lg mb-16 sm:mb-20">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-5 leading-tight">
            Shot on iPhone.{" "}
            <em className="text-gold italic">Edited in minutes.</em>
          </h2>
          <p className="font-body font-light text-muted text-base leading-relaxed">
            Every photo below was taken and edited on an iPhone just like yours. No professional camera. No studio. Drag to see the edit.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {pairs.map((pair) => (
            <BeforeAfterSlider key={pair.before} {...pair} />
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-14 sm:mt-16 text-center">
          <p className="font-display text-xl sm:text-2xl text-cream/80 mb-6">
            Your shots could look like this.
          </p>
          <Button href="/checkout">Start shooting like this →</Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
