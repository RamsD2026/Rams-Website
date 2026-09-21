"use client";

import { Head, useReveal } from "@/components/sections/hardware/hw-shared";
import { GAPS } from "./aiv-data";

/**
 * 02 — The gap.
 *
 * From the hardware copy deck §2. The showcase build this page was ported from
 * opened straight into environments and use cases: it showed what the camera
 * does before establishing why anyone needs it, which left the whole page
 * answering a question it had never asked. This is that question.
 *
 * ── Why this is not a card grid ─────────────────────────────────────
 * It was one, briefly, and it was the wrong shape for the content. Every
 * couplet here has the same structure — something happens, then you find out —
 * and the whole argument of the section is the distance between those two
 * moments. Four equal rounded boxes flatten that into a feature list and throw
 * the argument away. The page also already carries five card grids; a sixth
 * would read as more of the same rather than as the premise everything below
 * depends on.
 *
 * So the layout is the argument: one continuous orange hairline — the seam —
 * runs the full height of the four rows. Left of it is the floor as it is,
 * right of it is what the camera does, and each row puts a tick on the seam
 * where the camera intervenes. It is the only continuous structural element in
 * a section otherwise made of whitespace, which is what makes it read as a
 * single sustained claim rather than four separate ones.
 *
 * The type is deliberately inverted: the situation is large and the response is
 * small. The floor shouts; the camera answers quietly. The response earns its
 * authority from full ink contrast and a tight measure rather than from size.
 *
 * No numbers on the rows. These are four independent situations, not a
 * sequence, and numbering them would claim an order the content does not have.
 *
 * ── Motion ──────────────────────────────────────────────────────────
 * One orchestrated moment, not four. The seam draws downward on entry and the
 * rows settle behind it; nothing else on the section moves, and under
 * `prefers-reduced-motion` the seam is simply already there. `useReveal`
 * already gives us a one-shot observer, so this needs no second one.
 */
export function AivGap() {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <section className="section white" id="gap">
      <div className="wrap">
        <Head
          label="The gap"
          top="Recording is not"
          bottom="the same as knowing."
          intro="Traditional cameras are very good at keeping a record. The gap is the distance between something happening and anyone being able to act on it — and that distance is where incidents live. Four situations every floor knows, and what the camera does about each."
        />

        <div ref={ref} className={"gap-rows" + (shown ? " drawn" : "")}>
          {GAPS.map((g) => (
            <article key={g.b} className="gap-row">
              <div className="gap-situation">
                <h3>{g.b}</h3>
                <p>{g.s}</p>
              </div>
              <p className="gap-response">{g.r}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
