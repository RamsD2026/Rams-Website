"use client";

/**
 * Where the network is, and what it is saying.
 *
 * Pins on a map, one reporting at a time: the pin lifts and pulses, and the
 * row for that site lights in the log beneath. The map says where; the log
 * says what. Both read from the same list and the same tick, so they can
 * never disagree about which site is being looked at.
 */

import {
  AROUND,
  CONTEXT_CITIES,
  GRATICULE,
  INDIA,
  LABELS,
  MAP,
  SITES,
  type Site,
} from "./aims-map-data";

export type { Site };
export { SITES };

const GREEN = "#54DE91";
const AMBER = "#FFBE47";
const RED = "#FF6C6C";

/* The land is lifted well clear of the board so the map reads as a map and
   not as another dark panel. */
/* Basemap tones: land a shade above the water it sits in, borders thin,
   labels quiet enough to read past. */
const LAND = "rgba(255,255,255,0.055)";
const LAND_LINE = "rgba(255,255,255,0.14)";
const HOME = "rgba(255,255,255,0.10)";
const GRID = "rgba(255,255,255,0.03)";

export const toneOf = (i: number) => (i >= 88 ? GREEN : i >= 80 ? AMBER : RED);

/** How long each site holds the floor. */
export const DWELL = 26;

/* ── the map ─────────────────────────────────────────────── */

/** A pin, standing on its point. */
const PIN =
  "M0,0 c-5.5,-8.5 -8,-11.5 -8,-16 a8,8 0 1,1 16,0 c0,4.5 -2.5,7.5 -8,16 z";

export function SiteMap({ t }: { t: number }) {
  const at = Math.floor(t / DWELL) % SITES.length;

  return (
    <svg
      viewBox={`0 0 ${MAP.w} ${MAP.h}`}
      className="block w-full h-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Connected warehouse locations"
    >
      {/* the grid a basemap carries */}
      <path d={GRATICULE} fill="none" stroke={GRID} strokeWidth={0.6} />

      {/* every country */}
      {AROUND.map((d, i) => (
        <path key={i} d={d} fill={LAND} stroke={LAND_LINE} strokeWidth={0.5} />
      ))}

      {/* and the one the network started in */}
      <path
        d={INDIA}
        fill={HOME}
        stroke="rgba(255,255,255,0.34)"
        strokeWidth={0.7}
        strokeLinejoin="round"
      />

      {/* what a basemap prints: countries, seas, and the cities that are
          not ours */}
      {LABELS.map((l) => (
        <text
          key={l.text}
          x={l.x}
          y={l.y}
          textAnchor="middle"
          fontSize={9}
          fontFamily="ui-monospace, monospace"
          letterSpacing={2}
          fill="#FFFFFF"
          fillOpacity={0.2}
        >
          {l.text}
        </text>
      ))}

      {CONTEXT_CITIES.map((c) => (
        <g key={c.name}>
          <circle cx={c.x} cy={c.y} r={1.4} fill="#FFFFFF" fillOpacity={0.3} />
          <text
            x={c.x + 4}
            y={c.y + 2.6}
            fontSize={7.5}
            fontFamily="ui-monospace, monospace"
            fill="#FFFFFF"
            fillOpacity={0.28}
          >
            {c.name}
          </text>
        </g>
      ))}

      {SITES.map((s, i) => {
        const on = i === at;
        const c = toneOf(s.index);
        return (
          <g key={s.id} transform={`translate(${s.x} ${s.y})`}>
            {/* the ground the pin stands on */}
            <ellipse
              cx={0}
              cy={1}
              rx={on ? 6 : 4}
              ry={on ? 2.2 : 1.6}
              fill="#000"
              opacity={0.3}
            />

            {on && (
              <circle
                r={13}
                fill="none"
                stroke={c}
                strokeOpacity={0.55}
                className="aims-ping"
              />
            )}

            <g
              transform={`translate(0 ${on ? -4 : 0}) scale(${on ? 1.15 : 0.86})`}
              style={{
                transition: "transform 320ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <path
                d={PIN}
                fill={c}
                fillOpacity={on ? 1 : 0.55}
                stroke="rgba(10,15,20,0.5)"
                strokeWidth={0.8}
              />
              <circle cy={-16} r={3} fill="#0A0F14" fillOpacity={0.9} />
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ── the log beside it ───────────────────────────────────── */

export function SiteLog({ t }: { t: number }) {
  const at = Math.floor(t / DWELL) % SITES.length;

  return (
    <div className="flex flex-col gap-1.5">
      {SITES.map((s, i) => {
        const on = i === at;
        const tone = toneOf(s.index);
        return (
          <div
            key={s.id}
            className="flex items-center gap-3 px-3 py-2 transition-colors duration-300"
            style={{
              borderRadius: 8,
              background: on ? `${tone}14` : "transparent",
              border: `1px solid ${on ? `${tone}44` : "transparent"}`,
            }}
          >
            <span
              className="flex items-center justify-center w-7 h-7 rounded-[7px] shrink-0 text-[9px] font-mono font-bold tracking-[0.04em]"
              style={{ background: `${tone}1F`, color: tone }}
            >
              {s.id}
            </span>

            <span className="min-w-0 flex-1">
              <span
                className="block text-[11.5px] font-semibold truncate transition-colors duration-300"
                style={{ color: on ? "#FFFFFF" : "rgba(255,255,255,0.68)" }}
              >
                {s.name}
              </span>
              <span className="block text-[9.5px] font-mono text-white/35 truncate">
                {s.region} · {s.note}
              </span>
            </span>

            <span
              className="text-[12px] font-mono font-semibold tabular-nums shrink-0"
              style={{ color: on ? tone : "rgba(255,255,255,0.5)" }}
            >
              {s.index.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
