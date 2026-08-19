"use client";

/**
 * Small platform marks for the hero availability strip.
 * lucide-react dropped brand icons, so these are simplified inline glyphs.
 */

type GlyphProps = { className?: string };

export function AppleGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.37 1.43c0 1.14-.42 2.2-1.12 2.99-.85.96-2.24 1.7-3.4 1.6-.14-1.11.42-2.28 1.08-3.01.76-.86 2.06-1.5 3.44-1.58ZM20.9 17.1c-.55 1.27-.82 1.84-1.53 2.96-.99 1.57-2.39 3.52-4.12 3.53-1.54.02-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.73-.02-3.05-1.78-4.04-3.34C.3 15.8-.03 10.7 1.7 8c1.23-1.93 3.17-3.06 5-3.06 1.86 0 3.03 1.02 4.57 1.02 1.49 0 2.4-1.02 4.55-1.02 1.63 0 3.36.89 4.59 2.42-4.03 2.21-3.38 7.96.49 9.74Z" />
    </svg>
  );
}

export function AndroidGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.6 9.48l1.84-3.18a.38.38 0 0 0-.14-.52.38.38 0 0 0-.52.14l-1.87 3.23a11.36 11.36 0 0 0-9.82 0L5.22 5.92a.38.38 0 0 0-.52-.14.38.38 0 0 0-.14.52L6.4 9.48A10.75 10.75 0 0 0 1 18h22a10.75 10.75 0 0 0-5.4-8.52ZM7 15.25a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm10 0a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z" />
    </svg>
  );
}

export function WindowsGlyph({ className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M2.5 5.3 10 4.2v7.3H2.5V5.3Zm0 13.4L10 19.8v-7.2H2.5v6.1ZM11 4.05 21.5 2.5v9H11v-7.45ZM11 12.6h10.5v9L11 19.95V12.6Z" />
    </svg>
  );
}
