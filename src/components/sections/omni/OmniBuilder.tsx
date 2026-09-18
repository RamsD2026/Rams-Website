"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Head, Reveal } from "@/components/sections/hardware/hw-shared";
import {
  ACT, BOX_META, ICON, NOTICE, ORDER, PLACES,
  type ModelKey, type Opt,
} from "./omni-data";

/**
 * 04 — Build your setup.
 *
 * Three questions — where it works, what it should notice, what should happen —
 * and a live panel that names the Omnibox (or Omniboxes) that answer them,
 * draws the kit around each one, and composes an email you can send.
 *
 * ── The three rules that make it feel like it understands you ───────
 * 1. **Questions 2 and 3 only offer what fits question 1.** Options carry the
 *    places they apply to, and anything that stops applying is *dropped from
 *    the answer*, not just hidden — otherwise unpicking "Forklifts" would leave
 *    an invisible "impacts" still driving the recommendation.
 * 2. **The recommendation can be more than one box.** Safety on a line plus a
 *    quality check is Edge *and* AI, and the reference is deliberate about
 *    that: `Omnibox Edge + AI`, two hubs, two rows in the kit.
 * 3. **The kit is derived, never listed.** `kit()` reads the actual answers, so
 *    picking "missing PPE" changes the camera's label, and picking nothing
 *    still yields a sensible default. The `edge` flag stops AI claiming the
 *    stop signal when Edge is already in the setup and owns it.
 *
 * ── The wires ───────────────────────────────────────────────────────
 * Each chip is joined to the box by a curve computed from the two elements'
 * real rectangles, so the wire leaves whichever side faces the box — sideways
 * on a wide screen, vertically once the hub stacks on a phone. That is measured
 * after layout and on resize, and it is why this is a DOM effect rather than
 * static SVG.
 */

type Group = "place" | "notice" | "act";
type Picks = Record<Group, Record<string, boolean>>;

const EMPTY: Picks = { place: {}, notice: {}, act: {} };
const byId = (list: Opt[], id: string) => list.find((o) => o.id === id);
const listText = (a: string[]) =>
  a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];

type KitItem = { k: string; l: string; ghost?: boolean };

/* Declared at module level, not inside the component: a component created
   during render is a new type on every pass, so React remounts its whole
   subtree and any focus or animation state in it is lost. */

const Icon = ({ name }: { name: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d={ICON[name]} />
  </svg>
);

const Option = ({
  o, pressed, onPick, big,
}: {
  o: Opt;
  pressed: boolean;
  onPick: () => void;
  big?: boolean;
}) => (
  <button type="button" className="b-opt" aria-pressed={pressed} onClick={onPick}>
    <Icon name={o.icon} />
    {big ? (
      <span>
        <b>{o.label}</b>
        <span>{o.hint}</span>
      </span>
    ) : (
      <span>{o.label}</span>
    )}
  </button>
);

/** One box with what it listens to on the left and what it acts on the right. */
const Hub = ({ box, k }: { box: ModelKey | null; k: { i: KitItem[]; o: KitItem[] } }) => (
  <div className="hub">
    <svg className="hub-wires" aria-hidden />
    <div className="hub-col hub-in">
      {k.i.map((x) => (
        <span key={x.k} className={"hchip" + (x.ghost ? " ghost" : "")} data-dir="in">
          <i />
          {x.l}
        </span>
      ))}
    </div>
    {box ? (
      <div className="hub-box">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BOX_META[box].img} alt="" />
        <b>{BOX_META[box].name}</b>
      </div>
    ) : (
      <div className="hub-box empty">Your Omnibox</div>
    )}
    <div className="hub-col hub-out">
      {k.o.map((x) => (
        <span key={x.k} className={"hchip" + (x.ghost ? " ghost" : "")} data-dir="out">
          <i />
          {x.l}
        </span>
      ))}
    </div>
  </div>
);

export function OmniBuilder({
  onOpen,
  onInside,
}: {
  onOpen: (key: ModelKey) => void;
  onInside: (key: ModelKey, view?: "inside" | "connect") => void;
}) {
  const [picks, setPicks] = useState<Picks>(EMPTY);
  const [qty, setQty] = useState<Record<string, number>>({});
  const diagramRef = useRef<HTMLDivElement>(null);

  const anyPlace = Object.keys(picks.place).length > 0;
  const applies = useCallback(
    (o: Opt) => (o.places ?? []).some((p) => picks.place[p]),
    [picks.place],
  );

  const toggle = (g: Group, id: string) => {
    setPicks((prev) => {
      const next: Picks = {
        place: { ...prev.place },
        notice: { ...prev.notice },
        act: { ...prev.act },
      };
      if (next[g][id]) delete next[g][id];
      else next[g][id] = true;

      // Rule 1: an answer that no longer fits the chosen places is removed,
      // not merely hidden, or it would keep steering the recommendation.
      if (g === "place") {
        for (const [group, list] of [["notice", NOTICE], ["act", ACT]] as const) {
          for (const key of Object.keys(next[group])) {
            const opt = byId(list, key);
            if (!opt || !(opt.places ?? []).some((p) => next.place[p])) delete next[group][key];
          }
        }
      }
      return next;
    });
  };

  /* ── the recommendation ───────────────────────────────── */
  const boxes = useMemo<ModelKey[]>(() => {
    const P = picks.place, N = picks.notice, A = picks.act;
    if (N.custom) return ["core"];
    const out: Partial<Record<ModelKey, boolean>> = {};
    if (P.cell || P.zone || P.line) {
      const aiNeed = N.defect || N.count || N.tool || A.reject;
      const safety = N.person || N.ppe;
      if (!aiNeed && !safety) {
        if (P.cell || P.zone) out.edge = true;
        if (P.line) out.ai = true;
      } else {
        if (safety) out.edge = true;
        if (aiNeed) out.ai = true;
      }
    }
    if (P.forklift) out.motion = true;
    if (P.other) out.core = true;
    return ORDER.filter((k) => out[k]);
  }, [picks]);

  const kit = useCallback(
    (box: ModelKey): { i: KitItem[]; o: KitItem[] } => {
      const N = picks.notice, A = picks.act;
      const i: KitItem[] = [], o: KitItem[] = [];
      const hasEdge = boxes.includes("edge");
      if (box === "edge") {
        i.push({ k: "cam", l: N.person && N.ppe ? "RAMS AI Camera · people + PPE" : N.ppe ? "RAMS AI Camera · PPE" : "RAMS AI Camera" });
        if (A.stop) o.push({ k: "stop", l: "Machine stop" });
        if (A.door) o.push({ k: "door", l: "Door or gate hold" });
        if (A.alarm) o.push({ k: "alarm", l: "Alarm light" });
        if (!o.length) o.push({ k: "outs", l: "Two outputs" });
      } else if (box === "ai") {
        if (N.defect) i.push({ k: "def", l: "Camera · defects" });
        if (N.count) i.push({ k: "cnt", l: "Camera · part count" });
        if (N.tool) i.push({ k: "tool", l: "Camera · tools & clamps" });
        if (!i.length) i.push({ k: "icam", l: "Inspection camera" });
        if (A.reject) o.push({ k: "rej", l: "Reject signal" });
        // Edge owns the stop and the alarm when it is in the setup.
        if (!hasEdge && A.stop) o.push({ k: "stop", l: "Line stop" });
        if (!hasEdge && A.alarm) o.push({ k: "alarm", l: "Stack light" });
        if (!o.length) o.push({ k: "sig", l: "Signals to the line" });
      } else if (box === "motion") {
        if (N.near) i.push({ k: "lidar", l: "4D LiDAR" });
        if (N.blind) { i.push({ k: "c360", l: "360° cameras" }); i.push({ k: "fork", l: "Fork camera" }); }
        if (N.impact) i.push({ k: "imp", l: "Impact sensors" });
        if (N.load) i.push({ k: "wt", l: "Weight sensor" });
        if (N.speed) i.push({ k: "spd", l: "Speed sensor" });
        if (N.driver) i.push({ k: "acc", l: "Access controller" });
        if (!i.length) i.push({ k: "sens", l: "Cameras & sensors" });
        o.push({ k: "disp", l: "Driver display" });
      } else {
        i.push({ k: "csen", l: N.custom ? "Your unusual signal" : "Your sensors" });
        o.push({ k: "cout", l: "Your outputs" });
      }
      if (A.record) o.push({ k: "log", l: "Event record" });
      if (A.alert) o.push({ k: "sup", l: "Supervisor alert" });
      return { i, o };
    },
    [picks, boxes],
  );

  const shorts = (list: Opt[], group: Group, ids: string[]) =>
    ids.filter((k) => picks[group][k]).map((k) => byId(list, k)!.short!);

  const why = (box: ModelKey) => {
    if (box === "edge") {
      const n = shorts(NOTICE, "notice", ["person", "ppe"]);
      const a = shorts(ACT, "act", ["stop", "door", "alarm"]);
      return `<b>Omnibox Edge</b>: RAMS AI Cameras watch for ${n.length ? listText(n) : "people in the zone"}, and the box can ${a.length ? listText(a) : "stop a machine or sound an alarm"} the moment it happens.`;
    }
    if (box === "ai") {
      const n = shorts(NOTICE, "notice", ["defect", "count", "tool"]);
      const a = shorts(ACT, "act", boxes.includes("edge") ? ["reject"] : ["reject", "stop", "alarm"]);
      return `<b>Omnibox AI</b>: AI trained on your own line checks ${n.length ? listText(n) : "your parts and process"}${a.length ? ", and can " + listText(a) : ""}.`;
    }
    if (box === "motion") {
      const n = shorts(NOTICE, "notice", ["near", "blind", "impact", "load", "speed", "driver"]);
      return `<b>Omnibox Motion</b>: one box on each truck keeps track of ${n.length ? listText(n) : "everything around it"}, and powers every camera, sensor and display — the full RAMS 2.0 kit.`;
    }
    return `<b>Omnibox Core</b>: ${picks.notice.custom ? "you need something no standard box covers" : "the job doesn’t fit a standard box"}, so we design one around it.`;
  };

  const title = boxes.length
    ? boxes.length === 1
      ? BOX_META[boxes[0]].name
      : "Omnibox " + boxes.map((b) => BOX_META[b].short).join(" + ")
    : "Your Omnibox appears here.";

  const names = (list: Opt[], g: Group) =>
    list.filter((o) => picks[g][o.id]).map((o) => o.label).join(", ");

  const mailHref = useMemo(() => {
    if (!boxes.length) return "mailto:connect@rams.digital";
    const lines = boxes.map((b) => {
      const k = kit(b);
      const q = qty[b] ?? 1;
      return `- ${q} × ${BOX_META[b].name} (${q} ${q === 1 ? BOX_META[b].unit : BOX_META[b].units}): ${[...k.i, ...k.o].map((x) => x.l).join(", ")}`;
    });
    const body =
      `Hi RAMS Digital,\n\nI put this setup together on the Omnibox page.\n\nWhere: ${names(PLACES, "place")}` +
      `\nIt should notice: ${names(NOTICE, "notice") || "-"}\nThen: ${names(ACT, "act") || "-"}` +
      `\n\nSuggested kit:\n${lines.join("\n")}\n\nCould you get in touch about it?\n`;
    return `mailto:connect@rams.digital?subject=${encodeURIComponent("Omnibox setup: " + title)}&body=${encodeURIComponent(body)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boxes, kit, qty, picks, title]);

  /* ── the wires ────────────────────────────────────────── */
  const drawWires = useCallback(() => {
    const root = diagramRef.current;
    if (!root) return;
    const clampN = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
    root.querySelectorAll<HTMLElement>(".hub").forEach((h) => {
      const svg = h.querySelector("svg");
      const boxEl = h.querySelector<HTMLElement>(".hub-box");
      if (!svg || !boxEl) return;
      const hr = h.getBoundingClientRect();
      const bx = boxEl.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${hr.width.toFixed(1)} ${hr.height.toFixed(1)}`);
      const bl = bx.left - hr.left, bt = bx.top - hr.top;
      const br = bl + bx.width, bb = bt + bx.height;
      let d = "";
      h.querySelectorAll<HTMLElement>(".hchip").forEach((c) => {
        const r = c.getBoundingClientRect();
        const l = r.left - hr.left, t = r.top - hr.top;
        const rr = l + r.width, rb = t + r.height;
        const cx = (l + rr) / 2, cy = (t + rb) / 2;
        let p: string, m: number, e: number;
        if (rr <= bl + 1) { e = clampN(cy, bt + 16, bb - 16); m = (rr + bl) / 2; p = `M${rr} ${cy}C${m} ${cy} ${m} ${e} ${bl} ${e}`; }
        else if (l >= br - 1) { e = clampN(cy, bt + 16, bb - 16); m = (l + br) / 2; p = `M${l} ${cy}C${m} ${cy} ${m} ${e} ${br} ${e}`; }
        else if (rb <= bt + 1) { e = clampN(cx, bl + 16, br - 16); m = (rb + bt) / 2; p = `M${cx} ${rb}C${cx} ${m} ${e} ${m} ${e} ${bt}`; }
        else { e = clampN(cx, bl + 16, br - 16); m = (t + bb) / 2; p = `M${cx} ${t}C${cx} ${m} ${e} ${m} ${e} ${bb}`; }
        const cls = c.classList.contains("ghost") ? "w-ghost" : "w-" + c.getAttribute("data-dir");
        d += `<path class="${cls}" d="${p}"/>`;
      });
      svg.innerHTML = d;
    });
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(drawWires);
    const late = window.setTimeout(drawWires, 480);
    window.addEventListener("resize", drawWires, { passive: true });
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(late);
      window.removeEventListener("resize", drawWires);
    };
  }, [drawWires, boxes, picks, qty]);

  const c3 = boxes.find((b) => b === "motion" || b === "edge");

  return (
    <section className="section white" id="choose">
      <div className="wrap">
        <Head
          label="Find your Omnibox"
          top="Build your setup."
          intro="Three quick questions. Watch your setup come together as you pick, then send it to us."
        />

        <div className="builder">
          <div className="b-steps">
            <Reveal as="div">
              <fieldset className="b-step">
                <legend>
                  <span className="b-n">1</span>Where will it work?<small>Pick all that apply</small>
                </legend>
                <div className="b-opts big">
                  {PLACES.map((o) => (
                    <Option key={o.id} o={o} pressed={!!picks.place[o.id]} onPick={() => toggle("place", o.id)} big />
                  ))}
                </div>
              </fieldset>
            </Reveal>

            {([["notice", NOTICE, "What should it notice?", "2"], ["act", ACT, "What should happen then?", "3"]] as const).map(
              ([g, list, legend, n]) => (
                <Reveal as="div" key={g}>
                  <fieldset className="b-step" disabled={!anyPlace}>
                    <legend>
                      <span className="b-n">{n}</span>
                      {legend}
                      <small>Pick all that apply</small>
                    </legend>
                    <div className="b-opts">
                      {list.filter(applies).map((o) => (
                        <Option key={o.id} o={o} pressed={!!picks[g][o.id]} onPick={() => toggle(g, o.id)} />
                      ))}
                    </div>
                    <p className="b-empty">Choose where it will work first.</p>
                  </fieldset>
                </Reveal>
              ),
            )}
          </div>

          <Reveal className="b-result" delay={80}>
            <div className="b-panel">
              <div className="b-top">
                <span className="label">Your setup</span>
                {anyPlace && (
                  <button
                    type="button"
                    className="link"
                    onClick={() => {
                      setPicks(EMPTY);
                      setQty({});
                    }}
                  >
                    Start over
                  </button>
                )}
              </div>

              <h3>{title}</h3>

              <div className="b-diagram" ref={diagramRef}>
                {boxes.length ? (
                  boxes.map((b) => <Hub key={b} box={b} k={kit(b)} />)
                ) : (
                  <Hub
                    box={null}
                    k={{ i: [{ k: "g1", l: "What it notices", ghost: true }], o: [{ k: "g2", l: "What it does", ghost: true }] }}
                  />
                )}
              </div>

              {boxes.length ? (
                <p
                  className="b-why"
                  aria-live="polite"
                  // The copy interleaves bold model names into a sentence built
                  // at run time; the strings are this file's own, never input.
                  dangerouslySetInnerHTML={{
                    __html:
                      boxes.map(why).join(" ") +
                      (picks.act.record || picks.act.alert
                        ? " Every event also goes to the <b>RAMS Digital Twin</b>."
                        : ""),
                  }}
                />
              ) : (
                <p className="b-why" aria-live="polite">
                  Tell us where it will work to get started.
                </p>
              )}

              {boxes.length > 0 && (
                <>
                  <div className="b-kit">
                    {boxes.map((b) => {
                      const k = kit(b);
                      const q = qty[b] ?? 1;
                      return (
                        <div className="kit-row" key={b}>
                          <div className="kname">
                            <b>{BOX_META[b].name}</b>
                            <span>
                              {[...k.i, ...k.o].map((x) => x.l).join(", ")} · per {BOX_META[b].unit}
                            </span>
                          </div>
                          <div className="kqty">
                            <div className="stepper" role="group" aria-label={`How many ${BOX_META[b].units}`}>
                              <button
                                type="button"
                                aria-label="Fewer"
                                onClick={() => setQty((p) => ({ ...p, [b]: Math.max(1, (p[b] ?? 1) - 1) }))}
                              >
                                −
                              </button>
                              <output aria-live="polite">{q}</output>
                              <button
                                type="button"
                                aria-label="More"
                                onClick={() => setQty((p) => ({ ...p, [b]: Math.min(99, (p[b] ?? 1) + 1) }))}
                              >
                                +
                              </button>
                            </div>
                            <small>{BOX_META[b].units}</small>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="b-cta">
                    <a className="btn btn-primary btn-sm" href={mailHref}>
                      Email this setup
                    </a>
                    {c3 && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => onInside(c3, "connect")}
                      >
                        See it connected in 3D
                      </button>
                    )}
                    <button type="button" className="link" onClick={() => onOpen(boxes[0])}>
                      Learn more about {BOX_META[boxes[0]].short}
                    </button>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
