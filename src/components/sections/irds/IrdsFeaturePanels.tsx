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
    eyebrow: "IRDS",
    title: "Inspection data becomes a decision system.",
    body: "Every finding is connected to the exact rack location and component, making risk easier to understand, prioritise and close.",
    metricLabel: "Corrective actions closed",
    metricValue: "79%",
    metricPercent: 79,
  },
  {
    eyebrow: "DIGITAL TWIN",
    title: "Every bay has an address. Every issue has a history.",
    body: "Create a searchable structural record of the warehouse so teams can see exactly where risk exists and how it changes over time.",
    metricLabel: "Rack map completeness",
    metricValue: "64%",
    metricPercent: 64,
  },
];

export function IrdsFeaturePanels() {
  return (
    <section className="irds-fp-section">
      <style>{`
        .irds-fp-section{background:#000E11;padding:120px 0}
        .irds-fp-container{width:min(1180px,calc(100% - 40px));margin:auto}
        .irds-feature-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px}
        .irds-feature-panel{
          border-radius:24px;padding:38px;min-height:440px;position:relative;overflow:hidden;
          border:1px solid rgba(255,255,255,.12);background:#06171B
        }
        .irds-feature-panel.irds-orange-bg{
          background:#FF6A00;color:#111;border-color:transparent
        }
        .irds-feature-panel h3{
          margin:0;font-size:30px;line-height:1.15;letter-spacing:-.02em;max-width:450px;font-weight:800;color:#fff
        }
        .irds-orange-bg h3{color:#111}
        .irds-feature-panel p{margin:14px 0 0;font-size:15px;line-height:1.6;max-width:460px}
        .irds-feature-panel p.irds-muted{color:#9FA9AD}
        .irds-orange-bg p{color:rgba(17,17,17,.72)}
        .irds-eyebrow{
          display:inline-flex;gap:8px;align-items:center;
          color:#ffb27c;font-weight:700;font-size:12px;
          letter-spacing:.14em;text-transform:uppercase;margin-bottom:18px
        }
        .irds-eyebrow .irds-dot{
          width:7px;height:7px;border-radius:50%;background:#FF6A00;box-shadow:0 0 16px #FF6A00
        }
        .irds-orange-bg .irds-eyebrow{color:#111}
        .irds-orange-bg .irds-eyebrow .irds-dot{background:#111;box-shadow:none}
        .irds-mini-ui{
          position:absolute;left:38px;right:38px;bottom:32px;
          border:1px solid rgba(255,255,255,.14);
          border-radius:16px;padding:18px;background:rgba(0,0,0,.18)
        }
        .irds-orange-bg .irds-mini-ui{background:rgba(255,255,255,.25);border-color:rgba(0,0,0,.14)}
        .irds-mini-row{display:flex;justify-content:space-between;align-items:center;font-size:14px;color:#fff}
        .irds-mini-row .irds-mini-label{color:#9FA9AD}
        .irds-orange-bg .irds-mini-row{color:#111}
        .irds-orange-bg .irds-mini-row .irds-mini-label{color:#111}
        .irds-mini-row b{font-weight:800}
        .irds-bar{height:8px;border-radius:8px;background:#173139;overflow:hidden;margin-top:8px}
        .irds-bar > span{display:block;height:100%;background:#FF6A00;border-radius:8px}
        .irds-orange-bg .irds-bar{background:rgba(0,0,0,.18)}
        .irds-orange-bg .irds-bar > span{background:#111}
        @media(max-width:900px){
          .irds-feature-grid{grid-template-columns:1fr}
          .irds-fp-section{padding:80px 0}
        }
      `}</style>

      <div className="irds-fp-container">
        <div className="irds-feature-grid">
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
      className={`irds-feature-panel${isOrange ? " irds-orange-bg" : ""}`}
    >
      <div className="irds-eyebrow">
        <span className="irds-dot" /> {data.eyebrow}
      </div>
      <h3>{data.title}</h3>
      <p className={isOrange ? "" : "irds-muted"}>{data.body}</p>

      <div className="irds-mini-ui">
        <div className="irds-mini-row">
          <span className="irds-mini-label">{data.metricLabel}</span>
          <b>{data.metricValue}</b>
        </div>
        <div className="irds-bar">
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
