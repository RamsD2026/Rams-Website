"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, Texture } from "./dtw-shared";

const SYSTEMS = ["IRDS", "MEPS", "ATOS", "RTSS", "IMDS", "AIMS"];

export function DtwHero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: "#08080A" }}
    >
      <Texture glow="top" />

      <div className="relative rams-container pt-40 sm:pt-48 lg:pt-56 pb-24 sm:pb-28">
        <div className="max-w-[980px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
              Platform · Digital Twin
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
            className="mt-8 text-[46px] sm:text-[70px] lg:text-[88px] font-bold leading-[1.0] tracking-[-0.045em]"
          >
            The best model of your <br className="hidden sm:block" />
            warehouse is{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(120deg, #FF6A00 0%, #FF9B4D 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              your
            </span>{" "}
            warehouse.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
            className="mt-7 text-[16px] sm:text-[18px] text-white/55 leading-[1.6] max-w-[680px] mx-auto"
          >
            One live spatial model every RAMS system reads from and writes back
            to. Not a drawing of your site — a queryable replica that updates as
            the floor changes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[15px] font-semibold px-7 py-4 rounded-xl transition-transform duration-200 hover:-translate-y-0.5"
              style={{ boxShadow: "0 16px 40px -12px rgba(255,106,0,0.6)" }}
            >
              Model my warehouse
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#watch"
              className="inline-flex items-center gap-2 text-white text-[15px] font-semibold px-7 py-4 rounded-xl border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Watch it work
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14"
          >
            <div className="text-[10.5px] font-mono font-bold tracking-[0.2em] uppercase text-white/30 mb-5">
              Every system runs on it
            </div>
            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              {SYSTEMS.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
                  className="px-4 py-2 rounded-lg text-[13px] font-mono font-bold tracking-[0.08em] text-white/60"
                  style={{
                    background: "rgba(255,255,255,0.035)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
