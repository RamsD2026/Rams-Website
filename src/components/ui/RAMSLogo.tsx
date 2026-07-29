import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RAMSLogoProps {
  className?: string;
  asLink?: boolean;
  variant?: "dark" | "white";
}

export function RAMSLogo({ className, asLink = false, variant = "dark" }: RAMSLogoProps) {
  const logo = (
    <div className={cn("relative", className)}>
      <Image
        src="/RAMS_Logo_Black.svg"
        alt="RAMS"
        width={120}
        height={48}
        priority
        className={cn(
          "h-full w-auto object-contain",
          variant === "white" && "brightness-0 invert"
        )}
      />
    </div>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        aria-label="RAMS — Return to homepage"
        className="inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2 rounded"
      >
        {logo}
      </Link>
    );
  }

  return logo;
}
