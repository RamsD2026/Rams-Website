"use client";

import { Head, Reveal } from "@/components/sections/hardware/hw-shared";

/**
 * 07 — Battery Management.
 *
 * The one sensor with no photograph worth showing — it is a chip that lives with
 * the battery — so it is drawn: a BMS package with its pins, and signal traces
 * running out to the edges with a pulse travelling along four of them.
 *
 * ── Words and meters, no figures ────────────────────────────────────
 * "Charging", "Good", "Counted, every one" — a charge meter that fills, five
 * health bars, a cycle trend with no axis. Every reading on this page is
 * qualitative on purpose, because RAMS has no measured figures to quote for a
 * customer's batteries and a specimen number on a product page becomes a
 * promise. The line under the block says as much. See `sst-data.ts`.
 *
 * All three animations are CSS and all three stop under
 * `prefers-reduced-motion`, where the charge bar holds at 80% rather than
 * sitting empty.
 */
export function SstBattery() {
  return (
    <section className="section dark" id="battery">
      <div className="wrap">
        <Head
          label="Battery Management"
          top="Health and charge,"
          bottom="for every truck."
          intro="A battery management chip at the truck’s battery follows its charge through the shift, counts its charge cycles and tracks its health — so a failing battery shows up in the data before it shows up on the floor."
        />

        <div className="bms">
          <Reveal className="chip-stage">
            <svg viewBox="0 0 600 600" role="img" aria-label="A battery management chip with signal traces running out to its pins">
              <g className="trace">
                <path d="M300 170V40M260 170V70H150V20M340 170V70H450V20M170 260H40M170 300H20M170 340H70V480M430 260H560M430 300H580M430 340H530V480M260 430V530H160V590M340 430V530H440V590M300 430V580" />
              </g>
              {/* four of the traces carry a pulse, so the chip reads as live */}
              <g className="flow">
                <path d="M300 170V40" />
                <path d="M430 300H580" />
                <path d="M340 430V530H440V590" />
                <path d="M170 260H40" />
              </g>

              <rect x="150" y="150" width="300" height="300" rx="26" fill="#0d0f0e" stroke="#2a2d2b" strokeWidth="3" />
              <g fill="#c8a65a">
                {[182, 222, 262, 302, 342, 382].map((x) => (
                  <rect key={"t" + x} x={x} y="132" width="16" height="22" rx="3" />
                ))}
                {[182, 222, 262, 302, 342, 382].map((x) => (
                  <rect key={"b" + x} x={x} y="446" width="16" height="22" rx="3" />
                ))}
                {[182, 222, 262, 302, 342, 382].map((y) => (
                  <rect key={"l" + y} x="132" y={y} width="22" height="16" rx="3" />
                ))}
                {[182, 222, 262, 302, 342, 382].map((y) => (
                  <rect key={"r" + y} x="446" y={y} width="22" height="16" rx="3" />
                ))}
              </g>
              <rect x="190" y="190" width="220" height="220" rx="14" fill="#161917" />
              <circle cx="214" cy="214" r="7" fill="#2a2d2b" />
              <text x="300" y="296" textAnchor="middle" fill="#F5F5F7" fontWeight="800" fontSize="46" letterSpacing="1">
                BMS
              </text>
              <text x="300" y="334" textAnchor="middle" fill="#6E6E73" fontWeight="600" fontSize="18" letterSpacing="3">
                RAMS DIGITAL
              </text>
            </svg>
          </Reveal>

          <div className="bms-cards">
            <Reveal className="bcard">
              <span className="k">Charge level</span>
              <b>Charging</b>
              <p>Followed through the shift, so a truck isn’t sent out on a battery that won’t last.</p>
              <div className="charge" aria-hidden>
                <i />
              </div>
            </Reveal>

            <Reveal className="bcard" delay={60}>
              <span className="k">Battery health</span>
              <b>Good</b>
              <p>A trend over months, not a surprise on a Monday morning.</p>
              <div className="health" aria-hidden>
                <i />
                <i />
                <i />
                <i />
                <i className="dim" />
              </div>
            </Reveal>

            <Reveal className="bcard" delay={120}>
              <span className="k">Charge cycles</span>
              <b>Counted, every one</b>
              <p>How hard each battery works, truck by truck — and when to plan a replacement.</p>
              <div className="cycles" aria-hidden>
                <svg viewBox="0 0 300 70" preserveAspectRatio="none">
                  <path
                    className="area"
                    d="M0 60L25 52L50 55L75 44L100 47L125 38L150 40L175 30L200 33L225 24L250 26L275 16L300 12V70H0Z"
                  />
                  <path d="M0 60L25 52L50 55L75 44L100 47L125 38L150 40L175 30L200 33L225 24L250 26L275 16L300 12" />
                </svg>
              </div>
            </Reveal>
          </div>
        </div>

        <p className="note-dark">Illustration. Readings shown without figures.</p>
      </div>
    </section>
  );
}
