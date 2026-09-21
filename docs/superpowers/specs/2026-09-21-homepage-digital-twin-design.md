# Homepage: the digital-twin film

**Status:** approved, not yet implemented
**Route:** `/`

## Why

The homepage is the oldest code in the repo. It predates the conventions the
five hardware pages follow: its sections are flat files in
`components/sections/`, most of them sit in the lint baseline `AGENTS.md`
describes, and `TechnologySystems.tsx` alone is 1,961 lines. Its hero is a
looping `/download.mp4` behind a dark overlay.

Meanwhile `/hardware/ai-vision`, `/hardware/omnibox`, `/hardware/sensor-stack`,
`/hardware/rtls` and `/hardware/inspection` each open on a scroll-driven 3D
film. The front door is now the least characteristic page on the site.

The brief came with a reference video, and the useful thing about it is that it
is not a style reference — it is the company's own argument told as a film:

1. a dashboard, and a button reading *Generate Live Digital Twin*
2. the view flies into an isometric warehouse
3. the floor is laced with glowing lines tracing how work moves
4. the camera drops to one rack bay; a card appears with what is stored there
5. it pulls back, and live telemetry panels ring the building

That is what RAMS sells. A homepage that shows it beats a homepage that
asserts it.

## Decisions taken

Three questions were put to the client before designing. The answers bound
everything below.

| Question | Answer |
|---|---|
| How much is rebuilt? | New 3D hero **and** rebuild the 3–4 sections it flows into. Lower sections stay. |
| What does it look like? | The reference's dark industrial warehouse — **but the glow is signal-orange, not green.** |
| How far does the 3D reach? | The warehouse **stays live behind the rebuilt sections**, one continuous camera move. |

On the second: `AGENTS.md` states signal-orange is the only accent on this site
— "CTAs, eyebrows, one word in a heading, a live indicator. Not body copy, not
decoration. Invent no colour that is not already on the site." The reference's
green would have been a second accent, and the homepage would then disagree
with all five hardware pages. Orange keeps the drama and the rule.

## Architecture

A new folder, in the hardware-page idiom, so the front door is built the way
the rest of the site is:

```
src/components/sections/home/
  home-3d.ts      createHomeKit — shed, racking, MHE, conveyor, flow-lines
  HomeFilm.tsx    fixed canvas, ~450vh scroll track, the type layer
  home-data.ts    copy for the rebuilt sections
  HomeGap.tsx     the problem
  HomeSystems.tsx five intelligent systems
  HomeStart.tsx   three ways to start
  HomePage.tsx    the shell
```

`app/page.tsx` renders `<HomePage />`.

`HeroVersioned.tsx` and `SectionsVersioned.tsx` become unused. **They are left
in place, not deleted.** `AGENTS.md` records that dead section folders on this
site are kept deliberately, and the v1/v2 nav experiment they belong to is
still reachable by setting `localStorage["rams-nav-version"]` by hand.

### Why the film is a sibling of the sections, not a wrapper

The hardware pages put the film and the document side by side: a fixed canvas
at one z-index, a `.hw-doc` that scrolls over it at another. This page does the
same, with one difference — the document does not fully cover the film until
the fourth beat, so the warehouse is still rendering behind the first three
rebuilt sections. The film owns the camera; the sections own the copy; the only
thing they share is scroll position.

## The film

Five beats over roughly 450vh of track. Copy is reused where the existing page
already says it well; the source is named for each.

| Track | Camera and scene | Type |
|---|---|---|
| 0.00–0.18 | The shed, wide, slow drift. Lights on, nothing moving yet. | **"Clarity in Motion."** — the existing H1 |
| 0.20–0.42 | Flow-lines ignite along the aisles; MHE and conveyor start to move. | **"Racks. MHEs. Pallets. People."** — from `OperationShowcase` |
| 0.44–0.64 | Fly into one rack bay. It lights. A card appears with what is in it. | The gap — what a site cannot see today |
| 0.66–0.84 | Five systems light in place across the shed, each labelled where it lives. | **"One platform. Five intelligent systems."** — from `TechnologySystems` |
| 0.86–1.00 | Pull back. Telemetry panels ring the building. | **"Start with a service, a device or the platform."** — from `ThreeWaysToStart` |

Beat 3 is the one that earns the page. Beats 1, 2 and 5 are atmosphere; beat 3
is the only moment the pitch becomes a specific claim about a specific pallet,
and it is the beat the reference video spends its longest shot on.

### Camera

One continuous move, keyframed as `[p, position, target]` the way every other
film on this site is. The clearance guard added to `GiFilm` and `SstFilm`
applies here too: in the opening and closing beats the type owns the middle of
the screen, so the camera target lifts by a fraction of the *visible frame
height* — a fraction, not a fixed offset, so it holds at any resolution.

### Geometry and the reason for instancing

Dark shed on `#0B0C0F`. Structure, racking uprights and beams are ordinary
meshes. **Pallets and cartons are `InstancedMesh`.**

That is not a micro-optimisation. The reference's impact comes from density —
hundreds of pallets, a big building — and this is the most-visited page on the
site. Several hundred individually-drawn pallets would be several hundred draw
calls per frame. Instanced, it is one per geometry.

Flow-lines are emissive tubes following aisle paths, with a pulse travelling
along them driven by a uniform rather than by rebuilding geometry.

Budget: **~40k triangles, and zero network assets.** Everything is procedural,
so the front door downloads nothing it did not already.

## Sections rebuilt

Three, all flowing out of the film:

- **HomeGap** — the problem, picking up where beat 3 leaves off
- **HomeSystems** — the five systems, replacing `TechnologySystems` (1,961
  lines) with a data-driven section
- **HomeStart** — three ways to start

Copy is carried over from `ChallengeSelector`, `PlatformReveal`,
`OperationShowcase`, `ThreeWaysToStart` and `TechnologySystems`. The argument
does not change; the number of lines needed to make it does.

## Kept untouched

`IndustriesCarousel`, `CustomerSuccess`, `TrustCinematic`, `FinalCTA`.

## Fallback, performance, accessibility

- **No WebGL2, or ten seconds without a frame** → `.no-film`, and the existing
  `Hero.tsx` video hero takes over. The front door can never come up blank.
  This is the same contract the five hardware films use.
- **Mobile** drops instance counts and turns shadows off.
- **`prefers-reduced-motion`** parks the film on a composed frame rather than
  animating it.
- The film stops rendering once its track is out of view.
- The type layer is real markup — headings, links, and a `<canvas>` marked
  `aria-hidden`. Nothing in the film is the only route to any content.

## Also in scope

Three live 404s reachable from this page today, fixed by redirects in
`next.config.ts` beside the `/industries/*` block that exists for the same
reason:

| Link | From |
|---|---|
| `/platform/ai-vision` | `EcosystemSection`, `ChallengeProblemGrid` |
| `/solutions/ai-vision` | `SolutionsGrid` |

Both should resolve to `/hardware/ai-vision`.

## Out of scope

- The v2 homepage experiment (`HeroV2`, the v2 branch of `SectionsVersioned`)
- The lint baseline in the sections being kept
- Any change to the five hardware pages

## Risks

**The thing most likely to go wrong is framing.** Every 3D judgement in this
build — how big the shed reads, whether the type clears the geometry, how far
the camera flies — is a judgement that a passing build cannot check. The
clearance guard and the instancing are the two decisions taken specifically to
reduce how much of that is left to chance, but the beats will need looking at.

**Second: density is the whole effect.** If the instancing work is skipped or
the pallet count is cut to make the framerate, the result is a sparse shed that
looks nothing like the reference. The triangle budget exists to protect the
density, not to cap it.
