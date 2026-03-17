import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-hairline/40">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      <div className="max-w-content mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left: wordmark */}
          <a href="/" className="opacity-60 hover:opacity-80 transition-opacity" aria-label="LUMÉ home">
            <Image
              src="/images/wordmark-gradient.svg"
              alt="LUMÉ"
              width={160}
              height={40}
              className="h-11 w-auto"
            />
          </a>

          {/* Center: links */}
          <nav className="flex items-center gap-6 text-xs text-muted/50 font-body">
            <a
              href="/privacy"
              className="hover:text-cream/70 transition-colors"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="hover:text-cream/70 transition-colors"
            >
              Terms
            </a>
            <a
              href="mailto:hello@lume.com"
              className="hover:text-cream/70 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Right: copyright */}
          <div className="text-[10px] text-muted/30 font-body text-center sm:text-right uppercase tracking-wider">
            <p>© {year} LUMÉ · Payments by Stripe</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
