"use client";
import { motion } from "framer-motion";

const W = 252, H = 252;
const FONT = "ui-sans-serif,system-ui,sans-serif";
const MONO = "ui-monospace,monospace";

const cards = [
  { label: "Floor Coverage", value: "100%",   sub: "Full",     subColor: "#22C55E" },
  { label: "Active Zones",   value: "20/20",  sub: "All Live", subColor: "#22C55E" },
  { label: "Assets Mapped",  value: "8,742",  sub: "+128",     subColor: "#FF6A00" },
  { label: "Model Version",  value: "v2.4.1", sub: "Latest",   subColor: "#6366F1" },
];

export default function DigitalTwinWidget() {
  return (
    <div className="absolute z-10 overflow-hidden"
      style={{
        top: 128, bottom: 16, left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 28px)",
        borderRadius: "16px",
        background: "transparent",
        border: "1px solid #E5E7EB",
      }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMin meet" style={{ display: "block" }}>
        <defs>
          <filter id="dtf" x="-6%" y="-6%" width="112%" height="112%">
            <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="rgba(0,0,0,0.05)" />
          </filter>
        </defs>

        {/* Card */}
        <motion.rect x={0} y={0} width={W} height={H} rx="16"
          fill="rgba(255,255,255,0.92)" filter="url(#dtf)"
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.45 }}
        />

        {/* Header */}
        <text x={14} y={26} fontSize="9" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">Digital Twin</text>
        <text x={14} y={37} fontSize="5.5" fill="#94A3B8" fontFamily={FONT}>Warehouse A · Real-time replica</text>


        {/* Divider */}
        <line x1={14} y1={46} x2={W-14} y2={46} stroke="#F1F5F9" strokeWidth="1" />

        {/* Big primary KPI */}
        <motion.g initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.4, delay:0.1 }}>
          <text x={14} y={74} fontSize="23" fill="#0E0E0F" fontFamily={FONT} fontWeight="800">99.2%</text>
          <text x={14} y={86} fontSize="6" fill="#94A3B8" fontFamily={FONT}>Overall twin sync accuracy</text>
        </motion.g>

        {/* Divider */}
        <line x1={14} y1={96} x2={W-14} y2={96} stroke="#F1F5F9" strokeWidth="1" />

        {/* 2×2 card grid */}
        {cards.map(({ label, value, sub, subColor }, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const cw = 106, ch = 58;
          const x = 14 + col * (cw + 8);
          const y = 104 + row * (ch + 8);
          return (
            <motion.g key={label}
              initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.35, delay:0.15 + i*0.08 }}>
              <rect x={x} y={y} width={cw} height={ch} rx="10" fill="#F8FAFC" />
              <text x={x+10} y={y+16} fontSize="5.5" fill="#94A3B8" fontFamily={FONT}>{label}</text>
              <text x={x+10} y={y+36} fontSize="14" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">{value}</text>
              <text x={x+10} y={y+50} fontSize="5.5" fill={subColor} fontFamily={FONT} fontWeight="500">{sub}</text>
            </motion.g>
          );
        })}

      </svg>
    </div>
  );
}
