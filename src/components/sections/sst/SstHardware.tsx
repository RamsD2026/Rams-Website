"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { Head, Media, Reveal } from "@/components/sections/hardware/hw-shared";
import { createSstKit, type Device, type DevKey } from "./sst-3d";
import { HW_TABS, type LidarMode, type SheetKey } from "./sst-data";

/**
 * 08 — Meet the hardware.
 *
 * Four devices on a turntable, one at a time, drag to turn, labels on request.
 * They are the same builds the film mounts on the truck, so what you turn here
 * is what you saw up there: the Pallet Detection Sensor and the LiDAR are their
 * real CAD models (`REAL` in `sst-3d.ts`), the other two are modelled down to
 * the power switch on the side of the Access Control unit. Labels are part names only — the
 * caption under the stage carries the prose.
 *
 * ── Labels are laid out, not just projected ─────────────────────────
 * Projecting each part's centre to screen space stacks chips on top of one
 * another the moment two parts line up with the camera. So after projecting,
 * each chip flips to whichever side it fits on, is clamped inside the stage,
 * and — per side, top to bottom — is pushed down to clear the one above. Under
 * 600px there is no room beside the model at all, so they become two columns
 * pinned to the stage edges. Same treatment as the OmniBox Inside viewer, and
 * for the same reason.
 *
 * ── If WebGL is missing ─────────────────────────────────────────────
 * `.no-gl` swaps the canvas for the product photograph of whichever device is
 * selected. The tabs and the captions keep working, so the section still does
 * its job — it just stops turning.
 */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Chip = { el: HTMLDivElement; obj: THREE_NS.Object3D; x: number; y: number; h: number; flip: boolean };

export function SstHardware({
  active,
  onActive,
  onOpen,
  onLidar,
}: {
  active: DevKey;
  onActive: (k: DevKey) => void;
  onOpen: (k: SheetKey) => void;
  onLidar: (m: LidarMode) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [noGl, setNoGl] = useState(false);
  const [labels, setLabels] = useState(false);

  const activeRef = useRef(active);
  const labelsRef = useRef(labels);
  const selectRef = useRef<((k: DevKey) => void) | null>(null);

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
      const kit = createSstKit(THREE, isMobile);

      let R: THREE_NS.WebGLRenderer;
      try {
        R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        setNoGl(true);
        return;
      }
      kit.setupRenderer(R);

      const scene = await kit.makeScene(R, 0.35);
      if (disposed) {
        R.dispose();
        return;
      }
      const cam = new THREE.PerspectiveCamera(30, 16 / 9, 0.002, 50);

      /* Procedural first: these build instantly and cost no network. The
         pallet sensor then upgrades itself to the real CAD model the first
         time its tab is shown — see `upgrade` below. */
      const devs = {} as Record<DevKey, Device>;
      for (const t of HW_TABS) {
        const d = kit.DEV[t.key]();
        d.group.visible = t.key === activeRef.current;
        d.group.traverse((o) => {
          const mesh = o as THREE_NS.Mesh;
          if (mesh.isMesh && (mesh.material as THREE_NS.Material)?.opacity !== 0) {
            mesh.castShadow = !isMobile;
            mesh.receiveShadow = !isMobile;
          }
        });
        scene.add(d.group);
        devs[t.key] = d;
      }

      /* The device actually on screen. Deliberately not `activeRef`: that
         flips the moment a tab is clicked, while the old model is still
         fading out — and framing the old model for the new one's size is what
         made it jump just before every switch. */
      let shown: DevKey = activeRef.current;

      let chips: Chip[] = [];
      const buildChips = () => {
        chips.forEach((c) => c.el.remove());
        chips = devs[shown].parts.map((p) => {
          const d = document.createElement("div");
          d.className = "pchip";
          const inner = document.createElement("div");
          inner.className = "in";
          // The part's name only — the caption under the stage carries the prose.
          const b = document.createElement("b");
          b.textContent = p.label;
          inner.append(b);
          d.append(inner);
          chipRoot.appendChild(d);
          return { el: d, obj: p.obj, x: 0, y: 0, h: 0, flip: false };
        });
      };
      buildChips();

      /* The real model, fetched only when its own tab is looked at. Two
         megabytes is not much, but it is two megabytes nobody who never opens
         this tab should be made to download. */
      const upgrading = new Map<DevKey, Promise<void>>();
      const upgrade = (k: DevKey): Promise<void> => {
        if (!kit.hasDevGlb(k)) return Promise.resolve();
        let p = upgrading.get(k);
        if (!p) {
          p = doUpgrade(k);
          upgrading.set(k, p);
        }
        return p;
      };
      const doUpgrade = async (k: DevKey) => {
        const d = await kit.loadDevice(k);
        if (disposed || d === devs[k]) return;
        d.group.visible = devs[k].group.visible;
        scene.remove(devs[k].group);
        d.group.traverse((o) => {
          const mesh = o as THREE_NS.Mesh;
          // Label anchors are invisible markers; they must not cast a shadow.
          if (mesh.isMesh && (mesh.material as THREE_NS.Material)?.opacity !== 0) {
            mesh.castShadow = !isMobile;
            mesh.receiveShadow = !isMobile;
          }
        });
        scene.add(d.group);
        devs[k] = d;
        if (shown === k) buildChips();
      };
      void upgrade(activeRef.current);

      let ang = 0.55, elev = activeRef.current === "bms" ? 0.72 : 0.32, lk = 0;
      let drag: { x: number; y: number } | null = null;

      /* Switching device: fade the stage out, swap while it is invisible,
         fade back. The swap also waits for the real CAD model if that tab has
         one and it has not arrived yet — otherwise the stand-in shows first and
         the real model replaces it a beat later, a second jump. `token` drops
         a switch that a quicker click has already overtaken. */
      let token = 0;
      selectRef.current = (k: DevKey) => {
        const mine = ++token;
        const swap = () => {
          if (disposed || mine !== token) return;
          shown = k;
          for (const t of HW_TABS) devs[t.key].group.visible = t.key === k;
          buildChips();
          ang = 0.55;
          // A board is read from above; at the enclosures' angle it is all edge.
          elev = k === "bms" ? 0.72 : 0.32;
          stage.classList.remove("swap");
        };
        if (reduceMotion) {
          void upgrade(k).then(swap);
          return;
        }
        stage.classList.add("swap");
        const faded = new Promise((r) => window.setTimeout(r, 230));
        void Promise.all([upgrade(k), faded]).then(swap);
      };
      cleanups.push(() => {
        selectRef.current = null;
      });

      const onDown = (ev: PointerEvent) => {
        if ((ev.target as HTMLElement).closest(".stage-actions")) return;
        drag = { x: ev.clientX, y: ev.clientY };
        stage.setPointerCapture(ev.pointerId);
      };
      const onMove = (ev: PointerEvent) => {
        if (!drag) return;
        ang -= (ev.clientX - drag.x) * 0.008;
        elev = clamp(elev + (ev.clientY - drag.y) * 0.004, 0.02, 1.2);
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
        const on = labelsRef.current ? 1 : 0;
        lk = reduceMotion ? on : lk + (on - lk) * Math.min(1, dt * 8);
        if (!drag && !reduceMotion) ang += dt * 0.25;

        const d = devs[shown];
        const s = d.size;
        const span = Math.max(s.x, s.y, s.z);
        look.set(0, s.y * 0.5, 0);
        /* Distance from the device's own size, not a constant: the chip is
           120mm across and Access Control is 240mm. */
        // A flat board is small from any angle, so it is brought in closer.
        const near = shown === "bms" ? 0.72 : 1;
        const dist = span * near * (cam.aspect < 1 ? 5.2 : 3.4);
        cam.position.set(
          Math.sin(ang) * Math.cos(elev) * dist,
          look.y + Math.sin(elev) * dist,
          Math.cos(ang) * Math.cos(elev) * dist,
        );
        cam.lookAt(look);

        const w = stage.clientWidth, hh = stage.clientHeight;
        for (const ch of chips) {
          bb.setFromObject(ch.obj);
          bb.getCenter(c);
          ndc.copy(c).project(cam);
          ch.x = (ndc.x * 0.5 + 0.5) * w;
          ch.y = (-ndc.y * 0.5 + 0.5) * hh;
          ch.flip = ch.x < w / 2;
          ch.h = ch.el.offsetHeight || 40;
          const cw = ch.el.offsetWidth || 140;
          if (ch.flip && ch.x - 18 - cw < 8) ch.flip = false;
          if (!ch.flip && ch.x + 18 + cw > w - 8) ch.flip = ch.x - 18 - cw >= 8;
          ch.x = ch.flip ? Math.max(ch.x, cw + 26) : Math.min(ch.x, w - cw - 26);
        }
        // No room beside the model on a phone: two pinned columns instead.
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
          let fl = -1e9;
          for (const ch of col) {
            const half = ch.h / 2 + 4;
            ch.y = Math.max(ch.y, fl + half);
            ch.y = clamp(ch.y, half + 10, hh - half - 64);
            fl = ch.y + half;
          }
        }
        for (const ch of chips) {
          ch.el.classList.toggle("flip", ch.flip);
          ch.el.style.transform = ch.flip
            ? `translate(${(ch.x - 18).toFixed(1)}px,${ch.y.toFixed(1)}px) translate(-100%,-50%)`
            : `translate(${(ch.x + 18).toFixed(1)}px,${ch.y.toFixed(1)}px) translate(0,-50%)`;
          ch.el.style.opacity = lk.toFixed(3);
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

      let running = false, last = 0;
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
      console.warn("Sensor Stack: hardware viewer unavailable —", err);
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
    selectRef.current?.(active);
  }, [active]);

  const cap = HW_TABS.find((t) => t.key === active)!;

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const i = HW_TABS.findIndex((t) => t.key === active);
    const next = HW_TABS[(i + d + HW_TABS.length) % HW_TABS.length];
    onActive(next.key);
    document.getElementById("hw-" + next.key)?.focus();
  };

  return (
    <section className="section" id="hardware">
      <div className="wrap">
        <Head center label="The hardware" top="Meet the hardware." intro="Pick a sensor to see it up close. Drag to turn it around." />

        <Reveal className={"inside-stage dev" + (noGl ? " no-gl" : "")}>
          <div ref={stageRef} style={{ position: "absolute", inset: 0 }}>
            <canvas
              ref={canvasRef}
              className="inside-canvas"
              role="img"
              aria-label="3D model of the selected sensor with its main features labelled"
            />
            <div ref={chipsRef} aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

            <div className="stage-actions">
              <button
                type="button"
                className="label-toggle"
                aria-pressed={labels}
                onClick={() => setLabels((v) => !v)}
              >
                <i aria-hidden />
                Labels
              </button>
            </div>

            <span className="inside-hint">Drag to turn</span>
          </div>

          <div className="inside-fallback">
            <Media src={cap.img} alt={cap.alt} label={cap.img} className="contain" tone="light" />
          </div>
        </Reveal>

        <div className="env-ui">
          <div className="seg" role="tablist" aria-label="Sensor" onKeyDown={onKey}>
            {HW_TABS.map((t) => (
              <button
                key={t.key}
                id={"hw-" + t.key}
                type="button"
                role="tab"
                aria-selected={t.key === active}
                tabIndex={t.key === active ? 0 : -1}
                onClick={() => onActive(t.key)}
              >
                {t.tab}
              </button>
            ))}
          </div>

          <div className="env-cap" role="tabpanel" aria-labelledby={"hw-" + active}>
            <h3>{cap.h}</h3>
            <p>{cap.p}</p>
            {/* Bound to a local so the narrowing survives into the callback —
                TS drops it for a property access captured by a closure. */}
            {(() => {
              const cta = cap.cta;
              return "sheet" in cta ? (
                <button type="button" className="link" onClick={() => onOpen(cta.sheet)}>
                  {cta.label}
                </button>
              ) : (
                <button type="button" className="link" onClick={() => onLidar(cta.lidar)}>
                  {cta.label}
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
