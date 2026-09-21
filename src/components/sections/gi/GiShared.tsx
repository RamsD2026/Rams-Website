"use client";

import { STAGE, RAIL, type MachineKey } from "./gi-data";

/**
 * The two pieces that carry the page's honesty rule, used in six places between
 * them: the cards, the sheets, the compare table, the chooser result, the "where
 * we are today" tiles and the film's own tags.
 *
 * Both read `STAGE` in `gi-data.ts` and nothing else, so moving a machine from
 * Concept to Prototype is one edit and every badge and rail on the page follows.
 * That is the reference's own design, and it is the reason no mention of either
 * machine anywhere can quietly lose its badge.
 */

/** The Concept / Prototype / Pilot / Available pill. */
export function StageBadge({ machine }: { machine: MachineKey }) {
  return <span className="badge">{STAGE[machine].badge}</span>;
}

/** The four-step rail, with the step it has reached lit. */
export function StageRail({ machine }: { machine: MachineKey }) {
  const at = STAGE[machine].stage;
  return (
    <ul className="rail" aria-label={`${machine} stage: ${STAGE[machine].badge}`}>
      {RAIL.map((step, i) => (
        <li key={step} className={i === at ? "on" : undefined}>
          {step}
        </li>
      ))}
    </ul>
  );
}
