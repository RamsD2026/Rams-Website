# Homepage: the warehouse story film

**Status:** approved; implementing (revised 2026-09-22 — replaces the light
five-beat film first built from this spec)
**Route:** `/homepage` while it is built, so the live `/` stays untouched.
Swapping it onto `/` is a one-line change to `app/page.tsx` once signed off.

## Why

Every hardware page opens on a scroll-driven 3D film; the front door opens on a
looping video. The Location Intelligence film (`loc/LocFilm.tsx`) set the look
the client wants for the homepage: a dark isometric warehouse, lit by its own
data. The homepage version shows the whole operation rather than one sensor —
and, since everything RAMS sells happens in a warehouse, it tells the product
story one chapter at a time in the same building.

## Decisions taken

| Question | Answer |
|---|---|
| Chapters | All nine, below |
| Figures | **Words and states only** — "Damaged — rectify", "Service due", "Mismatch". No sample numbers. |
| Route | Rebuild at `/homepage`; `/` untouched until sign-off |
| Look | Dark, isometric, as the Location film; data drawn in glowing lines. Solid geometry, not a LiDAR point cloud. |
| Assets | The forklifts are the CAD truck the AI Camera and Sensor Stack pages use (`rams-forklift.glb`, 2.3 MB), loaded after the film is running; procedural stand-ins show until it arrives and stay if it fails. Everything else is procedural. |

## The story — nine chapters, one continuous camera

| # | Chapter | In the scene | Points to |
|---|---|---|---|
| 0 | **Clarity in Motion.** (hero) | Wide shot; the floor working normally — MHEs on their routes, people on foot | — |
| 1 | Every move, traced | Each MHE leaves a glowing trail; the trails build into a live map of how work moves | Location Intelligence, Digital Twin |
| 2 | Heatmaps | The trails become a traffic heatmap (the density grid *is* where the trucks drove), then switch to a near-miss heatmap | Management Intelligence |
| 3 | MHE safety | The camera follows one truck: an AI Vision camera at a blind crossing detects a pedestrian; the truck is over the zone limit; both flagged | AI Vision, Sensor Stack, OmniBox |
| 4 | MHE health & productivity | A state tag over every truck — moving, loaded, idle, charging, service due — and a fleet utilisation strip | Sensor Stack (BMS), MHE Diagnostics |
| 5 | Rack safety | Down to a rack run; an AirScan drone sweeps the face (scroll-driven), bays turn green / amber / red behind it; one damaged upright gets a card | IRDS, Guided Inspection, services |
| 6 | Inventory | Pallets and empty slots light by status; mismatches pulse; a card shows system vs found | Inventory Intelligence |
| 7 | Execution | Task flows as glowing lines — dock → staging → putaway, and picks back out | Warehouse Execution |
| 8 | One platform | Pull back over the whole site; panels ring the building; "Find your starting point" | Platform, Services, CTA |

About 1000vh of track (~110vh a chapter, in line with the hardware films).

## Architecture

```
src/components/sections/home/
  home-3d.ts     createHomeKit — the building, racking (instanced), MHEs
                 (procedural), routes, the floor overlay (trails + heat)
  HomeFilm.tsx   fixed canvas, the scroll track, chapter type, DOM tags/cards
  home-data.ts   copy for the sections under the film
  HomeSections.tsx, HomePage.tsx
```

- **The film ends at the fold**, as on every hardware page: `.home-doc` is
  opaque and scrolls up over it. (The first build left the first sections
  transparent over a light film; with a dark film that is a hard seam.)
- **No `data-hero-tone`**: both the film and the fallback video hero are dark,
  so the navbar's transparent/white state is right over both.
- **Trails** are painted into a canvas texture on one floor plane; **heat** is a
  coarse density grid accumulated from the same truck positions, uploaded as a
  `DataTexture` and ramped in a shader (orange ramp — the site's one accent).
  Both are pre-warmed at load so chapters 1–2 are full whenever they arrive.
- **Pallets, uprights, beams** are `InstancedMesh` — density is the effect.
- **Labels are DOM**, projected each frame, so the copy is real markup.
- `setViewOffset` shifts the picture away from whichever side a chapter's type
  is on (carried from `LocFilm`).

## Fallback, performance, accessibility

- No WebGL2, or ten seconds without a frame → `.no-film`, and the existing video
  `Hero` takes over.
- Mobile: fewer MHEs, lower trail/heat resolution, no shadows.
- `prefers-reduced-motion`: trucks hold still; the scroll still moves the camera.
- Nothing in the film is the only route to any content.

## Kept untouched

`IndustriesCarousel`, `CustomerSuccess`, `TrustCinematic`, `FinalCTA`, and the
live `/` until sign-off.

## Risks

Framing — nine chapters is nine framings no build can check. The camera track
is built and screenshotted first, with placeholder type, before any chapter's
effects are layered on.
