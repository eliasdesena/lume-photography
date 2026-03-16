import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-label text-gold-dim border border-hairline rounded-full bg-surface",
        className
      )}
    >
      {children}
    </span>
  );
}
