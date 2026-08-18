"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { IndustryModal } from "./IndustryModal";

type Industry = {
  id: string;
  name: string;
  description: string;
  focus: string;
  gradient: string;
  accent: string;
  image?: string;
};

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const INDUSTRIES: Industry[] = [
  {
    id: "distribution",
    name: "Distribution & Logistics",
    description:
      "Real-time visibility across high-volume fulfilment centres.",
    focus: "AI Vision",
    gradient:
      "linear-gradient(135deg, #0F172A 0%, #1E293B 45%, #334155 100%)",
    accent: "#60A5FA",
    image: UNSPLASH("photo-1553413077-190dd305871c"),
  },
  {
    id: "ecommerce",
    name: "E-commerce Fulfilment",
    description:
      "Accelerate picking while protecting racks, people and equipment.",
    focus: "MHE Safety",
    gradient:
      "linear-gradient(135deg, #1A1A1F 0%, #2D1D2A 45%, #4A2540 100%)",
    accent: "#F472B6",
    image: UNSPLASH("photo-1601598851547-4302969d0614"),
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description:
      "Connect production warehouses with intelligent asset monitoring.",
    focus: "Asset Monitoring",
    gradient:
      "linear-gradient(135deg, #1C1917 0%, #292524 45%, #44403C 100%)",
    accent: "#FB923C",
    image: UNSPLASH("photo-1581091226825-a6a2a5aee158"),
  },
  {
    id: "cold-storage",
    name: "Cold Storage",
    description:
      "Reliable operation in extreme environments with rugged hardware.",
    focus: "Rugged Hardware",
    gradient:
      "linear-gradient(135deg, #0B2545 0%, #13315C 45%, #1F5582 100%)",
    accent: "#7DD3FC",
    image: UNSPLASH("photo-1587293852726-70cdb56c2866"),
  },
  {
    id: "retail",
    name: "Retail Distribution",
    description:
      "Standardise safety and inventory across multiple regional DCs.",
    focus: "Inventory",
    gradient:
      "linear-gradient(135deg, #1E1B4B 0%, #312E81 45%, #4338CA 100%)",
    accent: "#A5B4FC",
    image: UNSPLASH("photo-1586528116311-ad8dd3c8310d"),
  },
  {
    id: "3pl",
    name: "3PL & Warehousing",
    description:
      "Give every client complete visibility without operational complexity.",
    focus: "Multi-tenant Ops",
    gradient:
      "linear-gradient(135deg, #052E2B 0%, #0F3D3A 45%, #14504B 100%)",
    accent: "#5EEAD4",
    image: UNSPLASH("photo-1600880292203-757bb62b4baf"),
  },
  {
    id: "pharma",
    name: "Pharma & Healthcare",
    description:
      "Compliance-first warehouse intelligence with complete traceability.",
    focus: "Compliance",
    gradient:
      "linear-gradient(135deg, #1B1B1F 0%, #262632 45%, #3A3A4A 100%)",
    accent: "#C4B5FD",
    image: UNSPLASH("photo-1582719508461-905c673771fd"),
  },
  {
    id: "automotive",
    name: "Automotive",
    description:
      "Track heavy assets, forklifts and high-value inventory in real time.",
    focus: "Asset Tracking",
    gradient:
      "linear-gradient(135deg, #0B0B0F 0%, #1B1B22 45%, #33333F 100%)",
    accent: "#FCD34D",
    image: UNSPLASH("photo-1580982327559-c1202864eb05"),
  },
];

const GAP = 20;
const PEEK = 0.15; // 15% of a card visible as "peek" to hint more content

export function IndustriesCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  // Responsive visible-card count (desktop 3, tablet 2, mobile 1)
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw < 640) setVisibleCount(1);
      else if (vw < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Track the carousel viewport (clipped area) width to size cards
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setViewportWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Card width so that `visibleCount` cards fit plus a partial peek of the next.
  //   viewportWidth = cardWidth * (visibleCount + PEEK) + GAP * (visibleCount - 1)
  const cardWidth =
    viewportWidth > 0
      ? (viewportWidth - GAP * (visibleCount - 1)) / (visibleCount + PEEK)
      : 400;

  const step = cardWidth + GAP;
  const maxIndex = Math.max(0, INDUSTRIES.length - visibleCount);

  // Clamp index when responsive changes shrink maxIndex
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);


  return (
    <section className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto px-6 lg:px-14" style={{ maxWidth: 1280 }}>
        {/* Heading */}
        <div className="mb-10 lg:mb-14">
          <div className="max-w-[820px]">
            <p className="text-base font-bold tracking-[0.22em] uppercase text-signal-orange">
              Industries
            </p>
            <h2 className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[68px] font-bold text-carbon leading-[1.04] mt-3">
              Purpose-built for
              <br />
              <span className="text-signal-orange">every operation.</span>
            </h2>
            <p className="mt-6 text-[14px] sm:text-base text-graphite/55 leading-relaxed max-w-[620px]">
              Whether you&apos;re managing a single distribution centre or a
              global logistics network, RAMS adapts to the way your operation
              moves.
            </p>
          </div>
        </div>

        {/* Carousel viewport — clips right side, next card peeks */}
        <div
          ref={viewportRef}
          className="relative w-full"
          style={{
            overflow: "hidden",
          }}
        >
          <motion.div
            className="flex"
            style={{ gap: GAP, willChange: "transform" }}
            animate={{ x: -index * step }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 220, damping: 30, mass: 0.9 }
            }
          >
            {INDUSTRIES.map((ind, i) => (
              <div
                key={ind.id}
                style={{
                  width: cardWidth,
                  flexShrink: 0,
                }}
              >
                <IndustryCard
                  industry={ind}
                  index={i}
                  reduceMotion={!!reduceMotion}
                  onOpen={setOpenId}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Apple-style pagination — dot pill + circular chevrons */}
        <div className="mt-14 flex items-center justify-center gap-3">
          {/* Dot pill */}
          <div
            className="flex items-center"
            style={{
              background: "#F0F0F2",
              borderRadius: 999,
              padding: "0 18px",
              height: 44,
              gap: 14,
            }}
          >
            {Array.from({ length: maxIndex + 1 }).map((_, i) => {
              const active = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={active ? "true" : undefined}
                  style={{
                    width: active ? 24 : 6,
                    height: 6,
                    borderRadius: 999,
                    background: active ? "var(--color-carbon-alt)" : "#86868B",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition:
                      "width 320ms cubic-bezier(0.22,1,0.36,1), background 200ms ease",
                  }}
                />
              );
            })}
          </div>

        </div>
      </div>

      {openId && (
        <IndustryModal
          industry={INDUSTRIES.find((i) => i.id === openId)!}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  );
}

function IndustryCard({
  industry,
  index,
  reduceMotion,
  onOpen,
}: {
  industry: Industry;
  index: number;
  reduceMotion: boolean;
  onOpen: (id: string) => void;
}) {
  const EASE = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.article
      initial="rest"
      animate="rest"
      whileHover={reduceMotion ? undefined : "hover"}
      onClick={() => onOpen(industry.id)}
      className="relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: 28,
        width: "100%",
        height: 560,
        background: industry.gradient,
      }}
    >
      {/* Entrance animation wrapper */}
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.55, ease: EASE, delay: index * 0.05 }}
      >
        {/* Media layer — zoom on hover */}
        <motion.div
          className="absolute inset-0"
          variants={{
            rest: { scale: 1.04 },
            hover: { scale: 1.12 },
          }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            background: industry.image
              ? `url(${industry.image}) center/cover no-repeat`
              : `radial-gradient(120% 80% at 20% 20%, ${industry.accent}22 0%, transparent 55%), ${industry.gradient}`,
            willChange: "transform",
          }}
        />

        {/* Grain */}
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Bottom gradient — deepens on hover */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          variants={{
            rest: { opacity: 0.85 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 65%, rgba(0,0,0,0.82) 100%)",
          }}
        />

        {/* Accent glow — brightens on hover */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            background: `radial-gradient(70% 45% at 50% 100%, ${industry.accent}33 0%, transparent 70%)`,
          }}
        />

        {/* Content — rises on hover */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4"
          variants={{
            rest: { y: 0 },
            hover: { y: -6 },
          }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ padding: 28 }}
        >
          <div>
            <h3
              className="text-white text-[24px] lg:text-[26px] font-semibold leading-[1.15]"
              style={{ letterSpacing: "-0.02em", margin: 0 }}
            >
              {industry.name}
            </h3>
            <p
              className="text-white/80 text-[14px] leading-[1.5] max-w-[320px]"
              style={{ marginTop: 8, marginBottom: 0 }}
            >
              {industry.description}
            </p>
          </div>
          <motion.span
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
            variants={{
              rest: {
                backgroundColor: "rgba(255,255,255,0.14)",
                scale: 1,
              },
              hover: {
                backgroundColor: "rgba(255,255,255,1)",
                scale: 1.1,
              },
            }}
            transition={{ duration: 0.4, ease: EASE }}
            style={{
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <motion.span
              className="flex items-center justify-center"
              variants={{
                rest: { color: "var(--color-white)" },
                hover: { color: "var(--color-carbon)" },
              }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
            </motion.span>
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
