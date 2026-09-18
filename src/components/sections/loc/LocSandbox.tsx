"use client";

import { useState } from "react";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import { LocPlan } from "./LocPlan";
import { ORDER, SCALE_TICKS, TECH, scaleMarkPct, type TechKey } from "./loc-data";

/**
 * 03 — the accuracy sandbox. The centrepiece.
 *
 * Four tabs, one floor, one truck. The circle around the truck is the selected
 * technology's accuracy drawn to scale on 48 × 28 m of warehouse, so switching
 * from LiDAR to Wi-Fi swallows two aisles in front of you and no one has to be
 * told what "5–15 m" means. The reader can drag the truck anywhere on the floor,
 * which is the moment the picture stops being a diagram: park the Bluetooth
 * circle next to a rack and it plainly covers four of them.
 *
 * The strip underneath places the same number on a log scale from 10 mm to 15 m,
 * labelled by what it buys — which millimetre, which slot, which rack, which
 * aisle, which zone. The marker transitions between positions rather than
 * jumping, so the distance between LiDAR and Wi-Fi is felt as well as read.
 *
 * Everything shown comes from `TECH` in `loc-data.ts`, including the badge that
 * separates the one technology we run today from the three we pilot first.
 */
export function LocSandbox() {
  const [key, setKey] = useState<TechKey>("lidar");
  const [manual, setManual] = useState(false);
  /* Bumped to hand the truck back to its route; `LocPlan` owns the position. */
  const [resume, setResume] = useState(0);

  const T = TECH[key];

  return (
    <section className="section white" id="accuracy">
      <div className="wrap">
        <Head
          label="See it"
          top="How precise do you"
          bottom="actually need to be?"
          intro="Pick a technology and watch the circle around the truck. The smaller the circle, the more you can do with it — and the more kit it takes to get there."
        />

        <Reveal className="sandbox">
          <div className="sb-stage">
            <div className="sb-tabs" role="group" aria-label="Positioning technology">
              {ORDER.map((k) => (
                <button
                  key={k}
                  type="button"
                  className="sb-tab"
                  aria-pressed={key === k}
                  style={{ "--dot": TECH[k].colour } as React.CSSProperties}
                  onClick={() => setKey(k)}
                >
                  <i />
                  {TECH[k].name}
                </button>
              ))}
            </div>

            <figure className="plan-frame">
              <LocPlan
                tech={key}
                drag
                onManual={setManual}
                resumeToken={resume}
                role="img"
                label="Warehouse plan showing the accuracy circle, tags and fixed anchors for the selected technology. Drag the truck to move it."
              />
            </figure>

            <div className="sb-under">
              <span className="sb-hint">Drag the truck anywhere on the floor</span>
              {manual && (
                <button type="button" className="link sb-resume" onClick={() => setResume((n) => n + 1)}>
                  Drive again
                </button>
              )}
            </div>

            <div className="sb-legend">
              <span className="d1">Where the truck really is</span>
              <span className="d2">Where the system thinks it is</span>
              {T.infraName && (
                <span>
                  <i style={{ background: T.colour }} />
                  {T.infraName} on the walls
                </span>
              )}
            </div>
          </div>

          <aside className="sb-read" aria-live="polite">
            <span className={"badge " + (T.live ? "live" : "pilot")}>{T.badge}</span>
            <h3>{T.name}</h3>
            <p className="sub">{T.sub}</p>
            <p className="sb-acc">
              {T.accTxt}
              <small>{T.accUnit}</small>
            </p>
            <p className="sb-can">{T.can}</p>
            <ul className="sb-facts">
              <li>
                <b>Tags</b>
                <span>{T.tags}</span>
              </li>
              <li>
                <b>Fixed kit</b>
                <span>{T.infra}</span>
              </li>
              <li>
                <b>Updates</b>
                <span>{T.rate}</span>
              </li>
              <li>
                <b>Good for</b>
                <span>{T.forTxt}</span>
              </li>
            </ul>
          </aside>
        </Reveal>

        <Reveal className="scale">
          <div className="scale-bar">
            <span className="scale-mark" style={{ left: scaleMarkPct(T.acc).toFixed(1) + "%" }} />
          </div>
          <div className="scale-ticks">
            {SCALE_TICKS.map((t) => (
              <span key={t.b} style={{ left: t.left + "%" }}>
                <b>{t.b}</b>
                {t.s}
              </span>
            ))}
          </div>
        </Reveal>

        {/* The disclaimer the whole page is built around — see `loc-data.ts`. */}
        <p className="note">
          LiDAR is the sensor we run today, quoted at its ±10 mm accuracy. The UWB, Bluetooth and
          Wi-Fi figures are typical industry ranges, not RAMS measurements. Indoor accuracy depends
          on the building, the racking and the survey — we commit to numbers only after a site
          survey and a pilot.
        </p>
      </div>
    </section>
  );
}
