import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

/** Shared marketing heading: `> EYEBROW_` mono label + title + subtitle. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "fade-in-up",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      <p className="mb-3 font-mono text-label-sm uppercase tracking-widest text-secondary">
        &gt; {eyebrow}
      </p>
      <h2 className="text-headline-md text-on-surface md:text-display-lg-mobile">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-body-md text-on-surface-variant md:text-body-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
