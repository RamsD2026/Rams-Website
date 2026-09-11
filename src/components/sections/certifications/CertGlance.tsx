"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Cpu,
  KeyRound,
  Lock,
  RefreshCcw,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { ask } from "./cert-data";

/**
 * The three cards at the foot of the hero.
 *
 * The reference closes its hero on a row of three: two low cards either side
 * of a taller one that carries the headline figure. This is that row on the
 * site's white ground — the centre card lifted 24px and carrying the claim,
 * the flanking pair carrying what the claim is not, and what it covers.
 *
 * ── The centre card carries the claim, not a statistic ──────────────
 * The reference puts "154,8%" there. There is no figure this page could put
 * in its place that would be true: RAMS states SOC 2 Type I and nothing
 * numeric follows from that. So the slot holds the claim itself, set large,
 * with the chip that says what kind of claim it is — and directly under it,
 * the sentence saying what is *not* implied.
 *
 * That pairing is the page's whole position, and putting it in the most
 * prominent object in the hero is deliberate. A security page that leads with
 * a badge and hides the boundary in a footnote is the one thing this page
 * exists not to be.
 *
 * ── The right card is the reference's icon grid ─────────────────────
 * Six shields in a 3 × 2 grid there; six control domains here, in the same
 * arrangement, each a real section further down the page. Two of them carry
 * the orange ring the reference uses to pick one out — identity and
 * monitoring, which are the two a security reviewer opens first.
 *
 * ── It is one row of the hero, not a section ────────────────────────
 * No `Section`, no `SectionHeader`, and it sits inside the hero's own
 * container so it shares the ground the shield is drawn on. Making it a
 * section would put a heading above three cards that are already captioned.
 */

const HAIR = "#E8E8ED";

const DOMAINS: { icon: typeof KeyRound; label: string; lit?: boolean }[] = [
  { icon: KeyRound, label: "Identity", lit: true },
  { icon: Lock, label: "Application" },
  { icon: ScrollText, label: "Data" },
  { icon: Cpu, label: "Integrations" },
  { icon: ShieldCheck, label: "Monitoring", lit: true },
  { icon: RefreshCcw, label: "Continuity" },
];

function Card({
  children,
  className,
  lift,
}: {
  children: React.ReactNode;
  className?: string;
  lift?: boolean;
}) {
  return (
    <div
      className={"flex flex-col h-full p-7 " + (className ?? "")}
      style={{
        borderRadius: 20,
        background: "#FFFFFF",
        boxShadow: lift
          ? "0 40px 80px -44px rgba(14,14,15,0.30), inset 0 0 0 1px #E8E8ED"
          : "0 20px 44px -32px rgba(14,14,15,0.18), inset 0 0 0 1px #E8E8ED",
      }}
    >
      {children}
    </div>
  );
}

export function CertGlance() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.1fr)_minmax(0,0.85fr)] gap-5 items-stretch">
      {/* what the standards do */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="lg:mt-6"
      >
        <Card>
          <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
            Standards in practice
          </span>

          <p className="mt-4 text-[19px] font-bold tracking-[-0.025em] text-carbon leading-[1.25]">
            EN 15635 shapes the workflow.
          </p>

          <p className="mt-2.5 text-[13.5px] leading-[1.65] text-graphite/60 flex-1">
            Inspection, classification, corrective action and verified closure,
            recorded against the rack it came from.
          </p>

          <p className="mt-5 text-[11.5px] leading-[1.6] text-graphite/45">
            Alignment is not accreditation.
          </p>
        </Card>
      </motion.div>

      {/* the claim, and what it is not */}
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card lift>
          <div className="flex items-center justify-between gap-4">
            <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
              Independently examined
            </span>
            <span
              className="text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange px-2.5 py-1"
              style={{ borderRadius: 999, background: "rgba(255,106,0,0.10)" }}
            >
              Public claim
            </span>
          </div>

          <p className="mt-5 text-[44px] sm:text-[52px] font-bold tracking-[-0.05em] text-carbon leading-[0.95]">
            SOC 2
          </p>
          <p className="mt-2 text-[14px] font-semibold tracking-[-0.01em] text-signal-orange">
            Type I · control design at a point in time
          </p>

          <p
            className="mt-6 pt-5 text-[12.5px] leading-[1.7] text-graphite/55 flex-1"
            style={{ borderTop: `1px solid ${HAIR}` }}
          >
            Not Type II, not ISO 27001, and not automatic regulatory compliance.
            Ask for the report period, the system boundary and the exceptions.
          </p>

          <a
            href={ask("RAMS Digital trust pack")}
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon hover:text-signal-orange transition-colors w-fit"
          >
            Request the evidence
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
          </a>
        </Card>
      </motion.div>

      {/* the six domains */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="lg:mt-6"
      >
        <Card>
          <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
            Control domains
          </span>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {DOMAINS.map((d) => (
              <div key={d.label} className="flex flex-col items-center">
                <span
                  className="flex items-center justify-center w-12 h-12"
                  style={{
                    borderRadius: 999,
                    background: d.lit ? "rgba(255,106,0,0.08)" : "#F5F5F7",
                    boxShadow: d.lit
                      ? "inset 0 0 0 1.5px rgba(255,106,0,0.45)"
                      : `inset 0 0 0 1px ${HAIR}`,
                  }}
                >
                  <d.icon
                    className={
                      "w-[18px] h-[18px] " +
                      (d.lit ? "text-signal-orange" : "text-graphite/45")
                    }
                    strokeWidth={1.9}
                    aria-hidden
                  />
                </span>
                <span className="mt-2 text-[10.5px] font-medium text-graphite/55 text-center leading-[1.3]">
                  {d.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-auto pt-5 text-[11.5px] leading-[1.6] text-graphite/45">
            Reviewed against the intended deployment.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
