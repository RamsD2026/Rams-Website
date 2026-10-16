# Solutions hero animations — prompts

Prompts for the animated "live product screen" in the hero of each Solutions page.
They are **reverse-engineered from the code** (the original prompts were not kept), so
they describe each animation precisely enough to rebuild it or make a matching one.

**How to use:** paste the **Shared base** first, then the page's prompt. Swap the
quoted data for your own and say whether it is real or "sample data". Add a
**Keep:** line for anything that must not change (e.g. "Keep the existing hero text
and buttons; only build the screen").

| Page | Component |
|---|---|
| Rack Safety Intelligence | `src/components/sections/irds/IrdsHero.tsx` |
| Inventory Intelligence | `src/components/sections/inv/InvHero.tsx` |
| MHE Safety & Productivity | `src/components/sections/mhe/MheHero.tsx` |
| Warehouse Execution | `src/components/sections/wex/WexHero.tsx` |
| MHE Diagnostics | `src/components/sections/dia/DiaHero.tsx` (+ `DiaFleetMap.tsx`) |
| Management Intelligence | `src/components/sections/aims/AimsHero.tsx` (+ `AimsSiteMap.tsx`) |

---

## Shared base (paste first)

> Build an animated "live product screen" for a hero section, in React + Tailwind +
> **Framer Motion + inline SVG only** (no video, images, canvas or 3D).
> Dark radial background #1D1D1F → #08080A with a soft orange glow and a faint 72px
> grid at 6% opacity. The screen sits in a frame (max 1240px wide, 28px radius,
> 14px padding) with an inner 18px-radius "screen" (#0A0F14 → #06090C).
> Entrance: frame fades/rises in (opacity 0→1, y 60→0, scale 0.97→1, 1.1s, 0.5s
> delay, ease [0.22,1,0.36,1]); headline fades up first.
> Accent orange #FF6A00. Status colours: green #54DE91/#2BCB74, amber #FFBE47,
> red #FF6C6C/#FF4D4D, blue #77BDFF. Small mono uppercase labels; KPIs as pills.
> Mobile: panels stack, the screen gets a min height (~600px) instead of a fixed
> ratio, SVG scales to fit, text readable at 375px width. Respect
> prefers-reduced-motion.

---

## 1. Rack Safety Intelligence — "Rack Twin"

> Hero eyebrow "Rack Safety Intelligence".
> Header: "Rack Twin · Pune DC", title "Aisle B — inspection live", green LIVE pill.
> KPIs: Rack Health 91% (orange) · Open Findings 14 · Critical 2.
> **Left panel "Rack Elevation · Aisle B-04":** SVG side view, 5 uprights × 3 beam
> levels, faint pallet boxes; uprights/beams/baseplates coloured red/amber/grey by
> condition with glow on damaged parts. Legend Red / Amber / Green.
> **Right panel "Findings Feed":** 8 findings (ID · location · status · note, e.g.
> "F-40218 · B-04 · U-B18 · critical · beam lock") scrolling up in a seamless loop,
> "Streaming" dot.
> **Animation:** orange scan band sweeps left→right (4.5s, loop, 0.6s pause); red
> pulse ring on the critical beam (2.4s loop); alert bar "Critical · B-04 · U-B18 —
> beam lock failure" fades in at 1s; feed scrolls continuously (~1.8s per row).

## 2. Inventory Intelligence — "Inventory Twin"

> Hero eyebrow "Inventory Intelligence", headline "Know what you have. / Know where
> it is."
> Header: "Inventory Twin · Sydney DC", title "Zone B — reconciliation live", LIVE pill.
> KPIs: Accuracy 98.2% (orange) · Exceptions 12 · Aging 7.4%.
> **Left panel "Rack Visibility · Aisle B-04":** SVG rack side view, 4 bays × 3
> levels × 2 pallet slots; slots are filled / empty / exception (one glowing orange
> exception slot).
> **Right panel "Reconciliation Feed":** 8 pallet checks (e.g. "P-102386 · C-05-07 ·
> exception · phantom"); match = green ✓, exception = orange !; loops upward.
> **Animation:** scan sweep (4.5s loop); pulse ring on the exception slot (2.4s);
> footer alert "Exception · B-04 · L1 · Slot 4 — phantom stock · Exp 48 · Cnt 0"
> fades in at 1s; feed scrolls (14.4s per loop).

## 3. MHE Safety & Productivity — "Fleet Twin"

> Hero eyebrow "MHE Safety & Productivity", headline "Make every movement / safer
> and more productive."
> Header: "Fleet Twin · Pune DC", title "Shift B — 18 MHEs running", LIVE pill.
> KPIs: Utilisation 76% (orange) · Active MHEs 18 · Safety alerts 3.
> **Left panel:** SVG floor plan — 4 rack rows (A–D, 8 bays each), a dashed dock
> area with 4 bays, 4 dashed aisle lanes each with one forklift drawn as a small
> truck shape (orange; one amber "warning" truck), and a red impact marker at
> row 2, bay 5.
> **Right panel "Live events":** 8 fleet events (e.g. "MHE-11 · Inbound Z-01 ·
> critical · impact"); ok ✓ green, warning • amber, critical ! red; loops upward.
> **Animation:** each forklift drives back and forth along its aisle (8–12s,
> easeInOut, staggered starts) with a soft halo pulse; red impact pulse (2.4s);
> scan sweep (5s loop); feed scrolls (14.4s loop).

## 4. Warehouse Execution — "ATOS"

> Hero eyebrow "Warehouse Execution", headline "Turn plans into / real-time
> execution."
> Header: "ATOS · Pune DC", title "Shift A — execution live", LIVE pill.
> KPIs: On Plan 86% (orange) · Completed {live count}/4 · Exceptions 3.
> **Left panel "Live Task Queue":** 4 task cards — "Move PLT-2048 · A-03 → Dispatch
> Zone · Priority" (amber), "Replenish B-12 · Queued" (blue), "Pick PLT-6110 ·
> Assigned" (green), "Exception Check · Zone D · Location mismatch · Action" (red);
> each with a Running/Done pill and a progress bar. Footer "Assigned · MHE-07 ·
> Operator · R. Kulkarni".
> **Right panel "Execution Map · Floor Layout":** SVG with 4 dashed zones (Reserve,
> Pick Face, Bulk, Dispatch), rack runs, 3 dock doors, blue aisles, task nodes A-03,
> B-12, C-08, D-01. Legend Rack / Task / Route.
> **Animation:** a state machine runs tasks one at a time (4.6s each, 1.2s "done"),
> looping: the active route draws in as a blue dashed line; a glowing dot (the
> forklift) travels it with an "MHE · In progress" label riding along; the card's
> progress bar fills in step; on arrival the dot turns green with a pulse, the card
> shows ✓ Done, and the route stays as a green dashed line. A standing red pulse
> marks the exception in Zone D; cards slide in on load.

## 5. MHE Diagnostics — "MHE Health & Maintenance Dashboard"

> Hero eyebrow "MHE Diagnostics & Maintenance", headline "Know machine health, /
> prevent downtime, / and keep fleets ready."
> Header bar: pulsing green dot, "MHE Health & Maintenance Dashboard", orange
> "SYSTEM ACTIVE".
> KPI strip: Fleet health 87% (orange, counts up from 0) · Connected assets 142 ·
> Open alerts 12 · Maintenance due 28.
> **Left panel "Warehouse 01 · live floor · 5 machines tracked":** SVG plan —
> building outline, columns, 5 dock doors, 12 rack rows, aisles A1–A6, green
> pedestrian walkway; zones Charging (blue), Workshop (amber), Staging, Parts;
> 4 forklifts with labels (FL-001, FL-007, FL-012 green; FL-018 amber) looping along
> paths; red FL-004 drives a dashed red route into the Workshop ("To workshop" →
> "In service", "BAY READY" until it parks).
> **Right panel:** "FL-004 · Reach truck · Aisle A2" + red "Attention" pill;
> Condition 46% (red bar), Battery 32% (blue bar); "Diagnostics" list (Status
> Attention · Battery 32% · Maintenance due 24 hrs · Open fault Hydraulic pressure);
> "Fault recurrence: 4 in 90 days" mini bar chart; amber pill "Work order WO-2231
> raised" + "Flagged before the shift, not after the breakdown."
> **Animation (90ms tick):** score and bars fill over ~2s; diagnostics rows reveal
> one by one (~0.5s apart, loop ~6s); forklifts loop continuously; FL-004 drives
> ~12s, parks ~12s, repeats, with the workshop zone brightening while parked.

## 6. Management Intelligence — "Management Control Tower"

> Hero eyebrow "Management Intelligence", headline "One warehouse network. / One
> decision layer."
> Header bar: orange "R" logo, "Management Control Tower · India Network", green
> "Live". Title "Enterprise overview / Network performance", "Last 30 days" pill.
> KPI cards (4): Sites connected 24 (+3 this quarter) · Safety index 86.4 (+4.2%) ·
> Open actions 128 (17 critical, red) · Closure rate 91% (+8.6%).
> **Left:** "Warehouse locations · 24 sites" — SVG world map with India
> highlighted and 8 site pins coloured by index (≥88 green, ≥80 amber, <80 red);
> "Risk distribution · priority by domain" — 4 orange bars: Rack safety 42 · MHE 31
> · Inventory 19 · People 12.
> **Right "Site performance log":** 8 rows (e.g. "PNQ · Pune DC-02 · 68.9 ·
> Critical rack risk", "DEL · Delhi NCR-01 · 92").
> **Animation:** risk bars grow once (~2s, staggered); every ~2.3s the next site
> becomes active — its pin lifts and scales with a ping ring (2.2s) and its log row
> highlights.

---

## Writing a prompt for a new one

> **[Page] → hero, [mobile/desktop/both].**
> Purpose: show [what the product does].
> Layout: header [labels], KPIs [label: value ×3–4], left panel [SVG drawing of …],
> right panel [feed / list / chart of …].
> Animation: [what moves, how often, how long].
> Data: [paste it, or "realistic sample data"].
> Keep: [what must not change].
> Ask me before adding anything not listed here.

Known gaps in the current heroes worth fixing when touching them: most do not
respect `prefers-reduced-motion`, and on mobile they rely on a min height — check
text stays readable at 375px.
