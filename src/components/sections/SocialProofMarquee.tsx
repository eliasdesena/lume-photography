"use client";

import { testimonials } from "@/data/testimonials";

function MarqueeContent() {
  return (
    <>
      {testimonials.map((t, i) => (
        <div key={i} className="flex items-center gap-8 shrink-0 px-8">
          <p className="font-display italic text-sm text-cream/60 whitespace-nowrap">
            &ldquo;{t.quote}&rdquo;
          </p>
          <span className="text-[10px] text-muted/60 font-body whitespace-nowrap uppercase tracking-wider">
            {t.name}
          </span>
          <span className="w-1 h-1 rounded-full bg-gold/30 shrink-0" />
        </div>
      ))}
    </>
  );
}

export default function SocialProofMarquee() {
  return (
    <section className="py-5 overflow-hidden border-b border-hairline/50">
      <div
        className="flex hover:[animation-play-state:paused]"
        style={{ width: "max-content" }}
      >
        <div className="flex animate-marquee">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>
    </section>
  );
}
