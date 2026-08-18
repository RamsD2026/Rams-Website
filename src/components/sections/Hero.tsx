"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

const BASE = "https://www.rams.digital/assets/rack-audit";

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

const TRACK = [...CLIENTS, ...CLIENTS];

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Subtle slow-zoom parallax on video
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const videoY     = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);


  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-[104px] sm:pt-[120px] pb-20"
    >
      {/* ── Video with parallax ── */}
      <motion.div
        style={{ scale: videoScale, y: videoY }}
        className="absolute inset-0 w-full h-full origin-center"
      >
        <video
          className="w-full object-cover"
          style={{ height: "150%", marginTop: "-5%" }}
          src="/download.mp4"
          autoPlay muted loop playsInline
          aria-hidden="true"
        />
      </motion.div>

      {/* ── Layer 1: Left-weighted carbon overlay (text legibility) ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(14,14,15,0.93) 0%, rgba(14,14,15,0.65) 38%, rgba(14,14,15,0.12) 100%)",
        }}
      />

      {/* ── Layer 2: Strong bottom fade — solid black from 22% up ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #0B0B0C 0%, #0B0B0C 22%, rgba(11,11,12,0.88) 38%, rgba(11,11,12,0.4) 55%, transparent 72%)",
        }}
      />


      {/* ── Content ── */}
      <div className="relative z-10 w-full">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
          <div className="max-w-2xl">

            <motion.h1
              {...fadeUp(0.22)}
              className="text-[38px] sm:text-[50px] md:text-[62px] lg:text-[76px] font-bold text-white leading-[1.05]"
            >
              Clarity
              <br />
              <span className="text-signal-orange">in Motion.</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.36)}
              className="mt-5 sm:mt-6 text-[14px] sm:text-[15px] md:text-[18px] text-white/55 leading-relaxed font-normal max-w-[560px] tracking-wide"
            >
              AI-powered warehouse intelligence connecting safety,
              <br />inventory and operations into one live platform.
            </motion.p>

            <motion.div
              {...fadeUp(0.5)}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <Link
                href="/book-demo"
                className="inline-flex items-center gap-2 bg-signal-orange hover:bg-signal-orange-hover px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-px active:translate-y-0"
              >
                Book a Demo
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 border border-white/25 bg-white/5 hover:bg-white/10 px-7 py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-px active:translate-y-0"
              >
                Find Your Starting Point
              </Link>
            </motion.div>

            <motion.div {...fadeUp(0.65)} className="mt-8">
              <button
                type="button"
                className="group inline-flex items-center gap-3 text-[13px] font-medium text-white/45 hover:text-white/75 transition-colors duration-200"
                aria-label="Watch platform overview video"
              >
                <span className="flex h-8 w-8 items-center justify-center border border-white/20 group-hover:border-white/45 group-hover:bg-white/5 transition-all duration-200">
                  <Play className="w-3 h-3 fill-current ml-0.5" aria-hidden="true" />
                </span>
                Watch platform overview
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Trust bar — floating inside hero, glass effect ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] as const }}
        className="absolute bottom-6 left-0 right-0 z-10"
      >
        <div
          className="mx-4 sm:mx-8 lg:mx-16 border border-white/[0.07] backdrop-blur-md"
          style={{ background: "rgba(11,11,12,0.55)" }}
        >
          <div className="max-w-[1280px] mx-auto flex items-center h-14 w-full">
            <div className="hidden sm:flex shrink-0 items-center gap-4 pl-6 sm:pl-8 pr-4 sm:pr-6">
              <span className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-white/30 whitespace-nowrap">
                Trusted by
              </span>
              <div className="w-px h-5 bg-white/10" aria-hidden="true" />
            </div>

            <div className="flex-1 overflow-hidden relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10"
                style={{ background: "linear-gradient(to right, rgba(11,11,12,0.55), transparent)" }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10"
                style={{ background: "linear-gradient(to left, rgba(11,11,12,0.55), transparent)" }}
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

            <div className="hidden sm:flex shrink-0 pl-6 pr-6 sm:pr-8 border-l border-white/[0.07] flex-col items-end">
              <span className="text-[16px] font-bold text-white leading-none">50+</span>
              <span className="text-[10px] text-white/30 font-medium mt-0.5 whitespace-nowrap">clients worldwide</span>
            </div>
          </div>
        </div>
      </motion.div>

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
