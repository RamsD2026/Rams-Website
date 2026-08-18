"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface FeatureCard {
  title: string;
  desc: string;
  screenshot: string;
}

interface ItemModal {
  features: [FeatureCard, FeatureCard, FeatureCard];
}

const ITEMS = [
  {
    id: "racks",
    label: "Racks",
    intelligence: "Rack Intelligence",
    image: "/Racks.png",
    heading: "Every Rack Has a Digital Identity. Every Risk Has a Location.",
    description:
      "RAMS monitors every rack's structural condition, configuration and compliance status — continuously. Impact events are logged, corrective actions tracked and inspection records maintained so nothing is missed between visits.",
    cta: "Explore Rack Intelligence",
    modal: {
      features: [
        {
          title: "Bay-Level Damage Detection",
          desc: "Every impact event is logged with photographic evidence, severity score and bay location — giving you a permanent, auditable record without relying on manual walkthroughs or self-reporting.",
          screenshot: "/SS/Rack health 736.webp",
        },
        {
          title: "Corrective Action Tracking",
          desc: "When damage is detected, RAMS automatically creates a corrective action, assigns it to the right owner and tracks it to resolution — so nothing sits unresolved between inspection cycles.",
          screenshot: "/SS/Dashboard2.webp",
        },
        {
          title: "Compliance & Inspection History",
          desc: "Every rack bay has a complete inspection timeline, compliance status and load configuration record — ready for audits, insurance reviews and regulatory requirements at any time.",
          screenshot: "/SS/Report.jpg",
        },
      ] as [FeatureCard, FeatureCard, FeatureCard],
    } satisfies ItemModal,
  },
  {
    id: "mhes",
    label: "MHEs",
    intelligence: "MHE Intelligence",
    image: "/MHE.png",
    heading: "Understand Every Movement Across Your Warehouse.",
    description:
      "Every forklift, reach truck and MHE is tracked for location, travel patterns, productive versus idle time, speed events and impacts — giving operations a complete picture of fleet behaviour and maintenance needs.",
    cta: "Explore MHE Intelligence",
    modal: {
      features: [
        {
          title: "Real-Time Location & Zone Tracking",
          desc: "Every MHE is tracked continuously across the facility — not just where it is, but which zone it is operating in, how long it has been there and whether it should be there at all.",
          screenshot: "/SS/Dashboard2.webp",
        },
        {
          title: "Speed Events & Impact Logging",
          desc: "Speed violations and collision events are automatically captured with timestamp, severity and operator attribution — giving safety teams the evidence they need without relying on witness reports.",
          screenshot: "/SS/Screenshot 2026-07-12 124539.png",
        },
        {
          title: "Usage-Based Maintenance Triggers",
          desc: "RAMS replaces calendar-based maintenance schedules with actual usage data — triggering service alerts based on real operating hours, load cycles and impact history per vehicle.",
          screenshot: "/SS/Report.jpg",
        },
      ] as [FeatureCard, FeatureCard, FeatureCard],
    } satisfies ItemModal,
  },
  {
    id: "pallets",
    label: "Pallets",
    intelligence: "Inventory Intelligence",
    image: "/Pallets.png",
    heading: "Know Where Every Pallet Is. Verify Every Movement.",
    description:
      "RAMS reconciles physical pallet positions against your WMS in real time — flagging wrong-bay placements, FIFO and FEFO exceptions, and expiry risk without manual counts or reliance on operator input.",
    cta: "Explore Inventory Intelligence",
    modal: {
      features: [
        {
          title: "Physical-to-WMS Reconciliation",
          desc: "RAMS continuously compares physical pallet positions against your WMS records at bay level — surfacing discrepancies the moment they occur, not at the next manual stock count.",
          screenshot: "/SS/Screenshot 2026-07-12 124539.png",
        },
        {
          title: "FIFO, FEFO & Expiry Monitoring",
          desc: "Rotation rules and expiry dates are monitored automatically. Wrong-sequence picks and approaching use-by dates are flagged before they become compliance failures or write-offs.",
          screenshot: "/SS/Dashboard2.webp",
        },
        {
          title: "Full Movement Audit Trail",
          desc: "Every pallet movement is recorded with operator, MHE, origin bay and destination bay — giving you the audit trail you need for traceability, recalls and customer compliance reporting.",
          screenshot: "/SS/Report.jpg",
        },
      ] as [FeatureCard, FeatureCard, FeatureCard],
    } satisfies ItemModal,
  },
  {
    id: "people",
    label: "People",
    intelligence: "People Intelligence",
    image: "/People.png",
    heading: "Connect People, Equipment and Tasks With Complete Context.",
    description:
      "RAMS links operators to the assets, zones and tasks they interact with — building a clear operational record of task execution, waiting time, safety events and equipment use. Operational clarity, not surveillance.",
    cta: "Explore People Intelligence",
    modal: {
      features: [
        {
          title: "Operator-to-Asset Linkage",
          desc: "Every interaction between an operator and an MHE, rack bay or pallet is automatically recorded — giving managers full context behind any safety event, task failure or productivity gap.",
          screenshot: "/SS/Dashboard2.webp",
        },
        {
          title: "Task Execution & Waiting Time",
          desc: "RAMS tracks how long tasks actually take, where delays occur and which zones create bottlenecks — giving operations the data to improve sequencing and resource allocation across shifts.",
          screenshot: "/SS/Screenshot 2026-07-12 124539.png",
        },
        {
          title: "Incident Timeline Reconstruction",
          desc: "When a safety event occurs, RAMS can reconstruct the full timeline — who was involved, what equipment they were using, where they were and what happened in the minutes before.",
          screenshot: "/SS/Rack health 736.webp",
        },
      ] as [FeatureCard, FeatureCard, FeatureCard],
    } satisfies ItemModal,
  },
] as const;

type Item = (typeof ITEMS)[number];

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
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          borderRadius: `${OUTER_R}px`,
          background: "linear-gradient(170deg, rgba(255,255,255,0.045) 0%, transparent 30%)",
          pointerEvents: "none",
        }}
      />
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

function IntelligenceModal({ item, onClose }: { item: Item; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

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

          {/* Hero */}
          <div className="px-10 sm:px-20 lg:px-28 pt-16 pb-6">
            <p className="text-[20px] font-bold tracking-[0.04em] uppercase text-signal-orange mb-5">
              {item.intelligence}
            </p>
            <h2
              className="text-[42px] sm:text-[60px] lg:text-[68px] font-bold text-carbon-alt leading-[1.04]"
              style={{ letterSpacing: "-0.025em" }}
            >
              What&apos;s inside {item.label} Intelligence.
            </h2>
          </div>

          {/* Feature cards */}
          {item.modal.features.map((feature) => (
            <div key={feature.title} className="px-10 sm:px-20 lg:px-28 pb-12">
              <div className="bg-off-white-alt" style={{ borderRadius: "20px" }}>
                <div className="px-8 pt-8 pb-6">
                  <p className="text-[18px] sm:text-[20px] text-carbon-alt leading-relaxed max-w-[580px]">
                    <span className="font-bold">{feature.title}.</span>{" "}
                    <span className="text-graphite-alt">{feature.desc}</span>
                  </p>
                </div>
                <div className="px-6 pb-6">
                  <ScreenMockup src={feature.screenshot} alt={feature.title} />
                </div>
              </div>
            </div>
          ))}

          <div className="pb-10" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function FlipCard({ item, onOpenModal }: { item: Item; onOpenModal: (item: Item) => void }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full"
      style={{ perspective: "1600px", aspectRatio: "3 / 5" }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "18px",
            border: "1px solid #E8E8ED",
          }}
        >
          <img
            src={item.image}
            alt={item.label}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <h3
              className="text-white text-[28px] sm:text-[30px] font-bold leading-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              {item.label}
            </h3>
          </div>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 overflow-hidden bg-white flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "18px",
            border: "1px solid #E8E8ED",
          }}
        >
          <div
            className="flex flex-col"
            style={{ height: "100%", padding: "40px 32px 32px 32px" }}
          >
            <p
              className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-signal-orange"
              style={{ marginBottom: "24px" }}
            >
              {item.intelligence}
            </p>
            <h4
              className="text-[20px] sm:text-[21px] font-bold text-carbon leading-[1.22]"
              style={{ letterSpacing: "-0.015em", marginBottom: "24px" }}
            >
              {item.heading}
            </h4>
            <p
              className="text-[13px] text-graphite-alt leading-[1.7]"
              style={{ marginBottom: "0" }}
            >
              {item.description}
            </p>
            <button
              type="button"
              onClick={() => onOpenModal(item)}
              className="inline-flex items-center gap-2 whitespace-nowrap text-[10px] font-bold tracking-[0.1em] uppercase text-carbon hover:text-signal-orange transition-colors duration-200 group self-start"
              style={{ marginTop: "auto", paddingTop: "24px" }}
            >
              {item.cta}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function OperationShowcase() {
  const [modalItem, setModalItem] = useState<Item | null>(null);

  return (
    <section className="bg-white py-20 sm:py-28">

      {/* ── Section heading (centered, single-line) ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mb-14 sm:mb-16 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-[16px] font-bold tracking-[0.22em] uppercase text-signal-orange mb-3"
        >
          Platform Intelligence
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="text-[28px] sm:text-[40px] md:text-[52px] lg:text-[64px] font-bold text-carbon leading-[1.04] sm:whitespace-nowrap"
          style={{ letterSpacing: "-0.025em" }}
        >
          Racks. MHEs. Pallets. <span className="text-signal-orange">People.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] text-graphite/50 max-w-[560px] mx-auto leading-relaxed"
        >
          RAMS creates clarity around each operational element — and around the interactions between them. Click any card to reveal details.
        </motion.p>
      </div>

      {/* ── 4-card flip grid ── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.35, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
            >
              <FlipCard item={item} onOpenModal={setModalItem} />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modalItem && (
          <IntelligenceModal item={modalItem} onClose={() => setModalItem(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
