"use client";

import { useEffect, useRef, useState } from "react";
import type * as THREE_NS from "three";
import { createSstKit, loadFork, type DevKey, type Mounts } from "./sst-3d";

/**
 * The hero film — the truck, the five sensors on it, and the LiDAR chapter.
 *
 * A fixed canvas behind fixed type, driven entirely by how far the page has been
 * scrolled. Four chapters over one scroll track:
 *
 *   p 0.00–0.20  the truck, three-quarter front, under the headline
 *   p 0.24–0.45  "Six senses. One truck." — every sensor lights where it really
 *                mounts, each with a name tag pinned to it in screen space
 *   p 0.50–0.80  "One LiDAR layer. Three answers." — the room fills with a
 *                point cloud sweeping out from the truck's own LiDAR, and the
 *                canvas washes to near-black under it
 *   p 0.85–1.00  "Know every truck." — back to the opening frame
 *
 * ── Why the sensors are placed by the model, not by hand ────────────
 * `mountsOf()` reads the GLB's own named parts, so the Access Control unit is on
 * the rider panel, the pallet sensor is on the lift carriage, the LiDAR is on
 * the roof and the reverse alarm is on the engine cover — because that is where
 * they are on the model, not because five vectors were typed in until they
 * looked right. It also means the halos and the tags point at the real thing.
 *
 * ── The LiDAR chapter dims the page ─────────────────────────────────
 * `R.setClearColor(0x06080a, ch3 * .96)` fades the canvas itself to near-black
 * as chapter three comes in, and `.film.dark-bg` flips the fixed type to its
 * light colours over it. The cloud has to be read against black; a point cloud
 * on `#F5F5F7` is invisible. That is the one moment the page goes dark under
 * the type rather than in a section of its own.
 *
 * ── If it cannot run ────────────────────────────────────────────────
 * Ten seconds without a WebGL2 context, or any throw, and `onUnavailable()`
 * puts the page into `.no-film`: this whole track is removed, `SstHero` takes
 * its place, and the page reads as an ordinary hero with a photograph. That is
 * the reference's own designed state.
 */

/** The five tags that ride on the truck in chapter two. */
const TAGS: { k: DevKey; name: string; tag: string }[] = [
  { k: "access", name: "Access Control", tag: "Who can drive" },
  { k: "lidar", name: "LiDAR", tag: "Crash · speed · location" },
  { k: "pds", name: "Pallet Detection", tag: "What’s on the forks" },
  { k: "bms", name: "Battery Management", tag: "Charge and health" },
  { k: "rsa", name: "Reverse Sensor Alarm", tag: "What’s behind" },
];

const ss = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a), 0, 1);

export function SstFilm({ onUnavailable }: { onUnavailable: () => void }) {
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
      const kit = createSstKit(THREE, isMobile);

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

      const scene = await kit.makeScene(R, 6);
      if (disposed) {
        R.dispose();
        return;
      }
      const cam = new THREE.PerspectiveCamera(30, 1, 0.05, 200);
      const truck = new THREE.Group();
      scene.add(truck);

      const cloud = new THREE.Points(kit.buildCloud(0.55), kit.cloudMaterial());
      cloud.rotation.y = Math.PI / 2;
      scene.add(cloud);
      cloud.material.uniforms.uRange.value = 13;
      cloud.material.uniforms.uSize.value = 0.06;

      /* The orange glow under each sensor, so the eye finds five small things
         on a large truck. A sprite, so it faces the camera at every angle. */
      const halo = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 128;
        const x = c.getContext("2d")!;
        const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0, "rgba(255,138,61,.95)");
        g.addColorStop(0.35, "rgba(255,106,0,.45)");
        g.addColorStop(1, "rgba(255,106,0,0)");
        x.fillStyle = g;
        x.fillRect(0, 0, 128, 128);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      })();

      const halos: Partial<Record<DevKey, THREE_NS.Sprite>> = {};
      const anchors: Partial<Record<DevKey, THREE_NS.Vector3>> = {};
      let mounts: Mounts | null = null;

      loadFork()
        .then((src) => {
          if (disposed) return;
          const f = kit.fitFork(src);
          truck.add(f);
          mounts = kit.mountsOf(f);
          for (const t of TAGS) {
            const d = kit.DEV[t.k]();
            // The chip is tiny next to a forklift, so it is drawn larger than
            // life — the film is making the point that it is there at all.
            d.group.scale.setScalar(t.k === "bms" ? 2.4 : 1.5);
            d.group.position.copy(mounts[t.k]);
            if (t.k === "pds") {
              d.group.rotation.x = -Math.PI / 2;
              d.group.rotation.z = Math.PI;
            }
            if (t.k === "rsa") d.group.rotation.y = Math.PI;
            if (t.k === "access") d.group.rotation.set(-0.5, Math.PI, 0);
            truck.add(d.group);
            anchors[t.k] = mounts[t.k].clone();

            const sp = new THREE.Sprite(
              new THREE.SpriteMaterial({
                map: halo, transparent: true, depthWrite: false, depthTest: false,
                blending: THREE.AdditiveBlending, opacity: 0,
              }),
            );
            sp.scale.setScalar(0.55);
            sp.position.copy(mounts[t.k]);
            truck.add(sp);
            halos[t.k] = sp;
          }
        })
        .catch((e) => console.warn("Sensor Stack: forklift unavailable —", e));

      /* Camera keyframes: [p, position, target]. Chapter three pulls up and
         back, because the cloud is 28 m of warehouse and the truck is 2.3 m. */
      const KW: [number, THREE_NS.Vector3, THREE_NS.Vector3][] = [
        [0, V3(7.4, 3.6, -8.1), V3(0, 2.65, 0)],
        [0.2, V3(7.4, 3.6, -8.1), V3(0, 2.65, 0)],
        [0.4, V3(-10.2, 4.4, 3.4), V3(0, 1.75, 0)],
        [0.56, V3(-8.5, 8.5, 10.5), V3(0, 0.6, 0)],
        [0.8, V3(6, 9, 11), V3(0, 0.6, 0)],
        [0.94, V3(7.4, 3.6, -8.1), V3(0, 2.65, 0)],
        [1, V3(7.4, 3.6, -8.1), V3(0, 2.65, 0)],
      ];
      const camPos = V3(), camTgt = V3(), ndc = V3(), wp = V3();
      const keyed = (p: number, outP: THREE_NS.Vector3, outT: THREE_NS.Vector3) => {
        let i = 0;
        while (i < KW.length - 2 && p > KW[i + 1][0]) i++;
        const [a, pa, ta] = KW[i], [b, pb, tb] = KW[i + 1];
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

      /* Drag turns the truck, not the camera: the film's camera is on rails and
         taking it off them mid-chapter loses the composition. */
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

      let lastOp = -1;
      const frame = (dt: number) => {
        state.p += (state.pT - state.p) * Math.min(1, dt * (reduceMotion ? 20 : 4));
        const p = state.p;
        state.time += dt;
        state.drag += (state.dragT - state.drag) * Math.min(1, dt * 6);

        keyed(p, camPos, camTgt);
        /* Pull the camera back on a narrow viewport rather than change the
           keyframes: the truck is long, and a portrait phone crops it. */
        const a = cam.aspect;
        const push = a < 1 ? clamp(1.05 / a, 1.2, 2.1) : clamp(1.6 / a, 1, 1.5);
        camPos.sub(camTgt).multiplyScalar(push).add(camTgt);
        if (!state.placed) {
          cam.position.copy(camPos);
          state.placed = true;
        }
        cam.position.lerp(camPos, Math.min(1, dt * 5));
        cam.lookAt(camTgt);
        truck.rotation.y = state.drag + (reduceMotion ? 0 : Math.sin(state.time * 0.2) * 0.04);

        const ch2 = ss(seg(p, 0.22, 0.3)) * (1 - ss(seg(p, 0.44, 0.5)));
        const ch3 = ss(seg(p, 0.48, 0.56)) * (1 - ss(seg(p, 0.8, 0.88)));

        const u = cloud.material.uniforms;
        u.uOp.value = ch3;
        u.uTime.value = state.time;
        u.uAng.value = reduceMotion ? 1.2 : state.time * 2.4;
        cloud.visible = ch3 > 0.01;
        R.setClearColor(0x06080a, ch3 * 0.96);
        film.classList.toggle("dark-bg", ch3 > 0.5);
        u.uScale.value = (window.innerHeight / (2 * Math.tan((cam.fov * Math.PI) / 360))) * R.getPixelRatio();
        if (mounts) {
          truck.localToWorld(wp.copy(mounts.lidar));
          u.uO.value.copy(wp);
        }

        TAGS.forEach((t, i) => {
          const el = tagRefs.current[i];
          const h = halos[t.k];
          if (!el) return;
          if (!h) {
            el.style.opacity = "0";
            return;
          }
          const pulse = reduceMotion ? 1 : 0.75 + 0.25 * Math.sin(state.time * 3 + i);
          h.material.opacity = ch2 * pulse;
          truck.localToWorld(wp.copy(anchors[t.k]!));
          ndc.copy(wp).project(cam);
          el.style.transform =
            `translate(${((ndc.x * 0.5 + 0.5) * window.innerWidth).toFixed(1)}px,` +
            `${((-ndc.y * 0.5 + 0.5) * window.innerHeight + 18).toFixed(1)}px) translate(-50%,0)`;
          el.style.opacity = (ndc.z < 1 ? ch2 : 0).toFixed(3);
        });

        for (const s of secs) {
          const f = 0.04;
          const o = (s.a === 0 ? 1 : ss(seg(p, s.a, s.a + f))) * (1 - ss(seg(p, s.b - f, s.b)));
          s.el.style.opacity = o.toFixed(3);
          s.el.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
          s.el.style.visibility = o < 0.005 ? "hidden" : "visible";
        }

        /* Past the end of the track the whole film fades out over 60% of a
           viewport, handing the page to the document underneath. */
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
      console.warn("Sensor Stack: hero film unavailable —", err);
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
            <p className="kicker">RAMS Digital</p>
            <h1>Sensor Stack</h1>
            <p className="tag">
              Who’s driving, how fast, what it hit, where it is, what’s on the forks —{" "}
              <b>and how the battery is holding up.</b>
            </p>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#sensors">
                Meet the sensors
              </a>
              <a className="btn btn-secondary" href="#lidar">
                See the LiDAR
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
          <span className="label">The stack</span>
          <h2>
            Six senses.
            <br />
            One truck.
          </h2>
          <p className="lead">
            Each sensor answers one question. Together they tell you everything that happened on a
            shift.
          </p>
        </section>

        <section
          className="sec top"
          data-a="0.5"
          data-b="0.8"
          ref={(el) => {
            secRefs.current[2] = el;
          }}
        >
          <span className="label">LiDAR</span>
          <h2>
            One LiDAR layer.
            <br />
            Three answers.
          </h2>
          <p className="lead">
            The truck sees the space around it in 3D — and from that picture knows its speed, its
            place, and the moment it hits something.
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
          <h2>
            Know every truck.
            <br />
            Every shift.
          </h2>
          <div className="hero-cta" style={{ justifyContent: "center", marginTop: 28 }}>
            <a className="btn btn-primary" href="#sensors">
              Meet the sensors
            </a>
          </div>
        </section>
      </div>

      <div className="hw-tags" ref={tagsRef} aria-hidden>
        {TAGS.map((t, i) => (
          <div
            key={t.k}
            className="box-tag"
            ref={(el) => {
              tagRefs.current[i] = el;
            }}
          >
            <b>{t.name}</b>
            <span>{t.tag}</span>
          </div>
        ))}
      </div>

      <div className="hw-scrollspace" ref={spaceRef} aria-hidden />
    </>
  );
}
