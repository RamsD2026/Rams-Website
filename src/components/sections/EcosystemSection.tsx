"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, Pause, Play } from "lucide-react";
import Link from "next/link";

const TABS = [
  {
    id: "engineering",
    label: "Engineering",
    eyebrow: "Engineering Services",
    headline: "Operational clarity starts with the physical structure.",
    description:
      "On-site assessment, rack certification and structural compliance delivered by RAMS engineers before any software is deployed.",
    includes: ["Site Survey", "Rack Certification", "Compliance Audit"],
    screenshots: ["/SS/Rack health 736.webp", "/SS/Screenshot 2026-07-12 124539.png", "/SS/Dashboard2.webp"],
    href: "/services/engineering",
    video: "/Jira PT VP 3 Demo Placeholder-948px-60fps-crf23.mp4",
  },
  {
    id: "ai-vision",
    label: "AI Vision",
    eyebrow: "AI Vision",
    headline: "See everything that moves. Miss nothing.",
    description:
      "Computer vision and AI models running on RAMS hardware — monitoring racks, MHEs, pallets and people continuously in real time.",
    includes: ["Object Detection", "Damage Recognition", "Behavioural Analytics"],
    screenshots: ["/SS/Screenshot 2026-07-12 124539.png", "/SS/Dashboard2.webp", "/SS/Report.jpg"],
    href: "/platform/ai-vision",
    video: "/Jira PT VP 1 Demo Placeholder-948px-60fps-crf23.mp4",
  },
  {
    id: "digital-twin",
    label: "Digital Twin",
    eyebrow: "Digital Twin",
    headline: "Your warehouse, live and always current.",
    description:
      "A continuously updated digital replica of your facility — spatial data, asset positions and operational state, always in sync.",
    includes: ["3D Facility Mapping", "Live Asset Sync", "Spatial Intelligence"],
    screenshots: ["/SS/Dashboard2.webp", "/SS/Screenshot 2026-07-12 124539.png", "/SS/Rack health 736.webp"],
    href: "/platform/digital-twin",
    video: "/Jira PT VP 2 Demo Placeholder-948px-60fps-crf23.mp4",
  },
  {
    id: "hardware",
    label: "Hardware",
    eyebrow: "Intelligent Hardware",
    headline: "Purpose-built for the warehouse floor.",
    description:
      "Proprietary sensors, edge devices and cameras designed specifically for the demands of industrial warehouse environments.",
    includes: ["Edge Cameras", "IoT Sensors", "Wireless Gateways"],
    screenshots: ["/SS/Report.jpg", "/SS/Rack health 736.webp", "/SS/Screenshot 2026-07-12 124539.png"],
    href: "/hardware",
    video: "/Jira PT VP 2 Demo Placeholder-948px-60fps-crf23.mp4",
  },
  {
    id: "software",
    label: "Software",
    eyebrow: "Enterprise Software",
    headline: "One platform. Every operational answer.",
    description:
      "Dashboards, alerts, task management, reporting and deep WMS integration — the complete RAMS intelligence suite.",
    includes: ["AIMS Dashboard", "WMS Integration", "Custom Reporting"],
    screenshots: ["/SS/Screenshot 2026-07-12 124539.png", "/SS/Dashboard2.webp", "/SS/Report.jpg"],
    href: "/platform/software",
    video: "/Jira PT VP 2 Demo Placeholder-948px-60fps-crf23.mp4",
  },
];

type TabId = "engineering" | "ai-vision" | "digital-twin" | "hardware" | "software";
type Tab = (typeof TABS)[number];

function ScreenMockup({ src, alt }: { src: string; alt: string }) {
  const BEZEL = 14;
  const OUTER_R = 38;
  const INNER_R = OUTER_R - BEZEL;

  return (
    <div
      style={{
        position: "relative",
        padding: `${BEZEL}px`,
        background: "linear-gradient(155deg, #38383A 0%, #222224 45%, #141416 100%)",
        borderRadius: `${OUTER_R}px`,
      }}
    >
      {/* Top-edge highlight */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          borderRadius: `${OUTER_R}px`,
          background: "linear-gradient(170deg, rgba(255,255,255,0.045) 0%, transparent 30%)",
          pointerEvents: "none",
        }}
      />

      {/* Screen */}
      <div style={{ borderRadius: `${INNER_R}px`, overflow: "hidden" }}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} style={{ display: "block", width: "100%", height: "auto" }} />
        ) : (
          <div style={{ aspectRatio: "16/10", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "12px", color: "#48484A" }}>Screenshot coming soon</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Modal({ tab, onClose }: { tab: Tab; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const features = tab.includes.map((title, i) => ({
    title,
    desc: [
      "Continuous on-site assessment and structural compliance delivered before any software is deployed.",
      "Real-time monitoring and intelligent alerts keep your team ahead of issues before they escalate.",
      "Deep integration with your existing systems — every action tracked, logged, and reportable.",
    ][i],
    screenshot: tab.screenshots[i],
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={onClose}
    >
      {/* Backdrop — behind modal, non-scrolling */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

      {/* Scroll container — page-level scroll, scrollbar at screen right edge */}
      <div className="flex min-h-full items-start justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white w-full my-auto"
          style={{ borderRadius: "20px", maxWidth: "1100px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-4 h-4 text-carbon" />
          </button>

        {/* ── Section 1 — Hero ── */}
        <div className="px-10 sm:px-20 lg:px-28 pt-16 pb-6">
          <p className="text-[20px] font-bold tracking-[0.04em] uppercase text-signal-orange mb-5">
            {tab.eyebrow}
          </p>
          <h2
            className="text-[42px] sm:text-[60px] lg:text-[68px] font-bold text-carbon-alt leading-[1.04]"
            style={{ letterSpacing: "-0.025em" }}
          >
            What&apos;s inside {tab.label}.
          </h2>
        </div>

        {/* ── Sections 2–4 — text + screen mockup in one card ── */}
        {features.map((feature) => (
          <div key={feature.title} className="px-10 sm:px-20 lg:px-28 pb-12">
            <div
              className="bg-off-white-alt"
              style={{ borderRadius: "20px" }}
            >
              {/* Text — top of card */}
              <div className="px-8 pt-8 pb-6">
                <p className="text-[18px] sm:text-[20px] text-carbon-alt leading-relaxed max-w-[580px]">
                  <span className="font-bold">{feature.title}.</span>{" "}
                  <span className="text-graphite-alt">{feature.desc}</span>
                </p>
              </div>
              {/* Screen mockup — with margin inside card */}
              <div className="px-6 pb-6">
                <ScreenMockup src={feature.screenshot} alt={feature.title} />
              </div>
            </div>
          </div>
        ))}

        {/* bottom padding */}
        <div className="pb-10" />
      </motion.div>
      </div>
    </motion.div>
  );
}

export function EcosystemSection() {
  const [activeId, setActiveId] = useState<TabId>("engineering");
  const [modalTab, setModalTab] = useState<Tab | null>(null);
  const [videoPaused, setVideoPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const active = TABS.find((t) => t.id === activeId)!;

  const toggleVideo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setVideoPaused(false); }
    else { v.pause(); setVideoPaused(true); }
  }, []);

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-14 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[68px] font-bold text-carbon leading-[1.04] mb-4"
            style={{ letterSpacing: "-0.025em" }}
          >
            Everything your warehouse needs,
            <br />
            connected in one platform.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] text-graphite/50 max-w-[520px] mx-auto leading-relaxed"
          >
            Engineering, hardware, AI Vision, Digital Twin and software unified into a single intelligent platform.
          </motion.p>
        </div>

        {/* Segmented control */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="flex justify-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center bg-[#F2F2F2] rounded-full p-1.5 gap-0.5 w-full max-w-[700px]">
            {TABS.map((tab) => {
              const isActive = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveId(tab.id as TabId)}
                  className={`flex-1 py-2.5 text-[13px] font-medium transition-all duration-200 rounded-full whitespace-nowrap text-center ${
                    isActive
                      ? "bg-carbon text-white"
                      : "text-graphite hover:text-signal-orange"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 lg:gap-16 items-stretch pt-8 sm:pt-10"
            >
              {/* Left */}
              <div className="flex flex-col justify-center">
                <p className="text-[20px] font-bold tracking-[0.04em] uppercase text-signal-orange mb-4">
                  {active.eyebrow}
                </p>
                <h3 className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold text-carbon leading-[1.08] mb-4" style={{ letterSpacing: "-0.02em" }}>
                  {active.headline}
                </h3>
                <p className="text-[14px] sm:text-[15px] text-graphite-alt leading-relaxed mb-7 max-w-[380px]">
                  {active.description}
                </p>

                {/* Includes */}
                <div className="flex flex-col gap-3 mb-8">
                  {active.includes.map((item) => (
                    <span key={item} className="flex items-center gap-3 text-[13px] font-medium text-carbon">
                      <span className="w-5 h-5 rounded-full bg-signal-orange flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white stroke-[2.5]" />
                      </span>
                      {item}
                    </span>
                  ))}
                </div>

                {/* CTA — more prominent */}
                <button
                  type="button"
                  onClick={() => setModalTab(active)}
                  className="group self-start inline-flex items-center gap-2 bg-carbon hover:bg-signal-orange text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-all duration-200"
                >
                  Explore {active.label}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
              </div>

              {/* Right — clean dark video card */}
              <div
                className="relative overflow-hidden bg-carbon"
                style={{
                  borderRadius: "16px",
                  minHeight: "460px",
                }}
              >
                {/* Subtle dot grid */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: "radial-gradient(circle, #3A3A3E 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                {/* Orange ambient glow */}
                <div
                  aria-hidden="true"
                  className="absolute pointer-events-none"
                  style={{
                    bottom: "-40px", right: "-40px",
                    width: "280px", height: "280px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(255,106,0,0.18) 0%, transparent 70%)",
                    filter: "blur(32px)",
                  }}
                />
                <video
                  ref={videoRef}
                  key={active.video}
                  src={active.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={toggleVideo}
                  aria-label={videoPaused ? "Play video" : "Pause video"}
                  className="absolute bottom-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 z-10"
                >
                  {videoPaused
                    ? <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    : <Pause className="w-3.5 h-3.5 fill-current" />
                  }
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      <AnimatePresence>
        {modalTab && <Modal tab={modalTab} onClose={() => setModalTab(null)} />}
      </AnimatePresence>
    </section>
  );
}
