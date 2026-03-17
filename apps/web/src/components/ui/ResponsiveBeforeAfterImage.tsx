"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Placeholder from "./Placeholder";

interface ResponsiveBeforeAfterImageProps {
  filename: string;
  placeholderLabel: string;
  alt: string;
  dimensions: string;
}

/**
 * Automatically loads an image if it exists in /public,
 * otherwise falls back to a placeholder.
 */
export default function ResponsiveBeforeAfterImage({
  filename,
  placeholderLabel,
  alt,
  dimensions,
}: ResponsiveBeforeAfterImageProps) {
  const [loadError, setLoadError] = useState(false);

  const handleError = useCallback(() => {
    setLoadError(true);
  }, []);

  // If load error occurred, show placeholder
  if (loadError) {
    return (
      <Placeholder
        label={placeholderLabel}
        dimensions={dimensions}
        aspectRatio="3/4"
        className="w-full h-full"
        alt={alt}
      />
    );
  }

  return (
    <Image
      src={`/images/${filename}`}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover select-none pointer-events-none"
      onError={handleError}
      priority={filename === "before1.webp" || filename === "after1.webp"}
      draggable={false}
    />
  );
}
