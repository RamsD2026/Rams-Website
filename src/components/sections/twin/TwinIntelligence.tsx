"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 06 — Intelligence.
 *
 * The transform, shown rather than claimed. A raw reading arrives as a line of
 * telemetry; the twin resolves it against the model; a conclusion comes out
 * the other side. Three examples cycle through the same three stages, so what
 * you watch is the mechanism, not one lucky case.
 *
 * The stage timings are fixed and the payloads are written down — nothing here
 * is generated, so the server and the client render the same frame.
 */

const CASES = [
  {
    key: "impact",
    raw: [
      "ts=2025-09-05T09:42:07Z",
      "dev=IMP-A3-07  type=accel",
      "peak=3.1g  axis=y  dur=118ms",
    ],
    context: [
      ["Where", "Aisle A3 · Bay C07 · upright, aisle face"],
      ["What", "Selective pallet rack, 2,400 kg / level"],
      ["Next to", "Route R2 — 196 MHE passes per shift"],
      ["History", "Third impact on this upright in 30 days"],
    ],
    meaning: "Not an impact. A turn radius.",
    detail:
      "Route R2 clips the same upright every time a loaded reach truck enters A3. The rack is the symptom; the route is the cause.",
    action: "Reroute R2 · add corner guard · re-inspect C07",
    tone: "#FF6C6C",
  },
  {
    key: "dwell",
    raw: [
      "ts=2025-09-05T10:04:19Z",
      "dev=DOCK-03  type=door_state",
      "state=open  dwell=34m  vehicle=TR-1194",
    ],
    context: [
      ["Where", "Dock 3 · inbound, west wall"],
      ["What", "Trailer TR-1194, 26 pallets booked"],
      ["Next to", "Inbound staging — 84% occupied"],
      ["History", "Dwell above 30 min on 6 of last 9 inbounds"],
    ],
    meaning: "Not a slow unload. A full staging lane.",
    detail:
      "The dock is not the constraint. Inbound staging has no room to receive, so the trailer waits with the door open.",
    action: "Clear staging before 10:15 slot · reslot outbound",
    tone: "#FFBE47",
  },
  {
    key: "speed",
    raw: [
      "ts=2025-09-05T09:38:44Z",
      "dev=MHE-04  type=velocity",
      "v=9.4km/h  limit=6.0  zone=W1",
    ],
    context: [
      ["Where", "Walkway W1 · pedestrian crossing"],
      ["What", "Reach truck MHE-04, laden, shift B"],
      ["Next to", "Battery room entrance — restricted zone"],
      ["History", "Same crossing, same 20-minute window, 4 times"],
    ],
    meaning: "Not a driver. A shift pattern.",
    detail:
      "Every breach lands in the twenty minutes before shift handover, on the only route that crosses W1 under load.",
    action: "Stagger handover · add a second laden route",
    tone: "#FF6A00",
  },
] as const;

const STAGES = ["Signal", "Context", "Meaning"] as const;
const STAGE_MS = 2300;

const POINTS = [
  {
    k: "Why context changes IoT",
    v: "A reading on its own is a number with a timestamp. The same reading placed in the building becomes an observation about a specific thing under specific conditions.",
  },
  {
    k: "Why AI needs a location",
    v: "A model that does not know where it is operating can only find patterns in the data. A model that does can find patterns in the facility.",
  },
  {
    k: "Why history matters",
    v: "One event is noise. The third event on the same upright, from the same route, at the same hour, is a cause you can act on.",
  },
];

export function TwinIntelligence() {
  const [c, setC] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => {
        if (s < STAGES.length - 1) return s + 1;
        setC((v) => (v + 1) % CASES.length);
        return 0;
      });
    }, STAGE_MS);
    return () => clearInterval(id);
  }, []);

  const k = CASES[c];

  return (
    <Section surface="white" id="intelligence">
      <SectionHeader
        eyebrow="Intelligence"
        top="Data tells you what happened."
        bottom="Context explains what it means."
        size="long"
        width="wide"
        body="Every system on your floor already produces data. The difference the twin makes is that it knows what the data is attached to — and what that thing has been through."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="overflow-hidden"
        style={{
          borderRadius: 16,
          background: "#FFFFFF",
          border: "1px solid #E4E4E9",
          boxShadow: "0 40px 90px -40px rgba(14,14,15,0.2)",
        }}
      >
        {/* stage rail */}
        <div
          className="flex items-stretch gap-px"
          style={{ background: "#ECEDF1", borderBottom: "1px solid #ECEDF1" }}
        >
          {STAGES.map((s, n) => {
            const on = stage >= n;
            return (
              <div
                key={s}
                className="flex-1 px-5 py-3.5 flex items-center gap-2.5"
                style={{ background: n === stage ? "#FFFFFF" : "#FAFAFB" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-400"
                  style={{ background: on ? "#FF6A00" : "#D6D6DC" }}
                />
                <span
                  className={
                    "text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase transition-colors duration-400 " +
                    (n === stage ? "text-carbon" : "text-graphite/40")
                  }
                >
                  0{n + 1} · {s}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          {/* the signal */}
          <div
            className="px-6 sm:px-8 py-7 sm:py-9"
            style={{ background: "#0A0C0E" }}
          >
            <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-white/35">
              Raw telemetry
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={k.key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-1.5"
              >
                {k.raw.map((l, n) => (
                  <motion.p
                    key={l}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: n * 0.08, ease: EASE }}
                    className="text-[12px] font-mono text-[#54DE91] leading-[1.7] break-all"
                  >
                    {l}
                  </motion.p>
                ))}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}>
              <p className="text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-white/35">
                Resolved against the model
              </p>
              <div className="mt-4 space-y-px">
                {k.context.map(([kk, vv], n) => (
                  <motion.div
                    key={kk}
                    initial={false}
                    animate={{
                      opacity: stage >= 1 ? 1 : 0.12,
                      x: stage >= 1 ? 0 : -6,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: stage >= 1 ? n * 0.09 : 0,
                      ease: EASE,
                    }}
                    className="py-2.5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <span className="block text-[9.5px] font-mono font-bold tracking-[0.16em] uppercase text-white/30">
                      {kk}
                    </span>
                    <span className="block mt-1 text-[12.5px] text-white/75 leading-[1.5]">
                      {vv}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* the meaning */}
          <div className="px-6 sm:px-10 py-9 sm:py-12 flex flex-col justify-center">
            <motion.div
              initial={false}
              animate={{ opacity: stage >= 2 ? 1 : 0.16 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold tracking-[0.14em] uppercase"
                style={{ color: k.tone, background: `${k.tone}1A` }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: k.tone }}
                />
                Conclusion
              </span>

              <AnimatePresence mode="wait">
                <motion.div
                  key={k.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <h3 className="mt-5 text-[26px] sm:text-[34px] font-bold leading-[1.15] tracking-[-0.03em] text-carbon">
                    {k.meaning}
                  </h3>
                  <p className="mt-4 text-[14.5px] leading-[1.65] text-graphite/65 max-w-[46ch]">
                    {k.detail}
                  </p>
                  <p className="mt-7 text-[9.5px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/40">
                    Recommended action
                  </p>
                  <p className="mt-2.5 text-[13.5px] font-semibold text-carbon leading-[1.5]">
                    {k.action}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <div className="mt-9 flex items-center gap-2">
              {CASES.map((x, n) => (
                <button
                  key={x.key}
                  type="button"
                  aria-label={`Show example ${n + 1}`}
                  onClick={() => {
                    setC(n);
                    setStage(0);
                  }}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: n === c ? 28 : 14,
                    background: n === c ? "#FF6A00" : "#E0E0E6",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div
        className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-px"
        style={{ background: "#E8E8ED" }}
      >
        {POINTS.map((p, n) => (
          <motion.div
            key={p.k}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: n * 0.08, ease: EASE }}
            className="bg-white px-7 py-8"
          >
            <h3 className="text-[10.5px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
              {p.k}
            </h3>
            <p className="mt-4 text-[14px] leading-[1.65] text-graphite/65">
              {p.v}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
