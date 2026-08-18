"use client";
import { motion } from "framer-motion";

const W = 360, H = 330;

/* Floating chip wrapper */
function Chip({ x, y, color, border, children, delay = 0 }: {
  x: number; y: number; color: string; border: string; children: React.ReactNode; delay?: number;
}) {
  return (
    <motion.g
      animate={{ y: [0, -4, 0], opacity: [0.88, 1, 0.88] }}
      transition={{ duration: 3 + delay * 0.4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <rect x={x} y={y} width={80} height={15} rx="7.5"
        fill="rgba(6,10,18,0.95)" stroke={border} strokeWidth="0.8" />
      <circle cx={x + 10} cy={y + 7.5} r={2.6} fill={color} />
      {children}
    </motion.g>
  );
}

export default function AIVisionScene() {
  return (
    <div
      className="absolute bottom-0 right-0 z-10 overflow-hidden"
      style={{
        top: 128,
        left: 24,
        borderRadius: "20px 0 0 0",
        border: "1px solid #1E2D40",
        borderRight: "none",
        borderBottom: "none",
        background: "#070A12",
      }}
    >
      <svg
        width="100%" height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        <defs>
          <pattern id="vdots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="0.55" fill="#0D1828" />
          </pattern>
          {/* Heatmap blobs */}
          <radialGradient id="heat-orange" cx="38%" cy="58%" r="28%">
            <stop offset="0%" stopColor="rgba(255,106,0,0.13)" />
            <stop offset="100%" stopColor="rgba(255,106,0,0)" />
          </radialGradient>
          <radialGradient id="heat-green" cx="64%" cy="44%" r="22%">
            <stop offset="0%" stopColor="rgba(34,197,94,0.09)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </radialGradient>
          {/* Vertical scan gradient */}
          <linearGradient id="vscan" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%"   stopColor="rgba(34,197,94,0)" />
            <stop offset="42%"  stopColor="rgba(34,197,94,0.05)" />
            <stop offset="50%"  stopColor="rgba(34,197,94,0.22)" />
            <stop offset="58%"  stopColor="rgba(34,197,94,0.05)" />
            <stop offset="100%" stopColor="rgba(34,197,94,0)" />
          </linearGradient>
          {/* Soft glow filter */}
          <filter id="glow-sm" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Base background ── */}
        <rect width={W} height={H} fill="#070A12" />
        <rect width={W} height={H} fill="url(#vdots)" />
        <rect width={W} height={H} fill="url(#heat-orange)" />
        <rect width={W} height={H} fill="url(#heat-green)" />

        {/* ── Left rack column ── */}
        <rect x={0} y={0} width={72} height={H} fill="#0B1320" />
        {[52,104,156,208,260,312].map(y => (
          <line key={`lh-${y}`} x1={0} y1={y} x2={72} y2={y} stroke="#10202E" strokeWidth="1" />
        ))}
        {[26,78,130,182,234,286].map(cy =>
          [5,22,40,57].map(cx => (
            <rect key={`lp-${cx}-${cy}`} x={cx} y={cy - 6} width={13} height={10} rx="2"
              fill="#111E30" stroke="#192B40" strokeWidth="0.5" />
          ))
        )}
        <line x1={72} y1={0} x2={72} y2={H} stroke="#162438" strokeWidth="1.5" />

        {/* ── Right rack column ── */}
        <rect x={W - 72} y={0} width={72} height={H} fill="#0B1320" />
        {[52,104,156,208,260,312].map(y => (
          <line key={`rh-${y}`} x1={W - 72} y1={y} x2={W} y2={y} stroke="#10202E" strokeWidth="1" />
        ))}
        {[26,78,130,182,234,286].map(cy =>
          [W - 68, W - 51, W - 33, W - 16].map(cx => (
            <rect key={`rp-${cx}-${cy}`} x={cx} y={cy - 6} width={13} height={10} rx="2"
              fill="#111E30" stroke="#192B40" strokeWidth="0.5" />
          ))
        )}
        <line x1={W - 72} y1={0} x2={W - 72} y2={H} stroke="#162438" strokeWidth="1.5" />

        {/* ── Aisle centre line ── */}
        <line x1={W / 2} y1={20} x2={W / 2} y2={H - 20}
          stroke="#0C1826" strokeWidth="1" strokeDasharray="12,9" />

        {/* ── Camera FOV cone ── */}
        <path d={`M ${W / 2} 0 L ${W / 2 - 65} ${H * 0.4} L ${W / 2 + 65} ${H * 0.4} Z`}
          fill="rgba(34,197,94,0.02)" stroke="rgba(34,197,94,0.06)" strokeWidth="0.6" />

        {/* ── Camera indicators ── */}
        {[136, 224].map((cx, i) => (
          <g key={`cam-${i}`}>
            <rect x={cx - 11} y={4} width={22} height={13} rx="3"
              fill="#091520" stroke="rgba(34,197,94,0.4)" strokeWidth="0.7" opacity="0.6" />
            <motion.circle cx={cx - 4} cy={10.5} r={2.5} fill="#22C55E"
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.9 }}
            />
          </g>
        ))}

        {/* ── Vertical scanning line ── */}
        <motion.rect x={72} y={0} width={W - 144} height={H}
          fill="url(#vscan)"
          animate={{ y: [-H * 0.35, H * 0.35, -H * 0.35] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ════════════════════════════════════════
            PERSON — left aisle
        ════════════════════════════════════════ */}
        <motion.g
          animate={{ y: [0, -38, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          {/* Safety ellipse */}
          <motion.ellipse cx={128} cy={198} rx={26} ry={26}
            fill="rgba(96,165,250,0.06)" stroke="rgba(96,165,250,0.2)" strokeWidth="1" strokeDasharray="4,4"
            animate={{ rx: [26, 29, 26], ry: [26, 29, 26] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Body */}
          <circle cx={128} cy={192} r={8.5} fill="#93C5FD" opacity="0.92" />
          <ellipse cx={128} cy={205} rx={5.5} ry={8} fill="#60A5FA" opacity="0.88" />
          {/* Detection box */}
          <motion.rect x={113} y={179} width={30} height={42} rx="2"
            fill="none" stroke="#60A5FA" strokeWidth="1.1" strokeDasharray="4,3"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 1.9, repeat: Infinity }}
          />
          {/* Chip */}
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
            <rect x={88} y={163} width={80} height={14} rx="7"
              fill="rgba(6,10,20,0.96)" stroke="rgba(59,130,246,0.55)" strokeWidth="0.8" />
            <circle cx={99} cy={170} r={2.5} fill="#60A5FA" />
            <text x={105} y={174.5} fontSize="6.5" fill="#93C5FD"
              fontFamily="ui-monospace,monospace" fontWeight="600">Person • 98%</text>
          </motion.g>
        </motion.g>

        {/* ════════════════════════════════════════
            FORKLIFT — right aisle
        ════════════════════════════════════════ */}
        <motion.g
          animate={{ y: [0, 48, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Safety ellipse */}
          <motion.ellipse cx={222} cy={158} rx={32} ry={26}
            fill="rgba(34,197,94,0.05)" stroke="rgba(34,197,94,0.18)" strokeWidth="1" strokeDasharray="5,4"
            animate={{ rx: [32, 35, 32], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Forklift body */}
          <rect x={203} y={144} width={34} height={24} rx="3" fill="#D97706" />
          <rect x={216} y={148} width={17} height={16} rx="2" fill="#B45309" />
          <rect x={194} y={150} width={10} height={3} rx="1" fill="#FBBF24" />
          <rect x={194} y={159} width={10} height={3} rx="1" fill="#FBBF24" />
          <circle cx={206} cy={145} r={3} fill="#92400E" />
          <circle cx={233} cy={145} r={3} fill="#92400E" />
          <circle cx={206} cy={166} r={3} fill="#92400E" />
          <circle cx={233} cy={166} r={3} fill="#92400E" />
          {/* Detection box */}
          <motion.rect x={190} y={136} width={54} height={44} rx="2"
            fill="none" stroke="#22C55E" strokeWidth="1.1" strokeDasharray="4,3"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          {/* Chip */}
          <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}>
            <rect x={182} y={118} width={78} height={14} rx="7"
              fill="rgba(6,10,20,0.96)" stroke="rgba(34,197,94,0.55)" strokeWidth="0.8" />
            <circle cx={193} cy={125} r={2.5} fill="#22C55E" />
            <text x={199} y={129.5} fontSize="6.5" fill="#4ADE80"
              fontFamily="ui-monospace,monospace" fontWeight="600">Forklift • 99%</text>
          </motion.g>
        </motion.g>

        {/* ── Zone Clear chip ── */}
        <motion.g animate={{ y: [0, -4, 0], opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}>
          <rect x={108} y={248} width={72} height={15} rx="7.5"
            fill="rgba(4,12,6,0.96)" stroke="rgba(34,197,94,0.38)" strokeWidth="0.8" />
          <circle cx={119} cy={255.5} r={2.6} fill="#22C55E" />
          <text x={125} y={259.5} fontSize="6.5" fill="#4ADE80" fontFamily="ui-monospace,monospace">✓ Zone Clear</text>
        </motion.g>

        {/* ── Pallet chip ── */}
        <motion.g animate={{ y: [0, -3, 0], opacity: [0.82, 1, 0.82] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2.6 }}>
          <rect x={108} y={268} width={58} height={15} rx="7.5"
            fill="rgba(8,12,20,0.96)" stroke="rgba(100,116,139,0.35)" strokeWidth="0.8" />
          <circle cx={119} cy={275.5} r={2.6} fill="#64748B" />
          <text x={125} y={279.5} fontSize="6.5" fill="#94A3B8" fontFamily="ui-monospace,monospace">📦 Pallet</text>
        </motion.g>

        {/* ════════════════════════════════════════
            LIVE badge — top-left
        ════════════════════════════════════════ */}
        <rect x={8} y={7} width={80} height={18} rx="9"
          fill="rgba(7,10,18,0.94)" stroke="rgba(34,197,94,0.18)" strokeWidth="0.8" />
        <motion.circle cx={20} cy={16} r={3} fill="#22C55E" filter="url(#glow-sm)"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <text x={28} y={20} fontSize="7" fill="#22C55E" fontFamily="ui-monospace,monospace" fontWeight="700">LIVE</text>
        <text x={52} y={20} fontSize="6.5" fill="#334155" fontFamily="ui-monospace,monospace">· 2 cams</text>

        {/* ════════════════════════════════════════
            Alert Toast — top-right
        ════════════════════════════════════════ */}
        <motion.g
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <rect x={W - 118} y={5} width={110} height={50} rx="9"
            fill="rgba(18,8,4,0.97)" stroke="rgba(251,146,60,0.28)" strokeWidth="0.8" />
          <rect x={W - 118} y={5} width={3} height={50} rx="1.5" fill="#FB923C" opacity="0.7" />
          <text x={W - 110} y={20} fontSize="7" fill="#FB923C" fontFamily="ui-monospace,monospace" fontWeight="700">⚠ Near Miss</text>
          <text x={W - 110} y={32} fontSize="6.5" fill="#64748B" fontFamily="ui-monospace,monospace">Aisle 07</text>
          <text x={W - 110} y={43} fontSize="6" fill="#334155" fontFamily="ui-monospace,monospace">2 sec ago</text>
          <motion.circle cx={W - 14} cy={14} r={3} fill="#FB923C"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />
        </motion.g>

        {/* ════════════════════════════════════════
            Activity Timeline — bottom-right
        ════════════════════════════════════════ */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
        >
          <rect x={W - 122} y={H - 100} width={114} height={90} rx="10"
            fill="rgba(6,10,20,0.97)" stroke="rgba(22,36,56,0.9)" strokeWidth="0.8" />
          <text x={W - 111} y={H - 83} fontSize="7" fill="#64748B" fontFamily="ui-monospace,monospace" fontWeight="700">Recent Events</text>
          <line x1={W - 122} y1={H - 76} x2={W - 8} y2={H - 76} stroke="#0E1C2E" strokeWidth="0.8" />
          {/* Event rows */}
          {[
            { cy: H - 64, dot: "#22C55E", label: "✓ PPE Verified", time: "1m" },
            { cy: H - 48, dot: "#FB923C", label: "⚠ Speed Alert",  time: "2m" },
            { cy: H - 32, dot: "#22C55E", label: "✓ Zone Cleared", time: "5m" },
          ].map(({ cy, dot, label, time }) => (
            <g key={label}>
              <circle cx={W - 111} cy={cy} r={2.5} fill={dot} />
              <text x={W - 105} y={cy + 4} fontSize="6.5"
                fill={dot === "#22C55E" ? "#4ADE80" : "#FB923C"}
                fontFamily="ui-monospace,monospace">{label}</text>
              <text x={W - 14} y={cy + 4} textAnchor="end" fontSize="5.5"
                fill="#1E3A5F" fontFamily="ui-monospace,monospace">{time} ago</text>
            </g>
          ))}
        </motion.g>

        {/* ── Bottom status bar ── */}
        <rect x={0} y={H - 24} width={W} height={24} fill="rgba(4,6,12,0.98)" />
        <line x1={0} y1={H - 24} x2={W} y2={H - 24} stroke="#0E1A28" strokeWidth="1" />
        <motion.circle cx={13} cy={H - 12} r={2.5} fill="#22C55E"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <text x={21} y={H - 8} fontSize="6.5" fill="#22C55E" fontFamily="ui-monospace,monospace" fontWeight="700">AI VISION</text>
        <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="6" fill="#1E3A5F" fontFamily="ui-monospace,monospace">RAMS Vision Engine 2.0</text>
        <text x={W - 8} y={H - 8} textAnchor="end" fontSize="6" fill="#1A2D40" fontFamily="ui-monospace,monospace">24 events</text>
      </svg>
    </div>
  );
}
