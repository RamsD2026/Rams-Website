"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { Play } from "lucide-react";

type Feature = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  accent: string; // subtle hue applied as tinted rim on video frame
  video?: string;
  placeholderLabel: string;
  placeholderTimestamp: string;
};

const FEATURES: Feature[] = [
  {
    id: "engineering",
    eyebrow: "Engineering Services",
    title: "Operational clarity starts with the physical structure.",
    description:
      "On-site assessment, rack certification and structural compliance delivered by RAMS engineers before any software is deployed.",
    tags: ["Site Survey", "Rack Certification", "Compliance Audit"],
    accent: "#E88A5C",
    video: "/CSD-24696%20Agents%20In%20Jira%2001_1280_v001.mp4",
    placeholderLabel: "Engineering.mp4",
    placeholderTimestamp: "1:24",
  },
  {
    id: "ai",
    eyebrow: "Applied AI",
    title: "Detect what human eyes and manual audits always miss.",
    description:
      "Vision models trained on real warehouse conditions surface damage, misplacement and safety risks the moment they appear.",
    tags: ["Damage Detection", "Anomaly Alerts", "Vision QA"],
    accent: "#7B8BB0",
    video: "/Jira%20PT%20VP%201%20Demo%20Placeholder-948px-60fps-crf23.mp4",
    placeholderLabel: "AI Vision.mp4",
    placeholderTimestamp: "0:58",
  },
  {
    id: "platform",
    eyebrow: "Unified Platform",
    title: "One system for engineering, AI, hardware and enterprise workflows.",
    description:
      "Bring inspection, monitoring, planning and reporting into a single operational surface. No silos, no exports, no reconciliation.",
    tags: ["Unified Data", "Live Dashboards", "Integrated Workflows"],
    accent: "#6B9F82",
    video: "/Jira%20PT%20VP%202%20Demo%20Placeholder-948px-60fps-crf23.mp4",
    placeholderLabel: "Platform.mp4",
    placeholderTimestamp: "1:12",
  },
  {
    id: "enterprise",
    eyebrow: "Enterprise Grade",
    title: "Built for the security, scale and control global operations demand.",
    description:
      "Role-based access, granular permissions, complete audit trails and multi-site management ready for regulated environments.",
    tags: ["RBAC & SSO", "Audit Trails", "Multi-Site"],
    accent: "#8B7DAA",
    video: "/Jira%20PT%20VP%203%20Demo%20Placeholder-948px-60fps-crf23.mp4",
    placeholderLabel: "Enterprise.mp4",
    placeholderTimestamp: "1:36",
  },
  {
    id: "digital-twin",
    eyebrow: "Digital Twin",
    title: "A living operational model, not disconnected drawings.",
    description:
      "Every asset, every change and every event reflected in one continuously updated source of truth for the entire facility.",
    tags: ["3D Model", "Asset History", "Live Sync"],
    accent: "#5EA9AA",
    video: "/Jira%20PT%20VP%201%20Demo%20Placeholder-948px-60fps-crf23.mp4",
    placeholderLabel: "Digital Twin.mp4",
    placeholderTimestamp: "2:04",
  },
  {
    id: "scale",
    eyebrow: "Scale Ready",
    title: "From one warehouse to one hundred, without rebuilding your stack.",
    description:
      "The same platform, the same experience, whether you operate a single facility or a global network of sites.",
    tags: ["Multi-Region", "API-First", "Elastic Infrastructure"],
    accent: "#C29C6E",
    video: "/Jira%20PT%20VP%202%20Demo%20Placeholder-948px-60fps-crf23.mp4",
    placeholderLabel: "Scale.mp4",
    placeholderTimestamp: "1:48",
  },
];

function VideoPlaceholder({
  label,
  timestamp,
}: {
  label: string;
  timestamp: string;
}) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 30%, #FBFBFC 0%, #F2F2F5 100%)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 68,
            height: 68,
            background: "rgba(255,255,255,0.94)",
            boxShadow:
              "0 10px 40px rgba(14,14,15,0.14), 0 2px 8px rgba(14,14,15,0.06)",
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <Play
            className="w-5 h-5 text-carbon"
            fill="#0E0E0F"
            strokeWidth={0}
            style={{ marginLeft: 3 }}
          />
        </div>
      </div>

      <div
        className="absolute flex items-center gap-2"
        style={{ left: 22, bottom: 20 }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background: "var(--color-signal-orange)",
          }}
        />
        <span
          className="font-medium tabular-nums"
          style={{
            fontSize: 12,
            color: "var(--color-carbon)",
            letterSpacing: "0.005em",
          }}
        >
          {label}
        </span>
      </div>

      <div className="absolute" style={{ right: 22, bottom: 20 }}>
        <span
          className="font-mono tabular-nums"
          style={{ fontSize: 11, color: "var(--color-graphite-alt)" }}
        >
          {timestamp}
        </span>
      </div>
    </div>
  );
}

export function WhyRAMS() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [headerH, setHeaderH] = useState(220);
  const [exitProgress, setExitProgress] = useState(0);
  const reduceMotion = useReducedMotion();

  // ── Measure sticky header height so blocks/video pass beneath it correctly ──
  useLayoutEffect(() => {
    if (!headerRef.current) return;
    const el = headerRef.current;
    const measure = () => setHeaderH(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Sticky-scroll driver: pick block whose center is closest to the
  //    center of the *visible* area beneath the sticky header ──
  useEffect(() => {
    let rafId: number | null = null;

    const compute = () => {
      rafId = null;
      const targetY = headerH + (window.innerHeight - headerH) / 2;
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (let i = 0; i < blockRefs.current.length; i++) {
        const el = blockRefs.current[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const blockCenter = r.top + r.height / 2;
        const d = Math.abs(blockCenter - targetY);
        if (d < bestDistance) {
          bestDistance = d;
          bestIndex = i;
        }
      }
      setActiveIndex((prev) => (prev === bestIndex ? prev : bestIndex));

      // ── Compute sticky header exit progress ──
      // Start fading when section bottom is within (headerH + 400) of viewport top,
      // fully gone when section bottom hits headerH (natural sticky release point)
      if (sectionRef.current) {
        const sectionBottom = sectionRef.current.getBoundingClientRect().bottom;
        const startExit = headerH + 400;
        const endExit = headerH;
        let p = 0;
        if (sectionBottom <= endExit) p = 1;
        else if (sectionBottom >= startExit) p = 0;
        else p = (startExit - sectionBottom) / (startExit - endExit);
        setExitProgress((prev) => (Math.abs(prev - p) < 0.005 ? prev : p));
      }
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [headerH]);

  const activeFeature = FEATURES[activeIndex];
  const easeOut = [0.22, 1, 0.36, 1] as const;

  return (
    <section ref={sectionRef} className="bg-white relative">
      {/* ═════════════ STICKY HEADER — always visible while section scrolls ═════════════ */}
      <div
        ref={headerRef}
        className="sticky top-0 pt-16 pb-10 md:pt-20 md:pb-12"
        style={{
          backgroundColor: "var(--color-white)",
          zIndex: 40,
          isolation: "isolate",
          willChange: "transform, opacity",
          opacity: 1 - exitProgress,
          transform: `translateY(${-exitProgress * (headerH + 40)}px)`,
          transition: "opacity 0.15s linear",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={reduceMotion ? undefined : { y: 40, opacity: 0 }}
            whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="max-w-[820px]"
          >
            <p className="text-[16px] font-bold tracking-[0.22em] uppercase text-signal-orange">
              Why RAMS
            </p>

            <h2 className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[68px] font-bold text-carbon leading-[1.04] mt-3 max-w-[820px]">
              More than software.
              <br />
              <span className="text-signal-orange">Built for real operations.</span>
            </h2>

            <p className="mt-5 text-[14px] sm:text-[16px] text-graphite/55 leading-relaxed max-w-[560px]">
              RAMS combines engineering expertise, AI, connected hardware and
              enterprise software into one intelligent operational platform.
            </p>
          </motion.div>
        </div>

        {/* Soft fade attached to bottom of header — smooth disappear for blocks */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 right-0"
          style={{
            top: "100%",
            height: 56,
            background:
              "linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>

      {/* ═════════════ SCROLL STAGE — blocks pass BEHIND the sticky header ═════════════ */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 lg:gap-20">

          {/* LEFT: stacked full-viewport blocks */}
          <div className="w-full">
            {FEATURES.map((item, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={item.id}
                  ref={(el) => { blockRefs.current[i] = el; }}
                  className="flex items-start"
                  style={{
                    minHeight: `calc(100vh - ${headerH}px)`,
                    paddingTop: "12vh",
                    paddingBottom: "6vh",
                  }}
                >
                  <motion.div
                    animate={{
                      opacity: isActive ? 1 : 0.28,
                      y: isActive ? 0 : 8,
                    }}
                    transition={{ duration: 0.55, ease: easeOut }}
                    className="w-full"
                  >
                    <p className="text-[16px] font-bold tracking-[0.22em] uppercase text-signal-orange">
                      {item.eyebrow}
                    </p>

                    <h3 className="mt-4 text-[22px] sm:text-[26px] md:text-[30px] lg:text-[34px] font-semibold text-carbon leading-[1.15] tracking-[-0.018em] max-w-[520px]">
                      {item.title}
                    </h3>

                    <p
                      className="mt-5 text-[15px] sm:text-[16px] md:text-[17px] leading-[1.6] max-w-[520px]"
                      style={{ color: "#4A4A50" }}
                    >
                      {item.description}
                    </p>

                    <ul className="mt-8 flex flex-wrap gap-2.5">
                      {item.tags.map((tag) => (
                        <li
                          key={tag}
                          className="inline-flex items-center gap-2 rounded-full"
                          style={{
                            padding: "7px 14px",
                            background: "var(--color-off-white-alt)",
                            border: "1px solid #EAEAED",
                            fontSize: 12.5,
                            fontWeight: 500,
                            color: "var(--color-graphite)",
                            letterSpacing: "-0.005em",
                          }}
                        >
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: 99,
                              background: item.accent,
                              transition: "background 0.4s ease",
                            }}
                          />
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: sticky media, offset beneath the sticky header */}
          <div className="hidden md:block w-full">
            <div
              className="sticky flex items-center"
              style={{
                top: headerH,
                height: `calc(100vh - ${headerH}px)`,
              }}
            >
              <motion.div
                initial={
                  reduceMotion
                    ? undefined
                    : { scale: 0.97, opacity: 0 }
                }
                whileInView={
                  reduceMotion
                    ? undefined
                    : { scale: 1, opacity: 1 }
                }
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: easeOut }}
                className="w-full"
              >
                <motion.div
                  animate={{
                    boxShadow: `0 8px 60px 0 rgba(14,14,15,0.08), 0 1px 4px 0 rgba(14,14,15,0.04), inset 0 0 0 1px ${activeFeature.accent}33, inset 0 0 60px ${activeFeature.accent}12`,
                  }}
                  transition={{ duration: 0.5, ease: easeOut }}
                  className="relative w-full"
                  style={{
                    aspectRatio: "4 / 3",
                    borderRadius: 12,
                    border: "1px solid #E8E8E8",
                    overflow: "hidden",
                    background: "var(--color-white)",
                  }}
                >
                  <AnimatePresence mode="sync">
                    <motion.div
                      key={activeFeature.id}
                      initial={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.98, filter: "blur(8px)" }
                      }
                      animate={
                        reduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, scale: 1, filter: "blur(0px)" }
                      }
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.98, filter: "blur(8px)" }
                      }
                      transition={{ duration: 0.5, ease: easeOut }}
                      className="absolute inset-0"
                    >
                      {activeFeature.video ? (
                        <video
                          src={activeFeature.video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <VideoPlaceholder
                          label={activeFeature.placeholderLabel}
                          timestamp={activeFeature.placeholderTimestamp}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Progress index badge — top-right */}
                  <div
                    className="absolute z-20 flex items-baseline gap-1 tabular-nums"
                    style={{
                      top: 14,
                      right: 14,
                      padding: "6px 10px",
                      borderRadius: 8,
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      border: "1px solid rgba(14,14,15,0.06)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                  >
                    <motion.span
                      key={activeIndex}
                      initial={{ y: -6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.25, ease: easeOut }}
                      style={{ color: "var(--color-carbon)", display: "inline-block" }}
                    >
                      {String(activeIndex + 1).padStart(2, "0")}
                    </motion.span>
                    <span style={{ color: "#8E8E93" }}>
                      / {String(FEATURES.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Progress bar — thicker + tick marks */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[5px] z-10"
                    style={{ background: "rgba(14,14,15,0.06)" }}
                  >
                    <motion.div
                      animate={{
                        width: `${((activeIndex + 1) / FEATURES.length) * 100}%`,
                        background: activeFeature.accent,
                      }}
                      transition={{ duration: 0.5, ease: easeOut }}
                      className="h-full"
                    />
                    {/* Tick marks (n-1 dividers for n segments) */}
                    {Array.from({ length: FEATURES.length - 1 }).map((_, tickI) => (
                      <span
                        key={tickI}
                        aria-hidden
                        className="absolute top-0 bottom-0"
                        style={{
                          left: `${((tickI + 1) / FEATURES.length) * 100}%`,
                          width: 1,
                          background: "rgba(255,255,255,0.9)",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
