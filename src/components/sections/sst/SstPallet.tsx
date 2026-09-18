"use client";

import { useEffect, useRef, useState } from "react";
import { Head, Media, Reveal } from "@/components/sections/hardware/hw-shared";
import { IMG } from "./sst-data";

/**
 * 06 — Pallet Detection.
 *
 * A side view of the fork carriage with the sensor on it, drawn as SVG rather
 * than filmed: the whole point is the pair of beams, and beams are the one thing
 * a photograph of an infrared sensor cannot show. A pallet slides on and off the
 * forks; with it there the beams stop short and turn green, without it they run
 * away down the aisle as grey dashes. The chip in the corner reads the state the
 * truck would record.
 *
 * It cycles on its own every 3.2 seconds while on screen, because a reader who
 * does not press the button should still see both states. The first deliberate
 * press stops the cycle for good — once someone is driving it, taking it back
 * from them is worse than not animating at all.
 */
export function SstPallet() {
  const [empty, setEmpty] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let iv = 0;
    const io = new IntersectionObserver(([en]) => {
      clearInterval(iv);
      if (en.isIntersecting && autoRef.current) {
        iv = window.setInterval(() => setEmpty((v) => !v), 3200);
      }
    });
    io.observe(el);
    return () => {
      clearInterval(iv);
      io.disconnect();
    };
  }, []);

  return (
    <section className="section" id="pallet">
      <div className="wrap">
        <Head
          label="Pallet Detection"
          top="Loaded or empty."
          bottom="Every lift."
          intro="A small box on the fork carriage looks ahead with two sensing heads. The moment a pallet sits on the forks, the truck knows — and so does everything it records."
        />

        <div className="pds">
          <Reveal className={"pds-anim" + (empty ? " empty" : "")}>
            <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
              <svg
                viewBox="0 0 800 600"
                role="img"
                aria-label="Side view of a fork carriage with the pallet sensor on it. A pallet slides onto the forks and the sensor's beams stop short at the load."
              >
                <defs>
                  <linearGradient id="sstMast" x1="0" x2="1">
                    <stop offset="0" stopColor="#2b2c30" />
                    <stop offset="1" stopColor="#18191c" />
                  </linearGradient>
                </defs>

                {/* floor, mast, carriage, forks */}
                <rect x="0" y="520" width="800" height="80" fill="#DADAE0" />
                <rect x="118" y="60" width="46" height="460" rx="4" fill="url(#sstMast)" />
                <rect x="164" y="236" width="30" height="244" rx="3" fill="#2d2e33" />
                <rect x="176" y="462" width="470" height="16" rx="3" fill="#3a3b40" />
                <rect x="176" y="286" width="16" height="190" fill="#3a3b40" />

                {/* the sensor itself, with its two heads and two lenses */}
                <g>
                  <rect x="194" y="248" width="86" height="54" rx="7" fill="#141416" />
                  <rect x="204" y="244" width="30" height="10" rx="4" fill="#0b0b0c" />
                  <rect x="242" y="244" width="30" height="10" rx="4" fill="#0b0b0c" />
                  <text x="237" y="284" fill="#34353a" fontWeight="700" fontStyle="italic" fontSize="11" textAnchor="middle">
                    RAMS Digital
                  </text>
                  <circle cx="282" cy="264" r="4" fill="#FF9B4D" />
                  <circle cx="282" cy="286" r="4" fill="#FF9B4D" />
                </g>

                {/* beams that land on a pallet … */}
                <g className="beam hit">
                  <path d="M286 264L336 250M286 264L336 278" stroke="#30D158" strokeWidth="3" strokeLinecap="round" opacity=".9" />
                  <path d="M286 286L336 300M286 286L336 272" stroke="#30D158" strokeWidth="3" strokeLinecap="round" opacity=".9" />
                  <circle cx="336" cy="264" r="7" fill="#30D158" opacity=".35" />
                  <circle cx="336" cy="286" r="7" fill="#30D158" opacity=".35" />
                </g>
                {/* … and beams that find nothing */}
                <g className="beam miss">
                  <path d="M286 264L760 190M286 264L760 338" stroke="#8E8E93" strokeWidth="2" strokeDasharray="6 8" opacity=".6" />
                  <path d="M286 286L760 238M286 286L760 360" stroke="#8E8E93" strokeWidth="2" strokeDasharray="6 8" opacity=".35" />
                </g>

                {/* the pallet and its load, which slide out of frame when empty */}
                <g className="pal">
                  <rect x="336" y="478" width="300" height="12" fill="#b9895a" />
                  <rect x="336" y="500" width="300" height="12" fill="#a97a4c" />
                  <rect x="344" y="488" width="30" height="14" fill="#9c6f43" />
                  <rect x="471" y="488" width="30" height="14" fill="#9c6f43" />
                  <rect x="598" y="488" width="30" height="14" fill="#9c6f43" />
                  <rect x="340" y="370" width="140" height="108" fill="#d8b98c" />
                  <rect x="484" y="370" width="148" height="108" fill="#cdab7c" />
                  <rect x="340" y="262" width="292" height="104" fill="#dcc096" />
                  <rect x="340" y="262" width="292" height="216" fill="none" stroke="#b5946a" strokeWidth="2" />
                </g>
              </svg>

              <span className="pds-chip" aria-live="polite">
                <i />
                <span>{empty ? "Forks empty" : "Pallet on forks"}</span>
              </span>
              <button
                type="button"
                className="pds-toggle"
                onClick={() => {
                  autoRef.current = false;
                  setEmpty((v) => !v);
                }}
              >
                {empty ? "Put a pallet on" : "Take the pallet off"}
              </button>
            </div>
          </Reveal>

          <div className="pds-side">
            <Reveal>
              <Media src={IMG.pds} alt="RAMS Pallet Detection Sensor" label={IMG.pds} className="contain" tone="light" />
            </Reveal>
            <Reveal className="tile">
              <span className="label">What it adds</span>
              <h3>Every event knows the load.</h3>
              <ul className="checks">
                <li>Picks and drops counted, per truck and per operator</li>
                <li>Empty travel and loaded travel told apart</li>
                <li>An impact with a load on reads differently from one without</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
