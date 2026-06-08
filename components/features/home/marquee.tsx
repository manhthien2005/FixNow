import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  /** Animation duration; lower = faster. Default 35s. */
  durationSeconds?: number;
  /** Gap + horizontal padding utility classes for the track. */
  className?: string;
  /** Width of the left/right fade gradients. */
  fadeClassName?: string;
}

/**
 * Seamless horizontal auto-scroller. Renders `children` twice back-to-back so
 * the -50% keyframe loops without a visible jump. Pauses on hover/focus.
 * The caller is responsible for duplicating semantic content responsibly
 * (decorative repeat is aria-hidden via the wrapper).
 */
export function Marquee({
  children,
  durationSeconds = 35,
  className = "gap-6 px-6",
  fadeClassName = "w-16",
}: MarqueeProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 z-10 h-full bg-gradient-to-r from-surface-container-lowest to-transparent ${fadeClassName}`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute right-0 top-0 z-10 h-full bg-gradient-to-l from-surface-container-lowest to-transparent ${fadeClassName}`}
      />
      <div
        className={`marquee-track items-center ${className}`}
        style={{ "--marquee-duration": `${durationSeconds}s` } as React.CSSProperties}
      >
        {children}
        <span aria-hidden className="contents">
          {children}
        </span>
      </div>
    </div>
  );
}
