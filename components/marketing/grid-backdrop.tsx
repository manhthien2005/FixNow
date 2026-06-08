import { cn } from "@/lib/utils";

const GRID_LINES: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
  backgroundSize: "56px 56px",
};

/** Faint white line-grid backdrop with a vertical fade, to lift content. */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      style={GRID_LINES}
      className={cn(
        "pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    />
  );
}
