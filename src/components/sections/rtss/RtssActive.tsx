"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";

/**
 * Active safety — optional.
 *
 * The argument is that nothing here is mandatory: movement and Digital Twin
 * context are the foundation, and each sensing layer above it is added only
 * where a specific risk justifies it. So the three layers are presented as
 * choices, not as a feature list.
 *
 * The response ladder and the architecture diagram are the document's, and so
 * is the caveat under the ladder — it is the load-bearing one on this page,
 * because slowing and stopping an MHE is a claim about hardware that has to be
 * qualified. It stays at full size.
 */

const LINE = "#E8E8ED";

/* ── the optional layers ─────────────────────────────────── */

const LAYERS = [
  {
    tag: "Impact",
    title: "Impact Sensor",
    body: "Detects the physical shock. RTSS supplies the location, environment, machine, operator, movement, history and evidence around it.",
    ticks: [] as string[],
    more: "",
    out: "Impact intelligence",
  },
  {
    tag: "Vision",
    title: "AI Vision",
    body: "Operates independently on the machine. Validated deployment classes include people, floor-level pallets, defined PPE and driver identity or authentication.",
    ticks: [
      "Connected to RTSS it gains MHE and operator context",
      "Location, zone and speed",
      "History, evidence and corrective workflow",
    ],
    more: "Further camera use cases can be added where separately validated for the site.",
    out: "AI Vision detects locally. RTSS connects it to the wider safety ecosystem.",
  },
  {
    tag: "Distance",
    title: "Precision Reverse Assistance",
    body: "Close-clearance awareness during reversing and tight manoeuvring — rear and side clearance, rack and upright proximity, walls and columns.",
    ticks: [] as string[],
    more: "",
    out: "Know the clearance where the margin is small.",
  },
];

/* ── product screens ─────────────────────────────────────────
   ── MEDIA ────────────────────────────────────────────────────────────
   The source marks both of these "Awaiting product screen". SHOT_SRC is a
   placeholder standing in until they arrive — the same recording the heroes
   use, which is Atlassian's "CSD-24696 Agents In Jira". Give each frame its
   own src when the real captures land; nothing else here changes.
   ───────────────────────────────────────────────────────────────────── */
const SHOT_SRC = "/Product/irds/hero.mp4";

/** Offsets into the placeholder, so the three read as different screens. */
const SHOT_AT = [0, 4, 8];

function Shot({ title, at }: { title: string; at: number }) {
  const ref = useRef<HTMLVideoElement>(null);

  /* React sets `muted` as a property rather than a reliable attribute, so a
     browser can decide the element is unmuted and refuse to autoplay it. */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const start = () => {
      try {
        if (Number.isFinite(v.duration) && v.duration > at) v.currentTime = at;
      } catch {
        /* seeking before metadata is ready — the loop lands it anyway */
      }
      v.play().catch(() => {});
    };
    start();
    v.addEventListener("loadeddata", start);
    return () => v.removeEventListener("loadeddata", start);
  }, [at]);

  return (
    <div
      className="overflow-hidden bg-white"
      style={{
        borderRadius: 14,
        border: `1px solid ${LINE}`,
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        className="flex items-center gap-2.5 px-4 h-11"
        style={{ borderBottom: `1px solid ${LINE}`, background: "#FAFAFB" }}
      >
        <span className="text-[10.5px] font-mono tracking-[0.09em] uppercase text-graphite/55">
          {title}
        </span>
      </div>
      <div className="relative aspect-video" style={{ background: "#0A0C0E" }}>
        <video
          ref={ref}
          src={SHOT_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export function RtssActive() {
  const [active, setActive] = useState(0);

  return (
    <Section surface="white" id="active">
      <SectionHeader
        eyebrow="Active safety — optional"
        top="Start with the risk."
        bottom="Add the safety layer you need."
        body="RTSS does not require every sensor. The foundation is movement and Digital Twin context; each layer above it is added because a specific risk justifies it."
        size="compact"
        width="wide"
      />

      {/* ── the optional layers, and the screen they select ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-[1180px] mx-auto items-start">
        <div className="lg:col-span-4 flex flex-col">
          {LAYERS.map((l, i) => {
            const on = i === active;
            return (
              <motion.button
                key={l.title}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
                /* No card chrome — a rule between the rows, the dot and the
                   type weight carry it, and the chevron says it opens. */
                className="group flex flex-col text-left py-5 pr-1"
                style={{
                  borderTop: i > 0 ? `1px solid ${LINE}` : undefined,
                }}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="flex flex-col min-w-0">
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden
                        className="w-2 h-2 rounded-full shrink-0 transition-colors duration-200"
                        style={{ background: on ? "#FF6A00" : "#DCDCE2" }}
                      />
                      <span className="text-[10px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
                        {l.tag}
                      </span>
                    </span>

                    <span
                      className={
                        "mt-2.5 block text-[18px] sm:text-[19px] font-bold leading-[1.2] tracking-[-0.02em] transition-colors duration-200 " +
                        (on ? "text-carbon" : "text-graphite/60")
                      }
                    >
                      {l.title}
                    </span>
                  </span>

                  <ChevronDown
                    aria-hidden
                    className={
                      "w-[18px] h-[18px] shrink-0 mt-0.5 transition-transform transition-colors duration-300 ease-out " +
                      (on
                        ? "rotate-180 text-signal-orange"
                        : "text-graphite/35 group-hover:text-graphite/70")
                    }
                    strokeWidth={2}
                  />
                </span>

                {/* Only the selected layer carries its detail — three fully
                    expanded cards in a quarter-width column would run far
                    past the screen beside them. */}
                {on && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="block"
                  >
                    <span className="mt-3 block text-[13.5px] text-graphite/65 leading-[1.65]">
                      {l.body}
                    </span>

                    {l.ticks.length > 0 && (
                      <span className="mt-4 flex flex-col gap-2.5">
                        {l.ticks.map((t) => (
                          <span key={t} className="flex items-start gap-2.5">
                            <span
                              aria-hidden
                              className="w-[18px] h-[18px] rounded-full bg-signal-orange flex items-center justify-center shrink-0 mt-px"
                            >
                              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                            </span>
                            <span className="text-[13px] text-graphite/65 leading-[1.55]">
                              {t}
                            </span>
                          </span>
                        ))}
                      </span>
                    )}

                    {l.more && (
                      <span className="mt-3 block text-[13px] text-graphite/55 leading-[1.6]">
                        {l.more}
                      </span>
                    )}

                    <span className="mt-4 block text-[11.5px] font-mono font-semibold tracking-[0.04em] text-signal-orange leading-[1.6]">
                      → {l.out}
                    </span>
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.75, ease: EASE }}
          className="lg:col-span-8 lg:sticky lg:top-24"
        >
          {/* keyed so the element remounts and the offset seek applies */}
          <Shot
            key={active}
            title={LAYERS[active].title}
            at={SHOT_AT[active]}
          />
        </motion.div>
      </div>
    </Section>
  );
}
