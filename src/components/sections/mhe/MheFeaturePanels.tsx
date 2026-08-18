"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type PanelData = {
  eyebrow: string;
  title: string;
  body: string;
  metricLabel: string;
  metricValue: string;
  metricPercent: number;
};

const PANELS: PanelData[] = [
  {
    eyebrow: "Safety-first Operations",
    title: "Understand how MHEs are being driven.",
    body: "Track overspeeding, impacts and operator-linked risk events to improve day-to-day safety.",
    metricLabel: "Safety performance",
    metricValue: "82%",
    metricPercent: 82,
  },
  {
    eyebrow: "Productivity Intelligence",
    title: "Turn movement data into productivity insight.",
    body: "Measure utilisation, idle time and movement patterns across shifts and operators.",
    metricLabel: "Fleet utilisation",
    metricValue: "72%",
    metricPercent: 72,
  },
  {
    eyebrow: "Fleet & Pallet Efficiency",
    title: "Improve pallet flow and reduce congestion.",
    body: "Spot waiting zones, movement bottlenecks and inefficient pallet flow to improve throughput.",
    metricLabel: "Flow efficiency",
    metricValue: "76%",
    metricPercent: 76,
  },
];

export function MheFeaturePanels() {
  return (
    <section className="mhe-fp-section">
      <style>{`
        .mhe-fp-section{background:#000E11;padding:120px 0}
        .mhe-fp-container{width:min(1180px,calc(100% - 40px));margin:auto}
        .mhe-feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
        .mhe-feature-panel{
          border-radius:24px;padding:30px;min-height:390px;position:relative;overflow:hidden;
          border:1px solid rgba(255,255,255,.12);background:#06171B;
          display:flex;flex-direction:column
        }
        .mhe-feature-panel.mhe-orange-bg{
          background:#FF6A00;color:#111;border-color:transparent
        }
        .mhe-feature-panel h3{
          margin:0;font-size:26px;line-height:1.15;letter-spacing:-.02em;font-weight:800;color:#fff
        }
        .mhe-orange-bg h3{color:#111}
        .mhe-feature-panel p{margin:14px 0 0;font-size:15px;line-height:1.6}
        .mhe-feature-panel p.mhe-muted{color:#9FA9AD}
        .mhe-orange-bg p{color:rgba(17,17,17,.72)}
        .mhe-eyebrow{
          display:inline-flex;gap:8px;align-items:center;
          color:#ffb27c;font-weight:700;font-size:12px;
          letter-spacing:.14em;text-transform:uppercase;margin-bottom:18px
        }
        .mhe-eyebrow .mhe-dot{
          width:7px;height:7px;border-radius:50%;background:#FF6A00;box-shadow:0 0 16px #FF6A00
        }
        .mhe-orange-bg .mhe-eyebrow{color:#111}
        .mhe-orange-bg .mhe-eyebrow .mhe-dot{background:#111;box-shadow:none}
        .mhe-mini-ui{
          margin-top:auto;
          border:1px solid rgba(255,255,255,.14);
          border-radius:16px;padding:16px;background:rgba(0,0,0,.18)
        }
        .mhe-orange-bg .mhe-mini-ui{background:rgba(255,255,255,.25);border-color:rgba(0,0,0,.14)}
        .mhe-mini-row{display:flex;justify-content:space-between;align-items:center;font-size:14px;color:#fff}
        .mhe-mini-row .mhe-mini-label{color:#9FA9AD}
        .mhe-orange-bg .mhe-mini-row{color:#111}
        .mhe-orange-bg .mhe-mini-row .mhe-mini-label{color:#111}
        .mhe-mini-row b{font-weight:800}
        .mhe-bar{height:8px;border-radius:8px;background:#173139;overflow:hidden;margin-top:8px}
        .mhe-bar > span{display:block;height:100%;background:#FF6A00;border-radius:8px}
        .mhe-orange-bg .mhe-bar{background:rgba(0,0,0,.18)}
        .mhe-orange-bg .mhe-bar > span{background:#111}
        @media(max-width:900px){
          .mhe-feature-grid{grid-template-columns:1fr}
          .mhe-fp-section{padding:80px 0}
        }
      `}</style>

      <div className="mhe-fp-container">
        <div className="mhe-feature-grid">
          {PANELS.map((panel, i) => (
            <FeaturePanel key={panel.eyebrow} data={panel} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturePanel({ data, index }: { data: PanelData; index: number }) {
  const isOrange = index === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      className={`mhe-feature-panel${isOrange ? " mhe-orange-bg" : ""}`}
    >
      <div className="mhe-eyebrow">
        <span className="mhe-dot" /> {data.eyebrow}
      </div>
      <h3>{data.title}</h3>
      <p className={isOrange ? "" : "mhe-muted"}>{data.body}</p>

      <div className="mhe-mini-ui">
        <div className="mhe-mini-row">
          <span className="mhe-mini-label">{data.metricLabel}</span>
          <b>{data.metricValue}</b>
        </div>
        <div className="mhe-bar">
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: `${data.metricPercent}%` }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.3 + index * 0.08, ease: EASE }}
          />
        </div>
      </div>
    </motion.div>
  );
}
