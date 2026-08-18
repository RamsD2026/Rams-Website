"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import {
  X,
  Check,
  Download,
  FileText,
  Box,
  BookOpen,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Warehouse,
  Factory,
  Truck,
  Snowflake,
  Layers,
} from "lucide-react";

type Product = {
  title: string;
  description: string;
  accent: string;
  image: string;
  tagline?: string;
  overview?: string;
  features?: { title: string; description: string }[];
  specs?: { label: string; value: string }[];
};

const DEFAULT_IMG =
  "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_37_34%20PM.png";

type Tab = {
  id: string;
  label: string;
  gradient: string;
  products: Product[];
};

const TABS: Tab[] = [
  {
    id: "ai-vision",
    label: "AI Vision",
    gradient: "linear-gradient(135deg, #FFF6EE 0%, #FFECDA 100%)",
    products: [
      { title: "AI Cameras", description: "360 warehouse perception", accent: "#FF6A00", image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_37_34%20PM.png" },
      { title: "Driver Monitoring", description: "In-cab operator safety", accent: "#E88A5C", image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_42_29%20PM.png" },
      { title: "PPE Detection", description: "Automated compliance checks", accent: "#F27D3A", image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_47_25%20PM.png" },
      { title: "AI Analytics", description: "Real-time event intelligence", accent: "#D96A2C", image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_59_57%20PM.png" },
    ],
  },
  {
    id: "omnibox",
    label: "OmniBox",
    gradient: "linear-gradient(135deg, #F1F4FA 0%, #E4EBF6 100%)",
    products: [
      { title: "OmniBox Edge", description: "Local AI inference", accent: "#5A7CBF", image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_59_57%20PM.png" },
      { title: "OmniBox AI", description: "Neural processing", accent: "#4E6CA5", image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_59_57%20PM.png" },
      { title: "OmniBox Motion", description: "IMU & vibration sensing", accent: "#7B8BB0", image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_59_57%20PM.png" },
      { title: "OmniBox Core", description: "Central orchestration", accent: "#3E5C88", image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_59_57%20PM.png" },
    ],
  },
  {
    id: "location",
    label: "Location Intelligence",
    gradient: "linear-gradient(135deg, #EEF7F4 0%, #DCF0E8 100%)",
    products: [
      { title: "LiDAR", description: "High-precision 3D mapping", accent: "#4CA37F", image: DEFAULT_IMG },
      { title: "RTLS", description: "Real-time asset tracking", accent: "#3E8F70", image: DEFAULT_IMG },
      { title: "Indoor Positioning", description: "Sub-meter accuracy indoors", accent: "#6B9F82", image: DEFAULT_IMG },
      { title: "Warehouse Mapping", description: "Continuous floor intelligence", accent: "#5A8B70", image: DEFAULT_IMG },
    ],
  },
  {
    id: "inspection",
    label: "Guided Inspection",
    gradient: "linear-gradient(135deg, #F4F0F9 0%, #EAE0F1 100%)",
    products: [
      { title: "AirScan", description: "Drone-based aerial inspection", accent: "#8B7DAA", image: DEFAULT_IMG },
      { title: "FloorScan", description: "Ground-level asset audits", accent: "#7A6EA0", image: DEFAULT_IMG },
      { title: "Sensor Stack", description: "Multi-modal sensor fusion", accent: "#9B8CBE", image: DEFAULT_IMG },
      { title: "Inspection AI", description: "Automated defect classification", accent: "#6E5F91", image: DEFAULT_IMG },
    ],
  },
  {
    id: "platform",
    label: "Sensor",
    gradient: "linear-gradient(135deg, #EEF6F7 0%, #DDEDF0 100%)",
    products: [
      { title: "Digital Twin", description: "Live operational model", accent: "#5EA9AA", image: DEFAULT_IMG },
      { title: "Management Dashboard", description: "Unified control surface", accent: "#4A9598", image: DEFAULT_IMG },
      { title: "Workflow Engine", description: "Automated task orchestration", accent: "#6DB9BB", image: DEFAULT_IMG },
      { title: "Enterprise APIs", description: "Native integrations everywhere", accent: "#3F8285", image: DEFAULT_IMG },
    ],
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

function ProductCard({
  product,
  index,
  onOpen,
}: {
  product: Product;
  index: number;
  onOpen: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08 * index, ease: easeOut }}
      onClick={onOpen}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      className="group relative flex flex-col cursor-pointer bg-white overflow-hidden"
      style={{
        borderRadius: 16,
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "border-color 300ms ease, box-shadow 300ms ease",
      }}
    >
      {/* Image tile */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: "1 / 1",
          background: "#FAFAFB",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />
        {/* thin bottom divider between media & content */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px"
          style={{ background: "rgba(0,0,0,0.05)" }}
        />
      </div>

      {/* Content */}
      <div
        className="relative flex flex-col"
        style={{ padding: 20 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="text-[15px] font-semibold text-carbon"
              style={{ letterSpacing: "-0.01em", margin: 0 }}
            >
              {product.title}
            </h3>
            <p
              className="text-[13px] text-graphite-alt leading-[1.5]"
              style={{ marginTop: 6, marginBottom: 0 }}
            >
              {product.description}
            </p>
          </div>
          {/* accent dot */}
          <span
            aria-hidden
            className="shrink-0 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
            style={{
              width: 6,
              height: 6,
              background: product.accent,
              marginTop: 8,
            }}
          />
        </div>

        {/* Learn more link */}
        <div
          className="inline-flex items-center gap-1 text-[12.5px] font-medium"
          style={{ marginTop: 16, color: product.accent }}
        >
          <span>Learn more</span>
          <ChevronRight
            className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </div>
      </div>
    </motion.article>
  );
}

/* ══════════════════════════════════════════════════════════════
   PRODUCT DETAIL EXPERIENCE (as full-screen modal)
   Sections: Nav / Hero / Scroll rotation / Hotspots / 3 Feature
   moments / At a glance / Tech specs / Compare / Accessories /
   Downloads / Gallery / Industries / Final CTA
   ══════════════════════════════════════════════════════════════ */

const HOTSPOTS: {
  x: number;
  y: number;
  label: string;
  sub: string;
  metric: string;
}[] = [
  { x: 38, y: 38, label: "AI Lens", sub: "Industrial-grade optical sensor tuned for warehouse light.", metric: "24 MP" },
  { x: 62, y: 34, label: "Thermal Module", sub: "Long-range imaging that sees through darkness and dust.", metric: "160 m" },
  { x: 50, y: 55, label: "AI Processor", sub: "On-device inference. Zero cloud round-trip.", metric: "20 TOPS" },
  { x: 66, y: 62, label: "IR Illuminator", sub: "Uniform illumination for reliable night vision.", metric: "940 nm" },
  { x: 36, y: 66, label: "IP67 Housing", sub: "Sealed against dust, wash-downs, and shift after shift.", metric: "IP67" },
];

function Hotspot({
  x,
  y,
  label,
  sub,
  metric,
  accent,
  delay,
}: {
  x: number;
  y: number;
  label: string;
  sub: string;
  metric?: string;
  accent: string;
  delay: number;
}) {
  const [open, setOpen] = useState(false);
  const openAbove = y > 55;
  return (
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="relative flex items-center justify-center w-10 h-10 rounded-full group"
        aria-label={label}
      >
        <motion.span
          className="absolute rounded-full"
          style={{
            width: 18,
            height: 18,
            border: `1.5px solid ${accent}`,
          }}
          animate={{ scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay }}
        />
        <motion.span
          className="absolute rounded-full"
          style={{
            width: 18,
            height: 18,
            border: `1.5px solid ${accent}`,
          }}
          animate={{ scale: [1, 3.2, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: delay + 0.6 }}
        />
        <motion.span
          className="relative rounded-full block"
          animate={{ scale: open ? 1.15 : 1 }}
          transition={{ duration: 0.25, ease: easeOut }}
          style={{
            width: 14,
            height: 14,
            background: accent,
            boxShadow: `0 0 0 3px rgba(255,255,255,0.95), 0 4px 14px ${accent}88`,
          }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: openAbove ? -4 : 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: openAbove ? -4 : 4, scale: 0.96 }}
            transition={{ duration: 0.28, ease: easeOut }}
            className={`absolute left-1/2 -translate-x-1/2 w-[260px] pointer-events-none ${
              openAbove ? "bottom-full mb-4" : "top-full mt-4"
            }`}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                [openAbove ? "bottom" : "top"]: -14,
                width: 1,
                height: 14,
                background: `linear-gradient(${openAbove ? "180deg" : "0deg"}, transparent, ${accent})`,
              }}
            />
            <div
              className="relative text-left overflow-hidden"
              style={{
                borderRadius: 16,
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "saturate(180%) blur(24px)",
                WebkitBackdropFilter: "saturate(180%) blur(24px)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: `0 1px 0 rgba(255,255,255,0.7) inset, 0 20px 40px -10px rgba(0,0,0,0.18), 0 8px 20px -8px ${accent}55`,
              }}
            >
              <div
                className="absolute inset-x-0 top-0"
                style={{
                  height: 3,
                  background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                }}
              />
              <div style={{ padding: 20 }}>
                <div className="flex items-center justify-between" style={{ gap: 12 }}>
                  <p
                    className="text-[10px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: accent, margin: 0 }}
                  >
                    Component
                  </p>
                  {metric && (
                    <span
                      className="text-[10px] font-mono tracking-wide"
                      style={{
                        color: accent,
                        background: `${accent}18`,
                        padding: "3px 8px",
                        borderRadius: 999,
                      }}
                    >
                      {metric}
                    </span>
                  )}
                </div>
                <p
                  className="text-[17px] font-semibold text-carbon-alt leading-[1.2]"
                  style={{ letterSpacing: "-0.015em", marginTop: 10, marginBottom: 0 }}
                >
                  {label}
                </p>
                <p
                  className="text-[12.5px] text-graphite-alt leading-[1.5]"
                  style={{ marginTop: 8, marginBottom: 0 }}
                >
                  {sub}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function defaultFeatures(product: Product): {
  title: string;
  description: string;
  image?: string;
}[] {
  return (
    (product.features as { title: string; description: string; image?: string }[] | undefined) ?? [
      {
        title: "Detect everything.",
        description: `People. Forklifts. Pallets. Hazards. ${product.title} sees your entire floor in real time and reasons about what matters.`,
        image: "/Product/Detect%20everything..png",
      },
      {
        title: "Edge AI. On-device.",
        description: `A dedicated neural processor runs inference locally. No cloud latency. No bandwidth bottleneck. Just answers.`,
        image: "/Product/Edge%20AI.%20On-device..png",
      },
      {
        title: "Built for the warehouse.",
        description: `IP67 sealed, -20 to 60 degrees, PoE powered. Engineered to disappear into your operation and never miss a shift.`,
        image: "/Product/Built%20for%20the%20warehouse..png",
      },
    ]
  );
}

type SpecItem = {
  label: string;
  value: string;
  heading?: string;
  detail?: string;
};

function defaultSpecs(product: Product): SpecItem[] {
  return (
    (product.specs as SpecItem[] | undefined) ?? [
      {
        label: "Sensor",
        value: "24MP Sony industrial CMOS",
        heading: "Warehouse-grade imaging.",
        detail:
          "Sony's industrial CMOS sensor captures fine detail across the floor. Tuned for mixed lighting so pallets, faces and hazards stay legible from dock to dock.",
      },
      {
        label: "Resolution",
        value: "4K @ 60fps",
        heading: "Every frame counts.",
        detail:
          "Native 4K at 60 fps gives models a smooth, high-fidelity stream. Fast motion — forklifts, spills, dropped loads — stays crisp and analysable.",
      },
      {
        label: "Field of view",
        value: "120 degree diagonal",
        heading: "Coverage without stitching.",
        detail:
          "A 120 degree diagonal FOV covers an aisle end-to-end from a single mount. Fewer cameras, fewer blind spots, cleaner scene reconstruction.",
      },
      {
        label: "IR range",
        value: "Up to 40m",
        heading: "See in the dark.",
        detail:
          "Onboard IR illumination reaches 40 metres for reliable night operations. Uniform light patterns avoid the hotspots that trip up detection models.",
      },
      {
        label: "IP rating",
        value: "IP67 dust & water sealed",
        heading: "Built to be ignored.",
        detail:
          "IP67 sealing shrugs off dust, wash-downs and rain. Deploy indoors, outdoors, at loading bays — no separate enclosure required.",
      },
      {
        label: "Power",
        value: "PoE++ (12W typical)",
        heading: "One cable in.",
        detail:
          "PoE++ delivers data and power over a single run. Typical draw is 12W, freeing you from separate power drops and simplifying installs.",
      },
      {
        label: "Operating temp",
        value: "-20C to 60C",
        heading: "Cold storage to yard.",
        detail:
          "Rated from -20°C freezers to 60°C outdoor summer roofs. Consistent performance without derating across your whole footprint.",
      },
      {
        label: "AI compute",
        value: "8 TOPS on-device",
        heading: "Inference at the source.",
        detail:
          "A dedicated NPU runs 8 TOPS locally, keeping models fast and private. No round trip to the cloud, no bandwidth tax on the network.",
      },
      {
        label: "Connectivity",
        value: "Gigabit Ethernet, Wi-Fi 6",
        heading: "Slots into any stack.",
        detail:
          "Gigabit wired backbone with Wi-Fi 6 fallback for retrofit sites. RTSP, MQTT and REST out of the box for straightforward integrations.",
      },
      {
        label: "Warranty",
        value: "3-year enterprise SLA",
        heading: "Peace of mind at scale.",
        detail:
          "A three-year enterprise SLA covers hardware and firmware with priority replacement. Designed for fleets, not just single-unit projects.",
      },
    ]
  );
}

/* ══════════ Sticky product nav (back button + section tabs) ══════════ */
const NAV_TABS: { id: string; label: string }[] = [
  { id: "features", label: "Highlights" },
  { id: "glance", label: "At a glance" },
  { id: "specs", label: "Specs" },
  { id: "compare", label: "Compare" },
  { id: "accessories", label: "Accessories" },
  { id: "downloads", label: "Downloads" },
  { id: "gallery", label: "Gallery" },
];

function ProductNav({
  product,
  category,
  onClose,
  scrollRef,
}: {
  product: Product;
  category: string;
  onClose: () => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [activeId, setActiveId] = useState<string>(NAV_TABS[0].id);
  const NAV_HEIGHT = 108;

  const scrollTo = (id: string) => {
    const container = scrollRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(`#${id}`);
    if (!el) return;
    const target =
      container.scrollTop +
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      NAV_HEIGHT;
    container.scrollTo({ top: target, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const nodes = NAV_TABS.map((t) =>
      container.querySelector<HTMLElement>(`#${t.id}`),
    ).filter((n): n is HTMLElement => !!n);
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        root: container,
        rootMargin: `-${NAV_HEIGHT + 20}px 0px -55% 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [scrollRef]);

  return (
    <div
      className="sticky top-0 z-40 backdrop-blur-xl"
      style={{
        background: "rgba(255,255,255,0.92)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      {/* Row 1 — product name + primary CTA */}
      <div
        className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-6"
        style={{ height: 64 }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="group inline-flex items-center gap-1 text-[13px] font-medium text-graphite-alt hover:text-carbon-alt transition-colors shrink-0"
            aria-label="Back"
          >
            <ArrowLeft
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={2}
            />
          </button>
          <span
            aria-hidden
            className="h-4 w-px bg-[#D2D2D7] shrink-0"
          />
          <h1
            className="text-[18px] sm:text-[22px] font-semibold text-carbon-alt tracking-[-0.01em] leading-tight truncate"
            style={{ margin: 0 }}
          >
            {product.title}
            <span
              className="hidden sm:inline text-[#86868B] font-normal"
              style={{ marginLeft: 8 }}
            >
              ({category})
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <div className="hidden md:flex flex-col items-end leading-tight">
            <span className="text-[13px] font-semibold text-carbon-alt">
              Enterprise deployment
            </span>
            <span className="text-[11.5px] text-[#86868B]">
              Custom pricing ·{" "}
              <span style={{ color: product.accent }}>Contact sales</span>
            </span>
          </div>
          <button
            type="button"
            className="text-[13px] font-medium text-white px-5 py-2 rounded-full transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ background: product.accent }}
          >
            Book Demo
          </button>
        </div>
      </div>

      {/* Row 2 — section tabs */}
      <div
        className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10"
        style={{
          borderTop: "1px solid rgba(0,0,0,0.05)",
          height: 44,
        }}
      >
        <div
          className="h-full flex items-center gap-6 overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: "none" }}
        >
          {NAV_TABS.map((t) => {
            const isActive = activeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => scrollTo(t.id)}
                className="relative h-full inline-flex items-center text-[13px] transition-colors whitespace-nowrap"
                style={{
                  color: isActive ? "var(--color-carbon-alt)" : "var(--color-graphite-alt)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {t.label}
                {isActive && (
                  <span
                    className="absolute left-0 right-0"
                    style={{
                      bottom: -1,
                      height: 2,
                      background: product.accent,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════ Individual feature moment (full-viewport hero-style) ══════════ */
function ProductModal({
  product,
  category,
  onClose,
}: {
  product: Product;
  category: string;
  onClose: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const rotationSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  /* ── Hero mouse tilt ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(useTransform(mouseY, [-1, 1], [8, -8]), {
    stiffness: 120,
    damping: 20,
  });
  const tiltY = useSpring(useTransform(mouseX, [-1, 1], [-12, 12]), {
    stiffness: 120,
    damping: 20,
  });

  /* ── Scroll-driven product rotation ── */
  const { scrollYProgress: rotProgress } = useScroll({
    target: rotationSectionRef,
    container: scrollRef,
    offset: ["start start", "end end"],
  });
  const glow = useTransform(rotProgress, [0, 0.5, 1], [0.2, 0.5, 0.2]);
  const rotY = useMotionValue(0);
  const [rotAngle, setRotAngle] = useState(0);
  useMotionValueEvent(rotY, "change", (v) => {
    setRotAngle(((v % 360) + 360) % 360);
  });
  const dragStateRef = useRef<{ startX: number; startAngle: number } | null>(null);
  const handleRotStart = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current = { startX: e.clientX, startAngle: rotY.get() };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handleRotMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current) return;
    const dx = e.clientX - dragStateRef.current.startX;
    rotY.set(dragStateRef.current.startAngle + dx * 0.6);
  };
  const handleRotEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const features = defaultFeatures(product);
  const specs = defaultSpecs(product);
  const specHighlights = specs.slice(0, 3);
  const [openSpec, setOpenSpec] = useState<string | null>(null);
  const currentTab = TABS.find((t) =>
    t.products.some((p) => p.title === product.title)
  );
  const compareModels: Product[] = currentTab?.products ?? [product];

  const accessories = [
    { title: "Wall Mount", note: "Universal steel bracket", image: "/Product/sensor-removebg-preview.png" },
    { title: "Pole Mount", note: "For yard & outdoor use", image: "/Product/ChatGPT_Image_Aug_1__2026__10_41_00_PM-removebg-preview.png" },
    { title: "PoE Injector", note: "1G / 90W passthrough", image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2008_52_15%20PM.png" },
    { title: "AI Beacon", note: "Visual alert companion", image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_47_25%20PM.png" },
    { title: "OmniBox Edge", note: "Companion compute node", image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_59_57%20PM.png" },
  ];

  const downloads = [
    { title: "Datasheet", note: "Full technical specs", icon: FileText },
    { title: "CAD Model", note: "STEP / IGES / STL", icon: Box },
    { title: "Install Guide", note: "PDF, 24 pages", icon: BookOpen },
    { title: "API Docs", note: "REST / gRPC / MQTT", icon: FileText },
    { title: "Certificates", note: "ISO, SOC 2, CE", icon: ShieldCheck },
  ];

  const gallery: { label: string; image: string; span: "wide" | "tall" | "square" }[] = [
    {
      label: "In the aisle",
      image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2011_33_00%20PM.png",
      span: "wide",
    },
    {
      label: "Dock coverage",
      image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2011_32_53%20PM.png",
      span: "tall",
    },
    {
      label: "Bay view",
      image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2011_18_42%20PM.png",
      span: "square",
    },
    {
      label: "Detail",
      image: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2007_37_34%20PM.png",
      span: "square",
    },
  ];

  const industries: {
    name: string;
    icon: typeof Warehouse;
    blurb: string;
  }[] = [
    { name: "Warehouse", icon: Warehouse, blurb: "Aisle-level perception for high-throughput fulfilment centres." },
    { name: "Manufacturing", icon: Factory, blurb: "Line safety, quality inspection and floor-wide situational awareness." },
    { name: "Logistics", icon: Truck, blurb: "Yard, dock and gate coverage that keeps trailers moving." },
    { name: "Cold Storage", icon: Snowflake, blurb: "Rated for freezer environments with condensation-safe housings." },
    { name: "Distribution", icon: Layers, blurb: "End-to-end visibility across sortation, staging and outbound." },
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mouseX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    mouseY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] bg-white"
    >
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden"
      >
        {/* ─────────────── STICKY PRODUCT NAV ─────────────── */}
        <ProductNav
          product={product}
          category={category}
          onClose={onClose}
          scrollRef={scrollRef}
        />

        {/* ─────────────── 1. HERO ─────────────── */}
        <section
          ref={heroRef}
          onMouseMove={handleMouseMove}
          className="relative flex flex-col items-center overflow-hidden"
          style={{
            background: "var(--color-white)",
            paddingTop: 160,
            paddingBottom: 160,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
            className="text-center px-6 max-w-[900px] mx-auto"
          >
            <p
              className="text-[12px] font-semibold tracking-[0.24em] uppercase"
              style={{ color: product.accent }}
            >
              {category}
            </p>
            <h1
              className="mt-4 text-[48px] sm:text-[68px] lg:text-[88px] font-semibold text-carbon-alt leading-[1.0]"
              style={{ letterSpacing: "-0.035em" }}
            >
              {product.title}
            </h1>
            <p className="mt-5 text-[18px] sm:text-[22px] lg:text-[24px] text-carbon-alt/70 leading-[1.35] max-w-[640px] mx-auto">
              {product.description}. Industrial-grade hardware, engineered for
              the modern warehouse.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                className="text-[14px] font-medium text-white px-6 py-2.5 rounded-full transition-opacity hover:opacity-90"
                style={{ background: product.accent }}
              >
                Book Demo
              </button>
              <button className="text-[14px] font-medium text-carbon-alt bg-transparent border border-carbon-alt/25 hover:border-carbon-alt px-6 py-2.5 rounded-full transition-colors inline-flex items-center gap-2">
                <Download className="w-3.5 h-3.5" /> Download Datasheet
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: easeOut, delay: 0.3 }}
            className="relative mx-auto w-full max-w-[640px] aspect-square"
            style={{ perspective: 1400, marginTop: 120 }}
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                rotateX: tiltX,
                rotateY: tiltY,
                transformStyle: "preserve-3d",
              }}
              className="w-full h-full"
            >
              <video
                key={product.title}
                src={
                  product.title.toLowerCase().includes("omnibox")
                    ? "/Product/Omni box.mp4"
                    : "/Product/AI vision Camera.mp4"
                }
                autoPlay
                loop
                muted
                playsInline
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.currentTime >= 8) v.currentTime = 0;
                }}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>

        </section>

        {/* ─────────────── 2. SCROLL-DRIVEN ROTATION (hidden) ─────────────── */}
        <section
          ref={rotationSectionRef}
          className="relative hidden"
          style={{ height: "90vh", background: "#050505" }}
        >
          <div className="sticky top-12 h-[calc(90vh-3rem)] overflow-hidden">
            <div
              className="h-full max-w-[1200px] mx-auto px-6 grid grid-rows-[auto_1fr_auto]"
              style={{ paddingTop: 48, paddingBottom: 40 }}
            >
              <div className="text-center">
                <p
                  className="text-[12px] font-semibold tracking-[0.24em] uppercase"
                  style={{ color: product.accent }}
                >
                  Every angle
                </p>
                <h2
                  className="mt-3 text-[32px] sm:text-[44px] lg:text-[56px] font-semibold text-white leading-[1.02]"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  Designed to be studied.
                </h2>
              </div>

              <div className="relative flex items-center justify-center min-h-0">
                <div
                  className="relative w-full max-w-[480px] cursor-grab active:cursor-grabbing touch-none select-none"
                  style={{ perspective: 1600, aspectRatio: "1 / 1" }}
                  onPointerDown={handleRotStart}
                  onPointerMove={handleRotMove}
                  onPointerUp={handleRotEnd}
                  onPointerCancel={handleRotEnd}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background: `radial-gradient(50% 40% at 50% 55%, ${product.accent}66 0%, transparent 70%)`,
                      opacity: glow,
                      filter: "blur(48px)",
                    }}
                  />
                  {(() => {
                    const views = [
                      {
                        src: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2011_33_00%20PM.png",
                        at: 0,
                        label: "Front",
                      },
                      {
                        src: product.image,
                        at: 120,
                        label: "3/4",
                      },
                      {
                        src: "/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2011_32_53%20PM.png",
                        at: 240,
                        label: "Side",
                      },
                    ];
                    const window = 70;
                    const angularOpacity = (cur: number, target: number) => {
                      let d = Math.abs(cur - target);
                      if (d > 180) d = 360 - d;
                      return Math.max(0, 1 - d / window);
                    };
                    return views.map((v) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={v.label}
                        src={v.src}
                        alt=""
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                        style={{
                          opacity: angularOpacity(rotAngle, v.at),
                          filter: `drop-shadow(0 40px 60px ${product.accent}55)`,
                          transition: "opacity 120ms linear",
                        }}
                      />
                    ));
                  })()}
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div
                  className="relative w-[88px] h-[88px] cursor-grab active:cursor-grabbing touch-none select-none"
                  onPointerDown={handleRotStart}
                  onPointerMove={handleRotMove}
                  onPointerUp={handleRotEnd}
                  onPointerCancel={handleRotEnd}
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 30%, #2A2A2E 0%, #141416 70%, #0A0A0B 100%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.5)",
                    }}
                  />
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  >
                    {Array.from({ length: 24 }).map((_, i) => {
                      const angle = (i * 360) / 24;
                      const isMajor = i % 6 === 0;
                      const rInner = isMajor ? 38 : 41;
                      const rOuter = 45;
                      const rad = ((angle - 90) * Math.PI) / 180;
                      const x1 = 50 + rInner * Math.cos(rad);
                      const y1 = 50 + rInner * Math.sin(rad);
                      const x2 = 50 + rOuter * Math.cos(rad);
                      const y2 = 50 + rOuter * Math.sin(rad);
                      return (
                        <line
                          key={i}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={isMajor ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)"}
                          strokeWidth={isMajor ? 1.4 : 1}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </svg>
                  <div
                    className="absolute inset-0"
                    style={{ transform: `rotate(${rotAngle}deg)` }}
                  >
                    <div
                      className="absolute left-1/2 -translate-x-1/2"
                      style={{
                        top: 10,
                        width: 3,
                        height: 18,
                        borderRadius: 2,
                        background: product.accent,
                        boxShadow: `0 0 12px ${product.accent}`,
                      }}
                    />
                  </div>
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      width: 34,
                      height: 34,
                      background:
                        "radial-gradient(circle at 50% 30%, #3A3A3F 0%, #1B1B1E 100%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6)",
                    }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/50 font-medium">
                    Drag to rotate
                  </span>
                  <span
                    className="text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded"
                    style={{
                      color: product.accent,
                      background: `${product.accent}18`,
                    }}
                  >
                    {Math.round(rotAngle)}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────── 3. HOTSPOTS ─────────────── */}
        <section className="bg-white py-24 lg:py-32">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-14">
            <div className="text-center max-w-[900px] mx-auto mb-14">
              <p
                className="text-[12px] font-semibold tracking-[0.24em] uppercase"
                style={{ color: product.accent }}
              >
                Inside
              </p>
              <h2
                className="mt-3 text-[40px] sm:text-[56px] lg:text-[72px] font-semibold text-carbon-alt leading-[1.0]"
                style={{ letterSpacing: "-0.03em" }}
              >
                Every part, purposeful.
              </h2>
              <p className="mt-5 text-[16px] sm:text-[18px] text-graphite-alt max-w-[560px] mx-auto leading-[1.55]">
                Hover any point to see the engineering choices behind the finish.
              </p>
            </div>

            <div
              className="relative mx-auto max-w-[1100px] rounded-[28px] overflow-hidden"
              style={{
                aspectRatio: "16/10",
                background: `radial-gradient(55% 55% at 50% 50%, ${product.accent}22 0%, #F5F5F7 75%)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt=""
                className="absolute inset-0 w-full h-full object-contain p-8 lg:p-12"
              />
              {HOTSPOTS.map((h, i) => (
                <Hotspot
                  key={h.label}
                  x={h.x}
                  y={h.y}
                  label={h.label}
                  sub={h.sub}
                  metric={h.metric}
                  accent={product.accent}
                  delay={i * 0.3}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────── 4. FEATURE HIGHLIGHTS (Apple-style 3-up) ─────────────── */}
        <section id="features" className="bg-off-white-alt py-24 lg:py-32">
          <div className="mx-auto px-6 lg:px-14" style={{ maxWidth: 1280 }}>
            <div className="text-center max-w-[820px] mx-auto mb-14">
              <p
                className="text-[12px] font-semibold tracking-[0.24em] uppercase"
                style={{ color: product.accent }}
              >
                Highlights
              </p>
              <h2
                className="mt-3 text-[40px] sm:text-[56px] lg:text-[64px] font-semibold text-carbon-alt leading-[1.02]"
                style={{ letterSpacing: "-0.03em" }}
              >
                Engineered end to end.
              </h2>
              <p className="mt-5 text-[16px] sm:text-[18px] text-graphite-alt max-w-[560px] mx-auto leading-[1.55]">
                Three chapters of what makes {product.title} disappear into your operation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {features.map((f, i) => (
                <motion.article
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2, root: scrollRef }}
                  transition={{ duration: 0.6, ease: easeOut, delay: i * 0.08 }}
                  className="group relative flex flex-col overflow-hidden bg-white transition-transform duration-500 hover:-translate-y-1"
                  style={{
                    borderRadius: 12,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    className="relative w-full overflow-hidden"
                    style={{
                      aspectRatio: "4 / 3",
                      background: "var(--color-off-white-alt)",
                    }}
                  >
                    <motion.img
                      src={f.image ?? product.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      whileHover={{ scale: 1.04 }}
                      transition={{ duration: 0.6, ease: easeOut }}
                    />
                  </div>
                  <div className="flex flex-col" style={{ padding: 28 }}>
                    <h3
                      className="text-[22px] lg:text-[26px] font-semibold text-carbon-alt leading-[1.15]"
                      style={{ letterSpacing: "-0.02em", margin: 0 }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-[14.5px] text-graphite-alt leading-[1.5]"
                      style={{ marginTop: 12, marginBottom: 0 }}
                    >
                      {f.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────── 5. BANNER ─────────────── */}
        <section className="bg-white py-16 lg:py-24">
          <div
            className="relative mx-auto w-full overflow-hidden"
            style={{ maxWidth: 1280 }}
          >
            <img
              src="/Product/ChatGPT%20Image%20Aug%201%2C%202026%2C%2011_18_42%20PM.png"
              alt=""
              className="block w-full h-auto"
            />
          </div>
        </section>

        {/* ─────────────── 7. AT A GLANCE ─────────────── */}
        <section id="glance" className="bg-white py-24 lg:py-32">
          <div className="mx-auto px-6 lg:px-14" style={{ maxWidth: 1280 }}>
            <div className="text-center max-w-[820px] mx-auto mb-12">
              <p
                className="text-[12px] font-semibold tracking-[0.24em] uppercase"
                style={{ color: product.accent }}
              >
                At a glance
              </p>
              <h2
                className="mt-3 text-[36px] sm:text-[52px] lg:text-[64px] font-semibold text-carbon-alt leading-[1.02]"
                style={{ letterSpacing: "-0.03em" }}
              >
                {product.title}, in three numbers.
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {specHighlights.map((s) => (
                <div
                  key={s.label}
                  className="bg-off-white-alt p-8 flex flex-col justify-between"
                  style={{ borderRadius: 20, minHeight: 220 }}
                >
                  <p
                    className="text-[11px] font-semibold tracking-[0.22em] uppercase"
                    style={{ color: product.accent }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="text-[26px] sm:text-[30px] font-semibold text-carbon-alt leading-[1.1] mt-6"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────── 8. TECH SPECS TABLE ─────────────── */}
        <section id="specs" className="bg-off-white-alt py-24 lg:py-32">
          <div className="mx-auto px-6 lg:px-14" style={{ maxWidth: 1280 }}>
            <div className="text-center max-w-[820px] mx-auto mb-14">
              <p
                className="text-[12px] font-semibold tracking-[0.24em] uppercase"
                style={{ color: product.accent }}
              >
                Tech Specs
              </p>
              <h2
                className="mt-3 text-[40px] sm:text-[56px] lg:text-[64px] font-semibold text-carbon-alt leading-[1.02]"
                style={{ letterSpacing: "-0.03em" }}
              >
                Specifications.
              </h2>
              <p className="mt-5 text-[16px] sm:text-[18px] text-graphite-alt max-w-[560px] mx-auto leading-[1.55]">
                Every number tuned for uptime in real warehouse conditions.
              </p>
            </div>
            <div className="max-w-[860px] mx-auto">
              {specs.map((s) => {
                const isOpen = openSpec === s.label;
                return (
                  <div key={s.label} className="border-b border-[#D2D2D7]">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSpec((prev) => (prev === s.label ? null : s.label))
                      }
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="text-[16px] text-carbon-alt font-medium">
                        {s.label}
                      </span>
                      <ChevronDown
                        className="w-5 h-5 text-graphite-alt shrink-0 transition-transform duration-200"
                        style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: easeOut }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="pb-8 max-w-[640px]">
                            {s.heading && (
                              <p className="text-[15px] font-semibold text-carbon-alt mb-1.5">
                                {s.heading}
                              </p>
                            )}
                            {s.detail && (
                              <p className="text-[14px] text-graphite-alt leading-[1.55]">
                                {s.detail}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────── 9. COMPARE MODELS ─────────────── */}
        <section id="compare" className="bg-white py-24 lg:py-32">
          <div className="mx-auto px-6 lg:px-14" style={{ maxWidth: 1280 }}>
            <div className="text-center max-w-[820px] mx-auto mb-12">
              <p
                className="text-[12px] font-semibold tracking-[0.24em] uppercase"
                style={{ color: product.accent }}
              >
                Which is right for you
              </p>
              <h2
                className="mt-3 text-[36px] lg:text-[52px] font-semibold text-carbon-alt leading-[1.02]"
                style={{ letterSpacing: "-0.03em" }}
              >
                Compare models.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
              {compareModels.map((p, idx) => {
                const isSelf = p.title === product.title;
                const rating = [4.9, 4.8, 4.7, 4.9][idx % 4];
                const reviews = [128, 92, 76, 143][idx % 4];
                return (
                  <div
                    key={p.title}
                    className="relative flex flex-col bg-white"
                    style={{
                      borderRadius: 16,
                      padding: 20,
                      border: isSelf
                        ? `1.5px solid ${product.accent}`
                        : "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    {/* "New" badge */}
                    <span
                      className="absolute text-[11px] font-medium"
                      style={{
                        top: 14,
                        left: 20,
                        color: p.accent,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      New
                    </span>

                    {/* Product photo */}
                    <div
                      className="relative w-full overflow-hidden"
                      style={{
                        aspectRatio: "1 / 1",
                        marginTop: 24,
                        background: "transparent",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.title}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    </div>

                    {/* Title */}
                    <p
                      className="text-[15px] font-semibold text-carbon-alt"
                      style={{ marginTop: 20, marginBottom: 0, lineHeight: 1.3 }}
                    >
                      {p.title}
                    </p>

                    {/* Rating */}
                    <div
                      className="flex items-center gap-1.5"
                      style={{ marginTop: 8 }}
                    >
                      <span
                        className="text-[12px]"
                        style={{ color: "#F5A623", letterSpacing: 1 }}
                      >
                        ★★★★★
                      </span>
                      <span className="text-[12px] font-medium text-carbon-alt">
                        {rating}
                      </span>
                      <span className="text-[12px] text-graphite-alt">
                        ({reviews})
                      </span>
                    </div>

                    {/* CTAs */}
                    <button
                      type="button"
                      className="w-full text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                      style={{
                        background: "var(--color-carbon-alt)",
                        borderRadius: 999,
                        padding: "10px 16px",
                        marginTop: 20,
                      }}
                    >
                      {isSelf ? "Book Demo" : "Request quote"}
                    </button>
                    <button
                      type="button"
                      className="w-full text-[13px] font-medium text-carbon-alt transition-colors hover:bg-off-white-alt"
                      style={{
                        background: "transparent",
                        border: "1px solid #D2D2D7",
                        borderRadius: 999,
                        padding: "10px 16px",
                        marginTop: 8,
                      }}
                    >
                      Learn more
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────── 10. ACCESSORIES ─────────────── */}
        <section id="accessories" className="bg-white py-24 lg:py-32">
          <div className="mx-auto px-6 lg:px-14" style={{ maxWidth: 1280 }}>
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <div>
                <p
                  className="text-[12px] font-semibold tracking-[0.24em] uppercase"
                  style={{ color: product.accent }}
                >
                  Accessories
                </p>
                <h2
                  className="mt-3 text-[32px] lg:text-[44px] font-semibold text-carbon-alt leading-[1.02]"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  Complete the system.
                </h2>
              </div>
              <a
                href="#"
                className="text-[13px] font-medium inline-flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{ color: product.accent }}
              >
                Shop all accessories <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
              {accessories.map((a, i) => (
                <motion.a
                  href="#"
                  key={a.title}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  className="group relative flex flex-col overflow-hidden bg-off-white-alt"
                  style={{ borderRadius: 20 }}
                >
                  {i === 0 && (
                    <span
                      className="absolute top-3 left-3 z-10 text-[9px] font-semibold tracking-[0.18em] uppercase px-2 py-1 rounded-full"
                      style={{
                        color: product.accent,
                        background: "rgba(255,255,255,0.95)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      New
                    </span>
                  )}
                  <div
                    className="relative w-full overflow-hidden bg-white"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    <motion.img
                      src={a.image}
                      alt={a.title}
                      variants={{
                        rest: { scale: 1 },
                        hover: { scale: 1.06 },
                      }}
                      transition={{ duration: 0.5, ease: easeOut }}
                      className="absolute inset-0 w-full h-full object-contain p-6"
                      style={{ mixBlendMode: "multiply" }}
                    />
                    <motion.div
                      variants={{
                        rest: { opacity: 0, y: 8 },
                        hover: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.3, ease: easeOut }}
                      className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{ background: product.accent }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>
                  <div className="flex flex-col" style={{ padding: 18 }}>
                    <p
                      className="text-[14.5px] font-semibold text-carbon-alt leading-[1.25]"
                      style={{ letterSpacing: "-0.01em", margin: 0 }}
                    >
                      {a.title}
                    </p>
                    <p
                      className="text-[12.5px] text-graphite-alt leading-[1.5]"
                      style={{ marginTop: 6, marginBottom: 0 }}
                    >
                      {a.note}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────── 11. DOWNLOADS ─────────────── */}
        <section id="downloads" className="bg-off-white-alt py-24 lg:py-32">
          <div className="mx-auto px-6 lg:px-14" style={{ maxWidth: 1280 }}>
            <div className="text-center max-w-[820px] mx-auto mb-14">
              <p
                className="text-[12px] font-semibold tracking-[0.24em] uppercase"
                style={{ color: product.accent }}
              >
                Downloads
              </p>
              <h2
                className="mt-3 text-[32px] lg:text-[44px] font-semibold text-carbon-alt leading-[1.02]"
                style={{ letterSpacing: "-0.03em" }}
              >
                Everything you need.
              </h2>
              <p className="mt-4 text-[15px] sm:text-[16px] text-graphite-alt max-w-[520px] mx-auto leading-[1.55]">
                Datasheets, CAD, integration guides — everything to spec, install and integrate.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
              {downloads.map((d, i) => {
                const Icon = d.icon;
                const fileMeta = ["PDF · 2.4 MB", "STEP / STL · 18 MB", "PDF · 5.1 MB", "OpenAPI · 1.2 MB", "ZIP · 3.6 MB"][i] ?? "PDF";
                return (
                  <motion.a
                    key={d.title}
                    href="#"
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    className="group relative flex items-center gap-5 bg-white overflow-hidden transition-shadow"
                    style={{
                      borderRadius: 20,
                      padding: 20,
                      border: "1px solid rgba(0,0,0,0.05)",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{ width: 44, height: 44 }}
                    >
                      <Icon
                        className="w-7 h-7 text-carbon-alt"
                        strokeWidth={1.3}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="text-[15px] font-semibold text-carbon-alt leading-[1.25]"
                        style={{ letterSpacing: "-0.01em", margin: 0 }}
                      >
                        {d.title}
                      </p>
                      <p
                        className="text-[13px] text-graphite-alt leading-[1.45]"
                        style={{ marginTop: 4, marginBottom: 0 }}
                      >
                        {d.note}
                      </p>
                      <p
                        className="text-[11px] font-mono uppercase tracking-[0.08em] text-[#8E8E93]"
                        style={{ marginTop: 8, marginBottom: 0 }}
                      >
                        {fileMeta}
                      </p>
                    </div>
                    <motion.div
                      variants={{
                        rest: { scale: 1, background: "#F2F2F4", color: "#1D1D1F" },
                        hover: { scale: 1.05, background: product.accent, color: "var(--color-white)" },
                      }}
                      transition={{ duration: 0.25, ease: easeOut }}
                      className="shrink-0 flex items-center justify-center"
                      style={{ width: 40, height: 40, borderRadius: 999 }}
                    >
                      <Download className="w-4 h-4" />
                    </motion.div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────── 12. GALLERY ─────────────── */}
        <section id="gallery" className="bg-white py-24 lg:py-32">
          <div className="mx-auto px-6 lg:px-14" style={{ maxWidth: 1280 }}>
            <div className="text-center max-w-[820px] mx-auto mb-14">
              <p
                className="text-[12px] font-semibold tracking-[0.24em] uppercase"
                style={{ color: product.accent }}
              >
                Gallery
              </p>
              <h2
                className="mt-3 text-[36px] lg:text-[52px] font-semibold text-carbon-alt leading-[1.02]"
                style={{ letterSpacing: "-0.03em" }}
              >
                Studied. Photographed.
              </h2>
            </div>
            <div className="flex flex-col gap-4 max-w-[900px] mx-auto">
              {gallery.map((g, i) => (
                <motion.div
                  key={g.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.05, root: scrollRef }}
                  transition={{ duration: 0.55, ease: easeOut, delay: i * 0.05 }}
                  className="relative overflow-hidden cursor-pointer group"
                >
                  <img
                    src={g.image}
                    alt={g.label}
                    className="block w-full h-auto transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────── 13. INDUSTRIES ─────────────── */}
        <section id="industries" className="bg-white py-24 lg:py-32">
          <div className="mx-auto px-6 lg:px-14" style={{ maxWidth: 1280 }}>
            <div className="text-center max-w-[820px] mx-auto mb-14">
              <p
                className="text-[12px] font-semibold tracking-[0.24em] uppercase"
                style={{ color: product.accent }}
              >
                Industries
              </p>
              <h2
                className="mt-3 text-[36px] lg:text-[52px] font-semibold text-carbon-alt leading-[1.02]"
                style={{ letterSpacing: "-0.03em" }}
              >
                Built for the floor.
              </h2>
              <p className="mt-4 text-[15px] sm:text-[16px] text-graphite-alt max-w-[560px] mx-auto leading-[1.55]">
                Deployed across the operations that keep goods and people moving.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
              {industries.map((ind, i) => {
                const Icon = ind.icon;
                return (
                  <motion.div
                    key={ind.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2, root: scrollRef }}
                    transition={{ duration: 0.5, ease: easeOut, delay: i * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="group relative flex flex-col bg-[#FAFAFB] transition-shadow duration-300"
                    style={{
                      borderRadius: 20,
                      padding: 24,
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <Icon
                        className="w-7 h-7 text-carbon-alt"
                        strokeWidth={1.3}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: product.accent }}
                      />
                    </div>
                    <p
                      className="text-[17px] font-semibold text-carbon-alt leading-[1.2]"
                      style={{ letterSpacing: "-0.01em", marginTop: 32, marginBottom: 0 }}
                    >
                      {ind.name}
                    </p>
                    <p
                      className="text-[13px] text-graphite-alt leading-[1.5]"
                      style={{ marginTop: 8, marginBottom: 0 }}
                    >
                      {ind.blurb}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────── 14. FINAL CTA ─────────────── */}
        <section className="bg-off-white-alt py-28 lg:py-36">
          <div
            className="mx-auto px-6 lg:px-14"
            style={{ maxWidth: 1280 }}
          >
            <div className="text-center mx-auto" style={{ maxWidth: 820 }}>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4, root: scrollRef }}
                transition={{ duration: 0.6, ease: easeOut }}
                className="text-[12px] font-medium uppercase text-graphite-alt"
                style={{ letterSpacing: "0.16em", marginBottom: 24 }}
              >
                Get started
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4, root: scrollRef }}
                transition={{ duration: 0.7, delay: 0.05, ease: easeOut }}
                className="text-[40px] sm:text-[54px] lg:text-[64px] font-semibold text-carbon-alt"
                style={{
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                Bring {product.title} to your floor.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4, root: scrollRef }}
                transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
                className="text-[17px] sm:text-[19px] text-graphite-alt mx-auto"
                style={{
                  maxWidth: 560,
                  lineHeight: 1.55,
                  marginTop: 24,
                  marginBottom: 0,
                }}
              >
                See it inside a real deployment. We&apos;ll walk you through it
                end-to-end.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4, root: scrollRef }}
                transition={{ duration: 0.6, delay: 0.18, ease: easeOut }}
                className="flex flex-col sm:flex-row items-center justify-center"
                style={{ marginTop: 48, gap: 16 }}
              >
                <button
                  className="group text-[15px] font-medium text-white inline-flex items-center justify-center transition-transform hover:-translate-y-[1px]"
                  style={{
                    background: "var(--color-carbon-alt)",
                    padding: "14px 30px",
                    borderRadius: 999,
                    border: "1px solid var(--color-carbon-alt)",
                    gap: 8,
                    lineHeight: 1,
                  }}
                >
                  Book a demo
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </button>
                <button
                  type="button"
                  className="text-[15px] font-medium text-carbon-alt inline-flex items-center justify-center transition-colors hover:bg-[#FBFBFD]"
                  style={{
                    background: "var(--color-white)",
                    padding: "14px 30px",
                    borderRadius: 999,
                    border: "1px solid #D2D2D7",
                    lineHeight: 1,
                  }}
                >
                  Contact sales
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4, root: scrollRef }}
                transition={{ duration: 0.6, delay: 0.26, ease: easeOut }}
                style={{ marginTop: 40 }}
                className="flex justify-center"
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="group inline-flex items-center text-[14px] font-medium transition-colors"
                  style={{ color: product.accent, gap: 4 }}
                >
                  Back to systems
                  <ChevronRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.2}
                  />
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

export function TechnologySystems() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const [modalCtx, setModalCtx] = useState<{
    product: Product;
    category: string;
  } | null>(null);
  const reduceMotion = useReducedMotion();

  const activeTab = TABS.find((t) => t.id === activeId) ?? TABS[0];

  return (
    <section
      className="relative bg-white py-20 sm:py-28"
      style={{ zIndex: 50, isolation: "isolate" }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-14 sm:mb-16">
        <motion.div
          initial={reduceMotion ? undefined : { y: 30, opacity: 0 }}
          whileInView={reduceMotion ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="text-center max-w-[820px] mx-auto"
        >
          <p className="text-[16px] font-bold tracking-[0.22em] uppercase text-signal-orange">
            Technology
          </p>
          <h2 className="text-[34px] sm:text-[46px] md:text-[56px] lg:text-[68px] font-bold text-carbon leading-[1.04] mt-3">
            One platform.
            <br />
            <span className="text-signal-orange">Five intelligent systems.</span>
          </h2>
          <p className="mt-6 text-[14px] sm:text-[16px] text-graphite/55 leading-relaxed max-w-[620px] mx-auto">
            Every RAMS deployment combines AI, connected hardware, positioning
            technology and inspection systems into one operational intelligence
            platform.
          </p>
        </motion.div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center bg-[#F2F2F2] rounded-full p-1.5 gap-0.5 w-full max-w-[820px]">
            {TABS.map((tab) => {
              const isActive = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveId(tab.id)}
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

        <div style={{ marginTop: 120 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
            >
              {activeTab.products.map((product, i) => (
                <ProductCard
                  key={`${activeTab.id}-${product.title}`}
                  product={product}
                  index={i}
                  onOpen={() =>
                    setModalCtx({ product, category: activeTab.label })
                  }
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {modalCtx && (
          <ProductModal
            product={modalCtx.product}
            category={modalCtx.category}
            onClose={() => setModalCtx(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
