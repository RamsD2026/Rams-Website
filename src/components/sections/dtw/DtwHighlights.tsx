"use client";

import { motion } from "framer-motion";
import { EASE, Kicker } from "./dtw-shared";

/* Three full-bleed feature highlights, each with its own visual —
   the "sticky scroll highlight" rhythm from modern platform pages. */

export function DtwHighlights() {
  return (
    <section
      className="relative text-white border-t border-white/[0.07]"
      style={{ background: "#08080A" }}
    >
      <Highlight
        kicker="Time travel"
        title="Rewind any location to any day"
        body="State is versioned, never overwritten. Ask what a bay held on 14 March, what condition its uprights were in, and which vehicle touched it last."
        visual={<TimelineVisual />}
      />
      <Highlight
        kicker="Scenarios"
        title="Test the change before you make it"
        body="Model a slotting or layout change against the real site and compare it against how the floor runs today — before a single pallet moves."
        visual={<ScenarioVisual />}
        flip
      />
      <Highlight
        kicker="Multi-site"
        title="Every warehouse, modelled the same way"
        body="One schema across the network means rack health, utilisation and accuracy compare like for like, without each site inventing its own naming."
        visual={<SitesVisual />}
      />
    </section>
  );
}

function Highlight({
  kicker,
  title,
  body,
  visual,
  flip,
}: {
  kicker: string;
  title: string;
  body: string;
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="rams-container py-20 sm:py-28 border-b border-white/[0.07] last:border-b-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className={flip ? "lg:order-2" : ""}
        >
          <Kicker>{kicker}</Kicker>
          <h3 className="mt-5 text-[30px] sm:text-[42px] font-bold leading-[1.1] tracking-[-0.035em]">
            {title}
          </h3>
          <p className="mt-5 text-[15px] text-white/55 leading-[1.7] max-w-[460px]">
            {body}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          className={flip ? "lg:order-1" : ""}
        >
          <div
            className="relative overflow-hidden p-6 sm:p-8"
            style={{
              borderRadius: 20,
              background: "linear-gradient(180deg, #101013 0%, #0A0A0C 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 50px 100px -50px rgba(0,0,0,0.9)",
              minHeight: 320,
            }}
          >
            {visual}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── visuals ─────────────────────────────────────────────── */

function TimelineVisual() {
  const marks = ["Mar", "Apr", "May", "Jun", "Jul"];
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <span className="text-[13px] font-semibold">Bay A-04-12</span>
        <span className="text-[11px] font-mono text-white/40">14 Jun 2026</span>
      </div>

      <div className="relative h-[6px] rounded-full mb-10" style={{ background: "rgba(255,255,255,0.09)" }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-signal-orange"
          initial={{ width: 0 }}
          whileInView={{ width: "68%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
        />
        <motion.span
          className="absolute -top-[6px] w-[18px] h-[18px] rounded-full"
          style={{ background: "#0A0A0C", border: "2px solid #FF6A00" }}
          initial={{ left: "0%" }}
          whileInView={{ left: "68%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
        />
        <div className="absolute -bottom-6 inset-x-0 flex justify-between">
          {marks.map((m) => (
            <span key={m} className="text-[10px] font-mono text-white/30">
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          { k: "Stored", v: "PLT-4471" },
          { k: "Condition", v: "Green" },
          { k: "Last inspected", v: "12 Jun" },
          { k: "Moves", v: "34" },
        ].map((r) => (
          <div
            key={r.k}
            className="px-4 py-3.5 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase text-white/35">
              {r.k}
            </div>
            <div className="mt-1.5 text-[15px] font-bold">{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScenarioVisual() {
  const rows = [
    { l: "Travel distance", now: 100, next: 64 },
    { l: "Touches per pallet", now: 100, next: 78 },
    { l: "Pick face coverage", now: 62, next: 91 },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <span className="text-[13px] font-semibold">Slotting scenario</span>
        <span
          className="text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase px-2 py-1 rounded"
          style={{ background: "rgba(255,106,0,0.14)", color: "#FF9B4D" }}
        >
          Draft
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {rows.map((r, i) => (
          <div key={r.l}>
            <div className="flex justify-between mb-2.5">
              <span className="text-[12.5px] text-white/65">{r.l}</span>
              <span className="text-[12.5px] font-bold text-signal-orange tabular-nums">
                {r.next > r.now ? "+" : ""}
                {r.next - r.now}%
              </span>
            </div>
            <div className="h-[7px] rounded-full mb-1.5" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full rounded-full" style={{ width: r.now + "%", background: "rgba(255,255,255,0.26)" }} />
            </div>
            <div className="h-[7px] rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-full rounded-full bg-signal-orange"
                initial={{ width: 0 }}
                whileInView={{ width: r.next + "%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, delay: 0.1 + i * 0.1, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SitesVisual() {
  const sites = [
    { n: "Pune DC", health: 91, locs: "18,420" },
    { n: "Chennai", health: 84, locs: "12,110" },
    { n: "Bhiwandi", health: 77, locs: "22,640" },
    { n: "Hosur", health: 95, locs: "8,980" },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <span className="text-[13px] font-semibold">Network</span>
        <span className="text-[11px] font-mono text-white/40">4 sites</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {sites.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="px-4 py-4 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[13px] font-semibold">{s.n}</span>
              <span className="text-[10.5px] font-mono text-white/35 tabular-nums">
                {s.locs} locations
              </span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-full rounded-full bg-signal-orange"
                initial={{ width: 0 }}
                whileInView={{ width: s.health + "%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.08, ease: EASE }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
