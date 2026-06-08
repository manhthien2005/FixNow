import Image from "next/image";

import { cn } from "@/lib/utils";

const LOGO_SIZE = {
  sm: { width: 132, height: 47, className: "h-9" },
  md: { width: 168, height: 60, className: "h-11" },
  lg: { width: 208, height: 74, className: "h-14" },
} as const;

interface BrandLogoProps {
  size?: keyof typeof LOGO_SIZE;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  size = "md",
  className,
  priority = false,
}: BrandLogoProps) {
  const config = LOGO_SIZE[size];

  return (
    <Image
      src="/images/fixnow_logo.png"
      alt="FixNow"
      width={config.width}
      height={config.height}
      priority={priority}
      className={cn("w-auto object-contain", config.className, className)}
    />
  );
}
