"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

/* ─────────────────────────────────────────
   Cinematic reveal — video breathes first,
   then content orchestrates in with stagger
───────────────────────────────────────── */
function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.8,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  };
}

const BASE = "https://www.rams.digital/assets/rack-audit";

const CLIENTS = [
  { name: "Bosch",         logo: `${BASE}/bosch.svg` },
  { name: "Maersk",        logo: `${BASE}/maersk.svg` },
  { name: "Coca-Cola",     logo: `${BASE}/Coca-Cola_logo logo.svg` },
  { name: "Volvo",         logo: `${BASE}/volvo.svg` },
  { name: "ABB",           logo: `${BASE}/abb.svg` },
  { name: "Continental",   logo: `${BASE}/continental.svg` },
  { name: "Siemens",       logo: `${BASE}/logo2.svg` },
  { name: "Caterpillar",   logo: `${BASE}/Caterpillar-Logo.svg` },
  { name: "JCB",           logo: `${BASE}/JCB1.svg` },
  { name: "Nestlé",        logo: `${BASE}/Nestle.svg` },
  { name: "Flipkart",      logo: `${BASE}/Flipkart1.svg` },
  { name: "Saint-Gobain",  logo: `${BASE}/saintgobain.svg` },
  { name: "Ferrero",       logo: `${BASE}/Ferrero1.svg` },
  { name: "Grundfos",      logo: `${BASE}/grundfos.svg` },
  { name: "Rhenus",        logo: `${BASE}/rhenus.svg` },
  { name: "GKN",           logo: `${BASE}/GKN1.svg` },
  { name: "Garrett",       logo: `${BASE}/Garrett1.svg` },
  { name: "Aditya Birla",  logo: `${BASE}/adityabirla.svg` },
  { name: "Exide",         logo: `${BASE}/exide.svg` },
  { name: "GMR",           logo: `${BASE}/GMR1.svg` },
];

const TRACK = [...CLIENTS, ...CLIENTS];

export function HeroV2() {
  return (
    <section className="relative h-screen min-h-[640px] max-h-[960px] flex items-center justify-center overflow-hidden">

      {/* ── Video — loads immediately, full bleed ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/download.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* ── Overlay — uniform dark wash, heavier top + bottom ── */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#0E0E0F]/55" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#0E0E0F]/60 via-transparent to-[#0E0E0F]/70" />

      {/* ── Hero content — centered, editorial ── */}
      <div className="relative z-10 w-full">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 flex flex-col items-center text-center">

        {/* 1 — Badge · delay 0.7s */}
        <motion.p
          {...reveal(0.7)}
          className="mb-5 sm:mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 sm:px-4 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-white/55 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" aria-hidden="true" />
          Warehouse Operational Intelligence
        </motion.p>

        {/* 2 — Headline · delay 0.95s */}
        <motion.h1
          {...reveal(0.95)}
          className="text-[40px] sm:text-[54px] md:text-[72px] lg:text-[88px] font-bold text-white leading-[1.02]"
        >
          Clarity
          <br />
          <span className="text-[#FF6A00]">in Motion.</span>
        </motion.h1>

        {/* 3 — Supporting copy · delay 1.25s */}
        <motion.p
          {...reveal(1.25)}
          className="mt-5 sm:mt-7 text-[14px] sm:text-[16px] md:text-[18px] text-white/50 leading-relaxed font-normal max-w-[520px] tracking-wide"
        >
          Real-time visibility across every rack, vehicle, and workflow —
          so your warehouse executes with precision, not guesswork.
        </motion.p>

        {/* 4 + 5 — CTAs · delay 1.5s */}
        <motion.div
          {...reveal(1.5)}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/book-demo"
            className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00] hover:bg-[#E55F00] px-8 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 shadow-lg shadow-[#FF6A00]/25 hover:shadow-[#FF6A00]/40 hover:-translate-y-px active:translate-y-0"
          >
            Book a Demo
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>

          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-8 py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-px active:translate-y-0"
          >
            Find Your Starting Point
          </Link>
        </motion.div>

        {/* 6 — Watch demo · delay 1.7s */}
        <motion.div {...reveal(1.7)} className="mt-8">
          <button
            type="button"
            className="group inline-flex items-center gap-3 text-[13px] font-medium text-white/35 hover:text-white/65 transition-colors duration-300"
            aria-label="Watch platform overview video"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 group-hover:border-white/35 group-hover:bg-white/5 transition-all duration-300">
              <Play className="w-3 h-3 fill-current ml-0.5" aria-hidden="true" />
            </span>
            Watch platform overview
          </button>
        </motion.div>

      </div>
      </div>

      {/* ── Trust bar · delay 1.9s ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.9, ease: [0.22, 1, 0.36, 1] as const }}
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/8 bg-[#0E0E0F]/60 backdrop-blur-md"
      >
        <div className="max-w-[1280px] mx-auto flex items-center h-16 w-full">
          <div className="hidden sm:flex shrink-0 items-center gap-4 pl-6 sm:pl-8 pr-4 sm:pr-6">
            <span className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-white/25 whitespace-nowrap">
              Trusted by
            </span>
            <div className="w-px h-5 bg-white/10" aria-hidden="true" />
          </div>

          <div className="flex-1 overflow-hidden relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10"
              style={{ background: "linear-gradient(to right, rgba(14,14,15,0.6), transparent)" }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10"
              style={{ background: "linear-gradient(to left, rgba(14,14,15,0.6), transparent)" }}
            />
            <div
              className="flex items-center gap-12 animate-marquee-v2"
              aria-label="Client logos"
              role="list"
            >
              {TRACK.map((client, i) => (
                <div
                  key={`${client.name}-${i}`}
                  role="listitem"
                  className="shrink-0 flex items-center justify-center"
                  title={client.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-5 w-auto max-w-[90px] object-contain brightness-0 invert opacity-30 hover:opacity-60 transition-opacity duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex shrink-0 pl-6 pr-6 sm:pr-8 border-l border-white/8 flex-col items-end">
            <span className="text-[16px] font-bold text-white leading-none">50+</span>
            <span className="text-[10px] text-white/25 font-medium mt-0.5 whitespace-nowrap">clients worldwide</span>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes marquee-v2 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-v2 {
          animation: marquee-v2 40s linear infinite;
          width: max-content;
        }
        .animate-marquee-v2:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
