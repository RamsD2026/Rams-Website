import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import { MepsCalculator } from "@/components/sections/meps/MepsCalculator";

export const metadata: Metadata = {
  title: "ROI Calculator | RAMS Digital",
  description:
    "Test the MHE productivity opportunity against your own assumptions. Every value is yours to set — RAMS supplies the measurement, not the improvement figures.",
};

/**
 * /roi-calculator
 *
 * The navbar now carries a standing "ROI calculator" CTA, and this is what it
 * points at.
 *
 * `MepsCalculator` was already written — a scenario model with its own header,
 * sliders and working — but it had been dropped from the MEPS page during that
 * page's rebuild and was left on disk unimported. So the calculator is not new
 * here; only the route around it is. It is rendered unchanged, which keeps one
 * calculator on the site rather than a second one that has to agree with it.
 *
 * ── The surfaces alternate ──────────────────────────────────────────
 * Dark hero, white calculator, dark close.
 *
 * The calculator was dark-only for a revision and the whole page went dark
 * with it, which left the one section a reader actually uses sitting on the
 * same ground as the two that only talk. Rather than copy the component to
 * re-colour it, `MepsCalculator` now takes a `tone` — the colours were always
 * a fixed set, so they became a table with two columns. It still defaults to
 * dark, so the MEPS page is unaffected if it ever picks the section back up.
 *
 * ── The hero is static ──────────────────────────────────────────────
 * No motion, so this stays a server component and the only client boundary on
 * the route is the calculator itself, which needs one for its state.
 *
 * ── It states whose numbers these are ───────────────────────────────
 * The calculator's own subline already says that RAMS does not supply the
 * improvement figures, and the hero says it again above the fold: the output
 * is the reader's assumptions worked through, not a RAMS claim about savings.
 * Nothing on this page should be quotable as a promised return.
 */
export default function RoiCalculatorPage() {
  return (
    <>
      <section
        className="relative overflow-hidden text-white"
        id="top"
        data-hero-tone="dark"
        style={{
          background:
            "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[620px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.22), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          }}
        />

        <div className="relative rams-container pt-40 sm:pt-52 lg:pt-60 pb-28 sm:pb-36 lg:pb-44">
          <div className="max-w-[1000px] mx-auto text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
              <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
                ROI Calculator
              </span>
            </span>

            <h1 className="mt-8 sm:mt-10 text-[44px] sm:text-[68px] lg:text-[86px] font-bold leading-[1.06] tracking-[-0.045em]">
              <span className="block text-white">Your numbers,</span>
              <span
                className="block"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                worked through.
              </span>
            </h1>

            <p className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[820px] mx-auto">
              Set the fleet, the shift pattern and the improvement you think is
              available. The model shows what those assumptions are worth over a
              year — so the conversation starts from your operation rather than
              from a headline figure.
            </p>

            {/* the same three-chip row the platform and service heroes carry —
                here it states the terms of the thing rather than its features,
                because what a calculator is worth depends entirely on whose
                numbers went into it */}
            <div className="mt-8 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
              {["Your inputs", "Indicative only", "No RAMS figures"].map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-[10.5px] font-mono font-semibold tracking-[0.22em] uppercase text-white/70"
                >
                  <span
                    className="w-1 h-1 rounded-full bg-signal-orange"
                    aria-hidden
                  />
                  {c}
                </span>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
              <Link
                href="#roi"
                className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200 hover:bg-signal-orange-hover"
              >
                Open the calculator
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/services/mhe-productivity-assessment"
                className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] text-white text-[14px] font-semibold px-6 py-3.5 rounded-full transition-colors duration-200 hover:bg-white/[0.08]"
              >
                Measure the real baseline
              </Link>
            </div>

            <p className="mt-12 mx-auto max-w-[760px] text-[10.5px] font-mono font-semibold tracking-[0.16em] uppercase leading-[1.7] text-white/30">
              Every value below is yours to set. RAMS supplies the measurement,
              not the improvement figures.
            </p>
          </div>
        </div>
      </section>

      <MepsCalculator tone="light" />

      <section
        className="relative overflow-hidden text-white"
        style={{
          background:
            "radial-gradient(80% 100% at 50% 100%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[520px]"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 90%, rgba(255,106,0,0.18), transparent 70%)",
          }}
        />

        <div className="relative rams-container py-24 sm:py-32 text-center">
          <h2 className="max-w-[900px] mx-auto text-[34px] sm:text-[52px] lg:text-[60px] font-bold leading-[1.06] tracking-[-0.04em]">
            <span className="block text-white">A number is a hypothesis.</span>
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Measurement settles it.
            </span>
          </h2>

          <p className="mt-6 text-[14px] sm:text-[16px] text-white/60 leading-[1.6] max-w-[720px] mx-auto">
            An MHE productivity assessment establishes the baseline these
            assumptions are tested against, and states the window, the measures
            and the exclusions it was measured under.
          </p>

          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/services/mhe-productivity-assessment"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[15px] font-semibold px-7 py-4 rounded-full transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              MHE productivity assessment
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] text-white text-[15px] font-semibold px-7 py-4 rounded-full transition-colors duration-200 hover:bg-white/[0.08]"
            >
              Talk to the team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
