"use client";

import { Head, Reveal } from "./aiv-shared";
import { EDGE } from "./aiv-data";

/**
 * 06 — Intelligence at the edge.
 *
 * From the hardware copy deck §5, and the one section here that exists because
 * of a fallback path rather than a content gap.
 *
 * The film already argues this as its third chapter ("What it decides —
 * Intelligence at the edge"). But the film is a fixed layer that stands down
 * whenever WebGL2 is missing or the GLB fails, and the static hero that
 * replaces it carries none of the chapter copy. Without this section the whole
 * edge argument — the reason the camera works when the network doesn't —
 * disappears on exactly the low-end hardware most likely to be browsing from a
 * warehouse office.
 *
 * It sits after `AivHow` on purpose: How explains what the camera does, this
 * explains why it can do it without asking anything of your network.
 */
export function AivEdge() {
  return (
    <section className="section dark" id="edge">
      <div className="wrap">
        <Head
          center
          label="At the edge"
          top="Safety can't wait"
          bottom="on your Wi-Fi."
          intro="Operational safety cannot depend on a distant server and a perfect signal. Every decision is made on the camera itself; the network is for reporting afterwards, and losing it costs you the analytics, never the detection."
        />

        <div className="edge-grid">
          {EDGE.map((e, i) => (
            <Reveal key={e.b} className="edge-card" delay={i * 80}>
              <span className="edge-n">{String(i + 1).padStart(2, "0")}</span>
              <h3>{e.b}</h3>
              <p>{e.s}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
