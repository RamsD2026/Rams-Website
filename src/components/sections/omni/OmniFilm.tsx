"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { createOmniKit, type Holder } from "./omni-3d";
import { MODELS, ORDER } from "./omni-data";

/**
 * The hero film — all four boxes, on one scroll track.
 *
 * Unlike the AI Camera film, which inspects a single product, this one has to
 * introduce a family. So the four boxes stand in a lineup from the start, the
 * camera moves along and around them, and at the middle of the track they all
 * come apart together and go back together again — the "four boxes, one job"
 * argument made physically.
 *
 *   p 0.00–0.20  the lineup, named
 *   p 0.20–0.46  "Four boxes. One job."
 *   p 0.46–0.82  all four explode, staggered by 0.025 each
 *   p 0.82–1.00  back together, "See it. Decide. Act."
 *
 * ── Two things worth knowing ────────────────────────────────────────
 * 1. **Explode uses `side = 0.3` here.** The boxes stand shoulder to shoulder,
 *    so a part flying out sideways at full offset would land inside its
 *    neighbour. The Inside viewer, which shows one box alone, uses the full
 *    offset.
 * 2. **The layout switches on aspect, not width.** Below 1:1 the lineup becomes
 *    a two-by-two, because four boxes in a row on a portrait phone are specks.
 *    Camera keyframes come in wide and narrow sets for the same reason.
 *
 * There is no loading gate: the boxes are procedural, so there is nothing to
 * download and the film is ready on the first frame.
 */

const ss = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);

export function OmniFilm({ onUnavailable }: { onUnavailable: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];
    const giveUp = () => {
      if (disposed) return;
      setFailed(true);
      onUnavailable();
    };
    const bail = window.setTimeout(giveUp, 10000);
    cleanups.push(() => clearTimeout(bail));

    (async () => {
      const THREE = (await import("three")) as typeof THREE_NS;
      if (disposed) return;

      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = matchMedia("(max-width:760px)").matches || /Mobi|Android/i.test(navigator.userAgent);
      const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
      const kit = createOmniKit(THREE, isMobile);

      let R: THREE_NS.WebGLRenderer;
      try {
        R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
        if (!R.capabilities.isWebGL2) throw new Error("webgl2");
      } catch {
        giveUp();
        return;
      }
      kit.setupRenderer(R);
      const scene = await kit.makeScene(R, 8);
      if (disposed) return;
      clearTimeout(bail);

      const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
      const hs: Holder[] = ORDER.map((k) => {
        const h = kit.makeHolder(k);
        scene.add(h.g);
        return h;
      });


      const WIDE = [V3(-4.45, 0, 0), V3(-1.8, 0, 0), V3(1.25, 0, 0), V3(4.45, 0, 0)];
      const NARROW = [V3(-1.55, 0, -2.4), V3(1.55, 0, -2.4), V3(-1.45, 0, 1.6), V3(1.75, 0, 1.7)];
      type Key = [number, THREE_NS.Vector3, THREE_NS.Vector3];
      const KW: Key[] = [
        [0, V3(0, 4.4, 17), V3(0, 2.2, 0)], [0.2, V3(0, 4.4, 17), V3(0, 2.2, 0)],
        [0.42, V3(2.6, 3.4, 14.5), V3(0, 1.2, 0)], [0.56, V3(-2.4, 8.2, 18.5), V3(0, 3.3, 0)],
        [0.8, V3(-1.4, 8.6, 18), V3(0, 3.2, 0)], [0.94, V3(0, 4.4, 17), V3(0, 2.6, 0)],
        [1, V3(0, 4.4, 17), V3(0, 2.6, 0)],
      ];
      const KN: Key[] = [
        [0, V3(0, 13, 20), V3(0, 4.8, 0)], [0.2, V3(0, 13, 20), V3(0, 4.8, 0)],
        [0.42, V3(1.6, 11, 18.5), V3(0, 3.8, 0)], [0.56, V3(-1.8, 15, 21), V3(0, 5.6, 0)],
        [0.8, V3(-1, 15.5, 20.5), V3(0, 5.5, 0)], [0.94, V3(0, 13, 20), V3(0, 5, 0)],
        [1, V3(0, 13, 20), V3(0, 5, 0)],
      ];

      const camPos = V3(), camTgt = V3(), tmp = V3(), ndc = V3();
      const keyed = (keys: Key[], p: number, outP: THREE_NS.Vector3, outT: THREE_NS.Vector3) => {
        let i = 0;
        while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
        const [a, pa, ta] = keys[i];
        const [b, pb, tb] = keys[i + 1];
        const t = ss(seg(p, a, b));
        outP.lerpVectors(pa, pb, t);
        outT.lerpVectors(ta, tb, t);
      };

      const state = { p: 0, pT: 0, time: 0, drag: 0, dragT: 0, dragging: false, px: 0 };
      const secs = Array.from(filmRef.current?.querySelectorAll<HTMLElement>(".sec") ?? []).map((el) => ({
        el, a: +(el.dataset.a ?? 0), b: +(el.dataset.b ?? 1),
      }));
      const maxScroll = () => Math.max(1, (spaceRef.current?.offsetHeight ?? 1) - window.innerHeight);
      const onScroll = () => { state.pT = clamp(window.scrollY / maxScroll(), 0, 1); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      cleanups.push(() => window.removeEventListener("scroll", onScroll));

      const onDown = (e: PointerEvent) => { state.dragging = true; state.px = e.clientX; canvas.setPointerCapture(e.pointerId); };
      const onMove = (e: PointerEvent) => { if (!state.dragging) return; state.dragT += (e.clientX - state.px) * 0.006; state.px = e.clientX; };
      const end = () => { state.dragging = false; };
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", end);
      canvas.addEventListener("pointercancel", end);
      cleanups.push(() => {
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", end);
        canvas.removeEventListener("pointercancel", end);
      });

      let lastOp = -1, visible = true, narrow = false;
      const layout = () => {
        narrow = window.innerWidth / window.innerHeight < 1;
        hs.forEach((h, i) => h.g.position.copy((narrow ? NARROW : WIDE)[i]));
      };

      /* ── the real models ─────────────────────────────────────────
         Edge, AI and Motion exist as CAD. The film still *builds* procedurally,
         because this is the hero: it has to be on screen at first paint, and
         thirteen megabytes of geometry cannot be in that path. The real models are
         fetched after the film is already running and swapped into the lineup
         in place, so what a reader sees is the boxes appear immediately and
         then sharpen.

         `hs` is indexed by `ORDER` and the frame loop, the name tags and the
         layout arrays all index the same way — so a swap has to keep the index
         and the position, and reapply the layout the new holder missed. */
      void (async () => {
        await Promise.all(
          ORDER.map(async (k, i) => {
            if (!kit.hasGlb(k)) return;
            const h = await kit.loadHolder(k);
            if (disposed || h.model === hs[i].model) return;
            h.g.position.copy(hs[i].g.position);
            h.g.rotation.copy(hs[i].g.rotation);
            scene.remove(hs[i].g);
            scene.add(h.g);
            hs[i] = h;
          }),
        );
        if (!disposed) layout();
      })();

      const frame = (dt: number) => {
        state.p += (state.pT - state.p) * Math.min(1, dt * (reduceMotion ? 20 : 4));
        const p = state.p;
        state.time += dt;
        state.drag += (state.dragT - state.drag) * Math.min(1, dt * 6);

        keyed(narrow ? KN : KW, p, camPos, camTgt);
        // Keep the lineup inside the frame on in-between aspect ratios.
        const a = cam.aspect;
        const push = narrow ? clamp(0.56 / a, 0.85, 1.35) : clamp(1.6 / a, 1, 1.6);
        camPos.sub(camTgt).multiplyScalar(push).add(camTgt);
        cam.position.lerp(camPos, Math.min(1, dt * 5));
        cam.lookAt(camTgt);

        hs.forEach((h, i) => {
          const e = ss(seg(p, 0.46 + i * 0.025, 0.6 + i * 0.025)) * (1 - ss(seg(p, 0.82 + i * 0.015, 0.92 + i * 0.015)));
          kit.explode(h, e, 0.3);
          h.g.rotation.y = (narrow ? -0.35 : -0.5) + (reduceMotion ? 0 : Math.sin(state.time * 0.25 + i * 1.7) * 0.05) + state.drag;

          // The name tag rides under each box while the lineup is the subject.
          const tOp = ss(seg(p, 0.24, 0.3)) * (1 - ss(seg(p, 0.42, 0.47))) + ss(seg(p, 0.9, 0.96));
          tmp.copy(h.g.position);
          tmp.z += h.model.size.z * 0.62;
          tmp.y = -0.05;
          ndc.copy(tmp).project(cam);
          const el = tagRefs.current[i];
          if (el) {
            el.style.transform = `translate(${((ndc.x * 0.5 + 0.5) * window.innerWidth).toFixed(1)}px,${((-ndc.y * 0.5 + 0.5) * window.innerHeight + 10).toFixed(1)}px) translate(-50%,0)`;
            el.style.opacity = clamp(tOp, 0, 1).toFixed(3);
          }
        });

        for (const s of secs) {
          const f = 0.04;
          const o = (s.a === 0 ? 1 : ss(seg(p, s.a, s.a + f))) * (1 - ss(seg(p, s.b - f, s.b)));
          s.el.style.opacity = o.toFixed(3);
          s.el.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
          s.el.style.visibility = o < 0.005 ? "hidden" : "visible";
        }

        const past = Math.max(0, (window.scrollY - maxScroll()) / Math.max(1, window.innerHeight * 0.6));
        const op = 1 - Math.min(1, past);
        if (Math.abs(op - lastOp) > 0.004) {
          lastOp = op;
          const vis = op < 0.01 ? "hidden" : "visible";
          for (const el of [filmRef.current, tagsRef.current, canvas]) {
            if (!el) continue;
            el.style.opacity = op.toFixed(3);
            el.style.visibility = vis;
          }
        }
        visible = op >= 0.01;
        if (visible) R.render(scene, cam);
      };

      const resize = () => {
        R.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile ? 1.5 : 2));
        R.setSize(window.innerWidth, window.innerHeight, false);
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
        layout();
      };
      window.addEventListener("resize", resize);
      cleanups.push(() => window.removeEventListener("resize", resize));
      resize();

      let last = performance.now();
      const tick = (t: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(0.05, (t - last) / 1000 || 0);
        last = t;
        frame(dt);
      };
      raf = requestAnimationFrame(tick);

      cleanups.push(() => {
        scene.traverse((o) => {
          const m = o as THREE_NS.Mesh;
          if (!m.isMesh) return;
          m.geometry?.dispose();
        });
        R.dispose();
      });
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, [failed, onUnavailable]);

  if (failed) return null;

  return (
    <>
      <canvas ref={canvasRef} className="hw-gl" aria-hidden />

      <div className="film" ref={filmRef}>
        <section className="sec hero center" data-a="0" data-b="0.24">
          <div className="heroblock">
            <p className="kicker">RAMS Digital</p>
            <h1>OmniBox</h1>
            <p className="tag">
              The on-site brain that turns what cameras and sensors notice into <b>action.</b>
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#choose">Find your OmniBox</a>
              <a className="btn btn-secondary" href="#models">Meet the family</a>
            </div>
          </div>
          <div className="scrollcue" aria-hidden>
            Scroll<i />
          </div>
        </section>

        <section className="sec top" data-a="0.26" data-b="0.46">
          <span className="label">The family</span>
          <h2>
            Four boxes.
            <br />
            One job.
          </h2>
          <p className="lead">
            Edge, AI, Motion and Core. Different brains, different connections — the same job of
            turning what the floor notices into something that happens.
          </p>
        </section>

        <section className="sec top" data-a="0.50" data-b="0.80">
          <span className="label">Inside</span>
          <h2>
            The same idea,
            <br />
            sized to the job.
          </h2>
          <p className="lead">
            A brain, the connections it needs, and the power to run them — in an enclosure built for
            where it has to live.
          </p>
        </section>

        <section className="sec top" data-a="0.86" data-b="1.08">
          <span className="label">On the floor</span>
          <h2>
            See it. Decide. Act.
          </h2>
        </section>
      </div>

      <div className="hw-tags" ref={tagsRef} aria-hidden>
        {ORDER.map((k, i) => {
          const m = MODELS.find((x) => x.key === k)!;
          return (
            <div
              key={k}
              className="box-tag"
              ref={(el) => {
                tagRefs.current[i] = el;
              }}
            >
              <b>{m.name}</b>
              <span>{m.bestFor}</span>
            </div>
          );
        })}
      </div>

      <div className="hw-scrollspace" ref={spaceRef} aria-hidden />
    </>
  );
}
