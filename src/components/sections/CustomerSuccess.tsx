"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

type Stat = { value: string; label: string };

type Story = {
  id: string;
  company: string;
  companyColor: string;
  eyebrow: string;
  image: string;
  headline: string;
  body: string;
  industry: string;
  location: string;
  size: string;
  duration: string;
  situation: string;
  approach: string;
  outcome: string;
  quote: string;
  quoteAuthor: string;
  quoteRole: string;
  deployed: string[];
  results: Stat[];
};

const STORIES: Story[] = [
  {
    id: "flipkart",
    company: "Flipkart",
    companyColor: "#2874F0",
    eyebrow: "Retail Distribution · Pune, India",
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=85&auto=format&fit=crop",
    headline:
      "Why Flipkart chose RAMS to run inspections across its distribution centres.",
    body: "500,000 sq ft of high-throughput retail distribution unified into a single inspection and safety platform.",
    industry: "Retail Distribution",
    location: "Pune, India",
    size: "500,000 sq ft",
    duration: "90-day rollout",
    situation:
      "500,000 sq ft of high-throughput retail distribution ran on fragmented inspection systems — rack condition, safety data and audit records lived on paper checklists and disconnected spreadsheets. Regional heads had no way to compare sites, and central operations had no live picture of compliance across the network.",
    approach:
      "RAMS deployed digital inspection workflows, AI Vision monitoring and a unified compliance layer across every Flipkart distribution centre — replacing paper with mobile-first workflows and consolidating every finding into one governance surface.",
    outcome:
      "Within 90 days, every distribution centre was running the same digital inspection standard. Audit preparation dropped from days to hours, and regional operations gained a live compliance view across every site — for the first time working from the same numbers at the same moment.",
    quote:
      "RAMS gave us one source of truth for inspections across every DC. For the first time, our regional heads were looking at the same numbers at the same moment.",
    quoteAuthor: "Priya Menon",
    quoteRole: "Head of Warehouse Operations, Flipkart",
    deployed: ["AI Vision", "Digital Inspection", "AIMS"],
    results: [
      { value: "500k", label: "sq ft unified across sites" },
      { value: "3×", label: "faster audit turnaround" },
      { value: "100%", label: "digital inspection coverage" },
    ],
  },
  {
    id: "dhl",
    company: "DHL",
    companyColor: "#D40511",
    eyebrow: "Global Logistics · Leipzig, Germany",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=1200&q=85&auto=format&fit=crop",
    headline:
      "How DHL modernised fleet visibility across an 820,000 sq ft hub.",
    body: "AI Vision, RTLS positioning and Digital Twin combined into one live surface for every dock and vehicle.",
    industry: "Global Logistics",
    location: "Leipzig, Germany",
    size: "820,000 sq ft",
    duration: "6-month rollout",
    situation:
      "An 820,000 sq ft global logistics hub had no unified view of MHE, docks or bay activity. Vehicle movements, fleet position and rack impacts lived in isolated systems that never spoke to each other — leaving operations reacting to lagging weekly reports.",
    approach:
      "RAMS combined AI Vision, RTLS positioning and Digital Twin into a single live operating surface. Every dock, every vehicle and every rack lane now reports to the same dashboard — visible to site operations and the group management layer at the same time.",
    outcome:
      "The hub now runs on one live surface. Incident response times halved, dock activity and vehicle position resolve in real time, and management sees ground-truth activity instead of a summary written yesterday.",
    quote:
      "For a hub this size, one live view isn't a nice-to-have — it's how you actually run the operation. RAMS made that real.",
    quoteAuthor: "Klaus Weber",
    quoteRole: "Site Director, DHL Leipzig",
    deployed: ["AI Vision", "RTLS", "Digital Twin"],
    results: [
      { value: "820k", label: "sq ft under one view" },
      { value: "2×", label: "faster incident response" },
      { value: "1", label: "live operating surface" },
    ],
  },
  {
    id: "bosch",
    company: "Bosch",
    companyColor: "#EA0016",
    eyebrow: "Industrial Manufacturing · Stuttgart, Germany",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&auto=format&fit=crop",
    headline:
      "Bosch standardised inspections across four production plants with RAMS.",
    body: "Guided inspection workflows, digital twin monitoring and unified compliance reporting across facilities.",
    industry: "Industrial Manufacturing",
    location: "Stuttgart, Germany",
    size: "4 production plants",
    duration: "12-month rollout",
    situation:
      "Four production plants each ran inspection and compliance workflows to their own standard. Central operations had no way to compare performance, share findings or roll out an improvement across the network — every plant reported in its own language.",
    approach:
      "RAMS delivered guided inspection workflows, digital twin monitoring and unified compliance reporting standardised across every Bosch facility. Central operations and plant heads now share one enterprise view, with common data definitions across every site.",
    outcome:
      "All four plants now operate to the same inspection standard. Findings, corrective actions and compliance metrics roll up into one enterprise view — with plant heads able to benchmark performance directly instead of translating between systems.",
    quote:
      "Standardising four plants on the same inspection language changed how we manage the network. We stopped comparing apples to oranges.",
    quoteAuthor: "Andrea Vogel",
    quoteRole: "Head of Global Operations, Bosch",
    deployed: ["Digital Inspection", "Digital Twin", "Compliance Audit"],
    results: [
      { value: "4", label: "plants standardised" },
      { value: "100%", label: "compliance coverage" },
      { value: "1", label: "enterprise view" },
    ],
  },
  {
    id: "lineage",
    company: "Lineage",
    companyColor: "#003C71",
    eyebrow: "Cold Chain Logistics · Rotterdam, Netherlands",
    image:
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?w=1200&q=85&auto=format&fit=crop",
    headline:
      "Lineage keeps sub-zero cold zones audit-ready around the clock.",
    body: "AI Vision and environmental telemetry deployed across 9 cold-zone chambers with real-time alerting.",
    industry: "Cold Chain Logistics",
    location: "Rotterdam, Netherlands",
    size: "9 cold chambers",
    duration: "60-day rollout",
    situation:
      "Nine sub-zero cold-zone chambers required continuous audit-ready compliance — but manual checks and delayed alerts left blind windows during which product integrity could be silently compromised. Cold chain has no forgiveness for lagging data.",
    approach:
      "RAMS deployed AI Vision paired with environmental telemetry across every cold-zone chamber. Temperature, seal integrity and internal activity are continuously verified, with real-time alerting the moment any condition falls outside spec.",
    outcome:
      "Every chamber now runs on continuous verification. Alerts trigger inside 60 seconds when conditions drift, and audit records generate themselves — eliminating the manual checks that used to leave blind windows in the record.",
    quote:
      "Cold chain doesn't forgive blind windows. RAMS closed ours.",
    quoteAuthor: "Erik van der Berg",
    quoteRole: "Compliance Director, Lineage EU",
    deployed: ["AI Vision", "IoT Sensors", "AIMS"],
    results: [
      { value: "9", label: "chambers monitored" },
      { value: "24/7", label: "audit-ready coverage" },
      { value: "<60s", label: "alert response time" },
    ],
  },
  {
    id: "asos",
    company: "ASOS",
    companyColor: "#0E0E0F",
    eyebrow: "E-commerce Fulfilment · Barnsley, UK",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=85&auto=format&fit=crop",
    headline:
      "ASOS accelerated pick-safety operations at peak volume.",
    body: "Vehicle telematics and rack integrity monitoring integrated into every high-throughput fulfilment lane.",
    industry: "E-commerce Fulfilment",
    location: "Barnsley, UK",
    size: "High-throughput fulfilment",
    duration: "Pre-peak rollout",
    situation:
      "Peak-volume e-commerce fulfilment demanded flawless pick-safety across every lane — but visibility into vehicle behaviour and rack integrity lagged the operational tempo. Operations spent peak season reacting to incidents rather than preventing them.",
    approach:
      "RAMS integrated vehicle telematics and rack integrity monitoring into every high-throughput fulfilment lane. Risk signals surface in real time inside the operations dashboard, letting supervisors intervene before an incident disrupts throughput.",
    outcome:
      "Peak volume passed without a single pick-safety incident. Vehicle behaviour and rack integrity now surface risk in real time, letting operations act minutes before a lane is disrupted — turning peak from a coin flip into a controlled operation.",
    quote:
      "Getting through peak without a single pick-safety incident used to feel like a coin flip. It doesn't anymore.",
    quoteAuthor: "Sam Whitfield",
    quoteRole: "Operations Manager, ASOS Barnsley",
    deployed: ["Vehicle Telematics", "AI Vision", "Rack Certification"],
    results: [
      { value: "0", label: "peak-day incidents" },
      { value: "2×", label: "faster risk response" },
      { value: "100%", label: "lane coverage" },
    ],
  },
  {
    id: "toyota",
    company: "Toyota",
    companyColor: "#EB0A1E",
    eyebrow: "Automotive Manufacturing · Nagoya, Japan",
    image:
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&q=85&auto=format&fit=crop",
    headline:
      "Toyota unified asset intelligence across three parts warehouses.",
    body: "Positioning, inspection and asset intelligence combined for a real-time picture of every high-value component.",
    industry: "Automotive Manufacturing",
    location: "Nagoya, Japan",
    size: "3 parts warehouses",
    duration: "4-month rollout",
    situation:
      "Three parts warehouses held high-value components across thousands of SKUs. Asset position, inspection status and cross-site availability required manual reconciliation that lagged real operational need — production planners were working from data that was already stale.",
    approach:
      "RAMS combined positioning, inspection and asset intelligence into a single real-time picture across every Toyota parts warehouse. One live component view now feeds production planning, inventory and quality functions in parallel.",
    outcome:
      "All three warehouses share one live component view. Planners and production see exact position, inspection status and cross-site availability continuously — replacing manual reconciliation with a truth surface that never lags the floor.",
    quote:
      "Every planner now works from the same live picture. That single change made three warehouses feel like one.",
    quoteAuthor: "Kenji Sato",
    quoteRole: "Parts Operations Lead, Toyota Nagoya",
    deployed: ["RTLS", "Digital Inspection", "AIMS"],
    results: [
      { value: "3", label: "warehouses unified" },
      { value: "100%", label: "component visibility" },
      { value: "1", label: "real-time view" },
    ],
  },
];

const GAP = 20;
const PEEK = 0.15;

function CaseStudyModal({ story, onClose }: { story: Story; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const facts = [
    { label: "Industry", value: story.industry },
    { label: "Location", value: story.location },
    { label: "Size", value: story.size },
    { label: "Duration", value: story.duration },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] overflow-y-auto"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

      <div className="flex min-h-full items-start justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white w-full my-auto overflow-hidden"
          style={{ borderRadius: "20px", maxWidth: "1100px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur hover:bg-white flex items-center justify-center transition-colors duration-200 shadow-sm"
          >
            <X className="w-4 h-4 text-carbon" />
          </button>

          {/* ── Section 1 — Hero image with company overlay ── */}
          <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.image}
              alt={story.company}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }}
            />
            <div
              className="absolute inset-x-0 bottom-0"
              style={{ paddingLeft: "clamp(24px, 5vw, 64px)", paddingRight: "clamp(24px, 5vw, 64px)", paddingBottom: "clamp(24px, 4vw, 40px)" }}
            >
              <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/70 mb-3">
                Case Study
              </p>
              <div
                className="text-[32px] sm:text-[42px] font-bold leading-none"
                style={{ letterSpacing: "-0.02em", color: story.companyColor === "#0E0E0F" ? "#FFFFFF" : story.companyColor }}
              >
                {story.company}
              </div>
            </div>
          </div>

          {/* ── Body wrapper — consistent horizontal padding ── */}
          <div style={{ paddingLeft: "clamp(24px, 5vw, 64px)", paddingRight: "clamp(24px, 5vw, 64px)" }}>

            {/* Headline */}
            <div style={{ paddingTop: "clamp(40px, 5vw, 64px)" }}>
              <h2
                className="text-[28px] sm:text-[40px] lg:text-[48px] font-bold text-carbon-alt leading-[1.08]"
                style={{ letterSpacing: "-0.025em" }}
              >
                {story.headline}
              </h2>
            </div>

            {/* At a glance */}
            <div style={{ paddingTop: "clamp(32px, 4vw, 48px)" }}>
              <div
                className="grid grid-cols-2 sm:grid-cols-4"
                style={{ borderTop: "1px solid #E5E5EA", borderBottom: "1px solid #E5E5EA" }}
              >
                {facts.map((f, i) => (
                  <div
                    key={f.label}
                    className="py-6"
                    style={{
                      borderLeft: i > 0 ? "1px solid #E5E5EA" : "none",
                      paddingLeft: i > 0 ? 24 : 0,
                      paddingRight: 16,
                    }}
                  >
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-carbon/50">
                      {f.label}
                    </p>
                    <p className="mt-2 text-[15px] sm:text-[16px] font-semibold text-carbon-alt leading-snug">
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* The story */}
            <div style={{ paddingTop: "clamp(48px, 6vw, 72px)" }}>
              <div className="flex gap-6 sm:gap-8">
                <div
                  className="shrink-0"
                  style={{ width: 2, background: "var(--color-signal-orange)", borderRadius: 2 }}
                />
                <div className="flex-1 max-w-[820px]">
                  {[
                    { label: "The situation", body: story.situation },
                    { label: "The approach", body: story.approach },
                    { label: "The outcome", body: story.outcome },
                  ].map((block, i) => (
                    <div key={block.label} style={{ marginTop: i > 0 ? 40 : 0 }}>
                      <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-signal-orange">
                        {block.label}
                      </p>
                      <p className="mt-3 text-[16px] sm:text-[17px] text-carbon-alt/85 leading-[1.7]">
                        {block.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Pull quote */}
            <div style={{ paddingTop: "clamp(56px, 7vw, 88px)", paddingBottom: "clamp(24px, 3vw, 32px)" }}>
              <div className="max-w-[860px] mx-auto text-center">
                <span
                  className="block text-[64px] leading-none text-signal-orange"
                  aria-hidden="true"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  &ldquo;
                </span>
                <p
                  className="mt-2 text-[24px] sm:text-[30px] lg:text-[34px] font-semibold text-carbon-alt leading-[1.3]"
                  style={{ letterSpacing: "-0.015em" }}
                >
                  {story.quote}
                </p>
                <div className="mt-8">
                  <p className="text-[14px] font-semibold text-carbon-alt">
                    {story.quoteAuthor}
                  </p>
                  <p className="mt-1 text-[12px] text-graphite-alt">
                    {story.quoteRole}
                  </p>
                </div>
              </div>
            </div>

            {/* By the numbers */}
            <div style={{ paddingTop: "clamp(48px, 6vw, 72px)" }}>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-carbon/50 mb-6">
                By the numbers
              </p>
              <div
                className="grid grid-cols-1 sm:grid-cols-3"
                style={{ borderTop: "1px solid #E5E5EA", borderBottom: "1px solid #E5E5EA" }}
              >
                {story.results.map((r, i) => (
                  <div
                    key={r.label}
                    className="py-8"
                    style={{
                      borderLeft: i > 0 ? "1px solid #E5E5EA" : "none",
                      paddingLeft: i > 0 ? 28 : 0,
                      paddingRight: 16,
                    }}
                  >
                    <div
                      className="text-[40px] sm:text-[48px] font-bold text-signal-orange leading-none"
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {r.value}
                    </div>
                    <div className="mt-3 text-[13px] text-graphite-alt leading-snug">
                      {r.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What we deployed */}
            <div style={{ paddingTop: "clamp(40px, 5vw, 56px)", paddingBottom: "clamp(40px, 5vw, 64px)" }}>
              <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-carbon/50 mb-4">
                What we deployed
              </p>
              <div className="flex flex-wrap gap-2">
                {story.deployed.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-[12.5px] font-medium text-carbon-alt"
                    style={{ border: "1px solid #E5E5EA", borderRadius: 999 }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "var(--color-signal-orange)" }}
                    />
                    {m}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function CustomerSuccess() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const active = STORIES.find((s) => s.id === activeId) ?? null;

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

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setViewportWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardWidth =
    viewportWidth > 0
      ? (viewportWidth - GAP * (visibleCount - 1)) / (visibleCount + PEEK)
      : 400;

  const step = cardWidth + GAP;
  const maxIndex = Math.max(0, STORIES.length - visibleCount);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  return (
    <section className="relative w-full bg-white py-24 sm:py-28 lg:py-32">
      <div className="mx-auto px-6 lg:px-14" style={{ maxWidth: 1280 }}>
        {/* Header */}
        <div className="max-w-[820px] mb-10 lg:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[16px] font-bold tracking-[0.22em] uppercase text-signal-orange"
          >
            Customer Success
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[68px] font-bold text-carbon leading-[1.04] mt-3"
          >
            Real operations.
            <br />
            <span className="text-signal-orange">Real outcomes.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-[14px] sm:text-[16px] text-graphite/55 leading-relaxed max-w-[620px]"
          >
            See how enterprise warehouses are improving safety, compliance and
            operational visibility with RAMS.
          </motion.p>
        </div>

        {/* Carousel viewport */}
        <div
          ref={viewportRef}
          className="relative w-full"
          style={{ overflow: "hidden" }}
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
            {STORIES.map((s, i) => (
              <div
                key={s.id}
                style={{ width: cardWidth, flexShrink: 0 }}
              >
                <StoryCard story={s} index={i} onOpen={() => setActiveId(s.id)} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Apple-style pagination — dot pill only */}
        <div className="mt-14 lg:mt-16 flex items-center justify-center gap-3">
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

      <AnimatePresence>
        {active && (
          <CaseStudyModal story={active} onClose={() => setActiveId(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function StoryCard({ story, index, onOpen }: { story: Story; index: number; onOpen: () => void }) {
  const EASE = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: 0.05 + index * 0.05,
        ease: EASE,
      }}
      whileHover="hover"
      animate="rest"
      onClick={onOpen}
      className="group block cursor-pointer"
    >
      {/* Image */}
      <div
        className="relative w-full overflow-hidden rounded-[20px] bg-off-white-alt"
        style={{ height: 280 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.image}
          alt={story.company}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>

      {/* Text */}
      <div className="mt-8 lg:mt-10">
        <div
          className="text-[18px] font-bold leading-none mb-5"
          style={{
            color: story.companyColor,
            letterSpacing: "-0.02em",
          }}
        >
          {story.company}
        </div>

        <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-graphite/55">
          {story.eyebrow}
        </p>
        <h3 className="mt-5 text-[20px] lg:text-[22px] font-bold text-carbon leading-[1.25]">
          {story.headline}
        </h3>
        <p className="mt-5 text-[14px] text-graphite/65 leading-[1.65]">
          {story.body}
        </p>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-carbon group-hover:text-signal-orange transition-colors cursor-pointer"
        >
          Read case study
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
    </motion.div>
  );
}
