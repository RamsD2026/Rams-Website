"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Texture } from "./dtw-shared";

const SYSTEMS = ["IRDS", "MEPS", "ATOS", "RTSS", "IMDS", "AIMS"];

export function DtwCTA() {
  return (
    <section
      className="relative overflow-hidden text-white border-t border-white/[0.07]"
      style={{ background: "#08080A" }}
    >
      <Texture glow="bottom" />

      <div className="relative rams-container py-28 sm:py-36 lg:py-44">
        <div className="max-w-[900px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
              Map it once. Use it everywhere.
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
            className="mt-8 text-[38px] sm:text-[58px] lg:text-[70px] font-bold leading-[1.02] tracking-[-0.042em]"
          >
            Put your warehouse <br />
            <span
              style={{
                background: "linear-gradient(120deg, #FF6A00 0%, #FF9B4D 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              on the record.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.14, ease: EASE }}
            className="mt-7 text-[16px] text-white/55 leading-[1.65] max-w-[600px] mx-auto"
          >
            We survey the site, build the model and connect it to the systems
            your teams already use — then every RAMS product runs on top of it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.22, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[15px] font-semibold px-8 py-4 rounded-xl transition-transform duration-200 hover:-translate-y-0.5"
              style={{ boxShadow: "0 16px 40px -12px rgba(255,106,0,0.6)" }}
            >
              Model my warehouse
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-white text-[15px] font-semibold px-8 py-4 rounded-xl border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Talk to sales
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-14 flex items-center justify-center gap-2 flex-wrap"
          >
            {SYSTEMS.map((s) => (
              <span
                key={s}
                className="px-3.5 py-2 rounded-lg text-[12px] font-mono font-bold tracking-[0.08em] text-white/45"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {s}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
