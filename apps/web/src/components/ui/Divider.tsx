import { cn } from "@/lib/utils";

interface DividerProps {
  className?: string;
  /** Orientation of the divider */
  orientation?: "horizontal" | "vertical";
}

export default function Divider({
  className,
  orientation = "horizontal",
}: DividerProps) {
  return (
    <div
      className={cn(
        "bg-hairline",
        orientation === "horizontal" ? "h-px w-full" : "w-px h-full",
        className
      )}
      role="separator"
      aria-orientation={orientation}
    />
  );
}
