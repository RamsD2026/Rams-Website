"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

type Kpi = { value: number; suffix?: string; label: string };

const KPIS: Kpi[] = [
  { value: 100, suffix: "+", label: "Warehouses Digitized" },
  { value: 1, suffix: "M+", label: "Assets Managed" },
  { value: 10, suffix: "M+", label: "AI Events Processed" },
  { value: 24, suffix: "/7", label: "Continuous Monitoring" },
  { value: 99.98, suffix: "%", label: "Platform Availability" },
];

export function TrustCinematic() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ minHeight: "min(100vh, 720px)" }}
    >
      {/* Video */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: videoScale, y: videoY }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/download.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.40) 40%, rgba(0,0,0,0.70) 100%)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-20 py-32 lg:py-40"
        style={{ minHeight: "min(100vh, 720px)" }}
      >
        <div className="max-w-[1280px] w-full text-center text-white flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-base font-bold tracking-[0.22em] uppercase text-signal-orange"
          >
            Proven where it matters
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[68px] font-bold text-white leading-[1.04] mt-3 max-w-[820px] mx-auto"
          >
            Trusted where operations
            <br className="hidden sm:block" /> never stop.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-[14px] sm:text-[16px] text-white/70 leading-relaxed max-w-[560px] mx-auto"
          >
            RAMS powers engineering, AI vision and operational intelligence
            across enterprise warehouses — keeping people, equipment and
            infrastructure connected in real time.
          </motion.p>

          {/* KPI STRIP — number stacked over label, 5 across, dividers between */}
          <div
            className="flex items-stretch justify-between w-full max-w-[1280px] mx-auto"
            style={{ marginTop: "clamp(80px, 12vh, 200px)" }}
          >
            {KPIS.map((k, i) => (
              <motion.div
                key={k.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8"
                style={{
                  borderLeft:
                    i > 0 ? "1px solid rgba(255,255,255,0.18)" : "none",
                }}
              >
                <div
                  className="font-bold text-white leading-[1] whitespace-nowrap"
                  style={{
                    fontSize: "clamp(22px, 3.2vw, 52px)",
                    letterSpacing: "-0.03em",
                  }}
                >
                  <CountUp value={k.value} suffix={k.suffix} />
                </div>
                <div
                  className="mt-3 sm:mt-4 text-white/70 leading-tight"
                  style={{ fontSize: "clamp(10px, 0.95vw, 15px)" }}
                >
                  {k.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(eased * value);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  const isDecimal = !Number.isInteger(value);
  const rendered = isDecimal ? display.toFixed(2) : Math.round(display);

  return (
    <span ref={ref}>
      {rendered}
      {suffix ?? ""}
    </span>
  );
}
