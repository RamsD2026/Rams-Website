"use client";
import { motion } from "framer-motion";

const W = 252, H = 252;
const FONT = "ui-sans-serif,system-ui,sans-serif";
const MONO = "ui-monospace,monospace";

const chartPts: [number, number][] = [
  [0,54],[14,48],[28,52],[42,38],[56,44],[70,30],[84,42],
  [98,22],[112,36],[126,18],[140,28],[154,12],[168,24],
  [182,8],[196,18],[210,6],[224,14],[232,10],
];


export default function AIVisionWidget() {
  const lineD = chartPts.map(([x,y],i) => `${i===0?"M":"L"} ${x} ${y}`).join(" ");
  const fillD = `${lineD} L ${chartPts[chartPts.length-1][0]} 62 L 0 62 Z`;

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
        preserveAspectRatio="xMidYMin meet" style={{ display:"block" }}>
        <defs>
          <filter id="avf" x="-6%" y="-6%" width="112%" height="112%">
            <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="rgba(0,0,0,0.05)" />
          </filter>
          <linearGradient id="chartfill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,130,246,0.25)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.02)" />
          </linearGradient>
          <clipPath id="chartclip">
            <rect x={0} y={0} width={236} height={64} />
          </clipPath>
        </defs>

        {/* Card */}
        <motion.rect x={0} y={0} width={W} height={H} rx="16"
          fill="rgba(255,255,255,0.92)" filter="url(#avf)"
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.45 }}
        />

        {/* ── Header ── */}
        <text x={14} y={26} fontSize="8.5" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">AI Detection</text>

        {/* ── Primary + Secondary stats ── */}
        <text x={14} y={52} fontSize="19" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">1,284</text>
        <text x={14} y={63} fontSize="6" fill="#94A3B8" fontFamily={FONT}>Detections today</text>

        <text x={138} y={52} fontSize="14" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">98%</text>
        <text x={138} y={63} fontSize="6" fill="#94A3B8" fontFamily={FONT}>Accuracy rate</text>

        {/* ── Chart area ── */}
        <rect x={8} y={72} width={W-16} height={72} rx="10" fill="#F8FAFC" />

        <g transform="translate(8, 76)" clipPath="url(#chartclip)">
          <path d={fillD} fill="url(#chartfill)" />
          <motion.path d={lineD} fill="none" stroke="#3B82F6" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength:0 }} animate={{ pathLength:1 }}
            transition={{ duration:1.4, delay:0.3, ease:"easeOut" }}
          />
          {/* Now indicator */}
          <motion.line x1={232} y1={0} x2={232} y2={62}
            stroke="#3B82F6" strokeWidth="1" strokeDasharray="3,3"
            animate={{ opacity:[0.4,1,0.4] }} transition={{ duration:1.5, repeat:Infinity }}
          />
          <circle cx={232} cy={10} r={3} fill="#3B82F6" />
        </g>

        {/* Time labels */}
        {["6 AM","10 AM","2 PM","NOW"].map((t, i) => (
          <text key={t} x={14 + i * 72} y={154} fontSize="5" fill="#CBD5E1"
            fontFamily={MONO} textAnchor={i === 3 ? "end" : "start"}>{t}</text>
        ))}

        {/* ── Status card ── */}
        <rect x={10} y={164} width={W-20} height={54} rx="10" fill="#F8FAFC" />
        <rect x={18} y={174} width={14} height={14} rx="4" fill="#F0FDF4" />
        <circle cx={25} cy={181} r={4} fill="#22C55E" opacity="0.3" />
        <circle cx={25} cy={181} r={2} fill="#22C55E" />
        <text x={38} y={179} fontSize="7" fill="#0E0E0F" fontFamily={FONT} fontWeight="700">All Zones Secure</text>
        <text x={38} y={191} fontSize="5.5" fill="#94A3B8" fontFamily={FONT}>No anomalies detected in the last</text>
        <text x={38} y={201} fontSize="5.5" fill="#94A3B8" fontFamily={FONT}>30 minutes across all aisles.</text>

      </svg>
    </div>
  );
}
