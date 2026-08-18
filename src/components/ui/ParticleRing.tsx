"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#FF6A00", "#FF9B4D", "#FFC46A"];

interface Dot {
  x: number; y: number;
  r: number; alpha: number;
  color: string;
}

function buildDots(W: number, H: number, count: number, rxF: number, ryF: number): Dot[] {
  const cx = W / 2;
  const cy = H / 2;
  const rx = W * rxF;
  const ry = H * ryF;
  const dots: Dot[] = [];
  const step = (Math.PI * 2) / count;

  for (let i = 0; i < count; i++) {
    const t = i * step + (Math.random() - 0.5) * step * 2.5;
    const spread = (Math.random() - 0.5) * 28;
    dots.push({
      x: cx + (rx + spread) * Math.cos(t),
      y: cy + (ry + spread) * Math.sin(t),
      r: 0.6 + Math.random() * 1.4,
      alpha: 0.12 + Math.random() * 0.42,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }
  return dots;
}

export default function ParticleRing({
  count = 900,
  rxFactor = 0.44,
  ryFactor = 0.35,
  style,
}: {
  count?: number;
  rxFactor?: number;
  ryFactor?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const paint = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, W, H);

      for (const d of buildDots(W, H, count, rxFactor, ryFactor)) {
        ctx.globalAlpha = d.alpha;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [count, rxFactor, ryFactor]);

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 3,
        ...style,
      }}
    />
  );
}
