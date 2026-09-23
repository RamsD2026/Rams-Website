# Image and video prompts — everything still missing

Audited against disk on 2026-09-22. Every path below is referenced in code and
resolves to nothing, so each one is either a visible placeholder or a 404.

| | what | count |
|---|---|---|
| **Part 1** | AI Vision page | 9 images |
| **Part 2** | Guided Inspection — "Where it goes" | 7 images |
| **Part 3** | Homepage problem cards (live 404s) | 5 images |
| **Part 4** | Video, 10s clips | 6 clips |

---

## Read this first — the site is shipping another company's footage

Five video files in `public/` are Atlassian Jira demo placeholders, and they are
not sitting unused. They are wired into **fifteen components**, including
`WhyRAMS`, `PlatformReveal`, `EcosystemSection`, the MEPS and RTSS pages,
`RiqCondition` and the `/resources/videos` page:

```
public/CSD-24696 Agents In Jira 01_1280_v001.mp4            16.3 MB
public/Jira PT VP 1 Demo Placeholder-948px-60fps-crf23.mp4   1.7 MB
public/Jira PT VP 2 Demo Placeholder-948px-60fps-crf23.mp4   1.3 MB
public/Jira PT VP 3 Demo Placeholder-948px-60fps-crf23.mp4   1.1 MB
```

That is someone else's product footage on a live commercial site, and the file
names say whose. Part 4 replaces them. It is the most urgent thing in this
document, ahead of any of the images.

The 16.3 MB one is also, on its own, larger than every image on the site put
together.

---

## Shared style block

Append to **every image prompt** in Parts 1 and 2. It is what keeps them looking
like one site, and like the three `how-it-works` frames already in place.

> Photographed on a real industrial site, documentary realism, as if from a
> fixed camera. Cold white industrial lighting, no warm or coloured light.
> Desaturated charcoal, gunmetal and concrete palette. Sharp focus throughout,
> no depth-of-field blur, no lens flare, no fisheye. No text, signage, logos,
> numbers or watermarks anywhere. 16:9.

Two standing rules:

- **Orange is spoken for.** `#FF6A00` is the site's only accent and the HUD owns
  it. Safety-orange machine paint in the scene is fine; orange *lighting* is not.
- **No faces to camera.** Workers are seen from behind or in three-quarter rear.
  Keeps it about the work, and avoids a photo that reads as a stock portrait.

---

# Part 1 · AI Vision page — 9 images

Three registers, and they must not blur into each other.

- **`ctx-*`** — the camera as a physical object, mounted where it works. No HUD.
- **`uc-*`** — what the camera sees. Camera view **with the HUD burned in**,
  matching the `how-it-works` frames already on the page.
- **`idea-*`** — a plain environment. No HUD, no camera visible.

### 1.1 `ctx-dock.jpg` — the camera above a dock door

> A small matte-black industrial AI camera in a rectangular housing, mounted on
> a bracket high on the inside wall directly above a loading dock's sectional
> door, angled down across the doorway. The open door, the dock leveller and the
> rear of a parked trailer are visible below and behind it. The camera is sharp
> and reads clearly as the subject; the dock behind is slightly further away.
> Shot from inside the warehouse, roughly level with the camera.

### 1.2 `ctx-hazard.jpg` — the camera on a ceiling drop

> A small matte-black industrial AI camera in a rectangular housing, hanging
> from a short steel drop pole fixed to roof steel, angled down over a factory
> floor. Below and behind it, out of focus only slightly, a press line with
> yellow and black hazard striping painted on the concrete. Shot from roughly
> the camera's own height, looking along the roof line.

### 1.3 `uc-mhe.jpg` — forklift view, worker stepping out

Alt text on the page reads: *"Camera view from a forklift: a worker stepping out
from behind a rack."*

> The view from a camera mounted on a forklift's overhead guard, looking forward
> down a narrow warehouse aisle between tall pallet racking. A worker in a
> high-visibility vest is stepping out from behind an upright into the aisle
> ahead, mid-stride, seen three-quarters from behind. Dim aisle lighting.
>
> Overlay a flat vector machine-vision HUD: a thin cyan `#00C8FF` rectangle
> tightly around the worker, and above it a solid cyan label with near-black
> monospace text reading exactly `PERSON 0.97`. Top left, small white monospace
> text reading exactly `CAM_01 / AISLE 12`.

### 1.4 `uc-entry-exit.jpg` — dock door view

Alt: *"Camera view over a dock door: a forklift driving in and a worker
crossing."*

> The view from a camera high above a loading dock door, looking down across the
> doorway at about thirty degrees. A counterbalance forklift is driving in
> through the opening carrying a pallet. A worker in a high-visibility vest and
> hard hat is walking across its path from the right, seen from behind.
>
> Overlay a flat vector HUD: a thin cyan `#00C8FF` box around the forklift
> labelled exactly `MHE 0.94`, a thin cyan box around the worker labelled
> exactly `PERSON 0.96`, and a short orange `#FF6A00` dashed line across the
> doorway where their paths cross. Top left, white monospace text reading
> exactly `CAM_07 / DOOR 3`.

### 1.5 `uc-hazard-ppe.jpg` — press line, no helmet

Alt: *"Camera view of a press line: a worker without a helmet inside a hatched
zone."*

> The view from a ceiling camera looking down at about thirty degrees onto a
> press line. A worker in a high-visibility vest but **bare-headed, with no hard
> hat**, stands inside an area of yellow and black hazard striping painted on
> the concrete in front of the press.
>
> Overlay a flat vector HUD: a red `#FF6C6C` rectangle around the worker, and
> above it a solid red label with white monospace text reading exactly
> `NO HELMET · ZONE B`. Outline the striped area in orange `#FF6A00`. Top left,
> white monospace text reading exactly `CAM_04 / PRESS LINE`.

> **Note.** This is deliberately close to the `how-it-works-3` frame already on
> the page. If it comes back too similar, shoot it from the opposite side of the
> press instead — the two sit in different sections and shouldn't read as the
> same picture.

### 1.6–1.9 The four `idea-*` images — no HUD, no camera

These illustrate *"places this also goes."* Plain environment photographs.

| file | prompt (+ shared style block) |
|---|---|
| `idea-conveyor.jpg` | A parcel sortation conveyor line in a distribution centre, belts merging at a junction, totes and parcels moving along it. Steel framework, no people. Seen from slightly above and to one side. |
| `idea-gate.jpg` | A factory vehicle gate at night — a boom barrier across a road lane, a pedestrian walkway marked alongside it, security fencing, a lit gatehouse in the distance. Wet tarmac. No people, no vehicles. |
| `idea-crane.jpg` | An overhead travelling crane in a steel mill bay, carrying a large steel coil suspended above an empty concrete floor. Heavy gantry, dark roof structure above. No people. |
| `idea-cold-storage.jpg` | A cold-store warehouse aisle, tall racking rimed with frost, cold air haze hanging in the aisle, everything bluish and low-contrast under cold lighting. No people. |

---

# Part 2 · Guided Inspection — 7 images

Plain environment photographs, no HUD. Alt text is the page's own.

| file | prompt (+ shared style block) |
|---|---|
| `where-highbay.jpg` | A very tall high-bay warehouse aisle, pallet racking rising far above the camera to six or seven levels, pallets stacked to the top, the aisle narrowing into the distance. Looking up the aisle. No people. |
| `where-automation.jpg` | Several low autonomous mobile robots carrying shelving units across an open warehouse floor, floor markings and fiducial tags on the concrete, clean and modern. No people. |
| `where-count.jpg` | Pallet labels and barcode placards on the beam faces of pallet racking, high up, photographed from below so the labels recede into the distance along the beam. No people. |
| `where-install.jpg` | New, unpainted pallet racking uprights being anchored to a bare concrete floor, base plates and anchor bolts visible, a drill and dust on the slab. Partly built, no stock. No people. |
| `where-cold.jpg` | A cold store interior, racking and pallets covered in white frost, cold vapour hanging in the air, harsh blue-white lighting, frost on the floor. No people. |
| `where-3pl.jpg` | A very large third-party logistics warehouse seen down a wide main aisle, racking running away on both sides as far as the eye can see, mixed pallets of different goods. No people. |
| `where-ageing.jpg` | An older, worn warehouse floor — patched and repaired expansion joints, cracks filled with grey resin, tyre marks and staining on the concrete, scuffed racking feet. Shot low, looking along the floor. No people. |

---

# Part 3 · Homepage problem cards — 5 images

**These are live 404s on `/` right now**, referenced from both
`ProblemSelector.tsx` and `ChallengeSelector.tsx`. The file names contain
URL-encoded em dashes, which is worth fixing at the same time — I'd rename them
to plain slugs when they land.

These are card images behind a title, so they want more space and less detail
than the Part 1 and 2 shots: a single clear subject, room at the top for type.

| current path | prompt (+ shared style block) |
|---|---|
| `Card 1 — Rack Safety and Compliance.png` | A pallet racking upright with clear impact damage — the leg bent and buckled near the floor, paint scraped away — in an occupied warehouse aisle. The damage is the subject, centred low in the frame, with empty dark aisle above it. |
| `Card 2 — MHE Safety and Productivity.png` | A counterbalance forklift carrying a loaded pallet down a warehouse aisle, seen from behind and slightly above, motion implied. Empty dark aisle ahead of it filling the top of the frame. |
| `Card 3 — Inventory Mismatch and Lost Pallets.png` | A partly empty run of pallet racking — several bays full, one bay conspicuously empty with only a dusty footprint where a pallet stood. The gap is the subject, centred. |
| `Card 4 — Warehouse Execution.png` | A wide, busy warehouse floor seen from high up: marked walkways, staged pallets, racking running away in both directions. Order and flow rather than any single object. |
| `Card 5 — MHE Health and Maintenance.png` | A forklift parked in a maintenance bay with its battery compartment open and a charging lead connected, tools on a trolley beside it. Workshop, not warehouse. No people. |

---

# Part 4 · Video — 6 clips, 10 seconds each

These replace the Jira placeholders in `WhyRAMS`. They play as **muted
background loops behind white text**, which sets every constraint:

- **Slow and almost still.** One continuous drift or push. No cuts, no whip pans,
  no zooms. Anything energetic fights the copy in front of it.
- **Dark and low-contrast**, so white type stays readable over the whole clip.
- **Nothing important in the centre.** The heading sits there.
- **Start and end on a similar frame** where you can, so the loop doesn't jolt.
- **No text, no UI, no logos, no faces to camera.**
- 16:9.

Append to every clip: *"Slow continuous camera move, no cuts. Cold white
industrial lighting, desaturated charcoal palette, low contrast. No text,
signage, logos or watermarks. No faces to camera. 10 seconds, 16:9."*

### V1 · `Engineering.mp4` — Engineering Services
*"Operational clarity starts with the physical structure."*

> A slow dolly along a run of tall pallet racking in a warehouse, the uprights
> passing steadily across frame, a surveyor's tripod and instrument standing
> still in the aisle ahead. Empty, quiet, end of shift.

### V2 · `AI Vision.mp4` — Applied AI
*"Detect what human eyes and manual audits always miss."*

> A very slow push in toward a small matte-black AI camera mounted on a warehouse
> rack upright, the aisle behind it falling out of focus as the camera fills more
> of the frame. The camera itself never moves.

### V3 · `Platform.mp4` — Unified Platform
*"One system for engineering, AI, hardware and enterprise workflows."*

> A slow high drift across a large warehouse floor seen from near the roof,
> looking down on racking, marked aisles and staged pallets laid out in a grid.
> The whole building reading as one ordered system.

### V4 · `Enterprise.mp4` — Enterprise Grade
*"Security, scale and control."*

> A slow lateral drift past a row of closed grey electrical and control cabinets
> along a factory wall, indicator lights steady, conduit running overhead. Still,
> orderly, nothing happening.

### V5 · `Digital Twin.mp4` — Digital Twin
*"A living operational model, not disconnected drawings."*

> A slow orbit around a warehouse interior at night, lit only by its own high-bay
> lights, racking and structure holding their shape as the viewpoint moves
> steadily around them. Architectural and deliberate.

### V6 · `Scale.mp4` — Scale Ready
*"From one warehouse to one hundred."*

> A very slow aerial drift over a distribution park at dusk — several large
> identical warehouse roofs in a row, loading docks along their flanks, trailers
> parked in rows. High enough that no single building dominates.

**Also needs replacing but not by these six:** `RtssHero`, `MepsHero`,
`RiqCondition`, `EcosystemSection`, `PlatformReveal` and `/resources/videos`
all point at the same Jira files. Some may be able to reuse V1–V6; the rest need
their own pass. Tell me when these six exist and I'll work out which slots they
can cover and what is genuinely still short.

---

## Where to put them

```
public/ai-vision/ctx-dock.webp          public/inspection/where-highbay.webp
public/ai-vision/ctx-hazard.webp        public/inspection/where-automation.webp
public/ai-vision/uc-mhe.webp            public/inspection/where-count.webp
public/ai-vision/uc-entry-exit.webp     public/inspection/where-install.webp
public/ai-vision/uc-hazard-ppe.webp     public/inspection/where-cold.webp
public/ai-vision/idea-conveyor.webp     public/inspection/where-3pl.webp
public/ai-vision/idea-gate.webp         public/inspection/where-ageing.webp
public/ai-vision/idea-crane.webp
public/ai-vision/idea-cold-storage.webp public/home/card-rack-safety.webp
                                        public/home/card-mhe-safety.webp
public/video/engineering.mp4            public/home/card-inventory.webp
public/video/ai-vision.mp4              public/home/card-execution.webp
public/video/platform.mp4               public/home/card-mhe-health.webp
public/video/enterprise.mp4
public/video/digital-twin.mp4
public/video/scale.mp4
```

Hand me the raw files in any format and any size — as with the `how-it-works`
frames, I convert, resize and wire them. Those went 6.1 MB → 444 KB, and the
video will matter more: the current placeholder set is 20 MB.

I review each one before wiring: the shot against its brief, the HUD labels
where there are any, hallucinated text, and stray people at the edges.
