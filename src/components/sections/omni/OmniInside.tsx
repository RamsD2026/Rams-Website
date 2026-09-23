"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { Head, Media, Reveal } from "@/components/sections/hardware/hw-shared";
import { createOmniKit, type BoxModel, type Holder } from "./omni-3d";
import { HAS_CONN, INSIDE_CAPS, MODEL_BY_KEY, ORDER, type ModelKey } from "./omni-data";

/**
 * 03 — Inside.
 *
 * One box at a time on a turntable you can drag, with two things it can show:
 *
 *   **Inside** — the box comes apart, each part labelled in plain words. This
 *   is the section's job: to say what is actually in there.
 *   **What it connects to** — the box reassembles and the devices it is wired
 *   to appear around it, with cables that draw themselves and a streak of light that runs
 *   the direction the signal travels. Edge, AI and Motion have a fixed kit;
 *   Core does not, so the view switch hides for it.
 *
 * ── The camera orbits; the model never turns ────────────────────────
 * Dragging moves the *camera* around a stationary box (azimuth `ang`, elevation
 * `elev`), which is what the reference does. Spinning the model instead looks
 * near enough on an assembled box but falls apart the moment it explodes: the
 * parts swing through their own labels, and the connection cables — which live
 * in scene space so they can reach devices standing around the box — get
 * dragged along with it. The camera also creeps round on its own when nobody is
 * dragging, slowing as the connections come in so the cables stay readable.
 *
 * ── Framing is computed, not fixed ──────────────────────────────────
 * An exploded stack is far taller than the box and the connections rig is far
 * wider, so lift and distance are derived each frame from whichever is on
 * screen. A fixed camera would either crop the explode or leave the box tiny
 * once the devices appear.
 *
 * ── Labels are laid out, not just projected ─────────────────────────
 * Projecting each part's centre to screen space puts chips on top of one
 * another the moment two parts line up with the camera. So after projecting,
 * each chip is flipped to whichever side it fits on, clamped inside the stage,
 * and — per side, top to bottom — pushed down to clear the one above. On a
 * phone there is no room beside the model at all, so they become two columns
 * pinned to the stage edges. Without this the exploded stack reads as a pile of
 * overlapping cards.
 *
 * The viewer renders only while on screen, and takes itself apart once,
 * unprompted, the first time it is scrolled to — the section has to make its
 * own point before anyone thinks to press a button. Any deliberate input
 * cancels that.
 *
 * ── Every tab opens the same way, every time ────────────────────────
 * Picking a model resets it to its opening view — connections where the box
 * has a fixed kit (Edge, AI, Motion), taken apart where it does not (Core) —
 * and plays that from the start: the box swaps in assembled, then the cables
 * draw or the parts lift. Going back to a tab already seen plays it again
 * rather than showing the end state, so flicking between models always shows
 * the models doing something.
 */

const ss = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** How far the highest part travels when the box is fully apart. */
const maxLift = (m: BoxModel) => m.parts.reduce((n, p) => Math.max(n, p.offset.y), 0);

export type InsideView = "inside" | "connect";

type Chip = {
  el: HTMLDivElement;
  obj: THREE_NS.Object3D;
  x: number;
  y: number;
  h: number;
  flip: boolean;
  vis: boolean;
};

export function OmniInside({
  active,
  view,
  onActive,
  onView,
  onOpen,
}: {
  active: ModelKey;
  view: InsideView;
  onActive: (k: ModelKey) => void;
  onView: (v: InsideView) => void;
  onOpen: (k: ModelKey) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [noGl, setNoGl] = useState(false);
  const [apart, setApart] = useState(false);
  const [labels, setLabels] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiRef = useRef<any>(null);

  const cap = INSIDE_CAPS[active];
  const hasConn = HAS_CONN.includes(active);
  /* Core has no fixed kit, so it always shows the inside view even if the
     visitor last asked for connections on another box. */
  const shownView: InsideView = hasConn ? view : "inside";

  /* The scene builds asynchronously, after these effects have first run, so it
     reads the view it should open on from here once it exists. */
  const viewNow = useRef(shownView);

  /* Keep the imperative scene in step with React's state. */
  useEffect(() => { apiRef.current?.setActive(active); }, [active]);
  useEffect(() => {
    viewNow.current = shownView;
    apiRef.current?.setView(shownView);
  }, [shownView]);
  useEffect(() => { apiRef.current?.setApart(apart); }, [apart]);
  useEffect(() => { apiRef.current?.setLabels(labels); }, [labels]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const chipsRoot = chipsRef.current;
    if (!canvas || !stage || !chipsRoot) return;

    let disposed = false;
    let raf = 0;
    const cleanups: (() => void)[] = [];

    (async () => {
      const THREE = (await import("three")) as typeof THREE_NS;
      if (disposed) return;

      const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = matchMedia("(max-width:760px)").matches || /Mobi|Android/i.test(navigator.userAgent);
      const kit = createOmniKit(THREE, isMobile);

      let R: THREE_NS.WebGLRenderer;
      try {
        R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        setNoGl(true);
        return;
      }
      kit.setupRenderer(R);
      const scene = await kit.makeScene(R, 5.5);
      if (disposed) return;

      const cam = new THREE.PerspectiveCamera(30, 16 / 9, 0.05, 120);
      /* Procedural first, always. These build instantly and cost no network,
         so the viewer is usable the moment it renders. Edge and Motion then
         upgrade themselves to the real CAD-derived models when their tab is
         actually looked at — see `upgrade` below. */
      const hs: Record<string, Holder> = {};
      for (const k of ORDER) {
        const h = kit.makeHolder(k);
        h.g.visible = k === active;
        scene.add(h.g);
        hs[k] = h;
      }
      /* The cables reach devices standing around the box, so the rig belongs in
         scene space beside the holder rather than parented to it. */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conns: Record<string, any> = {};
      for (const k of HAS_CONN) {
        const c = kit.buildConn(k, hs[k].model);
        if (c) {
          conns[k] = c;
          c.group.visible = false;
          scene.add(c.group);
        }
      }

      const st = {
        key: active as string,
        view: viewNow.current,
        apart: false,
        labels: false,
        lk: 0,           // smoothed label opacity — labels fade, never snap
        e: 0,            // explode
        cp: 0,           // connections reveal
        ang: 0.7,
        elev: 0.5,
        drag: null as { x: number; y: number } | null,
        touched: false,  // any deliberate input cancels the auto-explode
        time: 0,
      };

      /* chips — one per labelled part, positioned from the 3D each frame. The
         shell gets none: "Housing" pointing at the box it is obviously part of
         is noise. */
      let chips: Chip[] = [];
      const buildChips = () => {
        chips.forEach((ch) => ch.el.remove());
        const conn = conns[st.key];
        const list: { label: string; desc: string; dir: string; obj: THREE_NS.Object3D }[] =
          st.view === "connect" && conn
            ? conn.devices.map((d: { label: string; desc: string; dir: string; obj: THREE_NS.Object3D }) => ({
                label: d.label,
                desc: d.desc,
                dir: d.dir,
                obj: d.obj,
              }))
            : hs[st.key].model.parts
                .filter((p) => p.label && !/^housing$|^enclosure$/i.test(p.label))
                /* Part chips carry the name only. With the description under
                   every name, a taken-apart box read as a wall of text over
                   the model it was meant to label. The descriptions stay in
                   the data (`PART_DESC`, the builders) should they be wanted
                   elsewhere; the connect view's device chips keep theirs. */
                .map((p) => ({ label: p.label, desc: "", dir: "", obj: p.obj }));
        chips = list.map((s) => {
          const d = document.createElement("div");
          d.className = "pchip";
          if (s.dir) d.setAttribute("data-dir", s.dir);
          d.innerHTML = s.desc ? '<div class="in"><b></b><span></span></div>' : '<div class="in"><b></b></div>';
          d.querySelector("b")!.textContent = s.label;
          if (s.desc) d.querySelector("span")!.textContent = s.desc;
          chipsRoot.appendChild(d);
          return { el: d, obj: s.obj, x: 0, y: 0, h: 40, flip: false, vis: false };
        });
      };
      buildChips();

      /* ── the real models ─────────────────────────────────────────
         Nine megabytes of CAD sit behind Edge and Motion. Fetching both up
         front would put that on every visitor to the page, including everyone
         who never opens this section — so each one is fetched the first time
         its own tab is shown, and swapped in when it lands.

         The swap has to take the cable rig with it: `buildConn` measures the
         model it is given, so a rig built around the procedural box would hang
         in the wrong places on the real one. */
      const upgraded = new Set<string>();
      const upgrade = async (k: string) => {
        if (upgraded.has(k) || !kit.hasGlb(k)) return;
        upgraded.add(k);
        const h = await kit.loadHolder(k);
        if (disposed || h.model === hs[k].model) return;

        h.g.visible = hs[k].g.visible;
        scene.remove(hs[k].g);
        scene.add(h.g);
        hs[k] = h;

        if (conns[k]) {
          scene.remove(conns[k].group);
          delete conns[k];
        }
        const c = kit.buildConn(k, h.model);
        if (c) {
          conns[k] = c;
          c.group.visible = false;
          scene.add(c.group);
        }
        if (st.key === k) buildChips();
        console.info(
          `OmniBox: ${k} upgraded to the CAD model — ${h.model.parts.length} parts`,
        );
      };
      void upgrade(st.key);

      /* The controls sit inside the drag surface, so a press that starts on one
         must not begin a drag: `setPointerCapture` would retarget the pointerup
         to the stage and the button would never see its click. */
      const onDown = (e: PointerEvent) => {
        if ((e.target as Element | null)?.closest?.(".stage-actions,.view-seg")) return;
        st.drag = { x: e.clientX, y: e.clientY };
        st.touched = true;
        stage.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!st.drag) return;
        st.ang -= (e.clientX - st.drag.x) * 0.008;
        st.elev = clamp(st.elev + (e.clientY - st.drag.y) * 0.004, 0.12, 1.1);
        st.drag = { x: e.clientX, y: e.clientY };
      };
      const end = () => { st.drag = null; };
      stage.addEventListener("pointerdown", onDown);
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerup", end);
      stage.addEventListener("pointercancel", end);
      cleanups.push(() => {
        stage.removeEventListener("pointerdown", onDown);
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerup", end);
        stage.removeEventListener("pointercancel", end);
      });

      const bb = new THREE.Box3();
      const mid = new THREE.Vector3();
      const ndc = new THREE.Vector3();
      const look = new THREE.Vector3();

      const frame = (dt: number) => {
        st.time += dt;
        const want = st.labels ? 1 : 0;
        st.lk = reduceMotion ? want : st.lk + (want - st.lk) * Math.min(1, dt * 8);

        const conn = conns[st.key];
        const wantC = st.view === "connect" && conn ? 1 : 0;
        st.cp = reduceMotion ? wantC : st.cp + (wantC - st.cp) * Math.min(1, dt * 2.2);

        /* The box cannot be in pieces and wired up at the same time, but the
           visitor's choice survives the detour: coming back to Inside springs it
           apart again. Deriving this every frame rather than zeroing the target
           on the way into connect view is what makes that work. */
        const tgt = st.view === "connect" ? 0 : st.apart ? 1 : 0;
        st.e = reduceMotion ? tgt : st.e + (tgt - st.e) * Math.min(1, dt * 2.6);

        const h = hs[st.key];
        const se = ss(st.e);
        kit.explode(h, se);
        for (const k in conns) {
          const cn = conns[k];
          cn.group.visible = k === st.key && st.cp > 0.002;
          if (cn.group.visible) kit.animateConn(cn, st.cp, st.time, reduceMotion);
        }

        const sc = ss(st.cp);
        if (!st.drag && !reduceMotion) st.ang += dt * lerp(0.18, 0.06, sc);

        /* Frame the model as it actually stands: the exploded stack is far
           taller than the box, and the connected kit far wider. */
        const s = h.model.size;
        const span = Math.max(s.x, s.z);
        const top = maxLift(h.model) + s.y;
        let lift = s.y * 0.5 + se * (top * 0.5 - s.y * 0.35);
        let dist = (span * 2.2 + s.y * 1.4 + se * top * 1.25) * (cam.aspect < 1 ? 1.55 : 1);
        if (conn) {
          lift = lerp(lift, conn.top * 0.5, sc);
          dist = lerp(dist, (conn.radius * 2.6 + conn.top * 1.2) * (cam.aspect < 1 ? 1.75 : 1), sc);
        }
        look.set(0, lift, 0);
        cam.position.set(
          Math.sin(st.ang) * Math.cos(st.elev) * dist,
          lift + Math.sin(st.elev) * dist,
          Math.cos(st.ang) * Math.cos(st.elev) * dist,
        );
        cam.lookAt(look);

        const w = stage.clientWidth;
        const hh = stage.clientHeight;
        const op = st.view === "connect" ? clamp((st.cp - 0.55) / 0.35, 0, 1) : clamp((st.e - 0.6) / 0.3, 0, 1);

        for (const ch of chips) {
          bb.setFromObject(ch.obj);
          bb.getCenter(mid);
          ndc.copy(mid).project(cam);
          ch.x = (ndc.x * 0.5 + 0.5) * w;
          ch.y = (-ndc.y * 0.5 + 0.5) * hh;
          ch.flip = ch.x < w / 2;
          ch.vis = ndc.z < 1;
          ch.h = ch.el.offsetHeight || 40;
          /* never let a label run off the stage edge: flip it to the side it fits on */
          const cw = ch.el.offsetWidth || 140;
          if (ch.flip && ch.x - 18 - cw < 8) ch.flip = false;
          if (!ch.flip && ch.x + 18 + cw > w - 8) ch.flip = ch.x - 18 - cw >= 8;
          ch.x = ch.flip ? Math.max(ch.x, cw + 26) : Math.min(ch.x, w - cw - 26);
        }

        // the toggle and the flow key sit along the bottom; the view switch on top
        const bottomClear = w < 600 ? (st.view === "connect" ? 60 : 64) : st.view === "connect" ? 44 : 20;
        const topClear = conns[st.key] ? (w < 600 ? 54 : 62) : 8;
        /* On a phone there is no room beside the model, so labels go into two
           columns pinned to the stage edges, alternating by height, and never
           cross the middle. */
        if (w < 600) {
          chips
            .slice()
            .sort((a, b) => a.y - b.y)
            .forEach((ch, i) => {
              ch.flip = i % 2 === 1;
              ch.x = ch.flip ? w - 10 + 18 : 10 - 18;
            });
        }
        /* keep labels from stacking: per side, top to bottom, each one clears
           the one above */
        for (const side of [true, false]) {
          const col = chips.filter((ch) => ch.flip === side).sort((a, b) => a.y - b.y);
          let floor = -1e9;
          for (const ch of col) {
            const half = ch.h / 2 + 4;
            ch.y = Math.max(ch.y, floor + half);
            ch.y = clamp(ch.y, half + topClear, hh - half - bottomClear);
            floor = ch.y + half;
          }
        }
        for (const ch of chips) {
          ch.el.classList.toggle("flip", ch.flip);
          ch.el.style.transform = ch.flip
            ? `translate(${(ch.x - 18).toFixed(1)}px,${ch.y.toFixed(1)}px) translate(-100%,-50%)`
            : `translate(${(ch.x + 18).toFixed(1)}px,${ch.y.toFixed(1)}px) translate(0,-50%)`;
          ch.el.style.opacity = (ch.vis ? op * st.lk : 0).toFixed(3);
        }

        /* Nothing is drawn until the stage has a size. `resize` returns early
           while the element has no layout, which leaves the drawing buffer at
           0x0 — and clearing or drawing to that is an incomplete-framebuffer
           error, once per frame, forever. */
        const db = R.getDrawingBufferSize(bufSize);
        if (db.width < 2 || db.height < 2) return;
        R.render(scene, cam);
      };

      const bufSize = new THREE.Vector2();
      const resize = () => {
        const w = stage.clientWidth, hh = stage.clientHeight;
        if (!w || !hh) return;
        R.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
        R.setSize(w, hh, false);
        cam.aspect = w / hh;
        cam.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(stage);
      resize();
      cleanups.push(() => ro.disconnect());

      let running = false, last = 0, seen = false;
      const loop = (t: number) => {
        if (!running) { raf = 0; return; }
        raf = requestAnimationFrame(loop);
        const dt = Math.min(0.05, (t - last) / 1000 || 0);
        last = t;
        frame(dt);
      };
      const io = new IntersectionObserver(
        ([en]) => {
          running = en.isIntersecting;
          if (running && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
          /* the first time it comes into view, take it apart on its own */
          if (running && !seen) {
            seen = true;
            /* through React, so the button label changes along with it */
            window.setTimeout(() => { if (!st.touched && !disposed) setApart(true); }, 900);
          }
        },
        { rootMargin: "80px" },
      );
      io.observe(stage);
      cleanups.push(() => io.disconnect());

      apiRef.current = {
        touch() { st.touched = true; },
        setActive(k: string) {
          if (k === st.key) return;
          void upgrade(k);
          st.cp = 0;
          const swap = () => {
            Object.values(hs).forEach((x) => (x.g.visible = x.key === k));
            st.key = k;
            st.ang = 0.7;
            // Start assembled and unwired, so the opening plays from its start
            // on every visit to the tab, not just the first.
            st.e = 0;
            st.cp = 0;
            st.lk = 0;
            buildChips();
          };
          if (reduceMotion) { swap(); return; }
          /* `.swap` belongs on `.inside-stage` — the element the CSS fades —
             not on this inner drag surface. */
          const frameEl = stage.closest(".inside-stage") ?? stage;
          frameEl.classList.add("swap");
          window.setTimeout(() => {
            if (disposed) return;
            swap();
            frameEl.classList.remove("swap");
          }, 200);
        },
        setView(v: InsideView) {
          if (v === st.view) return;
          st.view = v;
          buildChips();
        },
        setApart(on: boolean) { st.apart = on; },
        setLabels(on: boolean) { st.labels = on; },
      };

      cleanups.push(() => {
        apiRef.current = null;
        scene.traverse((o) => {
          const m = o as THREE_NS.Mesh;
          if (m.isMesh) m.geometry?.dispose();
        });
        R.dispose();
      });
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
    // Built once; state changes go through `apiRef`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Switch model, back to its opening view, with the opening played again. */
  const pick = (k: ModelKey) => {
    apiRef.current?.touch();
    onActive(k);
    onView("connect");
    setApart(true);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const i = ORDER.indexOf(active);
    const next = ORDER[(i + d + ORDER.length) % ORDER.length];
    pick(next);
    document.getElementById("omni-itab-" + next)?.focus();
  };

  return (
    <section className={"section" + (shownView === "connect" ? " connect" : "")} id="inside">
      <div className="wrap">
        <Head
          center
          label="Inside"
          top="Take one apart."
          intro="Pick a box to see what it connects to on the job, and what it’s made of. Drag to turn it around."
        />

        <Reveal className={"inside-stage" + (noGl ? " no-gl" : "")}>
          <div ref={stageRef} style={{ position: "absolute", inset: 0 }}>
            <canvas
              ref={canvasRef}
              className="inside-canvas"
              role="img"
              aria-label="3D model of the selected OmniBox, shown taken apart with its main parts labelled, or with the devices it connects to"
            />
            <div ref={chipsRef} aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

            {hasConn && (
              <div className="view-seg" role="group" aria-label="What to show">
                {(["inside", "connect"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={shownView === v}
                    onClick={() => { apiRef.current?.touch(); onView(v); }}
                  >
                    {v === "inside" ? "Inside" : "What it connects to"}
                  </button>
                ))}
              </div>
            )}

            <div className="stage-actions">
              <button
                type="button"
                className="label-toggle"
                aria-pressed={labels}
                onClick={() => { apiRef.current?.touch(); setLabels((v) => !v); }}
              >
                <i aria-hidden />
                Labels
              </button>
              {/* Core has no fixed internals, so there is nothing honest to
                  take apart — see the note in `omni-3d.ts`. */}
              {shownView === "inside" && active !== "core" && (
                <button
                  type="button"
                  className="inside-toggle"
                  onClick={() => { apiRef.current?.touch(); setApart((v) => !v); }}
                >
                  {apart ? "Put it back together" : "Take it apart"}
                </button>
              )}
            </div>

            {shownView === "inside" && <span className="inside-hint">Drag to turn</span>}

            {shownView === "connect" && (
              <div className="flow-key" aria-hidden>
                <span className="k-in">What it senses</span>
                <span className="k-out">What it acts on</span>
              </div>
            )}
          </div>

          <div className="inside-fallback">
            <Media src={cap.img} alt={MODEL_BY_KEY[active].name} label={cap.img} className="contain" tone="light" />
          </div>
        </Reveal>

        <div className="env-ui">
          <div className="seg" role="tablist" aria-label="OmniBox model" onKeyDown={onKey}>
            {ORDER.map((k) => (
              <button
                key={k}
                id={"omni-itab-" + k}
                role="tab"
                type="button"
                aria-selected={k === active}
                tabIndex={k === active ? 0 : -1}
                onClick={() => pick(k)}
              >
                {MODEL_BY_KEY[k].short}
              </button>
            ))}
          </div>

          <div className="env-cap" role="tabpanel" aria-labelledby={"omni-itab-" + active}>
            <h3>{cap.h}</h3>
            <p>{shownView === "connect" && cap.connect ? cap.connect : cap.inside}</p>
            <button type="button" className="link" onClick={() => onOpen(active)}>
              Learn more about {MODEL_BY_KEY[active].short}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
