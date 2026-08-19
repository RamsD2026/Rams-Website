"use client";

import { motion } from "framer-motion";
import { AlertOctagon, AlertTriangle, CheckCircle2, type LucideIcon } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const VIEWS = [
  {
    label: "Management view",
    body: "risk by site, row and rack element.",
  },
  {
    label: "Operations view",
    body: "what needs action and where.",
  },
  {
    label: "Engineering view",
    body: "finding history, evidence and verification.",
  },
];

const RISKS: {
  tone: "red" | "amber" | "green";
  label: string;
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    tone: "red",
    label: "RED",
    title: "Immediate high-priority action",
    body: "Critical damage or unsafe condition requiring immediate control, isolation or replacement as applicable.",
    icon: AlertOctagon,
  },
  {
    tone: "amber",
    label: "AMBER",
    title: "Planned corrective action",
    body: "Damage requiring timely corrective action and controlled monitoring until rectification is completed.",
    icon: AlertTriangle,
  },
  {
    tone: "green",
    label: "GREEN",
    title: "Observe and monitor",
    body: "Minor condition recorded for continued observation, trending and future inspection comparison.",
    icon: CheckCircle2,
  },
];

const TONE: Record<
  "red" | "amber" | "green",
  { bg: string; color: string; border: string; ring: string }
> = {
  red: {
    bg: "rgba(200,50,50,0.08)",
    color: "#B0322F",
    border: "rgba(200,50,50,0.22)",
    ring: "rgba(200,50,50,0.14)",
  },
  amber: {
    bg: "rgba(214,140,20,0.08)",
    color: "#B7770F",
    border: "rgba(214,140,20,0.22)",
    ring: "rgba(214,140,20,0.14)",
  },
  green: {
    bg: "rgba(43,168,96,0.08)",
    color: "#1F8A4E",
    border: "rgba(43,168,96,0.22)",
    ring: "rgba(43,168,96,0.14)",
  },
};

export function IrdsRackHealth() {
  return (
    <section
      className="relative overflow-hidden pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44"
      style={{ background: "#F5F5F7" }}
      aria-label="Rack health risk classification"
    >
      <style>{`
        @property --irdsrh-shine-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .irdsrh-card { position: relative; isolation: isolate; transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s cubic-bezier(0.22,1,0.36,1); }
        .irdsrh-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: conic-gradient(from var(--irdsrh-shine-angle), transparent 0deg, rgba(255,106,0,0.35) 60deg, transparent 120deg);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .irdsrh-card:hover { transform: translateY(-2px); box-shadow: 0 22px 60px -30px rgba(15,15,20,0.18); }
        .irdsrh-card:hover::before { opacity: 1; animation: irdsrh-spin 3.6s linear infinite; }
        @keyframes irdsrh-spin { to { --irdsrh-shine-angle: 360deg; } }
      `}</style>

      <div className="rams-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-16 items-start">
          {/* Copy panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease: EASE }}
            className="lg:col-span-5"
          >
            <p className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5">
              Rack Health Classification
            </p>
            <h2 className="text-[36px] sm:text-[46px] lg:text-[56px] font-bold text-carbon leading-[1.05] tracking-[-0.035em]">
              A shared language
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(180deg, rgba(14,14,15,0.75) 0%, rgba(14,14,15,0.45) 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                for rack risk.
              </span>
            </h2>
            <p className="mt-6 text-[15px] sm:text-[16px] text-graphite/65 leading-[1.65] max-w-[440px]">
              Make rack condition understandable at a glance while preserving
              the detailed evidence behind every finding — using a
              consistent RED · AMBER · GREEN framework across every site.
            </p>

            <div className="mt-10 space-y-4 pt-8 border-t border-black/[0.08]">
              {VIEWS.map((v, i) => (
                <motion.p
                  key={v.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: EASE }}
                  className="text-[14px] text-graphite/75 leading-[1.55]"
                >
                  <b className="text-carbon font-bold">{v.label}:</b> {v.body}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* RAG cards */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {RISKS.map((r, i) => {
              const s = TONE[r.tone];
              const Icon = r.icon;
              return (
                <motion.article
                  key={r.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
                  className="irdsrh-card bg-white rounded-[12px] p-6 sm:p-7"
                  style={{
                    border: "1px solid #E8E8ED",
                    boxShadow:
                      "0 1px 2px rgba(15,15,20,0.04), 0 8px 24px -12px rgba(15,15,20,0.06)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-[8px]"
                      style={{
                        background: s.bg,
                        color: s.color,
                        boxShadow: `inset 0 0 0 1px ${s.border}`,
                      }}
                    >
                      <Icon className="w-4 h-4" strokeWidth={2.25} aria-hidden />
                    </span>
                    <span
                      className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase"
                      style={{ color: s.color }}
                    >
                      {r.label}
                    </span>
                    <span
                      className="ml-auto text-[10px] font-mono font-semibold tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
                      style={{
                        background: s.ring,
                        color: s.color,
                      }}
                    >
                      Priority {i + 1}
                    </span>
                  </div>

                  <h3 className="text-[18px] sm:text-[20px] font-bold text-carbon leading-[1.25] tracking-[-0.015em]">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-[14px] text-graphite/65 leading-[1.6]">
                    {r.body}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
