import { downloadableAssets } from "@/data/course";
import Link from "next/link";

export default function DownloadsPage() {
  return (
    <div className="space-y-8 pt-2 pb-tab-safe lg:pb-0">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl mb-2">Downloads</h1>
        <p className="font-body font-light text-muted text-sm">
          Your course resources — presets, workbooks, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {downloadableAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-surface border border-hairline rounded-sm p-5 sm:p-6"
          >
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <h2 className="font-display text-base mb-1">{asset.title}</h2>
            <p className="text-xs text-muted font-body font-light mb-4">
              {asset.description}
            </p>
            <a
              href={`/api/downloads/${asset.id}`}
              className="inline-flex items-center bg-gold/10 text-gold border border-gold/20 px-5 py-2.5 text-xs font-body font-medium hover:bg-gold/20 transition-colors rounded-sm press-scale"
            >
              Download {asset.filename.split(".").pop()?.toUpperCase()}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
