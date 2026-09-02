"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { RiqClients } from "@/components/sections/rackiq/RiqClients";

/**
 * Digital Twin hero.
 *
 * The MEPS / RTSS / IMDS skeleton: centred pill eyebrow, the "Powered by X —"
 * line, the h1 at page-hero scale, centred subline, two CTAs, the product full
 * width beneath, then the client strip.
 *
 * The one departure is what sits in the product frame. Every other platform
 * page puts a recording there; this page claims a structured model of the
 * facility exists, so the frame holds the model itself, built from the plan's
 * own coordinates. It is the product screen, not an illustration of one.
 */

const LINE = "rgba(255,255,255,0.10)";

const TwinScene = dynamic(() => import("./TwinScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full" aria-hidden />,
});

const CHAIN = ["Model", "Connect", "Operate in context"];

export function TwinHero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ background: SURFACE.darkTop }}
      id="top"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.22), transparent 70%)",
        }}
      />
      <BackgroundBeams className="opacity-[0.5]" />

      <div className="relative rams-container pt-36 sm:pt-44 lg:pt-48 pb-20 sm:pb-24 lg:pb-28">
        <div className="max-w-[1180px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-white/70">
              Platform foundation
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: EASE }}
            className="mt-6 text-[12.5px] sm:text-[14px] text-white/50"
          >
            Powered by{" "}
            <span className="font-semibold text-white/80">Digital Twin</span>
            <span className="mx-2 text-white/25">—</span>a structured model of
            the facility
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.14, ease: EASE }}
            className="mt-8 sm:mt-10 text-[34px] sm:text-[64px] lg:text-[96px] font-bold leading-[1.0] tracking-[-0.045em]"
          >
            <span className="block text-white">The next operating</span>
            <span className="block text-white">system will understand</span>
            <span
              className="block"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              The physical world.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-7 text-[14px] sm:text-[16px] text-white/60 leading-[1.55] max-w-[1120px] mx-auto"
          >
            Your ERP knows what was purchased. Your WMS knows what was recorded.
            Your MES knows what was produced. None of them know what is actually
            happening on the floor — where, to what, next to what, and why it
            matters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
            className="mt-9 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link
              href="/book-a-demo"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              Request a demo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#create"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              See how it is created
            </Link>
          </motion.div>
        </div>

        {/* ── the product ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="mt-16 sm:mt-20 max-w-[1180px] mx-auto overflow-hidden"
          style={{
            borderRadius: 16,
            background: "#0E0E11",
            border: `1px solid ${LINE}`,
            boxShadow: "0 60px 120px -50px rgba(0,0,0,0.9)",
          }}
        >
          <div
            className="flex items-center gap-2.5 px-4 h-11 flex-wrap"
            style={{ borderBottom: `1px solid ${LINE}`, background: "#111114" }}
          >
            <span className="relative flex w-2 h-2 shrink-0">
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: "#54DE91" }}
                animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <span
                className="relative w-2 h-2 rounded-full"
                style={{ background: "#54DE91" }}
              />
            </span>
            <span className="text-[11.5px] font-semibold text-white/85">
              Digital Twin — Warehouse 01
            </span>
            <span className="ml-auto text-[10px] font-mono font-semibold tracking-[0.12em] uppercase text-signal-orange">
              Live model
            </span>
          </div>

          <div
            className="h-[300px] sm:h-[400px] lg:h-[480px]"
            style={{ background: "#0A0C0E" }}
          >
            <TwinScene />
          </div>

          <div
            className="flex items-center gap-4 px-4 py-3 flex-wrap"
            style={{ borderTop: `1px solid ${LINE}` }}
          >
            <span className="flex items-center gap-2.5 flex-wrap">
              {CHAIN.map((c, i) => (
                <span key={c} className="flex items-center gap-2.5">
                  {i > 0 && (
                    <span aria-hidden className="text-white/20 text-[11px]">
                      →
                    </span>
                  )}
                  <span className="text-[10px] font-mono font-semibold tracking-[0.14em] uppercase text-white/45">
                    {c}
                  </span>
                </span>
              ))}
            </span>
            <span className="ml-auto text-[11.5px] text-white/40">
              The Digital Twin is that missing layer — a model every sensor,
              camera, machine and application can resolve back into.
            </span>
          </div>
        </motion.div>

        <RiqClients />
      </div>
    </section>
  );
}
