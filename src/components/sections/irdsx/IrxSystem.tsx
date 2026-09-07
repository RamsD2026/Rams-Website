"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE } from "./irdsx-shared";

/**
 * 05 — How they connect.
 *
 * The first thing a platform page has to answer is what the platform *is*, and
 * a list of features never answers it. This is one diagram: the rack, the app
 * that works at it, the record both sides write to, and the console the
 * programme is run from — with the traffic between them moving.
 *
 * Read left to right it says: the audit happens at the rack on a phone, the
 * record is the product, and the desk configures and reads the same record.
 * Read as motion it says the two surfaces are not two products.
 *
 * Built as one fixed canvas with everything placed by coordinate, the way
 * `AimsFlow` is: the canvas is 1232 × 420, the viewBox is the canvas in CSS
 * pixels, and every clearance is a number rather than a guess.
 *
 *   0 ── 205 ····· 536 ─ 696 ····· 930 ── 1232
 *   │ app │  lanes  │ record │ lanes │ console │
 *
 * The packets are HTML, not SVG, and each one is a lane-width wrapper with the
 * pill pinned to one edge — `translateX` on a percentage is relative to the
 * element's own width, so animating the pill itself would move it by a
 * fraction of the pill rather than of the lane. Same trick as the travelling
 * chips on the Digital Twin.
 */

const LINE = "rgba(255,255,255,0.10)";
const ORANGE = "#FF6A00";
const GREEN = "#54DE91";

const H = 420;

/* Where each object sits, in canvas pixels, and the same value as a fraction
   for the elements that are positioned in %. */
const APP_R = 205;
const REC_L = 536;
const REC_R = 696;
const WEB_L = 930;
const pct = (x: number) => `${((x / 1232) * 100).toFixed(3)}%`;

/** The two rows the traffic runs on. */
const UP = 168;
const DOWN = 252;

type Lane = {
  from: number;
  to: number;
  y: number;
  dir: "r" | "l";
  tint: string;
  items: { t: string; d: number }[];
};

const LANES: Lane[] = [
  /* the floor, writing to the record */
  {
    from: APP_R,
    to: REC_L,
    y: UP,
    dir: "r",
    tint: ORANGE,
    items: [
      { t: "Observation", d: 0 },
      { t: "Photo", d: 2.6 },
      { t: "Reading", d: 5.2 },
    ],
  },
  /* the record, giving the floor its work */
  {
    from: APP_R,
    to: REC_L,
    y: DOWN,
    dir: "l",
    tint: GREEN,
    items: [
      { t: "Cycle", d: 1.3 },
      { t: "Checklist", d: 4.6 },
    ],
  },
  /* the record, answering the desk */
  {
    from: REC_R,
    to: WEB_L,
    y: UP,
    dir: "r",
    tint: ORANGE,
    items: [
      { t: "Findings", d: 0.7 },
      { t: "Results", d: 3.4 },
    ],
  },
  /* the desk, configuring the record */
  {
    from: REC_R,
    to: WEB_L,
    y: DOWN,
    dir: "l",
    tint: GREEN,
    items: [
      { t: "Rules", d: 2.1 },
      { t: "Schedule", d: 5.0 },
    ],
  },
];

const FLOW = 7.8;

function Packet({
  label,
  tint,
  dir,
  delay,
}: {
  label: string;
  tint: string;
  dir: "r" | "l";
  delay: number;
}) {
  return (
    <div
      className={"absolute inset-0 " + (dir === "r" ? "irx-r" : "irx-l")}
      style={{ animationDelay: `${delay}s` }}
    >
      <span
        className={
          "absolute top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full pl-1.5 pr-2.5 py-1 whitespace-nowrap " +
          (dir === "r" ? "left-0" : "right-0")
        }
        style={{
          background: "#0C0C0F",
          border: `1px solid ${tint}59`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: tint }}
        />
        <span
          className="text-[9.5px] font-mono font-bold uppercase tracking-[0.08em]"
          style={{ color: tint }}
        >
          {label}
        </span>
      </span>
    </div>
  );
}

/** The tablet, drawn — the audit surface. Landscape, two panes. */
function AppGlyph() {
  return (
    <div
      className="overflow-hidden"
      style={{
        width: 232,
        borderRadius: 14,
        padding: 8,
        background: "#141418",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 40px 80px -40px rgba(0,0,0,0.9)",
      }}
    >
      <div
        className="flex overflow-hidden"
        style={{ aspectRatio: "4 / 3", borderRadius: 8, background: "#08080A" }}
      >
        {/* the scope pane */}
        <div
          className="w-[36%] shrink-0 p-1.5 flex flex-col gap-1"
          style={{ borderRight: `1px solid ${LINE}`, background: "#0C0C10" }}
        >
          {["Row A3", "Bay 024", "Level 2", "U-024-03"].map((x, i) => (
            <span
              key={x}
              className="px-1 rounded-[3px] text-[6px] font-mono truncate"
              style={{
                height: 13,
                lineHeight: "13px",
                marginLeft: i * 3,
                background: i === 3 ? "rgba(255,106,0,0.14)" : "transparent",
                color:
                  i === 3 ? "#FF9B4D" : "rgba(255,255,255,0.35)",
              }}
            >
              {x}
            </span>
          ))}
        </div>

        {/* the work pane */}
        <div className="flex-1 min-w-0 p-1.5 flex flex-col gap-1">
          {[
            ["Upright plumb", "#54DE91"],
            ["Baseplate", "#E8A33D"],
            ["Impact damage", "#FF6C6C"],
          ].map(([x, tint], i) => (
            <motion.span
              key={x}
              className="flex items-center gap-1 px-1.5 rounded-[3px]"
              style={{
                height: 15,
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${tint}44`,
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.1,
              }}
            >
              <span
                className="w-1 h-1 rounded-full shrink-0"
                style={{ background: tint }}
              />
              <span className="text-[6px] text-white/60 truncate">{x}</span>
            </motion.span>
          ))}
          <span
            className="mt-auto flex items-center justify-center rounded-[3px] text-[6px] font-bold"
            style={{ height: 14, background: ORANGE, color: "#0A0A0A" }}
          >
            Capture
          </span>
        </div>
      </div>
    </div>
  );
}

/** The console, drawn — the programme surface. */
function WebGlyph() {
  return (
    <div
      className="overflow-hidden"
      style={{
        width: 292,
        borderRadius: 12,
        background: "#0E0E11",
        border: `1px solid ${LINE}`,
        boxShadow: "0 40px 80px -40px rgba(0,0,0,0.9)",
      }}
    >
      <div
        className="flex items-center gap-1.5 px-3 h-7"
        style={{ borderBottom: `1px solid ${LINE}`, background: "#111114" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.14)" }}
          />
        ))}
        <span className="ml-2 text-[7.5px] font-mono text-white/30 truncate">
          app.rams.digital/irds
        </span>
      </div>

      <div className="p-2.5 grid grid-cols-3 gap-1.5">
        {["Cycles", "Findings", "Testing", "Issues", "Reports", "Analytics"].map(
          (x, i) => (
            <motion.span
              key={x}
              className="px-1.5 py-2 rounded-[6px] text-[7.5px] font-mono font-bold tracking-[0.04em] text-center truncate"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${LINE}`,
                color: "rgba(255,255,255,0.55)",
              }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            >
              {x}
            </motion.span>
          ),
        )}
      </div>
    </div>
  );
}

/** The record — the product. Everything else is a way into this. */
function RecordGlyph() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 152, height: 152 }}>
      <span
        aria-hidden
        className="absolute rounded-full"
        style={{
          inset: "-24%",
          background:
            "radial-gradient(closest-side, rgba(255,106,0,0.20), transparent 72%)",
        }}
      />
      {[152, 126].map((d, i) => (
        <motion.span
          key={d}
          aria-hidden
          className="absolute rounded-full"
          style={{
            width: d,
            height: d,
            border: "1px solid rgba(255,106,0,0.20)",
          }}
          animate={{ opacity: [0.8, 0.3, 0.8] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.4,
          }}
        />
      ))}

      <div
        className="relative rounded-full flex flex-col items-center justify-center"
        style={{
          width: 104,
          height: 104,
          background: "#0C0C0F",
          border: "1px solid rgba(255,106,0,0.36)",
          boxShadow: "inset 0 0 30px -12px rgba(255,106,0,0.6)",
        }}
      >
        <motion.svg
          viewBox="0 0 24 22"
          className="w-[30px] h-auto"
          aria-hidden
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M3 1v20M12 1v20M21 1v20M3 8h18M3 15h18"
            stroke={ORANGE}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </motion.svg>
        <span className="mt-1.5 text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-white/70">
          Record
        </span>
      </div>
    </div>
  );
}

function Caption({
  x,
  title,
  sub,
}: {
  x: string;
  title: string;
  sub: string;
}) {
  return (
    <div
      className="absolute text-center -translate-x-1/2 w-[190px]"
      style={{ left: x, top: 344 }}
    >
      <p className="text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
        {title}
      </p>
      <p className="mt-2 text-[12px] leading-[1.5] text-white/40">{sub}</p>
    </div>
  );
}

export function IrxSystem() {
  return (
    <Section surface="offWhite" id="link">
      <style>{`
        @keyframes irx-r {
          0%   { transform: translateX(0);    opacity: 0; }
          10%  { opacity: 1; }
          72%  { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        @keyframes irx-l {
          0%   { transform: translateX(0);     opacity: 0; }
          10%  { opacity: 1; }
          72%  { opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        .irx-r { animation: irx-r ${FLOW}s cubic-bezier(0.4,0,0.5,1) infinite both; }
        .irx-l { animation: irx-l ${FLOW}s cubic-bezier(0.4,0,0.5,1) infinite both; }
        @media (prefers-reduced-motion: reduce) {
          .irx-r, .irx-l { animation: none; opacity: 1; }
        }
      `}</style>

      <SectionHeader
        eyebrow="How they connect"
        top="Two products,"
        bottom="One record between them."
        size="compact"
        width="wide"
        body="Neither product holds a copy of its own. The app writes observations, photographs and readings into the record; the console writes the structure, the rules and the schedule into it, and reads the findings and results back out."
      />

      {/* ── the canvas ───────────────────────────────────
          The section is white so the page keeps alternating, but the diagram
          keeps a dark ground: three dark objects and two lit lanes do not read
          on paper. So the drawing is an inset panel rather than a surface. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden"
        style={{
          borderRadius: 20,
          background:
            "radial-gradient(70% 90% at 50% 8%, rgba(255,106,0,0.14) 0%, transparent 60%)," +
            "linear-gradient(160deg, #17171C 0%, #0C0C0F 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
      <div
        className="relative hidden lg:block w-full"
        style={{ height: H }}
        aria-hidden
      >
        {/* the rails */}
        <svg
          viewBox={`0 0 1232 ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {LANES.map((l, i) => (
            <line
              key={i}
              x1={l.from}
              x2={l.to}
              y1={l.y}
              y2={l.y}
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1"
              strokeDasharray="4 7"
            />
          ))}
        </svg>

        {/* the traffic */}
        {LANES.map((l, i) => (
          <div
            key={i}
            className="absolute overflow-hidden"
            style={{
              left: pct(l.from),
              width: pct(l.to - l.from),
              top: l.y - 14,
              height: 28,
            }}
          >
            {l.items.map((it) => (
              <Packet
                key={it.t}
                label={it.t}
                tint={l.tint}
                dir={l.dir}
                delay={it.d}
              />
            ))}
          </div>
        ))}

        {/* the three objects */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(150), top: 210 }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <AppGlyph />
        </motion.div>

        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-[2]"
          style={{ left: pct(616), top: 210 }}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <RecordGlyph />
        </motion.div>

        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(1080), top: 210 }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.18, ease: EASE }}
        >
          <WebGlyph />
        </motion.div>

        <Caption
          x={pct(150)}
          title="Field app · tablet"
          sub="At the rack. Captures the audit."
        />
        <Caption
          x={pct(616)}
          title="The record"
          sub="One per rack, for its whole life."
        />
        <Caption
          x={pct(1080)}
          title="Web console"
          sub="At the desk. Runs the programme."
        />
      </div>

      {/* Below lg the diagram stacks — a 1232-wide system drawing on a phone
          would point lanes at objects no longer beside each other. */}
      <div className="lg:hidden flex flex-col items-center gap-8 py-14 px-6">
        <AppGlyph />
        <span className="text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
          Field app · tablet, at the rack
        </span>
        <RecordGlyph />
        <span className="text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
          One record
        </span>
        <WebGlyph />
        <span className="text-[10.5px] font-mono font-bold tracking-[0.16em] uppercase text-signal-orange">
          Web console · at the desk
        </span>
      </div>
      </motion.div>
    </Section>
  );
}
