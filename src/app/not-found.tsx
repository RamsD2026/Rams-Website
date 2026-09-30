import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/**
 * The 404.
 *
 * ── Why this file exists ────────────────────────────────────────────
 * Next's built-in not-found is a white page with two lines of system type,
 * and it carries none of this site's markup — including
 * `data-hero-tone="light"`, which is how a page tells the header it is light.
 * Without it the bar keeps its hero treatment: a white logo and white links,
 * on white. The header looked empty on every mistyped or dead URL, which is
 * exactly when a lost reader most needs the navigation.
 *
 * A dark ground fixes that by being what the bar already expects, and it
 * gives the page somewhere to send people rather than leaving them at a
 * dead end.
 *
 * ── It is a server component ────────────────────────────────────────
 * No state, no animation: a 404 should render instantly and not wait on a
 * client bundle. The entrance animations everywhere else are worth their
 * cost; here they are not.
 */

const ROUTES = [
  {
    label: "Platform",
    href: "/platform/overview",
    body: "IRDS, Digital Twin, MEPS, IBIS and the rest of the operating system.",
  },
  {
    label: "Solutions",
    href: "/solutions/rack-safety-intelligence",
    body: "Rack safety, inventory behaviour, MHE productivity, warehouse execution.",
  },
  {
    label: "Services",
    href: "/services",
    body: "Inspection, structural verification, audits, deployment and support.",
  },
  {
    label: "Resources",
    href: "/resources/case-studies",
    body: "Case studies, blogs, webinars, downloads and the help centre.",
  },
];

export default function NotFound() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 10%, rgba(255,106,0,0.18), transparent 70%)",
        }}
      />

      <div className="relative rams-container pt-40 sm:pt-48 lg:pt-52 pb-24 sm:pb-28 lg:pb-32">
        <div className="max-w-[880px]">
          <p className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange">
            Error 404
          </p>

          <h1 className="mt-6 text-[44px] sm:text-[64px] lg:text-[78px] font-bold leading-[1.04] tracking-[-0.04em]">
            <span className="block text-white">This page is not</span>
            <span className="block text-white/45">where you looked.</span>
          </h1>

          <p className="mt-6 text-[15px] sm:text-[16px] leading-[1.6] text-white/55 max-w-[620px]">
            The address may be mistyped, or the page may have moved since
            whatever sent you here was written. Everything below is a good
            place to pick the thread back up.
          </p>

          <div className="mt-9 flex items-center gap-3 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Back to the homepage
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Tell us what you were after
            </Link>
          </div>
        </div>

        {/* ── where to go instead ───────────────────────────── */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {ROUTES.map((route) => (
            <Link key={route.href} href={route.href} className="group block">
              <span className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-white transition-colors duration-200 group-hover:text-signal-orange">
                {route.label}
                <ArrowUpRight
                  className="w-4 h-4 text-white/30 transition-all duration-200 group-hover:text-signal-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </span>
              <span className="mt-2 block text-[13.5px] leading-[1.55] text-white/45">
                {route.body}
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-[12.5px] text-white/30">
          Looking for something specific? Open search from the bar above, or
          press <span className="font-mono">⌘K</span> /{" "}
          <span className="font-mono">Ctrl-K</span>.
        </p>
      </div>
    </section>
  );
}
