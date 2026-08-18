"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Pause, Play } from "lucide-react";

const VIDEOS = [
  "/CSD-24696 Agents In Jira 01_1280_v001.mp4",
];

function SeamlessVideo({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.src = VIDEOS[index];
    v.load();
    v.play().catch(() => {});
  }, [index]);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPaused(false); }
    else { v.pause(); setPaused(true); }
  }, []);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={VIDEOS[0]}
        autoPlay
        muted
        playsInline
        onEnded={() => setIndex((i) => (i + 1) % VIDEOS.length)}
        className={className}
        style={style}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? "Play video" : "Pause video"}
        className="absolute bottom-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white transition-all duration-200"
      >
        {paused
          ? <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          : <Pause className="w-3.5 h-3.5 fill-current" />
        }
      </button>
    </div>
  );
}

function LaptopMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      {/* ── Lid / screen ── */}
      <div
        className="relative w-full"
        style={{
          background: "linear-gradient(160deg, #2C2C2E 0%, #1C1C1E 100%)",
          borderRadius: "16px 16px 0 0",
          padding: "10px 10px 0 10px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Camera */}
        <div className="flex justify-center items-center h-5">
          <div className="w-[6px] h-[6px] rounded-full bg-[#3A3A3C] ring-1 ring-black/40" />
        </div>

        {/* Screen glass — inner bezel */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: "4px 4px 0 0",
            background: "#000",
            boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.5)",
          }}
        >
          {children}
        </div>
      </div>

      {/* ── Hinge line ── */}
      <div
        style={{
          height: "4px",
          background: "linear-gradient(180deg, #111 0%, #2A2A2C 100%)",
        }}
      />

      {/* ── Base / keyboard ── */}
      <div
        style={{
          background: "linear-gradient(180deg, #3A3A3C 0%, #2C2C2E 100%)",
          borderRadius: "0 0 10px 10px",
          height: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Trackpad hint */}
        <div
          style={{
            width: "72px",
            height: "10px",
            borderRadius: "3px",
            background: "rgba(0,0,0,0.25)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04)",
          }}
        />
      </div>

      {/* ── Desk reflection ── */}
      <div
        style={{
          height: "6px",
          background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, transparent 100%)",
          borderRadius: "0 0 8px 8px",
        }}
      />
    </div>
  );
}

export function PlatformReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const rawScale   = useTransform(scrollYProgress, [0, 0.5], [0.78, 1.0]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.3], [0.7, 1.0]);

  const windowScale   = useSpring(rawScale,   { stiffness: 140, damping: 28, mass: 0.4 });
  const windowOpacity = useSpring(rawOpacity, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <>
      {/* ── Desktop ── */}
      <section
        ref={containerRef}
        className="hidden md:block relative bg-surface-dark"
        style={{ height: "200vh" }}
      >
        <div
          className="sticky top-0 flex flex-col items-center justify-center gap-4"
          style={{ height: "100vh" }}
        >
          {/* Dot grid pattern */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, #2A2A2E 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: 0.35,
            }}
          />

          {/* Orange glow — bottom left */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 60% at -15% 90%, rgba(255,106,0,0.22) 0%, rgba(255,80,0,0.06) 55%, transparent 75%)",
              filter: "blur(48px)",
            }}
          />
          {/* Orange glow — top right */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 65% 50% at 115% 10%, rgba(255,106,0,0.18) 0%, rgba(255,80,0,0.05) 55%, transparent 75%)",
              filter: "blur(48px)",
            }}
          />
          {/* Eyebrow label */}
          <motion.p
            style={{ opacity: windowOpacity }}
            className="text-[10px] font-bold tracking-[0.22em] uppercase text-white/30"
          >
            RAMS Platform
          </motion.p>

          {/* Video */}
          <motion.div
            className="w-[92vw] max-w-[1400px] overflow-hidden relative"
            style={{ scale: windowScale, opacity: windowOpacity, borderRadius: "12px" }}
          >
            <SeamlessVideo
              className="w-full object-cover block"
              style={{ height: "82vh" } as React.CSSProperties}
            />
            {/* Bottom ambient glow */}
            <div
              aria-hidden="true"
              className="absolute -bottom-8 left-0 right-0 h-20 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(255,106,0,0.08) 0%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />
          </motion.div>

          {/* Bottom label */}
          <motion.p
            style={{ opacity: windowOpacity }}
            className="text-[11px] font-medium text-white/20 tracking-wide"
          >
            AI-powered warehouse intelligence — live
          </motion.p>
        </div>
      </section>

      {/* ── Mobile ── */}
      <section className="md:hidden relative bg-surface-dark py-14 px-4 overflow-hidden">
        {/* Dot grid */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #2A2A2E 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.3,
          }}
        />
        {/* Orange glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 100% 60% at 10% 90%, rgba(255,106,0,0.18) 0%, transparent 70%)",
            filter: "blur(32px)",
          }}
        />

        <div className="relative flex flex-col gap-4">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-[10px] font-bold tracking-[0.22em] uppercase text-white/30"
          >
            RAMS Platform
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
            style={{ borderRadius: "12px" }}
          >
            <SeamlessVideo className="w-full block object-cover" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-[11px] font-medium text-white/20 tracking-wide"
          >
            AI-powered warehouse intelligence — live
          </motion.p>
        </div>
      </section>
    </>
  );
}
