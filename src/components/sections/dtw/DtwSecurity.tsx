"use client";

import { motion } from "framer-motion";
import { EASE, Kicker } from "./dtw-shared";

const POINTS = [
  {
    title: "Your model, your data",
    body: "The twin holds your site's structure and operating history. It is not pooled, sold or used to build models for anyone else.",
  },
  {
    title: "Role-scoped access",
    body: "Sites, zones and record types are permissioned, so contractors and site teams see only what their role requires.",
  },
  {
    title: "Every change auditable",
    body: "Structure edits, condition changes and integrations write an audit entry — who changed what, when, and from which system.",
  },
];

const LOG = [
  { t: "12:04:18", who: "svc:scan", act: "bind PLT-2048 → A-04-12-3", s: "ok" },
  { t: "12:03:57", who: "usr:a.pawar", act: "condition U-B18 → amber", s: "ok" },
  { t: "12:02:44", who: "svc:wms", act: "sync 1,204 stock records", s: "ok" },
  { t: "12:01:12", who: "usr:r.kulkarni", act: "edit Zone C layout", s: "warn" },
  { t: "11:58:30", who: "svc:api", act: "export network snapshot", s: "ok" },
  { t: "11:54:07", who: "usr:contractor", act: "read Zone A · denied", s: "deny" },
];

const TONE = {
  ok: "#2BCB74",
  warn: "#FFB020",
  deny: "#FF6C6C",
} as const;

export function DtwSecurity() {
  return (
    <section
      className="relative text-white border-t border-white/[0.07]"
      style={{ background: "#08080A" }}
    >
      <div className="rams-container py-28 sm:py-36">
        <div className="max-w-[820px] mb-14 sm:mb-16">
          <Kicker>Governance</Kicker>
          <h2 className="mt-5 text-[36px] sm:text-[52px] lg:text-[62px] font-bold leading-[1.04] tracking-[-0.04em]">
            Your warehouse data <br />
            <span className="text-white/40">stays your warehouse data.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 lg:gap-10 items-start">
          <div className="flex flex-col gap-3">
            {POINTS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="px-6 py-6"
                style={{
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <h3 className="text-[16px] font-semibold tracking-[-0.01em]">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] text-white/50 leading-[1.65]">
                  {p.body}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="overflow-hidden"
            style={{
              borderRadius: 18,
              background: "linear-gradient(180deg, #101013 0%, #0A0A0C 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
              <Kicker tone="muted">Audit log</Kicker>
              <span className="text-[10.5px] font-mono text-white/30">
                last 10 min
              </span>
            </div>

            <div className="p-4 flex flex-col gap-1.5">
              {LOG.map((r, i) => (
                <motion.div
                  key={r.t}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.055)",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: TONE[r.s as keyof typeof TONE] }}
                  />
                  <span className="text-[10.5px] font-mono text-white/30 tabular-nums shrink-0">
                    {r.t}
                  </span>
                  <span className="text-[10.5px] font-mono text-white/45 shrink-0 w-[92px] truncate">
                    {r.who}
                  </span>
                  <span className="text-[12.5px] text-white/70 truncate">
                    {r.act}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
