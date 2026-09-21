"use client";

import { useEffect, useRef } from "react";
import { TECH, type TechKey } from "./loc-data";

/* ============================================================================
   The floor plan — one small 2D renderer, used twice.

   Ported from the inline `plan()` closure in the Location Intelligence
   reference. It draws 48 × 28 metres of warehouse **in metres**, scaled to the
   canvas, which is the one decision the whole sandbox rests on: the accuracy
   circle is then honestly the size that accuracy would be on that floor. ±10 mm
   is a dot you can barely see and 5–15 m swallows two aisles, and nobody has to
   take our word for either.

   Plain 2D canvas, no WebGL and no CDN — the reference's own choice, so the
   page works offline, on a phone, and inside the corporate laptop that will not
   run a GPU context. It honours `prefers-reduced-motion` by drawing one static
   frame and never starting the loop.

   Two instances render it:
   · the **hero**, dark, with the floor pushed to the right of the headline, and
     labelled chips over the truck, a trolley and a person;
   · the **sandbox**, light, draggable, where the reader moves the truck.

   Both share this file so the two pictures cannot drift apart.

   ── Why the imperative shape survived the port ──────────────────────
   The renderer owns a RAF loop, a pointer drag and an IntersectionObserver, and
   redraws forty times a second from mutable state. Lifting `st` into React
   state would re-render the tree on every frame for no gain. So React owns the
   element and the props; everything inside the effect stays the reference's
   own imperative code, and the two cross the boundary through refs.
   ========================================================================== */

/** The floor, in metres. Everything else here is expressed against it. */
const WORLD = { w: 48, h: 28 };

/** Twelve racks, three rows of four, laid out on the same grid as the aisles. */
const RACKS: { x: number; y: number; w: number; h: number }[] = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 4; c++) RACKS.push({ x: 4 + c * 11, y: 3.4 + r * 8.4, w: 8, h: 3.2 });
}

/** The loop the truck drives when nobody is dragging it. */
const PATH: [number, number][] = [
  [2.6, 12.4],
  [45.4, 12.4],
  [45.4, 24.6],
  [2.6, 24.6],
];
/** In the hero the left of the floor sits behind the headline, so the truck
    keeps to the right of it and stays visible. */
const PATH_HERO: [number, number][] = [
  [19, 12.4],
  [45.4, 12.4],
  [45.4, 24.6],
  [19, 24.6],
];

/** Where the fixed kit goes, by how much of it a technology needs. */
function anchorSpots(n: number): [number, number][] {
  if (n === 6)
    return [
      [3, 2.6],
      [24, 2],
      [45, 2.6],
      [3, 26],
      [24, 26.6],
      [45, 26],
    ];
  if (n === 3)
    return [
      [6, 2.4],
      [40, 2.4],
      [24, 26.6],
    ];
  if (n === 2)
    return [
      [10, 2.4],
      [38, 26.4],
    ];
  return [];
}

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
}

export function LocPlan({
  tech,
  theme = "light",
  hero = false,
  drag = false,
  onManual,
  /** Bump to put the truck back on its route. Nothing else resets it. */
  resumeToken = 0,
  id,
  role,
  label,
}: {
  tech: TechKey;
  theme?: "dark" | "light";
  hero?: boolean;
  drag?: boolean;
  onManual?: (manual: boolean) => void;
  resumeToken?: number;
  id?: string;
  role?: "img";
  label?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const techRef = useRef(tech);
  const manRef = useRef<{ x: number; y: number } | null>(null);
  /** The renderer's own `frame`, published so the prop effects below can force
      a redraw without owning any of its state. */
  const drawRef = useRef<((dt: number) => void) | null>(null);
  const onManualRef = useRef(onManual);

  useEffect(() => {
    onManualRef.current = onManual;
  }, [onManual]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dark = theme === "dark";
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let ppm = 1;
    let ox = 0;
    let oy = 0;
    let dragging = false;
    const st = { t: 0, time: 0, jx: 0, jy: 0, jtx: 0, jty: 0, manA: 0 };

    function size() {
      if (!canvas || !ctx) return;
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (!r.width || !r.height) return;
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ppm = Math.min(W / WORLD.w, H / WORLD.h);
      /* In the hero the copy sits on the left, so the floor takes the
         right-hand side; on a narrow screen it zooms in and crops instead,
         which reads better than a thin band of grid. */
      if (hero) ppm = W / H > 1.35 ? Math.min((W * 0.62) / WORLD.w, H / WORLD.h) : (H / WORLD.h) * 0.92;
      ox = (W - WORLD.w * ppm) / 2;
      oy = (H - WORLD.h * ppm) / 2;
      if (hero && W / H > 1.35) ox = W - WORLD.w * ppm - Math.min(48, W * 0.03);
    }

    const X = (x: number) => ox + x * ppm;
    const Y = (y: number) => oy + y * ppm;
    const M = (m: number) => m * ppm;

    function truckAt(t: number) {
      const route = hero ? PATH_HERO : PATH;
      const segs: number[] = [];
      let total = 0;
      for (let i = 0; i < route.length; i++) {
        const a = route[i];
        const b = route[(i + 1) % route.length];
        const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
        segs.push(d);
        total += d;
      }
      const want = (t % 1) * total;
      let acc = 0;
      for (let i = 0; i < segs.length; i++) {
        if (acc + segs[i] >= want) {
          const k = (want - acc) / segs[i];
          const a = route[i];
          const b = route[(i + 1) % route.length];
          return {
            x: a[0] + (b[0] - a[0]) * k,
            y: a[1] + (b[1] - a[1]) * k,
            a: Math.atan2(b[1] - a[1], b[0] - a[0]),
          };
        }
        acc += segs[i];
      }
      return { x: route[0][0], y: route[0][1], a: 0 };
    }

    function roundRect(x: number, y: number, w: number, h: number, r: number) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }

    /** A label over something on the floor. The reference set these in Inter;
        this site's body family is Roboto, named directly because a canvas font
        string cannot take a CSS variable. */
    function chip(txt: string, x: number, y: number, accent: string) {
      if (!ctx) return;
      ctx.font = "600 12px Roboto, system-ui, -apple-system, sans-serif";
      const w = ctx.measureText(txt).width + 34;
      const hh = 25;
      const rx = Math.max(4, Math.min(x - w / 2, W - w - 4));
      const ry = y - hh;
      ctx.fillStyle = dark ? "rgba(20,21,26,.86)" : "rgba(255,255,255,.92)";
      roundRect(rx, ry, w, hh, 9);
      ctx.fill();
      ctx.strokeStyle = dark ? "rgba(255,255,255,.13)" : "rgba(0,0,0,.08)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(rx + 12, ry + hh / 2, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = dark ? "#F5F5F7" : "#1D1D1F";
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText(txt, rx + 21, ry + hh / 2 + 0.5);
    }

    function frame(dt: number) {
      if (!ctx) return;
      const T = TECH[techRef.current];
      st.time += dt;
      if (!still) st.t += dt * 0.016;
      /* The reported dot wanders inside the accuracy circle, so uncertainty is
         something you watch rather than something you read. */
      if (st.time > 0.35) {
        st.time = 0;
        st.jtx = Math.random() * 2 - 1;
        st.jty = Math.random() * 2 - 1;
      }
      st.jx += (st.jtx - st.jx) * Math.min(1, dt * 2.2);
      st.jy += (st.jty - st.jy) * Math.min(1, dt * 2.2);

      ctx.clearRect(0, 0, W, H);

      /* floor */
      if (!dark) {
        ctx.fillStyle = "#EEEFF4";
        ctx.fillRect(0, 0, W, H);
      }
      ctx.strokeStyle = dark ? "rgba(255,255,255,.07)" : "rgba(29,29,31,.055)";
      ctx.lineWidth = 1;
      for (let gx = 0; gx <= WORLD.w; gx += 4) {
        ctx.beginPath();
        ctx.moveTo(X(gx), Y(0));
        ctx.lineTo(X(gx), Y(WORLD.h));
        ctx.stroke();
      }
      for (let gy = 0; gy <= WORLD.h; gy += 4) {
        ctx.beginPath();
        ctx.moveTo(X(0), Y(gy));
        ctx.lineTo(X(WORLD.w), Y(gy));
        ctx.stroke();
      }

      /* racks */
      for (const r of RACKS) {
        ctx.fillStyle = dark ? "#23252C" : "#D7D8DF";
        roundRect(X(r.x), Y(r.y), M(r.w), M(r.h), M(0.25));
        ctx.fill();
        ctx.strokeStyle = dark ? "rgba(255,255,255,.11)" : "rgba(29,29,31,.10)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const man = manRef.current;
      const p = man ? { x: man.x, y: man.y, a: st.manA } : truckAt(st.t);
      const cx = X(p.x);
      const cy = Y(p.y);

      /* fixed kit — none for LiDAR, which carries its own sensor instead */
      const spots = anchorSpots(T.anchors);
      spots.forEach((s, i) => {
        const sx = X(s[0]);
        const sy = Y(s[1]);
        if (T.mode === "rings" || T.mode === "blob") {
          const ph = (st.t * 3 + i * 0.33) % 1;
          const rad = M(T.mode === "blob" ? 16 : 9) * (T.mode === "blob" ? 1 : ph);
          if (T.mode === "blob") {
            const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, rad);
            g.addColorStop(0, "rgba(191,90,242,.16)");
            g.addColorStop(1, "rgba(191,90,242,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(sx, sy, rad, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.strokeStyle = "rgba(48,209,88," + (0.5 * (1 - ph)).toFixed(3) + ")";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(sx, sy, rad, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        if (T.mode === "range") {
          ctx.strokeStyle = "rgba(10,132,255,.28)";
          ctx.lineWidth = 1.2;
          ctx.setLineDash([4, 5]);
          ctx.lineDashOffset = -(st.t * 140) % 9;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(cx, cy);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.fillStyle = T.colour;
        roundRect(sx - M(0.45), sy - M(0.45), M(0.9), M(0.9), M(0.2));
        ctx.fill();
      });

      /* LiDAR sweeps from the truck itself */
      if (T.mode === "scan") {
        const sweep = ((st.t * 6) % 1) * Math.PI * 2;
        const span = Math.PI * 0.42;
        const reach = M(9);
        const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, reach);
        g2.addColorStop(0, dark ? "rgba(255,106,0,.32)" : "rgba(255,106,0,.20)");
        g2.addColorStop(1, "rgba(255,106,0,0)");
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, reach, sweep - span / 2, sweep + span / 2);
        ctx.closePath();
        ctx.fill();
      }

      /* The accuracy circle: real size on this floor, with a 3.5 px floor so
         ±10 mm stays visible at all. That floor is the one place the drawing
         flatters a technology, and it flatters the one we actually run. */
      const rad = Math.max(M(T.acc), 3.5);
      ctx.fillStyle = hexA(T.colour, 0.1);
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = hexA(T.colour, 0.9);
      ctx.lineWidth = 1.6;
      ctx.stroke();

      /* Where the system thinks it is, wandering inside that circle. Below
         30 cm the two are the same dot, so it is not drawn. */
      if (T.acc > 0.3) {
        ctx.beginPath();
        ctx.arc(cx + st.jx * rad * 0.62, cy + st.jy * rad * 0.62, 4.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(29,29,31,.55)";
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      /* the truck */
      if (dark) {
        const gl = ctx.createRadialGradient(cx, cy, 0, cx, cy, M(2.4));
        gl.addColorStop(0, "rgba(255,106,0,.30)");
        gl.addColorStop(1, "rgba(255,106,0,0)");
        ctx.fillStyle = gl;
        ctx.beginPath();
        ctx.arc(cx, cy, M(2.4), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(p.a);
      ctx.fillStyle = "#FF6A00";
      roundRect(-M(1), -M(0.6), M(2), M(1.2), M(0.25));
      ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,.35)";
      roundRect(M(0.25), -M(0.42), M(0.5), M(0.84), M(0.14));
      ctx.fill();
      ctx.restore();

      /* a pallet to find */
      ctx.fillStyle = dark ? "#6E7076" : "#1D1D1F";
      roundRect(X(20.5) - M(0.4), Y(20.2) - M(0.4), M(0.8), M(0.8), M(0.15));
      ctx.fill();

      /* The hero shows a floor with things on it, each one labelled. */
      if (hero) {
        const wt = (st.t * 0.9) % 1;
        const wx = X(6 + wt * 36);
        const wy = Y(6.6);
        ctx.fillStyle = "rgba(10,132,255,.18)";
        ctx.beginPath();
        ctx.arc(wx, wy, M(0.9), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#0A84FF";
        ctx.beginPath();
        ctx.arc(wx, wy, M(0.34), 0, Math.PI * 2);
        ctx.fill();

        const tx = X(33);
        const ty = Y(20.6);
        if (T.mode === "rings") {
          const tp = (st.t * 3) % 1;
          ctx.strokeStyle = "rgba(48,209,88," + (0.45 * (1 - tp)).toFixed(3) + ")";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(tx, ty, M(4) * tp, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = dark ? "#2C2E34" : "#C9CAD1";
        roundRect(tx - M(0.75), ty - M(0.45), M(1.5), M(0.9), M(0.18));
        ctx.fill();
        ctx.strokeStyle = dark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.10)";
        ctx.lineWidth = 1;
        ctx.stroke();

        /* Three chips crowd a phone, so they only appear once there is room. */
        if (W > 720) {
          chip("Forklift 14 · " + T.accTxt + " " + T.accUnit, cx, cy - M(1.5), T.colour);
          chip("Trolley T-42", tx, ty - M(1.3), "#30D158");
          chip("Person", wx, wy - M(1.3), "#0A84FF");
        }
      }
    }

    drawRef.current = frame;

    let raf = 0;
    let last = 0;
    let running = false;
    function loop(ts: number) {
      if (!running) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (ts - last) / 1000 || 0);
      last = ts;
      frame(dt);
    }

    /* Drag the truck around the floor: the circle, the ranging lines and the
       reported dot all follow it. This is what turns the picture into an
       argument — put the Wi-Fi circle over an aisle and it covers the aisle. */
    const place = (e: PointerEvent) => {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      const wx = Math.max(1.4, Math.min(WORLD.w - 1.4, (e.clientX - r.left - ox) / ppm));
      const wy = Math.max(1.4, Math.min(WORLD.h - 1.4, (e.clientY - r.top - oy) / ppm));
      const man = manRef.current;
      if (man && (wx !== man.x || wy !== man.y)) st.manA = Math.atan2(wy - man.y, wx - man.x);
      manRef.current = { x: wx, y: wy };
      onManualRef.current?.(true);
      frame(0);
    };
    const onDown = (e: PointerEvent) => {
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
      place(e);
    };
    const onMove = (e: PointerEvent) => {
      if (dragging) place(e);
    };
    const onUp = () => {
      dragging = false;
      canvas.style.cursor = "grab";
    };
    if (drag) {
      canvas.style.touchAction = "none";
      canvas.style.cursor = "grab";
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
    }

    size();
    frame(0);

    const onResize = () => {
      size();
      frame(0);
    };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    /* The loop only runs while the plan is on screen — two canvases on one page
       otherwise animate each other off a phone's battery. */
    const io = new IntersectionObserver(
      (entries) => {
        running = entries[0].isIntersecting && !still;
        if (running && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(loop);
        }
        if (!running) frame(0);
      },
      { rootMargin: "60px" },
    );
    io.observe(canvas);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
      if (drag) {
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
      }
      drawRef.current = null;
    };
  }, [theme, hero, drag]);

  /* The tab switch: the renderer reads the technology from a ref, so changing
     it redraws rather than tearing the whole canvas down and losing the truck's
     position mid-loop. */
  useEffect(() => {
    techRef.current = tech;
    drawRef.current?.(0);
  }, [tech]);

  useEffect(() => {
    if (!resumeToken) return;
    manRef.current = null;
    onManualRef.current?.(false);
    drawRef.current?.(0);
  }, [resumeToken]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      role={role}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
