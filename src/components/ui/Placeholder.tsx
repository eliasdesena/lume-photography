import { cn } from "@/lib/utils";

interface PlaceholderProps {
  /** The [[BRACKET]] name of the placeholder */
  label: string;
  /** Ideal dimensions to display as guidance */
  dimensions?: string;
  /** Aspect ratio CSS value, e.g. "3/4" or "16/9" */
  aspectRatio?: string;
  className?: string;
  alt?: string;
}

export default function Placeholder({
  label,
  dimensions,
  aspectRatio = "3/4",
  className,
  alt,
}: PlaceholderProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center border border-dashed border-hairline bg-surface cursor-crosshair overflow-hidden",
        className
      )}
      style={{ aspectRatio }}
      role="img"
      aria-label={alt || `Placeholder for ${label}`}
    >
      <div className="text-center p-4">
        <p className="text-label text-muted mb-1">[[{label}]]</p>
        {dimensions && (
          <p className="text-xs text-muted/60 font-body">{dimensions}</p>
        )}
      </div>
    </div>
  );
}
