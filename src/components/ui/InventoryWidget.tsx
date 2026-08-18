"use client";
import { motion } from "framer-motion";

const W = 280, H = 270;
const FONT = "ui-sans-serif,system-ui,sans-serif";
const MONO = "ui-monospace,monospace";

export default function InventoryWidget() {
  const trendPts = [
    [0,44],[22,38],[44,42],[66,30],[88,36],
    [110,22],[132,28],[154,16],[176,22],[198,10],
    [220,16],[242,6],[258,10],
  ];
  const lineD = trendPts.map(([x,y],i) => `${i===0?"M":"L"} ${x} ${y}`).join(" ");
  const fillD = `${lineD} L 258 50 L 0 50 Z`;

  const metrics = [
    { label: "Total SKUs",      value: "12,458", delta: "+5.6%", positive: true,  x: 16,  y: 72 },
    { label: "Accuracy",        value: "98.7%",  delta: "+2.4%", positive: true,  x: 156, y: 72 },
    { label: "Low Stock Items", value: "23",     delta: "↑ Risk", positive: false, x: 16,  y: 138 },
    { label: "Assets Tracked",  value: "8,742",  delta: "+128",  positive: true,  x: 156, y: 138 },
  ];

  return (
    <div className="absolute z-10 overflow-hidden"
      style={{
        top: 128, bottom: 16, left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        borderRadius: "14px",
        background: "transparent",
        border: "1px solid #E5E7EB",
      }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMin meet" style={{ display:"block" }}>
        <defs>
          <filter id="cs2" x="-6%" y="-6%" width="112%" height="112%">
            <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="rgba(0,0,0,0.08)" />
          </filter>
          <linearGradient id="tf2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.2)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </linearGradient>
        </defs>

        {/* ── Single card shell ── */}
        <motion.rect x={0} y={0} width={W} height={H} rx="14"
          fill="rgba(255,255,255,0.82)" filter="url(#cs2)"
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}
        />

        {/* ── Header ── */}
        <text x={16} y={29} fontSize="9.5" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">Inventory Overview</text>
        <text x={16} y={41} fontSize="7" fill="#94A3B8" fontFamily={FONT}>Physical assets · WMS reconciliation</text>

        {/* ── Divider 1 ── */}
        <line x1={16} y1={52} x2={W-16} y2={52} stroke="#F1F5F9" strokeWidth="1" />

        {/* ── Metrics grid ── */}
        {metrics.map(({ label, value, delta, positive, x, y }, i) => (
          <motion.g key={label}
            initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.4, delay: 0.12 + i * 0.08 }}>
            <text x={x} y={y} fontSize="7" fill="#94A3B8" fontFamily={FONT} fontWeight="500">{label}</text>
            <text x={x} y={y+22} fontSize="17" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">{value}</text>
            <text x={x} y={y+36} fontSize="6.5" fill={positive ? "#22C55E" : "#FF6A00"} fontFamily={FONT} fontWeight="500">{delta}</text>
          </motion.g>
        ))}

        {/* Vertical divider between metric columns */}
        <line x1={W/2} y1={58} x2={W/2} y2={184} stroke="#F1F5F9" strokeWidth="1" />

        {/* ── Divider 2 ── */}
        <line x1={16} y1={184} x2={W-16} y2={184} stroke="#F1F5F9" strokeWidth="1" />

        {/* ── Trend chart ── */}
        <text x={16} y={198} fontSize="8" fill="#0E0E0F" fontFamily={FONT} fontWeight="600">Stock Trend</text>
        <rect x={W-64} y={188} width={48} height={14} rx="7" fill="#F1F5F9" />
        <text x={W-40} y={198} fontSize="6.5" fill="#64748B" fontFamily={FONT} textAnchor="middle">30 Days ▾</text>

        <g transform="translate(10, 206)">
          <path d={fillD} fill="url(#tf2)" />
          <motion.path d={lineD} fill="none" stroke="#22C55E" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength:0 }} animate={{ pathLength:1 }}
            transition={{ duration:1.2, delay:0.4, ease:"easeOut" }}
          />
        </g>

      </svg>
    </div>
  );
}
