"use client";

import { useEffect, useMemo, useState } from "react";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import { EVENTS } from "./aiv-data";

/**
 * 07 — The software.
 *
 * A dashboard mock: an event heat map of the plant floor, a declining trend,
 * and a "latest event" panel that rotates through four event types.
 *
 * ── The heat map is computed, not hand-placed ───────────────────────
 * 16 × 7 cells, each scored by its distance from three hotspots — the dock
 * doors, the press line, and a weaker one mid-floor — and bucketed into four
 * shades. Deterministic, so the server and the client agree and it never
 * re-renders differently; and it means the picture matches the "Dock doors 41%
 * · Press line 27%" legend under it instead of being decorative noise.
 *
 * The "representative / illustrative" note stays, for the same reason as the
 * one in the numbers section.
 */
export function AivSoftware() {
  const cells = useMemo(() => {
    const COLS = 16;
    const ROWS = 7;
    const out: string[] = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      const x = i % COLS;
      const y = Math.floor(i / COLS);
      const d1 = Math.hypot(x - 2.2, y - 1.4);
      const d2 = Math.hypot(x - 10.5, y - 4.6);
      const d3 = Math.hypot(x - 6.5, y - 3.1);
      const v =
        Math.max(0, 2.8 - d1) + Math.max(0, 2.3 - d2) * 0.9 + Math.max(0, 1.6 - d3) * 0.6;
      out.push(v > 2.1 ? "h4" : v > 1.35 ? "h3" : v > 0.65 ? "h2" : v > 0.18 ? "h1" : "");
    }
    return out;
  }, []);

  const [ei, setEi] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setFading(true);
      setTimeout(() => {
        setEi((i) => (i + 1) % EVENTS.length);
        setFading(false);
      }, 350);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  const ev = EVENTS[ei];

  return (
    <section className="section" id="software">
      <div className="wrap">
        <Head
          label="The software"
          top="Every event,"
          bottom="on one screen."
          intro="Each camera runs on its own. Connected, they report to RAMS Digital, and individual events become trends — where they repeat, when they happen, and which areas have earned attention. The floor stops being anecdote and becomes something you can take to a safety review."
        />

        <Reveal className="dash">
          <div className="dash-bar">
            <span className="dash-dot" />
            <span className="dash-dot" />
            <span className="dash-dot" />
            <span className="dash-title">RAMS Digital — Plant 2</span>
            <span className="dash-live">LIVE</span>
          </div>

          <div className="dash-body">
            <div className="dash-main">
              <div className="dash-h">Events by location · last 30 days</div>
              <div
                className="heat"
                role="img"
                aria-label="Heat map of events across the plant floor, with hotspots at the dock doors and the press line"
              >
                {cells.map((c, i) => (
                  <i key={i} className={c || undefined} />
                ))}
              </div>
              <div className="heat-zones">
                <span>
                  <b>Dock doors</b> 41%
                </span>
                <span>
                  <b>Press line</b> 27%
                </span>
                <span>
                  <b>Aisles</b> 22%
                </span>
                <span>
                  <b>Robot cells</b> 10%
                </span>
              </div>
            </div>

            <div className="dash-side">
              <div className="dash-h">Trend</div>
              <svg className="spark" viewBox="0 0 200 56" role="img" aria-label="Event trend, declining">
                <polyline
                  className="spark-f"
                  points="0,10 22,16 44,12 66,24 88,20 110,31 132,29 154,40 176,44 200,49 200,56 0,56"
                />
                <polyline
                  className="spark-l"
                  points="0,10 22,16 44,12 66,24 88,20 110,31 132,29 154,40 176,44 200,49"
                />
              </svg>
              <div className="dash-delta">
                −62<em>%</em>
                <span>since install</span>
              </div>

              <div className="dash-h mt">Latest event</div>
              <div className={"evt" + (fading ? " fade" : "")} aria-live="polite">
                <div className="evt-top">
                  <span className="evt-id">{ev.id}</span>
                  <span className="evt-time">{ev.time}</span>
                </div>
                <div className="evt-row">
                  <span>Type</span>
                  <b>{ev.type}</b>
                </div>
                <div className="evt-row">
                  <span>Source</span>
                  <b>{ev.source}</b>
                </div>
                <div className="evt-row">
                  <span>Action</span>
                  <b className={ev.stop ? "stop" : undefined}>{ev.action}</b>
                </div>
                <div className="evt-row">
                  <span>Detail</span>
                  <b>{ev.detail}</b>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <p className="note">
          Interface shown is representative. Figures are illustrative until your own site data is
          collected.
        </p>
      </div>
    </section>
  );
}
