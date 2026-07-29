"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

const BASE = "https://www.rams.digital/assets/rack-audit";

/* Representative selection — recognisable global brands from the full 50-client list */
const CLIENTS = [
  { name: "Bosch",          logo: `${BASE}/bosch.svg` },
  { name: "Maersk",         logo: `${BASE}/maersk.svg` },
  { name: "Coca-Cola",      logo: `${BASE}/Coca-Cola_logo logo.svg` },
  { name: "Volvo",          logo: `${BASE}/volvo.svg` },
  { name: "ABB",            logo: `${BASE}/abb.svg` },
  { name: "Continental",    logo: `${BASE}/continental.svg` },
  { name: "Siemens",        logo: `${BASE}/logo2.svg` },
  { name: "Caterpillar",    logo: `${BASE}/Caterpillar-Logo.svg` },
  { name: "JCB",            logo: `${BASE}/JCB1.svg` },
  { name: "Nestlé",         logo: `${BASE}/Nestle.svg` },
  { name: "Flipkart",       logo: `${BASE}/Flipkart1.svg` },
  { name: "Saint-Gobain",   logo: `${BASE}/saintgobain.svg` },
  { name: "Ferrero",        logo: `${BASE}/Ferrero1.svg` },
  { name: "Grundfos",       logo: `${BASE}/grundfos.svg` },
  { name: "Rhenus",         logo: `${BASE}/rhenus.svg` },
  { name: "GKN",            logo: `${BASE}/GKN1.svg` },
  { name: "Garrett",        logo: `${BASE}/Garrett1.svg` },
  { name: "Aditya Birla",   logo: `${BASE}/adityabirla.svg` },
  { name: "Exide",          logo: `${BASE}/exide.svg` },
  { name: "GMR",            logo: `${BASE}/GMR1.svg` },
];

/* Duplicate for seamless infinite loop */
const TRACK = [...CLIENTS, ...CLIENTS];

export function Hero() {
  return (
    <section className="relative h-screen min-h-[640px] max-h-[900px] flex items-center overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/download.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* Left-weighted Carbon overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#0E0E0F]/92 via-[#0E0E0F]/65 to-[#0E0E0F]/15"
      />
      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[#0E0E0F]/60 via-transparent to-transparent"
      />

      {/* Content */}
      <div className="relative z-10 w-full px-8">
        <div className="max-w-2xl">

          {/* Eyebrow badge */}
          <motion.p
            {...fadeUp(0.1)}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/65 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" aria-hidden="true" />
            Operational Intelligence
          </motion.p>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.22)}
            className="text-[54px] md:text-[66px] lg:text-[76px] font-bold text-white leading-[1.05]"
          >
            Clarity
            <br />
            <span className="text-[#FF6A00]">in Motion.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            {...fadeUp(0.36)}
            className="mt-6 text-[16px] md:text-[18px] text-white/55 leading-relaxed font-normal max-w-[460px] tracking-wide"
          >
            AI-powered warehouse intelligence that connects safety, inventory,
            and operations into one live platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.5)}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/book-demo"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00] hover:bg-[#E55F00] px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 shadow-lg shadow-[#FF6A00]/30 hover:shadow-[#FF6A00]/40 hover:-translate-y-px active:translate-y-0"
            >
              Book a Demo
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 hover:bg-white/10 px-7 py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-px active:translate-y-0"
            >
              Find Your Starting Point
            </Link>
          </motion.div>

          {/* Watch demo */}
          <motion.div {...fadeUp(0.65)} className="mt-8">
            <button
              type="button"
              className="group inline-flex items-center gap-3 text-[13px] font-medium text-white/45 hover:text-white/75 transition-colors duration-200"
              aria-label="Watch platform overview video"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 group-hover:border-white/45 group-hover:bg-white/5 transition-all duration-200">
                <Play className="w-3 h-3 fill-current ml-0.5" aria-hidden="true" />
              </span>
              Watch platform overview
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── Client trust bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] as const }}
        className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/8 bg-[#0E0E0F]/65 backdrop-blur-md"
      >
        <div className="flex items-center h-16">
          {/* Label */}
          <div className="shrink-0 flex items-center gap-4 pl-8 pr-6">
            <span className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-white/30 whitespace-nowrap">
              Trusted by
            </span>
            <div className="w-px h-5 bg-white/10" aria-hidden="true" />
          </div>

          {/* Marquee track — clips and scrolls */}
          <div className="flex-1 overflow-hidden relative">
            {/* Left fade */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10"
              style={{ background: "linear-gradient(to right, rgba(14,14,15,0.65), transparent)" }}
            />
            {/* Right fade */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10"
              style={{ background: "linear-gradient(to left, rgba(14,14,15,0.65), transparent)" }}
            />

            <div
              className="flex items-center gap-12 animate-marquee"
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
                    className="h-5 w-auto max-w-[90px] object-contain brightness-0 invert opacity-35 hover:opacity-60 transition-opacity duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Client count */}
          <div className="shrink-0 pl-6 pr-8 border-l border-white/8 flex flex-col items-end">
            <span className="text-[16px] font-bold text-white leading-none">50+</span>
            <span className="text-[10px] text-white/30 font-medium mt-0.5 whitespace-nowrap">clients worldwide</span>
          </div>
        </div>
      </motion.div>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          width: max-content;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
