"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { createSstKit } from "./sst-3d";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";

/**
 * 07 — Battery Management.
 *
 * The board from the 3D viewer, live — `DEV.bms()` itself, in its own small
 * scene (`Bms3D`). Without WebGL it falls back to a drawing of the same board
 * from above: the same 100 × 64 mm layout (positions are `DEV.bms()`'s `at`
 * table, in mm) —
 * cell-balance header, filters, the AFE and the MCU, four protection MOSFETs,
 * two current-sense shunts, the pack terminals, the status connector.
 *
 * ── What moves ─────────────────────────────────────────────────────
 * Current runs the power path — B− pad, through the MOSFETs and the shunts, to
 * P− — outward to the truck on shift and inward on charge, so the one switch
 * that flips it also flips the charge meter beside it. The cell lines pulse
 * into the front end, and the MCU's status line pulses out to the connector:
 * the reading leaving the board for the truck's record.
 *
 * ── Words and meters, no figures ────────────────────────────────────
 * "Charging", "Good", "Counted, every one" — every reading here is qualitative
 * on purpose, because RAMS has no measured figures to quote for a customer's
 * batteries and a specimen number on a product page becomes a promise. See
 * `sst-data.ts`.
 *
 * It alternates shift and charge on its own while on screen; choosing one
 * holds it. Under reduced motion nothing flows and the meter holds.
 */

type Mode = "shift" | "charge";

/* Board mm → stage px: centred at (300, 300), 5.2 px per mm. */
const S = 5.2;
const X = (mm: number) => 300 + mm * S;
const Y = (mm: number) => 300 + mm * S;
const R = (cx: number, cz: number, w: number, d: number) => ({ x: X(cx - w / 2), y: Y(cz - d / 2), width: w * S, height: d * S });

const QZ = [-21, -7, 7, 21];
const CELLS = Array.from({ length: 9 }, (_, i) => -10.4 + i * 2.6);

function Board({ mode }: { mode: Mode }) {
  const power = `M${X(43)} ${Y(-16)}H${X(24)}V${Y(-21)}H${X(18)}V${Y(21)}H${X(24)}V${Y(6)}H${X(29)}V${Y(16)}H${X(43)}`;
  const status = `M${X(1.5)} ${Y(14)}H${X(4.5)}V${Y(25.3)}`;
  return (
    <svg viewBox="0 0 600 600" role="img" aria-label="Top view of the battery management board, with current flowing through its power path and data leaving through its status connector">
      {/* board: FR4 edge, green mask, the power pour */}
      <rect {...R(0, 0, 101, 65)} rx="6" fill="#b3ad8a" />
      <rect {...R(0, 0, 100, 64)} rx="5" fill="#0b3d24" />
      <rect {...R(30.75, 0, 36.5, 59)} rx="8" fill="#114f2e" />
      <rect x={X(12.5)} y={Y(-0.3)} width={36.5 * S} height={0.6 * S} fill="#0b3d24" />

      {/* traces: cells → filters → AFE, AFE → MCU */}
      <g className="bt">
        {CELLS.map((z, i) => (
          <path key={i} d={`M${X(-39.5)} ${Y(z)}H${X(-33.5)}M${X(-29.8)} ${Y(z + 1.3)}H${X(-26.5)}L${X(-24 + i * 0.4)} ${Y(-8.2)}`} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={"b" + i} d={`M${X(-16.5 + i * 1.3)} ${Y(-0.5)}V${Y(4 + i * 0.6)}L${X(-6.2)} ${Y(8.5 + i * 0.9)}H${X(-5.5)}`} />
        ))}
      </g>

      {/* mounting holes */}
      {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => (
        <g key={`${sx}${sz}`}>
          <circle cx={X(sx * 46.5)} cy={Y(sz * 28.5)} r={2.9 * S} fill="#cfd3d7" />
          <circle cx={X(sx * 46.5)} cy={Y(sz * 28.5)} r={1.6 * S} fill="#07100b" />
        </g>
      )))}

      {/* balance header, filters */}
      <rect {...R(-42.5, 0, 5.8, 24.8)} rx="2" fill="#efe7d2" />
      <rect {...R(-42.1, 0, 3.6, 22.8)} fill="#1b1c20" />
      {CELLS.map((z) => (
        <rect key={z} {...R(-42.1, z, 0.9, 0.9)} fill="#d3d6da" />
      ))}
      {CELLS.map((z, i) => (
        <g key={"rc" + i}>
          <rect {...R(-33.5, z, 1.6, 0.8)} fill="#17181a" />
          {i < 8 && <rect {...R(-29.8, z + 1.3, 1.6, 0.8)} fill="#a88a62" />}
        </g>
      ))}

      {/* AFE (TSSOP) and MCU (LQFP) */}
      {Array.from({ length: 14 }, (_, i) => -4.225 + i * 0.65).map((o) => (
        <g key={"a" + o} fill="#d3d6da">
          <rect {...R(-18 + o, -6.9, 0.3, 1.1)} />
          <rect {...R(-18 + o, -1.1, 0.3, 1.1)} />
        </g>
      ))}
      <rect {...R(-18, -4, 9.7, 4.4)} rx="0.6" fill="#17181a" />
      {Array.from({ length: 12 }, (_, i) => -2.75 + i * 0.5).map((o) => (
        <g key={"m" + o} fill="#d3d6da">
          <rect {...R(-2 + o, 8.6, 0.22, 1.1)} />
          <rect {...R(-2 + o, 17.4, 0.22, 1.1)} />
          <rect {...R(-6.4, 13 + o, 1.1, 0.22)} />
          <rect {...R(2.4, 13 + o, 1.1, 0.22)} />
        </g>
      ))}
      <rect {...R(-2, 13, 7, 7)} rx="0.6" fill="#17181a" />
      <circle cx={X(-4.8)} cy={Y(10.2)} r={0.45 * S} fill="#0b0c0d" />
      <text x={X(-2)} y={Y(13.6)} className="etch" textAnchor="middle">
        RD-BMS
      </text>
      <rect {...R(-11.5, 21.5, 3.2, 2.5)} rx="0.4" fill="#c7cacf" />

      {/* electrolytic, MOSFETs, shunts */}
      <rect {...R(5, -20, 6.6, 6.6)} rx="0.8" fill="#17181a" />
      <circle cx={X(5)} cy={Y(-20)} r={3.15 * S} fill="#c7cacf" />
      <path d={`M${X(5) - 3.15 * S * 0.5} ${Y(-20) - 3.15 * S * 0.87}A${3.15 * S} ${3.15 * S} 0 0 0 ${X(5) - 3.15 * S * 0.5} ${Y(-20) + 3.15 * S * 0.87}Z`} fill="#17181a" />
      {QZ.map((z) => (
        <g key={z}>
          <rect {...R(21.6, z, 1.6, 5.4)} fill="#d3d6da" />
          <rect {...R(18, z, 6.5, 6.1)} rx="0.5" fill="#17181a" />
          <rect {...R(13.5, z - 2.29, 1.8, 0.75)} fill="#d3d6da" />
          <rect {...R(13.5, z + 2.29, 1.8, 0.75)} fill="#d3d6da" />
        </g>
      ))}
      {[-6, 6].map((z) => (
        <g key={z}>
          <rect {...R(29, z, 3.2, 5.2)} fill="#17181a" />
          <rect {...R(29, z - 2.9, 3.2, 0.7)} fill="#d3d6da" />
          <rect {...R(29, z + 2.9, 3.2, 0.7)} fill="#d3d6da" />
        </g>
      ))}

      {/* pack terminals */}
      {[-16, 16].map((z) => (
        <g key={z}>
          <rect {...R(43, z, 9.5, 12.5)} rx="4" fill="#cfd3d7" />
          <ellipse cx={X(43)} cy={Y(z)} rx={4 * S} ry={5 * S} fill="#e6e8eb" />
        </g>
      ))}

      {/* status connector, LED */}
      <rect {...R(6, 27.5, 7.8, 4.5)} rx="0.6" fill="#efe7d2" />
      <rect {...R(6, 27.9, 6.2, 2.6)} fill="#1b1c20" />
      <rect {...R(-4, 27, 1.6, 0.8)} className="led" />

      {/* silkscreen */}
      <g className="silk">
        <text x={X(43)} y={Y(-24)} textAnchor="middle" fontSize="16">B−</text>
        <text x={X(43)} y={Y(26)} textAnchor="middle" fontSize="16">P−</text>
        <text x={X(-42.5)} y={Y(-14.6)} textAnchor="middle" fontSize="8">J1</text>
        <text x={X(12.2)} y={Y(28)} fontSize="6.5">STATUS</text>
        <image href="/RAMS_Logo_White.svg" x={X(-37.5)} y={Y(17.2)} width={16.5 * S} height={(16.5 * S) / 2.53} opacity=".92" />
        <text x={X(-37.5)} y={Y(26.4)} fontSize="6">BATTERY MANAGEMENT  REV A</text>
      </g>

      {/* what moves: power, cells, status */}
      <g className={"flow is-" + mode}>
        <path className="pw" d={power} />
        {CELLS.slice(0, 8).map((z, i) => (
          <path key={i} className="cl" style={{ animationDelay: `${i * -0.35}s` }} d={`M${X(-39.5)} ${Y(z)}H${X(-26.5)}L${X(-24 + i * 0.4)} ${Y(-8.2)}`} />
        ))}
        <path className="st" d={status} />
      </g>
    </svg>
  );
}

/* The power path, cell lines and status line in board mm — the same routes the
   drawing above uses — lifted just clear of the parts, in metres. */
const POWER: [number, number][] = [[43, -16], [24, -16], [24, -21], [18, -21], [18, 21], [24, 21], [24, 6], [29, 6], [29, 16], [43, 16]];
const STATUS: [number, number][] = [[1.5, 14], [4.5, 14], [4.5, 25.3]];

/**
 * The board from the hardware viewer, live: `DEV.bms()` itself, turning slowly
 * (drag to turn it yourself), with the current drawn on it as solid glowing
 * lines along the power path — a brightness wave running outward and orange on
 * shift, inward and blue on charge — glowing cell lines into the front end and
 * a status line out to its connector, and the status LED blinking.
 *
 * Falls back to the drawing if WebGL is missing, and holds still under
 * reduced motion.
 */
function Bms3D({ mode, onFail }: { mode: Mode; onFail: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const stage = stageRef.current, canvas = canvasRef.current;
    if (!stage || !canvas) return;
    let disposed = false, raf = 0;
    const cleanups: (() => void)[] = [];

    (async () => {
      const THREE = (await import("three")) as typeof THREE_NS;
      if (disposed) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = matchMedia("(max-width:760px)").matches;
      const kit = createSstKit(THREE, isMobile);
      let R: THREE_NS.WebGLRenderer;
      try {
        R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch {
        onFail();
        return;
      }
      kit.setupRenderer(R);
      const scene = await kit.makeScene(R, 0.12);
      if (disposed) {
        R.dispose();
        return;
      }
      const board = kit.DEV.bms();
      board.group.traverse((o) => {
        const m = o as THREE_NS.Mesh;
        if (m.isMesh && (m.material as THREE_NS.Material)?.opacity !== 0) {
          m.castShadow = !isMobile;
          m.receiveShadow = !isMobile;
        }
      });
      scene.add(board.group);
      const cam = new THREE.PerspectiveCamera(30, 1, 0.005, 5);

      /* ── glowing lines ──
         Each route is a solid tube — a bright core inside a soft additive
         halo — and the flow is a brightness wave travelling along it (the
         tube's u runs 0 → 1 along the route), so the line never breaks up. */
      const V = (mm: [number, number], y: number) => new THREE.Vector3(mm[0] / 1000, y, mm[1] / 1000);
      /** A route as straight segments, corner to corner, like a trace. */
      const route = (pts: [number, number][], y: number) => {
        const cp = new THREE.CurvePath<THREE_NS.Vector3>();
        for (let i = 1; i < pts.length; i++) cp.add(new THREE.LineCurve3(V(pts[i - 1], y), V(pts[i], y)));
        return cp;
      };
      type Glow = { mats: THREE_NS.ShaderMaterial[] };
      const glowLine = (pts: [number, number][], y: number, r: number, color: number, waves: number): Glow => {
        const curve = route(pts, y);
        const segs = Math.max(24, pts.length * 24);
        const mk = (halo: boolean) =>
          new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: !halo,
            blending: halo ? THREE.AdditiveBlending : THREE.NormalBlending,
            toneMapped: false,
            uniforms: {
              uColor: { value: new THREE.Color(color) },
              uTime: { value: 0 },
              uWaves: { value: waves },
              uAlpha: { value: halo ? 0.28 : 1 },
            },
            vertexShader: "varying float vU;void main(){vU=uv.x;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
            fragmentShader:
              "uniform vec3 uColor;uniform float uTime,uWaves,uAlpha;varying float vU;" +
              "void main(){float w=0.5+0.5*sin((vU*uWaves-uTime)*6.28318);float b=0.62+0.75*pow(w,3.);" +
              "gl_FragColor=vec4(uColor*b,uAlpha*(0.7+0.3*w));}",
          });
        const core = mk(false), halo = mk(true);
        scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, segs, r, 10, false), core));
        scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, segs, r * 2.8, 10, false), halo));
        return { mats: [core, halo] };
      };
      const power = glowLine(POWER, 0.0046, 0.00055, 0xff9b4d, 3);
      const status = glowLine(STATUS, 0.0026, 0.00028, 0xff9b4d, 1.2);
      const cells = Array.from({ length: 8 }, (_, i) => {
        const z = -10.4 + i * 2.6;
        return glowLine([[-39.5, z], [-29.8, z + 1.3], [-26.5, z + 1.3], [-24 + i * 0.4, -8.2]], 0.0021, 0.00022, 0x5ac8fa, 1.5);
      });
      const led = kit.M.ledOn;

      /* camera: a slow orbit, drag to turn */
      let ang = 0.6, elev = 0.95, drag: { x: number; y: number } | null = null;
      const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
      const onDown = (e: PointerEvent) => {
        if ((e.target as HTMLElement).closest(".bms-mode")) return;
        drag = { x: e.clientX, y: e.clientY };
        stage.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!drag) return;
        ang -= (e.clientX - drag.x) * 0.008;
        elev = clamp(elev + (e.clientY - drag.y) * 0.004, 0.35, 1.35);
        drag = { x: e.clientX, y: e.clientY };
      };
      const onUp = () => (drag = null);
      stage.addEventListener("pointerdown", onDown);
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerup", onUp);
      stage.addEventListener("pointercancel", onUp);
      cleanups.push(() => {
        stage.removeEventListener("pointerdown", onDown);
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerup", onUp);
        stage.removeEventListener("pointercancel", onUp);
      });

      // Discharging on shift is orange; charging is blue.
      const shiftCol = new THREE.Color(0xff9b4d), chargeCol = new THREE.Color(0x4db8ff);
      let t = 0, flow = 0, mix = modeRef.current === "charge" ? 1 : 0;
      const frame = (dt: number) => {
        const charge = modeRef.current === "charge";
        if (!reduce) t += dt;
        if (!drag && !reduce) ang += dt * 0.12;
        mix += ((charge ? 1 : 0) - mix) * Math.min(1, dt * 4);

        // Power: the wave runs outward (B− → P−) on shift, inward on charge.
        flow += dt * (charge ? -0.9 : 0.9) * (reduce ? 0 : 1);
        for (const m of power.mats) {
          (m.uniforms.uColor.value as THREE_NS.Color).copy(shiftCol).lerp(chargeCol, mix);
          m.uniforms.uTime.value = flow;
        }
        for (const m of status.mats) m.uniforms.uTime.value = t * 1.4;
        cells.forEach((c, i) => {
          for (const m of c.mats) m.uniforms.uTime.value = t * 0.8 + i * 0.13;
        });
        led.emissiveIntensity = reduce ? 1.4 : 0.5 + (Math.sin(t * 6) > 0.2 ? 1.4 : 0);

        const w = stage.clientWidth, h = stage.clientHeight;
        const dist = w / h < 1 ? 0.27 : 0.215;
        cam.position.set(Math.sin(ang) * Math.cos(elev) * dist, Math.sin(elev) * dist, Math.cos(ang) * Math.cos(elev) * dist);
        cam.lookAt(0, 0.001, 0);
        R.render(scene, cam);
      };

      const resize = () => {
        const w = stage.clientWidth, h = stage.clientHeight;
        if (!w || !h) return;
        R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        R.setSize(w, h, false);
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(stage);
      resize();

      let running = false, last = 0;
      const loop = (now: number) => {
        if (!running || disposed) {
          raf = 0;
          return;
        }
        raf = requestAnimationFrame(loop);
        frame(Math.min(0.05, (now - last) / 1000 || 0));
        last = now;
      };
      const io = new IntersectionObserver(([en]) => {
        running = en.isIntersecting;
        if (running && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(loop);
        }
      }, { rootMargin: "80px" });
      io.observe(stage);
      cleanups.push(() => {
        running = false;
        io.disconnect();
        ro.disconnect();
        R.dispose();
      });
    })().catch((err) => {
      console.warn("Sensor Stack: battery board unavailable —", err);
      onFail();
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, [onFail]);

  return (
    <div ref={stageRef} className="chip-inner chip-3d">
      <canvas ref={canvasRef} aria-label="3D model of the battery management board, with current flowing through its power path" role="img" />
    </div>
  );
}

export function SstBattery() {
  const [mode, setMode] = useState<Mode>("shift");
  // Without WebGL the section keeps the drawing of the board instead.
  const [noGl, setNoGl] = useState(false);
  const onFail = useCallback(() => setNoGl(true), []);
  const autoRef = useRef(true);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let iv = 0;
    const io = new IntersectionObserver(([en]) => {
      clearInterval(iv);
      if (en.isIntersecting && autoRef.current) {
        iv = window.setInterval(() => autoRef.current && setMode((m) => (m === "shift" ? "charge" : "shift")), 6000);
      }
    });
    io.observe(el);
    return () => {
      clearInterval(iv);
      io.disconnect();
    };
  }, []);

  const pick = (m: Mode) => {
    autoRef.current = false;
    setMode(m);
  };

  return (
    <section className="section dark" id="battery">
      <div className="wrap">
        <Head
          label="Battery Management"
          top="Health and charge,"
          bottom="for every truck."
          intro="A battery management chip at the truck’s battery follows its charge through the shift, counts its charge cycles and tracks its health — so a failing battery shows up in the data before it shows up on the floor."
        />

        <div className={"bms is-" + mode}>
          <Reveal className="chip-stage">
            <div ref={stageRef} className="chip-inner">
              {noGl ? <Board mode={mode} /> : <Bms3D mode={mode} onFail={onFail} />}
            </div>
            <div className="bms-mode" role="radiogroup" aria-label="Battery state">
              {(["shift", "charge"] as const).map((m) => (
                <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => pick(m)}>
                  {m === "shift" ? "On shift" : "On charge"}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="bms-cards">
            <Reveal className="bcard">
              <span className="k">Charge level</span>
              <b aria-live="polite">{mode === "charge" ? "Charging" : "In use"}</b>
              <p>
                {mode === "charge"
                  ? "Followed back up on the charger, so a truck isn’t sent out on a battery that won’t last."
                  : "Followed down through the shift, so a low battery is seen before the truck stops."}
              </p>
              <div className="charge" aria-hidden>
                <i />
              </div>
            </Reveal>

            <Reveal className="bcard" delay={60}>
              <span className="k">Battery health</span>
              <b>Good</b>
              <p>A trend over months, not a surprise on a Monday morning.</p>
              <div className="health" aria-hidden>
                <i />
                <i />
                <i />
                <i />
                <i className="dim" />
              </div>
            </Reveal>

            <Reveal className="bcard" delay={120}>
              <span className="k">Charge cycles</span>
              <b>Counted, every one</b>
              <p>How hard each battery works, truck by truck — and when to plan a replacement.</p>
              <div className="cycles" aria-hidden>
                <svg viewBox="0 0 300 70" preserveAspectRatio="none">
                  <path
                    className="area"
                    d="M0 60L25 52L50 55L75 44L100 47L125 38L150 40L175 30L200 33L225 24L250 26L275 16L300 12V70H0Z"
                  />
                  <path className="ln" d="M0 60L25 52L50 55L75 44L100 47L125 38L150 40L175 30L200 33L225 24L250 26L275 16L300 12" />
                </svg>
              </div>
            </Reveal>
          </div>
        </div>

        <p className="note-dark">Illustration. Readings shown without figures.</p>
      </div>
    </section>
  );
}
