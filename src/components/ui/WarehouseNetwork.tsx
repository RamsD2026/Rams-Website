"use client";

import { motion } from "framer-motion";

const CX = 200, CY = 148;

const NODES = [
  { id: "w1", x: 200, y: 42,  name: "Pune"      },
  { id: "w2", x: 335, y: 88,  name: "Mumbai"    },
  { id: "w3", x: 358, y: 192, name: "Delhi"      },
  { id: "w4", x: 268, y: 260, name: "Dubai"      },
  { id: "w5", x: 112, y: 260, name: "Singapore"  },
  { id: "w6", x: 36,  y: 188, name: "London"     },
  { id: "w7", x: 58,  y: 88,  name: "Frankfurt"  },
];

function WhIcon() {
  return (
    <>
      <rect x="-5" y="0" width="10" height="6" rx="0.5" fill="#0E0E0F" />
      <path d="M-6,0 L0,-6 L6,0 Z" fill="#33363A" />
      <rect x="-2" y="3" width="4" height="3" fill="#FF6A00" opacity="0.9" />
    </>
  );
}

export default function WarehouseNetwork() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        viewBox="0 0 400 308"
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Static base lines */}
        {NODES.map((n) => (
          <line
            key={n.id + "-base"}
            x1={CX} y1={CY} x2={n.x} y2={n.y}
            stroke="rgba(255,106,0,0.15)"
            strokeWidth="1"
          />
        ))}

        {/* Animated flowing dots along each edge */}
        {NODES.map((n, i) => (
          <motion.circle
            key={n.id + "-dot"}
            r="2.2"
            fill="#FF6A00"
            initial={{ cx: CX, cy: CY, opacity: 0 }}
            animate={{
              cx: [CX, n.x],
              cy: [CY, n.y],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.42,
              times: [0, 0.15, 0.85, 1],
            }}
          />
        ))}

        {/* Warehouse nodes */}
        {NODES.map((n, i) => (
          <g key={n.id} transform={`translate(${n.x},${n.y})`}>
            {/* Pulse ring */}
            <motion.circle
              r="10"
              fill="none"
              stroke="rgba(255,106,0,0.35)"
              strokeWidth="1"
              initial={{ r: 8, opacity: 0.7 }}
              animate={{ r: 20, opacity: 0 }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeOut",
                delay: i * 0.38,
              }}
            />
            {/* Node background */}
            <circle r="10" fill="white" stroke="rgba(255,106,0,0.25)" strokeWidth="1" />
            {/* Warehouse icon */}
            <WhIcon />
            {/* Label */}
            <text
              y="22"
              textAnchor="middle"
              fontSize="7.5"
              fill="#33363A"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontWeight="500"
            >
              {n.name}
            </text>
          </g>
        ))}

        {/* Central RAMS hub */}
        <g transform={`translate(${CX},${CY})`}>
          {/* Breathing glow */}
          <motion.circle
            r="30"
            fill="rgba(255,106,0,0.07)"
            animate={{ r: [26, 34, 26], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Outer ring */}
          <circle r="24" fill="white" stroke="rgba(255,106,0,0.35)" strokeWidth="1.5" />
          {/* Inner fill */}
          <circle r="20" fill="#FFF9F5" />
          {/* RAMS label */}
          <text
            textAnchor="middle"
            dy="-1"
            fontSize="7.5"
            fontWeight="700"
            fill="#FF6A00"
            fontFamily="ui-monospace, monospace"
            letterSpacing="1.5"
          >
            RAMS
          </text>
          <text
            textAnchor="middle"
            dy="9"
            fontSize="5.5"
            fill="#33363A"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            Platform
          </text>
        </g>
      </svg>
    </div>
  );
}
