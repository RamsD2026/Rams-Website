"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import AIVisionWidget from "@/components/ui/AIVisionWidget";
import InventoryWidget from "@/components/ui/InventoryWidget";
import DigitalTwinWidget from "@/components/ui/DigitalTwinWidget";

const GLOW = { blur: 0, borderWidth: 3, spread: 80, glow: true, disabled: false, proximity: 64, inactiveZone: 0.01 };

/* ── Stripe-style floating action button ─────────────── */
const btnRest = {
  y: 0,
  borderColor: "#ECECEC",
  backgroundColor: "rgba(255,255,255,0.85)",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
};
const btnHover = {
  y: -2,
  borderColor: "#FF6A00",
  backgroundColor: "rgba(255,255,255,1)",
  boxShadow: "0 4px 14px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
};

function StripeBtn() {
  return (
    <motion.button
      initial="rest" whileHover="hover" whileTap={{ scale: 0.96 }} animate="rest"
      variants={{ rest: btnRest, hover: btnHover }}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      style={{
        width: 40, height: 40, borderRadius: 12,
        backdropFilter: "blur(8px)",
        border: "1px solid #ECECEC",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, cursor: "pointer", outline: "none",
      }}
    >
      <motion.span
        variants={{ rest: { x: 0, y: 0, color: "#9CA3AF" }, hover: { x: 2, y: -2, color: "#FF6A00" } }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        style={{ fontSize: 18, lineHeight: 1, userSelect: "none" }}
      >
        ↗
      </motion.span>
    </motion.button>
  );
}

/* ── Mouse-parallax hook ─────────────────────────────── */
function useParallax(strength = 10) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(useTransform(rawX, [-0.5, 0.5], [-strength, strength]), { stiffness: 120, damping: 20 });
  const y = useSpring(useTransform(rawY, [-0.5, 0.5], [-strength, strength]), { stiffness: 120, damping: 20 });
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => { rawX.set(0); rawY.set(0); };
  return { ref, x, y, onMouseMove, onMouseLeave };
}

function makeCardVariants(reduced: boolean) {
  return {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: reduced
        ? { duration: 0.2 }
        : { duration: 0.35, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
    }),
  };
}

/* ── Premium browser-frame mockup (cards 1 & 2) ─────── */
function BrowserFrame({ src, alt, px, py, objectPosition = "center top", top, left = 24, shadow = false }: {
  src: string; alt: string;
  px: ReturnType<typeof useParallax>["x"];
  py: ReturnType<typeof useParallax>["y"];
  objectPosition?: string;
  top: number;
  left?: number;
  shadow?: boolean;
}) {
  return (
    <motion.div
      className="absolute right-0 bottom-0 z-10"
      style={{ top, left }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ opacity: { duration: 0.4, delay: 0.18, ease: [0.4, 0, 0.2, 1] }, default: { type: "spring", stiffness: 100, damping: 16 } }}
    >
      <div
        className="relative w-full h-full overflow-hidden"
        style={{
          borderRadius: "20px 0 0 0",
          border: "1px solid #E8E8E8",
          borderRight: "none",
          borderBottom: "none",
          background: "#fff",
          ...(shadow && { boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)" }),
        }}
      >
        <motion.img
          src={src} alt={alt}
          className="w-full h-full object-cover block"
          style={{ objectPosition, x: px, y: py }}
        />
      </div>
    </motion.div>
  );
}

/* ── Mockup panel — bleeds to right edge ─────────────── */
function ImageZone({ src, alt, px, py, objectPosition = "top", top = 130 }: {
  src: string; alt: string;
  px: ReturnType<typeof useParallax>["x"];
  py: ReturnType<typeof useParallax>["y"];
  objectPosition?: string;
  top?: number;
}) {
  return (
    <motion.div
      className="absolute bottom-0 left-4 right-0 overflow-hidden rounded-tl-xl rounded-tr-none z-10 border border-b-0 border-r-0 border-gray-200/40"
      style={{ top }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ opacity: { duration: 0.4, delay: 0.18, ease: [0.4, 0, 0.2, 1] }, default: { type: "spring", stiffness: 100, damping: 16 } }}
    >
      <motion.img src={src} alt={alt} className="w-full h-full object-cover block"
        style={{ objectPosition, x: px, y: py }} />
    </motion.div>
  );
}

/* ── Floating analytics widget for card 6 ───────────── */
function OperationalHealthWidget() {
  return (
    <div style={{
      position: "absolute",
      bottom: 77,
      left: "calc(29% - 132px)",
      width: 200,
      zIndex: 20,
      background: "#ffffff",
      borderRadius: 16,
      border: "1px solid #ECECEC",
      boxShadow: "none",
      padding: "16px 16px 14px 16px",
      fontFamily: "ui-sans-serif,system-ui,sans-serif",
    }}>
      {/* Label + pulse */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <motion.span
          style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block", flexShrink: 0 }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
        />
        <span style={{ fontSize: 9.5, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.06em", textTransform: "uppercase" }}>Operational Health</span>
      </div>

      {/* Hero number */}
      <div style={{ fontSize: 36, fontWeight: 800, color: "#0E0E0F", lineHeight: 1, marginBottom: 4 }}>88%</div>
      <div style={{ fontSize: 9.5, color: "#94A3B8", marginBottom: 14 }}>104 sites monitored</div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", background: "linear-gradient(90deg, #16A34A, #22C55E)", borderRadius: 99 }}
          initial={{ width: 0 }}
          whileInView={{ width: "88%" }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.5, ease: "linear" }}
        />
      </div>
    </div>
  );
}

/* ── Wide mockup for card 6 ─────────────────────────── */
function ImageZoneWide({ src, alt, px, py }: {
  src: string; alt: string;
  px: ReturnType<typeof useParallax>["x"];
  py: ReturnType<typeof useParallax>["y"];
}) {
  return (
    <motion.div
      className="absolute top-4 bottom-0 right-0 left-[30%] overflow-hidden rounded-tl-xl rounded-tr-none rounded-br-none z-10 border border-b-0 border-r-0 border-gray-200/40"
      whileHover={{ x: -6 }}
      transition={{ type: "spring", stiffness: 90, damping: 14 }}
    >
      <motion.img src={src} alt={alt} className="w-full h-full object-cover object-left-top block"
        style={{ x: px, y: py }} />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════ */
export default function BentoGrid() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const cardVariants = makeCardVariants(prefersReducedMotion);
  const p1 = useParallax(prefersReducedMotion ? 0 : 8);
  const p2 = useParallax(prefersReducedMotion ? 0 : 6);
  const p3 = useParallax(prefersReducedMotion ? 0 : 6);
  const p4 = useParallax(prefersReducedMotion ? 0 : 7);
  const p5 = useParallax(prefersReducedMotion ? 0 : 6);
  const p6 = useParallax(prefersReducedMotion ? 0 : 5);

  return (
    <div className="bg-[#F6F6F8] px-6 py-16 md:px-12 md:py-20 flex flex-col items-center font-sans">

      <motion.div
        className="w-full max-w-7xl mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-[10.5px] font-bold tracking-[0.22em] uppercase text-signal-orange">Solutions</span>
        <h2 className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[68px] font-bold text-carbon leading-[1.04] mt-3 max-w-[820px]">
          What challenge are<br />you <span className="text-signal-orange">solving today?</span>
        </h2>
        <p className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] text-graphite/50 leading-relaxed max-w-[520px]">Choose your operational priority and discover how RAMS delivers the right combination of engineering, AI, hardware and software to solve it.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 max-w-7xl w-full">

        {/* CARD 1 */}
        <motion.div
          ref={p1.ref} onMouseMove={p1.onMouseMove} onMouseLeave={p1.onMouseLeave}
          custom={0} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="md:col-span-3 h-[420px] md:h-[540px]"
        >
          <div className="relative h-full rounded-xl border border-orange-100 p-1.5">
            <GlowingEffect {...GLOW} />
            <div className="relative h-full overflow-hidden rounded-[10px] bg-white flex flex-col">
              <img src="/bg-card-warm.png" alt="" aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0" style={{ opacity: 0.55 }} />
              <div className="relative z-10 p-8 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[17px] sm:text-[20px] lg:text-[21px] font-bold text-carbon leading-tight">Rack Safety &amp; Compliance</h3>
                  <StripeBtn />
                </div>
                <p className="mt-2 text-[13px] text-[#6B7280] leading-relaxed font-normal max-w-[230px]">Every rack damage, MHE impact and open corrective action — visible before it becomes a liability.</p>
              </div>
              <BrowserFrame src="/SS/Rack health 736.webp" alt="Rack Health" px={p1.x} py={p1.y} objectPosition="center top" top={148} left={32} />
            </div>
          </div>
        </motion.div>

        {/* CARD 2 */}
        <motion.div
          ref={p2.ref} onMouseMove={p2.onMouseMove} onMouseLeave={p2.onMouseLeave}
          custom={1} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="md:col-span-3 h-[420px] md:h-[540px]"
        >
          <div className="relative h-full rounded-xl border border-orange-100 p-1.5">
            <GlowingEffect {...GLOW} />
            <div className="relative h-full overflow-hidden rounded-[10px] bg-white flex flex-col">
              <img src="/bg-card-warm.png" alt="" aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0" style={{ opacity: 0.55 }} />
              <div className="relative z-10 p-8 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[17px] sm:text-[20px] lg:text-[21px] font-bold text-carbon leading-tight">MHE Safety &amp; Tracking</h3>
                  <StripeBtn />
                </div>
                <p className="mt-2 text-[13px] text-[#6B7280] leading-relaxed font-normal max-w-[230px]">Speed violations and near-misses tracked every shift — automated alerts before incidents occur.</p>
              </div>
              <BrowserFrame src="/SS/Screenshot 2026-07-12 124539.png" alt="Multi-site Dashboard" px={p2.x} py={p2.y} objectPosition="left top" top={148} left={32} />
            </div>
          </div>
        </motion.div>

        {/* CARD 3 — AI Vision (animated scene) */}
        <motion.div
          ref={p3.ref} onMouseMove={p3.onMouseMove} onMouseLeave={p3.onMouseLeave}
          custom={2} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="md:col-span-2 h-[440px] md:h-[520px]"
        >
          <div className="relative h-full rounded-xl border border-orange-100 p-1.5">
            <GlowingEffect {...GLOW} />
            <div className="relative h-full overflow-hidden rounded-[10px] bg-white flex flex-col">
              <img src="/bg-card-warm.png" alt="" aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0" style={{ opacity: 0.55 }} />
              <div className="relative z-10 p-6 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[17px] sm:text-[20px] lg:text-[21px] font-bold text-carbon leading-tight">AI Vision Monitoring</h3>
                  <StripeBtn />
                </div>
                <p className="mt-2 text-[13px] text-[#6B7280] leading-relaxed font-normal">Edge cameras and AI detect anomalies 24/7 across every aisle — zero blind spots, instant alerts.</p>
              </div>
              <AIVisionWidget />
            </div>
          </div>
        </motion.div>

        {/* CARD 4 */}
        <motion.div
          ref={p4.ref} onMouseMove={p4.onMouseMove} onMouseLeave={p4.onMouseLeave}
          custom={3} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="md:col-span-2 h-[440px] md:h-[520px]"
        >
          <div className="relative h-full rounded-xl border border-orange-100 p-1.5">
            <GlowingEffect {...GLOW} />
            <div className="relative h-full overflow-hidden rounded-[10px] bg-white flex flex-col">
              <img src="/bg-card-warm.png" alt="" aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0" style={{ opacity: 0.55 }} />
              <div className="relative z-10 p-6 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[17px] sm:text-[20px] lg:text-[21px] font-bold text-carbon leading-tight">Inventory & Assets</h3>
                  <StripeBtn />
                </div>
                <p className="mt-2 text-[13px] text-[#6B7280] leading-relaxed font-normal">Physical reality versus WMS records — reconciled in real time without manual audits, cycle counts, or costly guesswork.</p>
              </div>
              <InventoryWidget />
            </div>
          </div>
        </motion.div>

        {/* CARD 5 */}
        <motion.div
          ref={p5.ref} onMouseMove={p5.onMouseMove} onMouseLeave={p5.onMouseLeave}
          custom={4} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="md:col-span-2 h-[440px] md:h-[520px]"
        >
          <div className="relative h-full rounded-xl border border-orange-100 p-1.5">
            <GlowingEffect {...GLOW} />
            <div className="relative h-full overflow-hidden rounded-[10px] bg-white flex flex-col">
              <img src="/bg-card-warm.png" alt="" aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0" style={{ opacity: 0.55 }}
              />
              <div className="relative z-10 p-6 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[17px] sm:text-[20px] lg:text-[21px] font-bold text-carbon leading-tight">Digital Twin</h3>
                  <StripeBtn />
                </div>
                <p className="mt-2 text-[13px] text-[#6B7280] leading-relaxed font-normal">A live digital replica of your facility — floor plans, assets, and operational state always in sync.</p>
              </div>
              <DigitalTwinWidget />
            </div>
          </div>
        </motion.div>

        {/* CARD 6 */}
        <motion.div
          ref={p6.ref} onMouseMove={p6.onMouseMove} onMouseLeave={p6.onMouseLeave}
          custom={5} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="md:col-span-6 h-[420px] md:h-[480px]"
        >
          <div className="relative h-full rounded-xl border border-orange-100 p-1.5">
            <GlowingEffect {...GLOW} />
            <div className="relative h-full overflow-hidden rounded-[10px] bg-white">
              {/* Background image */}
              <img src="/bg-card6.png" alt="" aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0" style={{ opacity: 0.35 }} />

              {/* Floating analytics widget */}
              <OperationalHealthWidget />

              {/* True top-right action button */}
              <div className="absolute z-30" style={{ top: 24, right: 24 }}>
                <StripeBtn />
              </div>

              {/* Left text block — 32% width, vertically centered */}
              <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-center p-8" style={{ width: "calc(29% - 32px)" }}>
                <h3 className="text-[17px] sm:text-[20px] lg:text-[21px] font-bold text-carbon leading-tight">Management Visibility</h3>
                <p className="mt-2 text-[13px] text-[#6B7280] leading-relaxed font-normal">Consolidate operational data from every warehouse into one executive view to monitor performance, identify risks and drive informed business decisions.</p>
              </div>

              {/* Right mockup — browser chrome restored for card 6 */}
              <motion.div
                className="absolute z-10 overflow-hidden"
                style={{
                  top: 28,
                  left: "29%",
                  right: 80,
                  bottom: 28,
                  borderRadius: "20px",
                  border: "1px solid #E0E0E0",
                  background: "#fff",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.13), 0 3px 10px rgba(0,0,0,0.07)",
                }}
                whileHover={{ x: -6 }}
                transition={{ type: "spring", stiffness: 90, damping: 14 }}
              >
                {/* macOS chrome bar */}
                <div className="flex items-center gap-1.5 px-3 shrink-0"
                  style={{ height: 32, background: "#F4F4F5", borderBottom: "1px solid #E4E4E7" }}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  <div className="mx-2 flex-1 flex items-center justify-center rounded"
                    style={{ background: "#EBEBED", height: 18, maxWidth: 260 }}>
                    <span className="text-[10px] text-gray-400 font-mono truncate px-2">app.ramsplatform.com</span>
                  </div>
                </div>
                {/* Screenshot */}
                <div className="relative overflow-hidden" style={{ height: "calc(100% - 32px)" }}>
                  <motion.img
                    src="/SS/Screenshot 2026-07-12 124539.png"
                    alt="Platform Analytics"
                    className="w-full h-full object-cover block"
                    style={{ objectPosition: "left top", x: p6.x, y: p6.y }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
