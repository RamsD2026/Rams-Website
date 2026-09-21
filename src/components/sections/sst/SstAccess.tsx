"use client";

import { useEffect, useRef, useState } from "react";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import { ACCESS_SPECS, ACCESS_STEPS, DEMO_PIN } from "./sst-data";

/**
 * 05 — Access Control, as a thing you can actually use.
 *
 * A CSS replica of the unit's blue faceplate — RFID symbol, fingerprint ring,
 * 12-key pad, cable glands — wired to the same three-step sequence the real one
 * runs: **Identify → Authenticate → Authorise**, ending in the key circuit
 * closing or staying open. Tap the RFID, press the ring, or type the PIN and
 * press `#`.
 *
 * It is a replica rather than a photograph because the argument is a sequence,
 * not an object: what matters is that nothing happens until a known operator
 * identifies themselves, and you cannot show "nothing happens" with a still.
 * The photograph of the real unit is one section up, and in its sheet.
 *
 * ── It is a demo, and says so ───────────────────────────────────────
 * The enrolled card, the enrolled finger and the PIN are made up for this page.
 * "Unknown card" is there to show the denial path, which is the half of the
 * story a product page usually leaves out. Nothing is sent anywhere, no reader
 * exists, and no credential from the supplied manual appears here — see the
 * head of `sst-data.ts`.
 *
 * The specs under it (12–24 V DC, 30 A relay, 12–80 V key-on sense) are from
 * the manual and are real.
 */

type StepCls = "" | "on" | "ok" | "no";

const DEFAULTS = ACCESS_STEPS.map((s) => s.s) as [string, string, string];

export function SstAccess() {
  const [cls, setCls] = useState<[StepCls, StepCls, StepCls]>(["", "", ""]);
  const [txt, setTxt] = useState<[string, string, string]>([...DEFAULTS]);
  const [ign, setIgn] = useState({ cls: "", b: "Truck locked", s: "Waiting for an operator." });
  const [finger, setFinger] = useState("");
  const [pin, setPin] = useState("");

  const busy = useRef(false);
  const timers = useRef<number[]>([]);
  const rfidRef = useRef<HTMLButtonElement>(null);
  const pinRef = useRef("");

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const reset = () => {
    setCls(["", "", ""]);
    setTxt([...DEFAULTS]);
    setIgn({ cls: "", b: "Truck locked", s: "Waiting for an operator." });
    setFinger("");
    setPin("");
    pinRef.current = "";
    busy.current = false;
  };

  /**
   * One run through the three steps. `still` collapses the timing to nothing
   * under reduced motion — the states still change, they just do not stage
   * themselves.
   */
  const run = (method: string, ok: boolean) => {
    if (busy.current) return;
    busy.current = true;
    clearTimers();
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = still ? 0 : 1;

    setCls(["on", "", ""]);
    setTxt([method + " presented.", DEFAULTS[1], DEFAULTS[2]]);

    later(() => {
      setCls(["on", "on", ""]);
      setTxt((p) => [p[0], ok ? "Matched an enrolled operator." : "No enrolled operator matches.", p[2]]);

      later(() => {
        const end: StepCls = ok ? "ok" : "no";
        setCls(["on", end, end]);
        setTxt((p) => [p[0], p[1], ok ? "Key circuit closed." : "Key circuit stays open."]);
        setIgn({
          cls: ok ? "on" : "no",
          b: ok ? "Truck enabled" : "Access denied",
          s: ok
            ? "Operator verified by " + method.toLowerCase() + ". The key will now start the truck."
            : "Turning the key does nothing.",
        });
        if (method === "Fingerprint") setFinger(ok ? "ok" : "no");
        busy.current = false;
        later(reset, ok ? 6500 : 4000);
      }, 500 * t + 60);
    }, 450 * t + 40);
  };

  const tapCard = (ok = true) => {
    // Restart the CSS pulse even if it is already running — the reference's own
    // remove/reflow/add, which has no React equivalent.
    const el = rfidRef.current;
    if (el && ok) {
      el.classList.remove("hit");
      void el.offsetWidth;
      el.classList.add("hit");
    }
    run("RFID card", ok);
  };

  const tapFinger = () => {
    setFinger("hit");
    run("Fingerprint", true);
  };

  const key = (k: string) => {
    if (busy.current) return;
    if (k === "*") {
      pinRef.current = "";
      setPin("");
      setTxt((p) => [DEFAULTS[0], p[1], p[2]]);
      setCls((c) => ["", c[1], c[2]]);
      return;
    }
    if (k === "#") {
      if (pinRef.current.length === 4) run("PIN", pinRef.current === DEMO_PIN);
      else {
        setCls((c) => ["on", c[1], c[2]]);
        setTxt((p) => ["A PIN is four digits.", p[1], p[2]]);
      }
      return;
    }
    const next = (pinRef.current.length >= 4 ? "" : pinRef.current) + k;
    pinRef.current = next;
    setPin(next);
    clearTimers();
    setCls((c) => ["on", c[1], c[2]]);
    setTxt((p) => ["PIN " + "●".repeat(next.length) + "○".repeat(4 - next.length), p[1], p[2]]);
    // Four digits entered: accept it without waiting for `#`, but leave a beat
    // so the last dot is seen.
    if (next.length === 4) later(() => {
      if (pinRef.current.length === 4) run("PIN", pinRef.current === DEMO_PIN);
    }, 350);
  };

  return (
    <section className="section white" id="access">
      <div className="wrap">
        <Head
          label="Access Control"
          top="Card, PIN or finger."
          bottom="Then it starts."
          intro="The unit sits in the truck’s key circuit. Until an enrolled operator identifies themselves, turning the key does nothing. Try it."
        />

        <div className="acc">
          <Reveal className="acc-dev">
            <div className="acc-plate">
              <div className="face">
                <h4>ACCESS CONTROL</h4>
                <div className="lft">
                  <span className="brand" aria-hidden>
                    <i />
                    RAMS
                  </span>
                  <button
                    type="button"
                    className="rfid"
                    ref={rfidRef}
                    onClick={() => tapCard(true)}
                    aria-label="Tap an enrolled RFID card"
                  >
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={5} aria-hidden>
                      <rect x="8" y="8" width="84" height="84" rx="12" />
                      <path d="M40 44a10 10 0 0 1 10-10M36 36a22 22 0 0 1 22-10M32 28a34 34 0 0 1 34-10" transform="translate(4 8)" />
                      <circle cx="44" cy="52" r="5" />
                      <text x="50" y="84" fill="currentColor" stroke="none" fontWeight="800" fontSize="24" textAnchor="middle">
                        RFID
                      </text>
                    </svg>
                  </button>
                </div>
                <div className="keys">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => key(k)}
                      aria-label={k === "*" ? "Clear" : k === "#" ? "Enter" : k}
                    >
                      {k === "*" ? "∗" : k}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className={"finger " + finger}
                onClick={tapFinger}
                aria-label="Place an enrolled finger on the reader"
              />
              <div className="glands" aria-hidden>
                <i />
                <i />
              </div>
            </div>
            <span className="hint">Tap the RFID symbol, press the fingerprint ring, or type {DEMO_PIN} then #.</span>
          </Reveal>

          <Reveal className="acc-panel" delay={80}>
            <span className="label">What happens</span>
            <ol className="acc-steps">
              {ACCESS_STEPS.map((s, i) => (
                <li key={s.b} className={cls[i]}>
                  <i>{i + 1}</i>
                  <div>
                    <b>{s.b}</b>
                    <span>{txt[i]}</span>
                  </div>
                </li>
              ))}
            </ol>

            <div className="acc-try">
              <button type="button" onClick={() => tapCard(true)}>
                Enrolled card
              </button>
              <button type="button" onClick={tapFinger}>
                Enrolled finger
              </button>
              <button type="button" onClick={() => run("RFID card", false)}>
                Unknown card
              </button>
            </div>

            <div className={"ign " + ign.cls} aria-live="polite">
              <span className="key" aria-hidden>
                <svg viewBox="0 0 24 24">
                  <circle cx="8" cy="12" r="4" />
                  <path d="M12 12h9M18 12v3M21 12v2" />
                </svg>
              </span>
              <div>
                <b>{ign.b}</b>
                <span>{ign.s}</span>
              </div>
            </div>
            {/* `pin` is state only so the keypad re-renders; the run reads the
                ref, which is always current inside a timeout. */}
            <span hidden>{pin}</span>
          </Reveal>
        </div>

        <div className="specrow">
          {ACCESS_SPECS.map((s, i) => (
            <Reveal key={s.b} delay={i * 60}>
              <b>{s.b}</b>
              <span>{s.s}</span>
            </Reveal>
          ))}
        </div>

        <p className="note">
          Operators are enrolled, viewed, imported and exported from a phone or laptop over the
          unit’s own Wi-Fi — no site network or internet needed. Pre-drilled mounting holes and a
          power switch on the side.
        </p>
      </div>
    </section>
  );
}
