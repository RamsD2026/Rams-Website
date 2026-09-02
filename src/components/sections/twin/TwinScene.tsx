"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import type { Group, Mesh } from "three";
import {
  BAY,
  BAY_X,
  BAY_Y,
  COLUMNS,
  DOCK,
  DOCKS,
  EVENTS,
  SENSORS,
  SHELL,
  WALKWAYS,
  ZONES,
} from "./twin-plan";

/**
 * The twin, in three dimensions.
 *
 * Every coordinate here is lifted from the source document's own plan view —
 * the 900×520 SVG — rather than modelled by hand, so the 3D building and the
 * 2D plan are the same facility and stay that way. `p()` is the only mapping:
 * SVG units to world units, origin at the centre of the shell.
 *
 * Nothing is random. The scene renders identically every time, which is what
 * lets it be server-rendered safely and lets a second viewing match the first.
 */

/* ── the plan, in its own units ──────────────────────────── */

/** SVG → world. 20 SVG units to 1 world unit, centred on the shell. */
const S = 20;
const CX = 450;
const CY = 260;
const px = (x: number) => (x - CX) / S;
const pz = (y: number) => (y - CY) / S;
const pw = (w: number) => w / S;

const FLOOR_W = pw(SHELL.w);
const FLOOR_D = pw(SHELL.h);

const BAY_W = pw(BAY.w);
const BAY_D = pw(BAY.h);
const BAY_H = 1.75;

/* The model sits inside the dark product frame, so the building is read as
   light geometry on a dark floor rather than the other way round. */
const SLAB = "#15151B";
const RACK = "#33333D";
const COLUMN = "#44444F";
const DOCK_FACE = "#55555F";
const WALKWAY = "#54DE91";

/** Zone fills, in the tones the surface can carry. */
const ZONE_FILL = (restricted: boolean) =>
  restricted ? (["#FF6C6C", 0.16] as const) : (["#FFFFFF", 0.05] as const);

/* ── pieces ──────────────────────────────────────────────── */

/** All 104 bays as one instanced draw rather than 104. */
function Racks() {
  const bays = useMemo(
    () => BAY_Y.flatMap((y) => BAY_X.map((x) => [x, y] as const)),
    [],
  );

  return (
    <Instances limit={bays.length} castShadow={false}>
      <boxGeometry args={[BAY_W, BAY_H, BAY_D]} />
      <meshLambertMaterial color={RACK} />
      {bays.map(([x, y]) => (
        <Instance
          key={`${x}-${y}`}
          position={[px(x + BAY.w / 2), BAY_H / 2, pz(y + BAY.h / 2)]}
        />
      ))}
    </Instances>
  );
}

function Shell() {
  return (
    <group>
      {/* the slab */}
      <mesh position={[0, -0.06, 0]}>
        <boxGeometry args={[FLOOR_W, 0.12, FLOOR_D]} />
        <meshLambertMaterial color={SLAB} />
      </mesh>

      {/* zones, painted on the slab */}
      {ZONES.map(([x, y, w, h, label, restricted]) => {
        const [colour, opacity] = ZONE_FILL(restricted);
        return (
          <mesh
            key={label}
            position={[px(x + w / 2), 0.005, pz(y + h / 2)]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[pw(w), pw(h)]} />
            <meshBasicMaterial color={colour} transparent opacity={opacity} />
          </mesh>
        );
      })}

      {/* the walkway */}
      {WALKWAYS.map(([x, y, w, h]) => (
        <mesh
          key={`w-${x}-${y}`}
          position={[px(x + w / 2), 0.01, pz(y + h / 2)]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[pw(w), pw(h)]} />
          <meshBasicMaterial color={WALKWAY} transparent opacity={0.22} />
        </mesh>
      ))}

      {/* dock doors */}
      {DOCKS.map((y) => (
        <mesh key={`d-${y}`} position={[px(SHELL.x), 0.5, pz(y + DOCK.h / 2)]}>
          <boxGeometry args={[pw(DOCK.w), 1, pw(DOCK.h)]} />
          <meshLambertMaterial color={DOCK_FACE} />
        </mesh>
      ))}

      {/* columns */}
      {COLUMNS.flatMap((x) =>
        [SHELL.y, SHELL.y + SHELL.h].map((y) => (
          <mesh key={`c-${x}-${y}`} position={[px(x), 1.1, pz(y)]}>
            <boxGeometry args={[0.34, 2.2, 0.34]} />
            <meshLambertMaterial color={COLUMN} />
          </mesh>
        )),
      )}
    </group>
  );
}

/** A sensor node, and the ring that says it is reporting. */
function Sensor({ x, y, still }: { x: number; y: number; still: boolean }) {
  const ring = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!ring.current || still) return;
    /* one shared clock, so every node breathes together */
    const t = (clock.elapsedTime * 0.55) % 1;
    const s = 1 + t * 2.4;
    ring.current.scale.set(s, s, s);
    const m = ring.current.material as { opacity: number };
    m.opacity = 0.5 * (1 - t);
  });

  return (
    <group position={[px(x), 2.75, pz(y)]}>
      <mesh>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshBasicMaterial color="#FF6A00" />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.36, 24]} />
        <meshBasicMaterial color="#FF6A00" transparent opacity={0.5} />
      </mesh>
      {/* the drop to the floor, so the node reads as mounted */}
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 2.7, 6]} />
        <meshBasicMaterial color="#FF6A00" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function Event({ x, y, colour }: { x: number; y: number; colour: string }) {
  return (
    <group position={[px(x), BAY_H + 0.2, pz(y)]}>
      <mesh>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial color={colour} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.34, 24]} />
        <meshBasicMaterial color={colour} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

/** The whole facility, swaying rather than spinning — a loop that resolves. */
function Facility({ still }: { still: boolean }) {
  const g = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!g.current || still) return;
    g.current.rotation.y = 0.34 * Math.sin(clock.elapsedTime * 0.11);
  });

  return (
    <group ref={g} rotation={[0, still ? 0.1 : 0, 0]}>
      <Shell />
      <Racks />
      {SENSORS.map(([x, y]) => (
        <Sensor key={`s-${x}-${y}`} x={x} y={y} still={still} />
      ))}
      {EVENTS.map(([x, y, c]) => (
        <Event
          key={`e-${x}-${y}`}
          x={x}
          y={y}
          colour={c === "#C6413A" ? "#FF6C6C" : "#FFBE47"}
        />
      ))}
    </group>
  );
}

/* ── the canvas ──────────────────────────────────────────── */

export default function TwinScene() {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [still, setStill] = useState(true);

  /* Motion is opt-in: off until we know the viewer wants it and the machine
     is wide enough to be worth it. */
  useEffect(() => {
    const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 640px)");
    const read = () => setStill(motionOff.matches || narrow.matches);
    read();
    motionOff.addEventListener("change", read);
    narrow.addEventListener("change", read);
    return () => {
      motionOff.removeEventListener("change", read);
      narrow.removeEventListener("change", read);
    };
  }, []);

  /* No frames while the scene is off screen. */
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      rootMargin: "120px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="w-full h-full">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible && !still ? "always" : "demand"}
        camera={{ position: [17, 15.5, 22], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[12, 22, 8]} intensity={2.2} />
        <directionalLight position={[-14, 10, -10]} intensity={0.7} />
        <Facility still={still} />
      </Canvas>
    </div>
  );
}
