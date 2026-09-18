"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shared primitives for /hardware/ai-vision.
 *
 * These are the reference build's three page-level behaviours, each of which was
 * an imperative block in its inline `<script>`, rewritten as a hook or a
 * component. The styling all lives in `src/styles/hardware-base.css`;
 * nothing here re-states a class.
 *
 * Why this page does not use `rackiq-shared` or `<SectionHeader>`: it is a port
 * of a complete, self-contained design, and its section header is deliberately
 * a different object — a sentence-case orange line rather than this site's
 * 11px mono caps eyebrow. Mixing the two systems would give the page two
 * competing header treatments. See the note at the top of the stylesheet.
 */

export const EASE = [0.2, 0.8, 0.2, 1] as const;

/* ── reveal ──────────────────────────────────────────────────────── */

/**
 * The `.reveal` → `.reveal.in` fade-up, one observer per element.
 *
 * `rootMargin: "0px 0px -12% 0px"` and `unobserve` on first intersection are
 * both the reference's: the element reveals once, slightly before it reaches
 * the bottom edge, and never replays.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer (very old browser, or a test environment): show everything.
    // Deferred to a frame callback rather than run in the effect body, which
    // would cascade a second render — the same reason `layout/Header.tsx`
    // reads the hero tone in a frame callback.
    if (!("IntersectionObserver" in window)) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setShown(true);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, shown, cls: shown ? "reveal in" : "reveal" };
}

/** `<Reveal>` for the common case: a plain wrapper that fades its children up. */
export function Reveal({
  children,
  as: Tag = "div",
  className,
  delay,
  ...rest
}: {
  children: React.ReactNode;
  as?: "div" | "li" | "section";
  className?: string;
  delay?: number;
} & React.HTMLAttributes<HTMLElement>) {
  const { ref, cls } = useReveal<HTMLDivElement>();
  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={cls + (className ? " " + className : "")}
      style={delay ? ({ "--d": delay + "ms" } as React.CSSProperties) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ── the HUD clock ───────────────────────────────────────────────── */

/**
 * The `00:00:00` in the corner of every camera frame, ticking in real time.
 *
 * Rendered empty on the server and filled after mount: a clock is by definition
 * different between the server render and the client one, and pre-filling it
 * would be a hydration mismatch on every load.
 */
export function HudClock({
  className,
  as = "span",
}: {
  className?: string;
  /** `tspan` for the clock inside the SVG scene — a `span` there is not valid SVG. */
  as?: "span" | "tspan";
}) {
  const [t, setT] = useState("");
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setT(
        [n.getHours(), n.getMinutes(), n.getSeconds()]
          .map((v) => String(v).padStart(2, "0"))
          .join(":"),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const Tag = as;
  return (
    <Tag className={className} suppressHydrationWarning>
      {t || "00:00:00"}
    </Tag>
  );
}

/* ── media + camera overlay ──────────────────────────────────────── */

/** `[x, y, w, h, label, tone]` — all four geometry values are % of the frame. */
export type HudBox = [number, number, number, number, string, ("" | "warn" | "alert")?];
/** `[points, tone]` — `points` is an SVG polygon in a 0–100 viewBox. */
export type HudZone = [string, ("" | "warn" | "alert")?];
export type Hud = { cam: string; boxes?: HudBox[]; zones?: HudZone[] };

/**
 * A camera frame with its detection overlay.
 *
 * The overlay is HTML and SVG on top of a clean still, never baked into the
 * image — the reference is explicit about why: the boxes stay sharp at any
 * size, they animate in, and one still can be re-labelled without a new render.
 *
 * `src` omitted renders the reference's own missing-media treatment: a gradient
 * carrying the file name that belongs there. Thirteen of its fifteen images
 * were never generated, so that state is the normal one on this page rather
 * than an error path, and it is what makes the gaps obvious to whoever supplies
 * the photography.
 */
export function Media({
  src,
  alt,
  label,
  hud,
  tone = "dark",
  className,
  fit,
  priority,
}: {
  src?: string;
  alt?: string;
  label: string;
  hud?: Hud;
  tone?: "dark" | "light";
  className?: string;
  /** `contain` for a product shot that must not be cropped. */
  fit?: "cover" | "contain";
  priority?: boolean;
}) {
  const { ref, shown } = useReveal<HTMLElement>();

  // The overlay draws itself in when the frame reaches the viewport, so the
  // boxes land on a picture the reader is already looking at. `forceHud` is not
  // needed: inside a sheet the whole panel mounts in view and the observer
  // fires on the same frame.
  const classes = [
    "media",
    tone === "light" ? "light" : "",
    src ? "" : "missing",
    fit === "contain" ? "contain" : "",
    hud && src && shown ? "hud-in" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure ref={ref} className={classes} data-label={label}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      )}
      {hud && src && (
        <div className="hud" aria-hidden>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            {(hud.zones ?? []).map((z, i) => (
              <polygon
                key={i}
                className={z[1] || undefined}
                points={z[0]}
                style={{ transitionDelay: i * 120 + "ms" }}
              />
            ))}
          </svg>
          {(hud.boxes ?? []).map((b, i) => (
            <div
              key={i}
              className={"hud-box " + (b[5] || "")}
              style={{
                left: b[0] + "%",
                top: b[1] + "%",
                width: b[2] + "%",
                height: b[3] + "%",
                transitionDelay: 200 + i * 150 + "ms",
              }}
            >
              <b>{b[4]}</b>
            </div>
          ))}
          <div className="hud-meta">
            <span className="rec">{hud.cam}</span>
            <HudClock className="hud-clock" />
          </div>
        </div>
      )}
    </figure>
  );
}

/* ── section header ──────────────────────────────────────────────── */

/**
 * The page's section header: orange label, headline, optional intro.
 *
 * `top`/`bottom` split the headline across two lines the way the reference's
 * hard `<br>` does. Deliberately not `<SectionHeader>` — see the note above.
 */
export function Head({
  label,
  top,
  bottom,
  intro,
  center,
  className,
}: {
  label: string;
  top: string;
  bottom?: string;
  intro?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={"head" + (center ? " center" : "") + (className ? " " + className : "")}>
      <span className="label">{label}</span>
      <h2 className="h2">
        {top}
        {bottom && (
          <>
            <br />
            {bottom}
          </>
        )}
      </h2>
      {intro && <p className="intro">{intro}</p>}
    </Reveal>
  );
}
