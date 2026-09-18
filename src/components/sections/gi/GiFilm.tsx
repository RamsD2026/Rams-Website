"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { createGiKit, type Holder } from "./gi-3d";
import { INFO, KEYS } from "./gi-data";

/**
 * The hero film — two machines, two directions.
 *
 * A fixed canvas behind fixed type, driven by scroll. Four chapters:
 *
 *   p 0.00–0.20  both machines under the headline
 *   p 0.24–0.45  **"Above the floor. Below it."** — a ghost rack fades in behind
 *                AirScan and it climbs; a see-through slab fades in under
 *                FloorScan, with its reinforcement, a void, and a radar cone,
 *                and it drives across
 *   p 0.50–0.80  "Different machines. Same idea inside." — both explode
 *   p 0.85–1.00  "Coming soon."
 *
 * Chapter two is the page's whole thesis in one frame: one machine goes up, one
 * goes down, and the building they inspect is drawn transparent so you can see
 * the parts nobody checks. Every material in that chapter is a **clone** faded
 * from zero (`fm()`) rather than the shared material, so fading the rack in does
 * not also fade the rack in the Inside viewer further down the page.
 *
 * ── The layout switches on aspect, not width ────────────────────────
 * Below 1:1 the two machines stack rather than stand side by side, with their
 * own camera keyframes (`KN` instead of `KW`) and their own prop positions — two
 * machines side by side on a portrait phone are specks. On narrow screens the
 * drone's ground spot would sit on top of FloorScan, so its name tag moves above
 * it instead.
 *
 * ── If it cannot run ────────────────────────────────────────────────
 * Ten seconds without a WebGL2 context, or any throw, and `onUnavailable()` puts
 * the page into `.no-film`: this track is removed and `GiHero` takes its place
 * with the product photograph. That is the reference's own designed state.
 */

const ss = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function GiFilm({ onUnavailable }: { onUnavailable: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const spaceRef = useRef<HTMLDivElement>(null);
  const secRefs = useRef<(HTMLElement | null)[]>([]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (failed) return;
    const canvas = canvasRef.current;
    const film = filmRef.current;
    const tagsRoot = tagsRef.current;
    const space = spaceRef.current;
    if (!canvas || !film || !tagsRoot || !space) return;

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
      const kit = createGiKit(THREE, isMobile, reduceMotion);

      let R: THREE_NS.WebGLRenderer;
      try {
        R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
        if (!R.capabilities.isWebGL2) throw new Error("webgl2");
      } catch {
        giveUp();
        return;
      }
      kit.setupRenderer(R);
      clearTimeout(bail);

      const scene = await kit.makeScene(R, 9);
      if (disposed) {
        R.dispose();
        return;
      }
      const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 300);

      const hs: Holder[] = KEYS.map((k) => {
        const h = kit.makeHolder(k);
        scene.add(h.g);
        return h;
      });
      const [air, floorM] = hs;

      /* ── chapter two props ─────────────────────────────── */
      // Every material is cloned and faded from zero, so the shared originals
      // used by the Inside viewer are untouched.
      const fade: { m: THREE_NS.Material & { opacity: number }; max: number }[] = [];
      const fm = <T extends THREE_NS.Material>(m: T): T => {
        const c = m.clone() as T & { opacity: number; transparent: boolean };
        c.transparent = true;
        c.opacity = 0;
        fade.push({ m: c, max: (m as unknown as { transparent: boolean; opacity: number }).transparent ? (m as unknown as { opacity: number }).opacity : 1 });
        return c;
      };
      const FM = {
        upright: fm(kit.M.upright),
        beam: fm(kit.M.beam),
        pallet: fm(kit.M.pallet),
        carton: fm(kit.M.carton),
        cartonOdd: fm(kit.M.carton),
      };
      const rack = kit.buildRack({ bays: 1, levels: 3, bayW: 4.6, levelH: 2.1, depth: 1.7, mats: FM, t: 0.22 });
      rack.slots.forEach((s) => {
        if (s.l === 1 && s.s === 1) return; // one gap, so it reads as a real rack
        const o = kit.load(rack.g, s.x, s.y, 0, FM, { h: 1.05 });
        o.scale.set(0.4, 1, 0.36);
      });
      scene.add(rack.g);

      const slab = new THREE.Group();
      scene.add(slab);
      const concrete = fm(kit.M.concrete);
      const sub = fm(kit.M.subbase);
      const rebar = fm(kit.M.rebar);
      const voidM = fm(kit.M.voidM);
      const rayM = fm(kit.M.beamRay);
      const bx = (w: number, h: number, d: number, m: THREE_NS.Material, x: number, y: number, z: number, p: THREE_NS.Object3D) => {
        const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
        o.position.set(x, y, z);
        p.add(o);
        return o;
      };
      bx(9, 1.1, 5, concrete, 0, -0.56, 0, slab);
      bx(9, 1.9, 5, sub, 0, -2.07, 0, slab);
      for (let x = -4.2; x <= 4.2; x += 0.6) {
        const o = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4.8, 12), rebar);
        o.rotation.x = Math.PI / 2;
        o.position.set(x, -0.4, 0);
        slab.add(o);
      }
      const voidO = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), voidM);
      voidO.scale.set(1.1, 0.45, 0.9);
      slab.add(voidO);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1.1, 3, 32, 1, true), rayM);
      scene.add(cone);

      /* ── camera and layout ─────────────────────────────── */
      const WIDE = { air: V3(-3.3, 1.4, 0), floor: V3(3.1, 0, 0.4), rack: V3(-3.3, 0, -3.6), slab: V3(3.1, 0, 0.4) };
      const NARROW = { air: V3(-1.2, 2.6, -1.6), floor: V3(1.1, 0, 1.8), rack: V3(-1.2, 0, -5), slab: V3(1.1, 0, 1.8) };
      const KW: [number, THREE_NS.Vector3, THREE_NS.Vector3][] = [
        [0, V3(0, 3.3, 17), V3(0, 1.9, 0)],
        [0.2, V3(0, 3.3, 17), V3(0, 1.9, 0)],
        [0.4, V3(0.8, 5.4, 19), V3(0, 1.9, -0.6)],
        [0.56, V3(-2.2, 7.6, 19.5), V3(0, 3.1, 0)],
        [0.8, V3(-1.4, 8, 19), V3(0, 3.1, 0)],
        [0.94, V3(0, 3.3, 17), V3(0, 2.1, 0)],
        [1, V3(0, 3.3, 17), V3(0, 2.1, 0)],
      ];
      const KN: [number, THREE_NS.Vector3, THREE_NS.Vector3][] = [
        [0, V3(0, 9, 22), V3(0, 3.6, 0)],
        [0.2, V3(0, 9, 22), V3(0, 3.6, 0)],
        [0.4, V3(1, 10, 23), V3(0, 2.8, 0)],
        [0.56, V3(-1.6, 12.5, 23), V3(0, 4.4, 0)],
        [0.8, V3(-1, 13, 22.5), V3(0, 4.4, 0)],
        [0.94, V3(0, 9, 22), V3(0, 3.8, 0)],
        [1, V3(0, 9, 22), V3(0, 3.8, 0)],
      ];
      const camPos = V3(), camTgt = V3(), tmp = V3(), ndc = V3();
      const keyed = (keys: typeof KW, p: number, outP: THREE_NS.Vector3, outT: THREE_NS.Vector3) => {
        let i = 0;
        while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
        const [a, pa, ta] = keys[i], [b, pb, tb] = keys[i + 1];
        const t = ss(seg(p, a, b));
        outP.lerpVectors(pa, pb, t);
        outT.lerpVectors(ta, tb, t);
      };

      const state = { p: 0, pT: 0, time: 0, drag: 0, dragT: 0, dragging: false, px: 0, placed: false };
      const secs = secRefs.current
        .filter(Boolean)
        .map((el) => ({ el: el as HTMLElement, a: +(el as HTMLElement).dataset.a!, b: +(el as HTMLElement).dataset.b! }));

      const maxScroll = () => Math.max(1, space.offsetHeight - window.innerHeight);
      const onScroll = () => {
        state.pT = clamp(window.scrollY / maxScroll(), 0, 1);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      cleanups.push(() => window.removeEventListener("scroll", onScroll));

      const onDown = (e: PointerEvent) => {
        state.dragging = true;
        state.px = e.clientX;
        canvas.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!state.dragging) return;
        state.dragT += (e.clientX - state.px) * 0.006;
        state.px = e.clientX;
      };
      const endDrag = () => {
        state.dragging = false;
      };
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", endDrag);
      canvas.addEventListener("pointercancel", endDrag);
      canvas.style.cursor = "grab";
      cleanups.push(() => {
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", endDrag);
        canvas.removeEventListener("pointercancel", endDrag);
      });

      let lastOp = -1, narrow = false, L = WIDE;
      const layout = () => {
        narrow = window.innerWidth / window.innerHeight < 1;
        L = narrow ? NARROW : WIDE;
        rack.g.position.copy(L.rack);
        slab.position.copy(L.slab);
      };

      const frame = (dt: number) => {
        state.p += (state.pT - state.p) * Math.min(1, dt * (reduceMotion ? 20 : 4));
        const p = state.p;
        state.time += dt;
        state.drag += (state.dragT - state.drag) * Math.min(1, dt * 6);

        keyed(narrow ? KN : KW, p, camPos, camTgt);
        const a = cam.aspect;
        const push = narrow ? clamp(0.56 / a, 0.85, 1.35) : clamp(1.6 / a, 1, 1.6);
        camPos.sub(camTgt).multiplyScalar(push).add(camTgt);
        if (!state.placed) {
          cam.position.copy(camPos);
          state.placed = true;
        }
        cam.position.lerp(camPos, Math.min(1, dt * 5));
        cam.lookAt(camTgt);

        /* chapter two: up and down */
        const ch2 = ss(seg(p, 0.24, 0.34)) * (1 - ss(seg(p, 0.45, 0.52)));
        const climb = ss(seg(p, 0.27, 0.44)) * (1 - ss(seg(p, 0.46, 0.56)));
        const drive = ss(seg(p, 0.25, 0.46));
        for (const f of fade) {
          f.m.opacity = f.max * ch2;
          f.m.visible = ch2 > 0.01;
        }
        const bob = reduceMotion ? 0 : Math.sin(state.time * 1.6) * 0.06;
        air.g.position.copy(L.air);
        air.g.position.y += climb * (narrow ? 3.2 : 3.6) + bob;
        floorM.g.position.copy(L.floor);
        floorM.g.position.x += narrow ? 0 : lerp(-1.6, 1.4, drive) * ch2;
        cone.position.set(floorM.g.position.x, -1.5, floorM.g.position.z);
        cone.rotation.x = 0;
        cone.visible = ch2 > 0.01;
        voidO.position.set(narrow ? 0.4 : 1.3, -1.9, -0.3);
        voidM.emissiveIntensity = 0.45 + (reduceMotion ? 0 : Math.sin(state.time * 2.4) * 0.2);

        /* chapter three: both come apart */
        const e = ss(seg(p, 0.5, 0.62)) * (1 - ss(seg(p, 0.82, 0.92)));
        hs.forEach((h, i) => {
          kit.explode(h, e, 0.65);
          kit.spinRotors(h, dt);
          h.g.rotation.y =
            (i ? -0.55 : -0.45) + (reduceMotion ? 0 : Math.sin(state.time * 0.25 + i * 1.7) * 0.05) + state.drag + ch2 * (i ? 0.4 : 0);

          const tOp = 1 - ss(seg(p, 0.16, 0.22)) + ss(seg(p, 0.9, 0.96));
          const above = narrow && i === 0;
          if (above) tmp.set(h.g.position.x, h.g.position.y + h.model.size.y + 0.4, h.g.position.z);
          else tmp.set(h.g.position.x, 0, h.g.position.z + h.model.size.z * 0.62);
          ndc.copy(tmp).project(cam);
          const el = tagRefs.current[i];
          if (!el) return;
          el.style.transform =
            `translate(${((ndc.x * 0.5 + 0.5) * window.innerWidth).toFixed(1)}px,` +
            `${((-ndc.y * 0.5 + 0.5) * window.innerHeight + (above ? -8 : 10)).toFixed(1)}px)` +
            ` translate(-50%,${above ? "-100%" : "0"})`;
          el.style.opacity = clamp(tOp, 0, 1).toFixed(3);
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
          for (const el of [film, tagsRoot, canvas as HTMLElement]) {
            el.style.opacity = op.toFixed(3);
            el.style.visibility = vis;
          }
        }
        if (op >= 0.01) R.render(scene, cam);
      };

      const resize = () => {
        R.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
        R.setSize(window.innerWidth, window.innerHeight, false);
        cam.aspect = window.innerWidth / window.innerHeight;
        cam.updateProjectionMatrix();
        layout();
      };
      window.addEventListener("resize", resize);
      resize();
      cleanups.push(() => window.removeEventListener("resize", resize));

      let last = performance.now();
      const tick = (t: number) => {
        if (disposed) return;
        raf = requestAnimationFrame(tick);
        const dt = Math.min(0.05, (t - last) / 1000 || 0);
        last = t;
        frame(dt);
      };
      raf = requestAnimationFrame(tick);
      cleanups.push(() => R.dispose());
    })().catch((err) => {
      console.warn("Guided Inspection: hero film unavailable —", err);
      giveUp();
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, [failed, onUnavailable]);

  if (failed) return null;

  return (
    <>
      <canvas ref={canvasRef} className="hw-gl" aria-hidden />

      <div className="film" ref={filmRef}>
        <section
          className="sec hero center"
          data-a="0"
          data-b="0.2"
          ref={(el) => {
            secRefs.current[0] = el;
          }}
        >
          <div className="heroblock">
            <p className="kicker">RAMS Digital · Coming soon</p>
            <h1>Guided Inspection</h1>
            <p className="tag">
              Machines that go and look at the parts of your building <b>nobody checks.</b>
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#machines">
                Meet the machines
              </a>
              <a className="btn btn-secondary" href="#today">
                Become a design partner
              </a>
            </div>
          </div>
          <div className="scrollcue" aria-hidden>
            Scroll<i />
          </div>
        </section>

        <section
          className="sec top"
          data-a="0.24"
          data-b="0.45"
          ref={(el) => {
            secRefs.current[1] = el;
          }}
        >
          <span className="label">Two directions</span>
          <h2>
            Above the floor.
            <br />
            Below it.
          </h2>
          <p className="lead">AirScan flies up the rack face. FloorScan looks down through the slab.</p>
        </section>

        <section
          className="sec top"
          data-a="0.5"
          data-b="0.8"
          ref={(el) => {
            secRefs.current[2] = el;
          }}
        >
          <span className="label">Inside</span>
          <h2>
            Different machines.
            <br />
            Same idea inside.
          </h2>
          <p className="lead">
            Sensors to see, a brain to decide what matters, and a map to put every finding in its place.
          </p>
        </section>

        <section
          className="sec top"
          data-a="0.85"
          data-b="1.08"
          ref={(el) => {
            secRefs.current[3] = el;
          }}
        >
          <h2>Coming soon.</h2>
          <p className="lead">We’re building both with a small number of design partners.</p>
          <div className="hero-cta" style={{ justifyContent: "center", marginTop: 28 }}>
            <a className="btn btn-primary" href="#today">
              Become a design partner
            </a>
          </div>
        </section>
      </div>

      <div className="hw-tags" ref={tagsRef} aria-hidden>
        {KEYS.map((k, i) => (
          <div
            key={k}
            className="box-tag"
            ref={(el) => {
              tagRefs.current[i] = el;
            }}
          >
            <b>{INFO[k].name}</b>
            <span>{INFO[k].tag}</span>
            {/* The badge rides the film too — no mention of either machine
                anywhere on this page appears without it. */}
            <em>Concept</em>
          </div>
        ))}
      </div>

      <div className="hw-scrollspace" ref={spaceRef} aria-hidden />
    </>
  );
}
