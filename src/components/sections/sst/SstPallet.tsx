"use client";

import { useEffect, useRef, useState } from "react";
import { Head, Media, Reveal } from "@/components/sections/hardware/hw-shared";
import { IMG } from "./sst-data";

/**
 * 06 — Pallet Detection.
 *
 * A side view of the fork carriage. The unit — the upright box from the 3D
 * viewer — is bolted to the carriage face looking forward, and its two TF-Luna
 * heads aim down over the forks at two different angles, 45° and 60°. Each
 * lands on a different spot, so each is a separate check of the same answer.
 *
 * ── What it simulates ──────────────────────────────────────────────
 * Each head measures how far its beam travels before something stops it, and
 * that distance tells three cases apart:
 *
 *   **No pallet** — the beam runs on until it meets the bare forks.
 *   **Pallet** — it lands sooner, on the pallet's top deck.
 *   **Pallet with load** — it stops almost at once, on the load's back face.
 *
 * **Double verification**: each beam is traced against whatever is in front of
 * it every frame and read on its own meter, and the chip names a state only
 * when both heads agree. While a pallet is still moving it says so rather than
 * naming a reading mid-slide.
 *
 * ── No figures ─────────────────────────────────────────────────────
 * The meters carry bands, not numbers: RAMS quotes no range or threshold for
 * this unit, and a specimen number on a product page reads as a promise. Same
 * rule as the battery and LiDAR panels (see `sst-data.ts`).
 *
 * ── Driving it ─────────────────────────────────────────────────────
 * It cycles through all three on its own while on screen. Picking one hands it
 * to the reader and the cycle stops for good. Under reduced motion it jumps
 * straight to whatever is picked.
 */

type Cargo = "none" | "pallet" | "load";
const CARGO: { k: Cargo; label: string }[] = [
  { k: "none", label: "No pallet" },
  { k: "pallet", label: "Pallet" },
  { k: "load", label: "Pallet + load" },
];
const STATE: Record<Cargo, string> = { none: "Forks empty", pallet: "Empty pallet on forks", load: "Pallet with load" };
/** What the auto cycle asks for next. */
const SEQ: Cargo[] = ["load", "none", "pallet", "none"];

/* Scene geometry, in the SVG's 800 × 600. */
/* The TF-Luna windows, top of the unit's front face. The unit sits on the
   carriage just above the fork shanks, its face flush with theirs, so nothing
   stands proud of the carriage for a pallet to catch. */
const EYE = { x: 190, y: 259 };
const FORK_TOP = 470;
const DECK_TOP = 438, PAL_H = 70;
const LOAD_TOP = 306;
const PAL_X = 246, PAL_L = 320; // resting on the forks, clear of the sensor face
const OFF = 700; // how far right the pallet slides to be out of frame
/** The two heads' angles below horizontal, in degrees. */
const ANGLES = [45, 60];
/** Meter bands, as a fraction of each head's own empty-forks beam: load, then
    pallet, then forks. The 60° head meets the load face further along its beam
    than the 45° one, hence the load band's width. */
const LOAD_CUT = 0.68, PAL_CUT = 0.92;

type Pt = { x: number; y: number };
/**
 * Where a beam at `deg` below horizontal stops, traced against the load's back
 * face, the pallet's back face and deck, then the forks.
 */
const trace = (deg: number, cargo: Cargo, px: number): Pt => {
  const k = Math.tan((deg * Math.PI) / 180);
  const along = (x: number) => EYE.y + (x - EYE.x) * k;
  const atY = (y: number) => EYE.x + (y - EYE.y) / k;
  if (cargo !== "none") {
    if (cargo === "load") {
      const x = px + 6, y = along(x);
      if (x >= EYE.x && y >= LOAD_TOP && y <= DECK_TOP) return { x, y };
    }
    const y = along(px);
    if (px >= EYE.x && y >= DECK_TOP && y <= DECK_TOP + PAL_H) return { x: px, y };
    const x = atY(DECK_TOP);
    if (x >= px && x <= px + PAL_L) return { x, y: DECK_TOP };
  }
  return { x: atY(FORK_TOP), y: FORK_TOP };
};
const FULL = ANGLES.map((a) => Math.hypot(...(({ x, y }) => [x - EYE.x, y - EYE.y])(trace(a, "none", 0))));

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const classify = (f: number): Cargo => (f < LOAD_CUT ? "load" : f < PAL_CUT ? "pallet" : "none");

function PalletSim() {
  // `cargo` is what is physically riding in (or out); `off` how far out it is.
  const [cargo, setCargo] = useState<Cargo>("load");
  const [off, setOff] = useState(0);
  const [want, setWant] = useState<Cargo>("load");
  const wrapRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef(true);
  const st = useRef({ cargo: "load" as Cargo, off: 0, want: "load" as Cargo });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, last = 0, hold = 1.6, seq = 0;
    let move: { from: number; to: number; t: number } | null = null;

    const set = (cargo: Cargo, off: number) => {
      st.current.cargo = cargo;
      st.current.off = off;
      setCargo(cargo);
      setOff(off);
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      const S = st.current;

      if (move) {
        move.t = Math.min(1, move.t + dt / 1.5);
        set(S.cargo, move.from + (move.to - move.from) * ease(move.t));
        if (move.t < 1) return;
        move = null;
        hold = 1.8;
      }
      // Something else is wanted: drive the current pallet out, swap, drive in.
      if (S.want !== S.cargo) {
        if (S.cargo !== "none" && S.off < 1) {
          if (reduce) set(S.cargo, 1);
          else move = { from: S.off, to: 1, t: 0 };
          return;
        }
        set(S.want, 1);
        if (S.want !== "none") {
          if (reduce) set(S.want, 0);
          else move = { from: 1, to: 0, t: 0 };
        }
        return;
      }
      if (!autoRef.current || reduce) return;
      if ((hold -= dt) > 0) return;
      const next = SEQ[seq];
      seq = (seq + 1) % SEQ.length;
      S.want = next;
      setWant(next);
    };
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf);
      if (en.isIntersecting) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const pick = (k: Cargo) => {
    autoRef.current = false;
    st.current.want = k;
    setWant(k);
  };

  const px = PAL_X + off * OFF;
  const hits = ANGLES.map((a) => trace(a, cargo, px));
  const reads = hits.map((h, i) => Math.hypot(h.x - EYE.x, h.y - EYE.y) / FULL[i]);
  const seen = reads.map(classify);
  const agree = seen[0] === seen[1];
  // Only while the pallet is in frame: once it has slid out past the edge the
  // beam already sees bare forks, and the chip should say so.
  const moving = off > 0.001 && px < 790;
  const state = agree ? seen[0] : seen[1];
  const slats = Array.from({ length: 6 }, (_, i) => i);

  return (
    <Reveal className={"pds-anim is-" + state}>
      <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
        <svg
          viewBox="-50 -30 860 645"
          role="img"
          aria-label="Side view of a fork carriage. The pallet sensor on the carriage aims two beams down over the forks, at 45 and 60 degrees; they land on the bare forks, on a pallet's deck, or on the load."
        >
          <defs>
            <linearGradient id="sstMast" x1="0" x2="1">
              <stop offset="0" stopColor="#2b2c30" />
              <stop offset="1" stopColor="#18191c" />
            </linearGradient>
            <linearGradient id="sstBeam" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity=".05" />
              <stop offset="1" stopColor="currentColor" stopOpacity=".28" />
            </linearGradient>
          </defs>

          {/* floor */}
          <rect x="-240" y="520" width="1040" height="220" fill="#DADAE0" />

          {/* the front of the truck behind the mast — front wheel, body,
              steering, overhead guard — cropped by the frame, so the carriage
              reads as the front of a forklift, not a bracket on a wall */}
          <g className="truck">
            <path d="M-222 470V356q0-26 26-26H-118L-96 300H20q14 0 20 12L96 400V470Z" fill="#f2b200" />
            <path d="M-222 470V356q0-26 26-26H-150V470Z" fill="#d99c00" />
            <rect x="-104" y="316" width="58" height="16" rx="6" fill="#2a2b30" />
            <path d="M-104 316q-4-48 18-56h12q-8 26-4 56Z" fill="#2a2b30" />
            <path d="M16 300l30-58" stroke="#2a2b30" strokeWidth="8" strokeLinecap="round" />
            <ellipse cx="46" cy="240" rx="18" ry="5" fill="#2a2b30" transform="rotate(-60 46 240)" />
            <path d="M-140 330V150H80V396" fill="none" stroke="#2d2e33" strokeWidth="11" strokeLinejoin="round" />
            {[-110, -70, -30, 10, 50].map((x) => (
              <rect key={x} x={x} y="146" width="22" height="8" rx="2" fill="#2d2e33" />
            ))}
            <path d="M8 430a58 58 0 0 1 104 0" fill="#d99c00" />
            {[
              { x: 58, r: 50 },
              { x: -160, r: 40 },
            ].map((w) => (
              <g key={w.x}>
                <circle cx={w.x} cy={520 - w.r} r={w.r} fill="#1c1c1e" />
                <circle cx={w.x} cy={520 - w.r} r={w.r * 0.45} fill="#6e6e73" />
                <circle cx={w.x} cy={520 - w.r} r={w.r * 0.14} fill="#2a2b30" />
              </g>
            ))}
          </g>

          {/* mast, carriage and backrest */}
          <rect x="110" y="40" width="42" height="480" rx="4" fill="url(#sstMast)" />
          <rect x="152" y="120" width="28" height="366" rx="3" fill="#2d2e33" />
          {[150, 200, 250, 300, 350, 400].map((y) => (
            <rect key={y} x="156" y={y} width="20" height="4" fill="#45464c" />
          ))}

          {/* forks */}
          <rect x="176" y="300" width="14" height="184" rx="2" fill="#3a3b40" />
          <path d={`M176 ${FORK_TOP}H560L572 ${FORK_TOP + 8}V${FORK_TOP + 14}H176Z`} fill="#3a3b40" />

          {/* the pallet, and its load, sliding in from the right */}
          {cargo !== "none" && (
            <g className="pal" transform={`translate(${px} 0)`}>
              {slats.map((i) => (
                <rect key={"t" + i} x={i * 56} y={DECK_TOP} width="40" height="12" rx="2" fill={i % 2 ? "#c9a06e" : "#d3ab78"} />
              ))}
              <rect x="0" y={DECK_TOP} width={PAL_L} height="12" fill="none" />
              {[0, PAL_L / 2 - 16, PAL_L - 32].map((x) => (
                <rect key={x} x={x} y={DECK_TOP + 12} width="32" height="46" fill="#a97a4c" />
              ))}
              <rect x="0" y={DECK_TOP + 58} width={PAL_L} height="12" fill="#b9895a" />
              {cargo === "load" && (
                <g>
                  <rect x="6" y={LOAD_TOP + 58} width="150" height={DECK_TOP - LOAD_TOP - 58} fill="#d8b98c" />
                  <rect x="162" y={LOAD_TOP + 58} width="152" height={DECK_TOP - LOAD_TOP - 58} fill="#cdab7c" />
                  <rect x="6" y={LOAD_TOP} width="308" height="54" fill="#dcc096" />
                  <rect x="6" y={LOAD_TOP} width="308" height={DECK_TOP - LOAD_TOP} fill="none" stroke="#b5946a" strokeWidth="2" />
                  <path d={`M82 ${LOAD_TOP}V${LOAD_TOP + 54}M238 ${LOAD_TOP}V${LOAD_TOP + 54}`} stroke="#c9a877" strokeWidth="5" />
                </g>
              )}
            </g>
          )}

          {/* the two beams, 45° and 60° down, each stopping at whatever is in its way */}
          {hits.map((h, i) => {
            const n = { x: Math.sin((ANGLES[i] * Math.PI) / 180) * 8, y: -Math.cos((ANGLES[i] * Math.PI) / 180) * 8 };
            return (
              <g key={i} className={"beam-g is-" + seen[i]}>
                <path className="cone" d={`M${EYE.x} ${EYE.y}L${h.x - n.x} ${h.y - n.y}L${h.x + n.x} ${h.y + n.y}Z`} />
                <line className="beam" x1={EYE.x} y1={EYE.y} x2={h.x} y2={h.y} />
                <circle className="hitdot" cx={h.x} cy={h.y} r="6" />
              </g>
            );
          })}

          {/* the sensor, on the carriage face above the fork shanks, flush with them */}
          <rect x="174" y="250" width="16" height="38" rx="3" fill="#111214" />
          <rect className="win" x="186" y="254" width="5" height="10" rx="2" />
          <g className="callout">
            <path d="M182 250V214H216" />
            <rect x="216" y="200" width="190" height="28" rx="14" />
            <text x="230" y="219">
              Pallet Detection Sensor
            </text>
          </g>
        </svg>

        <span className="pds-chip" aria-live="polite">
          <i />
          <span>{moving ? "Reading…" : agree ? STATE[state] : "Heads disagree — checking"}</span>
        </span>

        <div className="pds-read" aria-hidden>
          <span className="k">How far each beam travels</span>
          {reads.map((f, i) => (
            <div key={i} className="row">
              <span>{ANGLES[i]}° head</span>
              <div className="bar">
                <b className="band load" style={{ width: `${LOAD_CUT * 100}%` }} />
                <b className="band pallet" style={{ left: `${LOAD_CUT * 100}%`, width: `${(PAL_CUT - LOAD_CUT) * 100}%` }} />
                <i className={"is-" + seen[i]} style={{ width: `${f * 100}%` }} />
              </div>
            </div>
          ))}
          <div className="legend">
            <span>Load</span>
            <span>Pallet</span>
            <span>Forks</span>
          </div>
        </div>

        <div className="pds-pick" role="radiogroup" aria-label="What is on the forks">
          {CARGO.map((c) => (
            <button key={c.k} type="button" role="radio" aria-checked={want === c.k} onClick={() => pick(c.k)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function SstPallet() {
  return (
    <section className="section" id="pallet">
      <div className="wrap">
        <Head
          label="Pallet Detection"
          top="Loaded or empty."
          bottom="Every lift."
          intro="A small box on the fork carriage looks forward and down over the forks with two sensing heads. From how far its beams travel, it knows whether the forks are empty, carrying an empty pallet, or carrying a loaded one — and so does everything the truck records."
        />

        <div className="pds">
          <PalletSim />

          <div className="pds-side">
            <Reveal>
              <Media src={IMG.pds} alt="RAMS Pallet Detection Sensor" label={IMG.pds} className="contain" tone="light" />
            </Reveal>
            <Reveal className="tile">
              <span className="label">What it adds</span>
              <h3>Every event knows the load.</h3>
              <ul className="checks">
                <li>Picks and drops counted, per truck and per operator</li>
                <li>Empty travel and loaded travel told apart</li>
                <li>An impact with a load on reads differently from one without</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
