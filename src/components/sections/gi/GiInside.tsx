"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { Head, Media, Reveal } from "@/components/sections/hardware/hw-shared";
import { createGiKit, type Find, type Holder, type Part, type Scan } from "./gi-3d";
import { INSIDE_CAPS, KEYS, MACHINES, type MachineKey } from "./gi-data";

/**
 * 04 — Inside.
 *
 * One machine at a time on a turntable you can drag, with two things it can
 * show:
 *
 *   **Inside** — the machine comes apart, each part labelled in plain words.
 *   **What it scans** — it reassembles and goes to work. AirScan climbs a full
 *   rack, level by level, reading labels, load notices and a free position in
 *   blue, and flagging a bent upright, an overhanging load and stock in the
 *   wrong bay in orange. FloorScan drives a cut-away slab, reading reinforcement,
 *   conduit and the shape of the surface, and flagging a post-tension cable, a
 *   crack and a void under a rack leg.
 *
 * That second view is where the page earns its argument: it is the only place a
 * reader can see what "inspects the slab" actually means. Blue reads, orange
 * flags, and the key under the stage says so.
 *
 * ── The camera orbits; the machine never turns ──────────────────────
 * Dragging moves the *camera*, as in the OmniBox viewer. Spinning the model
 * instead looks near enough on an assembled machine but falls apart the moment
 * it explodes — parts swing through their own labels — and the scan scenes live
 * in scene space, so a rack would be dragged round with the drone inside it.
 * Framing is computed per frame from whichever of the two is on screen: an
 * exploded drone and a 26-metre slab want very different distances.
 *
 * ── Labels are laid out, not just projected ─────────────────────────
 * After projecting, each chip flips to whichever side it fits on, is clamped
 * inside the stage, and — per side, top to bottom — pushed down to clear the one
 * above. On a phone they become two pinned columns. The clearances differ per
 * view because the scan view has a key bar along the bottom.
 *
 * The viewer takes itself apart once, unprompted, the first time it is scrolled
 * to; any deliberate input cancels that. And it carries a **Pilot machine** chip
 * throughout — these are stand-ins for machines that do not exist yet.
 */

const ss = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export type InsideView = "inside" | "scan";

type Chip = { el: HTMLDivElement; obj: THREE_NS.Object3D; x: number; y: number; h: number; flip: boolean; vis: boolean };

export function GiInside({
  active,
  view,
  onActive,
  onView,
  onOpen,
}: {
  active: MachineKey;
  view: InsideView;
  onActive: (k: MachineKey) => void;
  onView: (v: InsideView) => void;
  onOpen: (k: MachineKey) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [noGl, setNoGl] = useState(false);
  const [apart, setApart] = useState(false);
  /* Off, matching the OmniBox viewer. Both viewers auto-explode ~900ms after
     they are first seen, so the state a reader lands on is the machine apart
     with its parts unlabelled — the shape first, the names on demand. Turning
     labels on by default put a chip over every part of a machine the reader had
     not looked at yet. */
  const [labels, setLabels] = useState(false);

  const activeRef = useRef(active);
  const viewRef = useRef(view);
  const apartRef = useRef(apart);
  const labelsRef = useRef(labels);
  /** Published by the scene: swap machine, rebuild chips, note a deliberate touch. */
  const apiRef = useRef<{ select: (k: MachineKey) => void; rebuild: () => void; touch: () => void } | null>(null);

  useEffect(() => {
    apartRef.current = apart;
  }, [apart]);
  useEffect(() => {
    labelsRef.current = labels;
  }, [labels]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const chipRoot = chipsRef.current;
    if (!stage || !canvas || !chipRoot) return;

    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];

    (async () => {
      const THREE = (await import("three")) as typeof THREE_NS;
      if (disposed) return;

      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = matchMedia("(max-width:760px)").matches || /Mobi|Android/i.test(navigator.userAgent);
      const kit = createGiKit(THREE, isMobile, reduceMotion);

      let R: THREE_NS.WebGLRenderer;
      try {
        R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        setNoGl(true);
        return;
      }
      kit.setupRenderer(R);

      const scene = await kit.makeScene(R, 20);
      if (disposed) {
        R.dispose();
        return;
      }
      const cam = new THREE.PerspectiveCamera(30, 16 / 9, 0.05, 400);

      const hs = {} as Record<MachineKey, Holder>;
      for (const k of KEYS) {
        const h = kit.makeHolder(k);
        h.g.visible = k === activeRef.current;
        scene.add(h.g);
        hs[k] = h;
      }
      const scans = {} as Record<MachineKey, Scan>;
      for (const k of KEYS) {
        const s = kit.SCANS[k]();
        s.group.visible = false;
        scene.add(s.group);
        s.group.traverse((o) => {
          const mesh = o as THREE_NS.Mesh;
          if (mesh.isMesh && !(mesh.material as THREE_NS.Material)?.transparent) {
            mesh.castShadow = !isMobile;
            mesh.receiveShadow = !isMobile;
          }
        });
        scans[k] = s;
      }

      let chips: Chip[] = [];
      const buildChips = () => {
        chips.forEach((c) => c.el.remove());
        /* The frame carries no label of its own — it is the thing everything
           else is bolted to, and a chip pointing at "Frame" in the middle of an
           exploded machine says nothing. */
        const list: (Part | Find)[] =
          viewRef.current === "scan"
            ? scans[activeRef.current].finds
            : hs[activeRef.current].model.parts.filter((p) => p.label && !/^frame$|^chassis$/i.test(p.label));
        chips = list.map((p) => {
          const d = document.createElement("div");
          d.className = "pchip";
          if ("dir" in p && p.dir) d.dataset.dir = p.dir;
          const inner = document.createElement("div");
          inner.className = "in";
          const b = document.createElement("b");
          b.textContent = p.label;
          inner.appendChild(b);
          if (p.desc) {
            const s = document.createElement("span");
            s.textContent = p.desc;
            inner.appendChild(s);
          }
          d.appendChild(inner);
          chipRoot.appendChild(d);
          return { el: d, obj: p.obj, x: 0, y: 0, h: 0, flip: false, vis: true };
        });
      };
      buildChips();

      let e = 0, cp = 0, lk = 1, time = 0, ang = 0.7, elev = 0.42;
      let drag: { x: number; y: number } | null = null;
      let touched = false;

      apiRef.current = {
        select(k) {
          const swap = () => {
            for (const x of KEYS) {
              hs[x].g.visible = x === k;
              hs[x].g.position.set(0, 0, 0);
              hs[x].g.rotation.y = 0;
              hs[x].g.scale.setScalar(1);
            }
            buildChips();
            ang = 0.7;
          };
          cp = 0;
          if (reduceMotion) {
            swap();
            return;
          }
          stage.classList.add("swap");
          window.setTimeout(() => {
            if (disposed) return;
            swap();
            stage.classList.remove("swap");
          }, 200);
        },
        rebuild: buildChips,
        touch() {
          touched = true;
        },
      };
      cleanups.push(() => {
        apiRef.current = null;
      });

      const onDown = (ev: PointerEvent) => {
        if ((ev.target as HTMLElement).closest(".stage-actions,.view-seg")) return;
        drag = { x: ev.clientX, y: ev.clientY };
        stage.setPointerCapture(ev.pointerId);
        touched = true;
      };
      const onMove = (ev: PointerEvent) => {
        if (!drag) return;
        ang -= (ev.clientX - drag.x) * 0.008;
        elev = clamp(elev + (ev.clientY - drag.y) * 0.004, 0.08, 1.1);
        drag = { x: ev.clientX, y: ev.clientY };
      };
      const endDrag = () => {
        drag = null;
      };
      stage.addEventListener("pointerdown", onDown);
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerup", endDrag);
      stage.addEventListener("pointercancel", endDrag);
      cleanups.push(() => {
        stage.removeEventListener("pointerdown", onDown);
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerup", endDrag);
        stage.removeEventListener("pointercancel", endDrag);
      });

      const bb = new THREE.Box3(), c = new THREE.Vector3(), ndc = new THREE.Vector3(), look = new THREE.Vector3();

      const frame = (dt: number) => {
        time += dt;
        const wantLabels = labelsRef.current ? 1 : 0;
        lk = reduceMotion ? wantLabels : lk + (wantLabels - lk) * Math.min(1, dt * 8);

        const inScan = viewRef.current === "scan";
        const want = inScan ? 1 : 0;
        cp = reduceMotion ? want : cp + (want - cp) * Math.min(1, dt * 2.2);
        const sc = ss(cp);
        const wantE = inScan ? 0 : apartRef.current ? 1 : 0;
        e = reduceMotion ? wantE : e + (wantE - e) * Math.min(1, dt * 2.6);

        const h = hs[activeRef.current];
        const se = ss(e);
        const sn = scans[activeRef.current];
        kit.explode(h, se);
        kit.spinRotors(h, dt);

        /* The scene grows from the floor on the way in and simply leaves on the
           way out, and the asymmetry is the point. Growing reads as the slab
           being cut away and the rack being built — worth the half second.
           Running the same thing backwards did not read as anything: a
           full-height rack squashing flat into the floor looks like the scene
           collapsing, not like it ending. So on the way out it keeps its full
           height and disappears, which reads as a cut. The threshold is high
           on purpose — at 0.8 it is gone within about a tenth of a second of
           the click, so the scene leaves on the input rather than drifting out
           afterwards.

           `cp` itself is left easing at the same rate either way, because the
           camera and the machine's return journey are keyed off it further down
           and those *should* stay smooth. Only the scene's own presentation
           changes direction. */
        const leaving = want === 0;
        for (const k of KEYS) {
          const s = scans[k];
          s.group.visible = k === activeRef.current && cp > (leaving ? 0.8 : 0.002);
          if (s.group.visible) s.group.scale.set(1, leaving ? 1 : Math.max(0.001, sc), 1);
        }
        sn.place(h, time, sc);

        if (!drag && !reduceMotion) {
          ang += dt * 0.18 * (1 - sc);
          // In the scan view the camera settles to a near-fixed angle: the
          // scenes have a front, and a slow orbit round a rack is unreadable.
          if (sc > 0.01) ang = lerp(ang, 0.38 + Math.sin(time * 0.12) * 0.26, Math.min(1, dt * 0.8) * sc);
        }

        const s = h.model.size;
        const span = Math.max(s.x, s.z);
        const top = kit.maxLift(h.model) + s.y;
        const lift = s.y * 0.5 + se * (top * 0.5 - s.y * 0.35);
        let dist = (span * 2.2 + s.y * 1.4 + se * top * 1.25) * (cam.aspect < 1 ? 1.55 : 1);
        look.set(0, lift, 0);
        look.lerp(sn.center, sc);
        dist = lerp(dist, (sn.radius * 2.9 + sn.top * 0.9) * (cam.aspect < 1 ? 1.7 : 1), sc);
        const el = lerp(elev, activeRef.current === "floorscan" ? 0.62 : 0.22, sc);
        cam.position.set(
          look.x + Math.sin(ang) * Math.cos(el) * dist,
          look.y + Math.sin(el) * dist,
          look.z + Math.cos(ang) * Math.cos(el) * dist,
        );
        cam.lookAt(look);

        const w = stage.clientWidth, hh = stage.clientHeight;
        const op = inScan ? clamp((cp - 0.55) / 0.35, 0, 1) : clamp((e - 0.6) / 0.3, 0, 1);
        for (const ch of chips) {
          bb.setFromObject(ch.obj);
          bb.getCenter(c);
          ndc.copy(c).project(cam);
          ch.x = (ndc.x * 0.5 + 0.5) * w;
          ch.y = (-ndc.y * 0.5 + 0.5) * hh;
          ch.flip = ch.x < w / 2;
          ch.vis = ndc.z < 1;
          ch.h = ch.el.offsetHeight || 40;
          const cw = ch.el.offsetWidth || 140;
          if (ch.flip && ch.x - 18 - cw < 8) ch.flip = false;
          if (!ch.flip && ch.x + 18 + cw > w - 8) ch.flip = ch.x - 18 - cw >= 8;
          ch.x = ch.flip ? Math.max(ch.x, cw + 26) : Math.min(ch.x, w - cw - 26);
        }
        // The scan view keeps more room at the bottom for the key bar.
        const bottomClear = w < 600 ? 64 : inScan ? 44 : 20;
        const topClear = w < 600 ? 54 : 62;
        if (w < 600) {
          chips
            .slice()
            .sort((a, b) => a.y - b.y)
            .forEach((ch, i) => {
              ch.flip = i % 2 === 1;
              ch.x = ch.flip ? w - 10 + 18 : 10 - 18;
            });
        }
        for (const side of [true, false]) {
          const col = chips.filter((ch) => ch.flip === side).sort((a, b) => a.y - b.y);
          let floorY = -1e9;
          for (const ch of col) {
            const half = ch.h / 2 + 4;
            ch.y = Math.max(ch.y, floorY + half);
            ch.y = clamp(ch.y, half + topClear, hh - half - bottomClear);
            floorY = ch.y + half;
          }
        }
        for (const ch of chips) {
          ch.el.classList.toggle("flip", ch.flip);
          ch.el.style.transform = ch.flip
            ? `translate(${(ch.x - 18).toFixed(1)}px,${ch.y.toFixed(1)}px) translate(-100%,-50%)`
            : `translate(${(ch.x + 18).toFixed(1)}px,${ch.y.toFixed(1)}px) translate(0,-50%)`;
          ch.el.style.opacity = (ch.vis ? op * lk : 0).toFixed(3);
        }

        R.render(scene, cam);
      };

      const resize = () => {
        const w = stage.clientWidth, hh = stage.clientHeight;
        if (!w || !hh) return;
        R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        R.setSize(w, hh, false);
        cam.aspect = w / hh;
        cam.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(stage);
      resize();

      let running = false, last = 0, seen = false;
      const loop = (t: number) => {
        if (!running || disposed) {
          raf = 0;
          return;
        }
        raf = requestAnimationFrame(loop);
        const dt = Math.min(0.05, (t - last) / 1000 || 0);
        last = t;
        frame(dt);
      };
      const io = new IntersectionObserver(
        ([en]) => {
          running = en.isIntersecting;
          if (running && !raf) {
            last = performance.now();
            raf = requestAnimationFrame(loop);
          }
          /* It takes itself apart once, unprompted — the section has to make its
             own point before anyone thinks to press a button. */
          if (running && !seen) {
            seen = true;
            window.setTimeout(() => {
              if (!touched && !disposed) setApart(true);
            }, 900);
          }
        },
        { rootMargin: "80px" },
      );
      io.observe(stage);

      cleanups.push(() => {
        running = false;
        io.disconnect();
        ro.disconnect();
        chips.forEach((ch) => ch.el.remove());
        R.dispose();
      });
    })().catch((err) => {
      console.warn("Guided Inspection: inside viewer unavailable —", err);
      setNoGl(true);
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  useEffect(() => {
    activeRef.current = active;
    apiRef.current?.select(active);
  }, [active]);

  useEffect(() => {
    viewRef.current = view;
    apiRef.current?.rebuild();
  }, [view]);

  const cap = INSIDE_CAPS[active];
  const card = MACHINES.find((m) => m.key === active)!;

  const onKey = (ev: React.KeyboardEvent) => {
    const d = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    ev.preventDefault();
    const i = KEYS.indexOf(active);
    const next = KEYS[(i + d + KEYS.length) % KEYS.length];
    onActive(next);
    document.getElementById("gi-itab-" + next)?.focus();
  };

  return (
    <section className={"section" + (view === "scan" ? " connect" : "")} id="inside">
      <div className="wrap">
        <Head
          center
          label="Inside"
          top="Take one apart."
          intro="Pick a machine to see what it’s made of — or watch it at work, on a rack face and over a slab. Drag to turn it around."
        />

        <Reveal className={"inside-stage" + (noGl ? " no-gl" : "")}>
          <div ref={stageRef} style={{ position: "absolute", inset: 0 }}>
            <canvas
              ref={canvasRef}
              className="inside-canvas"
              role="img"
              aria-label="3D model of the selected machine, shown taken apart with its main parts labelled, or at work scanning a rack or a floor slab"
            />
            <div ref={chipsRef} aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

            {/* Said plainly, and never removed: these are not photographs of
                machines that exist. */}
            <span className="concept-note" aria-hidden>
              Pilot machine
            </span>

            <div className="view-seg" role="group" aria-label="What to show">
              {(["inside", "scan"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => {
                    apiRef.current?.touch();
                    onView(v);
                  }}
                >
                  {v === "inside" ? "Inside" : "What it scans"}
                </button>
              ))}
            </div>

            <div className="stage-actions">
              <button
                type="button"
                className="label-toggle"
                aria-pressed={labels}
                onClick={() => {
                  apiRef.current?.touch();
                  setLabels((v) => !v);
                }}
              >
                <i aria-hidden />
                Labels
              </button>
              {view === "inside" && (
                <button
                  type="button"
                  className="inside-toggle"
                  onClick={() => {
                    apiRef.current?.touch();
                    setApart((v) => !v);
                  }}
                >
                  {apart ? "Put it back together" : "Take it apart"}
                </button>
              )}
            </div>

            {view === "inside" && <span className="inside-hint">Drag to turn</span>}

            {view === "scan" && (
              <div className="flow-key" aria-hidden>
                <span className="k-in">What it reads</span>
                <span className="k-out">What it flags</span>
              </div>
            )}
          </div>

          <div className="inside-fallback">
            <Media src={card.img} alt={card.alt} label={card.img} className="contain" tone="light" />
          </div>
        </Reveal>

        <div className="env-ui">
          <div className="seg" role="tablist" aria-label="Machine" onKeyDown={onKey}>
            {KEYS.map((k) => (
              <button
                key={k}
                id={"gi-itab-" + k}
                type="button"
                role="tab"
                aria-selected={k === active}
                tabIndex={k === active ? 0 : -1}
                onClick={() => {
                  apiRef.current?.touch();
                  onActive(k);
                }}
              >
                {INSIDE_CAPS[k].h}
              </button>
            ))}
          </div>

          <div className="env-cap" role="tabpanel" aria-labelledby={"gi-itab-" + active}>
            <h3>{cap.h}</h3>
            <p className="ci">{cap.ci}</p>
            <p className="cc">{cap.cc}</p>
            <button type="button" className="link" onClick={() => onOpen(active)}>
              Learn more about {cap.h}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
