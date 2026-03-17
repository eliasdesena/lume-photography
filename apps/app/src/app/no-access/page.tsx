export default function NoAccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="w-12 h-12 rounded-full bg-error/10 border border-error/20 flex items-center justify-center mx-auto mb-6">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-error"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h1 className="font-display text-2xl mb-3">No access</h1>
        <p className="font-body font-light text-muted text-sm leading-relaxed mb-8">
          You don&apos;t have access to the LUMÉ course yet. Purchase the course to get started.
        </p>
        <a
          href="https://lumephotos.co/checkout"
          className="inline-flex items-center justify-center bg-gold text-obsidian px-8 py-3.5 text-sm uppercase tracking-[0.06em] font-body font-medium hover:bg-cream transition-colors duration-200"
        >
          Get access →
        </a>
      </div>
    </div>
  );
}
