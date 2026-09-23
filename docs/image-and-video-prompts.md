# Image prompts — the 19 still missing

Rewritten 2026-09-23 against five reference images the client supplied, after a
first pass that missed badly. What follows is what those references actually
contain, and every brief below is built from it.

## What the first pass got wrong

The first version of this document asked for documentary photography of
warehouses. The references are nothing of the kind, and the gap was total:

| the old brief said | the references actually have |
|---|---|
| "documentary realism, as if from a fixed camera" | **3D render**, PBR materials, film grain |
| "no depth-of-field blur" | heavy, deliberate bokeh |
| "desaturated charcoal and gunmetal" | electric blue, cyan, magenta, vivid red |
| "no text, signage or logos" | **RAMS DIGITAL on the device**, floor markings, location codes |
| nothing about atmosphere | volumetric light shafts and haze in every frame |
| empty rooms | **the technology visible as light** |

The last row is the one that matters. Every reference *shows the product
working* — a red scan grid on a bent upright, cyan brackets round pallets being
read, a beam across a doorway. The old briefs commissioned pictures of empty
buildings, which is why they came back dead. **Every brief below now names the
sensing effect**, and that is the part not to drop when editing one.

## Block A — fixed. Append to every prompt, unchanged.

> Realistic industrial 3D visualization, physically based rendering — not
> photography, not cartoon, no outlines. Dark warehouse interior at night, deep
> navy and charcoal shadows, cold pools of light from overhead high-bay fittings
> with visible volumetric light shafts and a light haze in the air. Shallow
> depth of field: the subject is sharp and the background falls into soft bokeh.
> Electric blue and cyan technology glows; vivid red only where something is
> being flagged. Subtle film grain, ultra high resolution, no watermarks. 16:9.

## How these were generated

`gpt_image_2_5`, `--quality high --resolution 2k`, via the Higgsfield CLI. Two
settings worth writing down because both defaults are wrong for this work:

- **`quality` defaults to `low`** and `resolution` to `1k`. Unset, you get
  1344×752. Set, you get 2688×1520.
- **The two `ctx-` briefs pass `public/ai-vision/product.png` as `--image`**, so
  the camera in frame is the real housing rather than a generic CCTV bullet.

Soul Location was tried and dropped: it reads "desaturated" as *monochrome* and
substitutes light shelving for pallet racking.

## On invented text

Some of these come back with readable location codes and barcodes — `A3-03-02`
and so on. The client's own Gemini reference does the same and it reads well, so
it is allowed. But it is fabricated data on a commercial page: if a code ever
needs to mean something, it has to be put there deliberately rather than left to
the generator.

---

## AI Vision — 8

### `ctx-hazard.webp`
PROMPT: A small matte-black industrial AI camera in a rectangular housing hangs from a short steel drop pole fixed to roof steel, angled down over a factory floor. From its lens a soft electric-blue sensing cone fans down and lands on the concrete as a glowing cyan trapezoid, falling across an area of yellow and black hazard striping painted on the floor in front of a heavy steel press. The camera is the sharp subject in the upper third; the press recedes into soft focus behind.

### `uc-mhe.webp`
PROMPT: The view from a camera mounted on a forklift's overhead guard, looking forward down a narrow warehouse aisle between tall blue and orange pallet racking. A worker in a yellow-green high-visibility vest and white hard hat is stepping out from behind an upright into the aisle ahead, mid-stride, seen three-quarters from behind. A thin glowing cyan rectangle is drawn tightly around the worker, with a small cyan label bar floating above it. A soft blue coverage cone from the camera spreads down the aisle floor ahead.

### `uc-entry-exit.webp`
PROMPT: The view from a camera high above a loading dock door, looking down across the doorway at about thirty degrees. A counterbalance forklift drives in through the opening carrying a wrapped pallet. A worker in a high-visibility vest and hard hat walks across its path from the right, seen from behind. Both are outlined in thin glowing cyan rectangles with small floating label bars. A vivid red dashed line glows across the concrete where their two paths cross.

### `uc-hazard-ppe.webp`
PROMPT: A ceiling camera view looking down at about thirty degrees onto a press line. A worker in a yellow-green high-visibility vest, bare-headed with no hard hat, stands inside an area of yellow and black hazard striping painted on the concrete in front of a heavy steel press. A vivid red rectangle glows tightly around the worker with a red label bar above it, and the striped floor area is outlined in glowing orange. A second worker further back wears a white hard hat and is outlined in cyan.

### `idea-conveyor.webp`
PROMPT: A parcel sortation conveyor line in a distribution centre, steel framework, belts merging at a junction with totes and parcels moving along them. Each parcel is outlined in a small glowing cyan bracket as it passes. At the merge point one bracket has turned vivid red and glows brighter than the rest. No people.

### `idea-gate.webp`
PROMPT: A factory vehicle gate at night — a boom barrier across a road lane, a pedestrian walkway marked alongside it, security fencing, wet tarmac reflecting the lights. A glowing electric-blue detection beam sweeps low across the pedestrian lane and lands on the tarmac as a bright cyan line. A small matte-black camera on a pole above watches the lane. No people, no vehicles.

### `idea-crane.webp`
PROMPT: An overhead travelling crane in a steel mill bay carrying a large steel coil suspended above an empty concrete floor, heavy gantry and dark roof structure above. Directly beneath the suspended load, a vivid red exclusion zone glows on the concrete as a bright outlined rectangle with a soft red volume rising from it. No people.

### `idea-cold-storage.webp`
PROMPT: A cold-store warehouse aisle, tall racking rimed with white frost, cold vapour hanging in the aisle, everything bluish and low-contrast. A reach truck sits part way down the aisle. Several pallet positions on the racking are outlined in glowing cyan brackets, cutting cleanly through the fog. No people.

## Guided Inspection — 6

### `where-automation.webp`
PROMPT: Several low autonomous mobile robots carrying shelving units across an open warehouse floor, floor markings and fiducial tags on the concrete. A low grey inspection floor robot sits in the foreground, projecting a glowing cyan grid across the concrete ahead of it that follows the undulation of the slab. No people.

### `where-count.webp`
PROMPT: Pallet labels and barcode placards on the beam faces of blue and orange pallet racking, high up, photographed from below so the labels recede into the distance along the beam. A compact white inspection quadcopter hovers level with them. Thin glowing cyan lines run from the drone's sensor to several labels, each ending in a small floating cyan bracket. No people.

### `where-install.webp`
PROMPT: New unpainted pallet racking uprights being anchored to a bare concrete floor, base plates and anchor bolts visible, drill dust on the slab, partly built with no stock. A low grey floor robot sits alongside, and beneath the concrete a glowing cyan ghosted lattice of reinforcing bar and a magenta conduit run are revealed as if seen through the slab. No people.

### `where-cold.webp`
PROMPT: A cold store interior, racking and pallets covered in white frost, cold vapour hanging in the air, harsh blue-white lighting, frost on the floor. A compact white inspection quadcopter hovers in the aisle with soft blue sensor glows, and several frosted pallet positions are outlined in glowing cyan brackets. No people.

### `where-3pl.webp`
PROMPT: A very large third-party logistics warehouse seen down a wide main aisle at night, blue and orange racking running away on both sides as far as the eye can see, mixed pallets of different goods. Glowing cyan brackets outline pallet positions in clusters far down both runs, fading with distance. No people.

### `where-ageing.webp`
PROMPT: An older, worn warehouse floor — patched and repaired expansion joints, cracks filled with grey resin, tyre marks and staining on the concrete, scuffed racking feet. Shot low, looking along the floor. A low grey floor robot sits mid-frame, and beneath the slab a vivid red glowing void is revealed as if seen through the concrete, directly under one rack leg. No people.

## Homepage cards — 5

### `card-rack-safety.webp`
PROMPT: Close on a blue steel pallet rack upright with a clear dent buckling its front edge near floor level, the perforated holes warped around the impact. A tight vivid red scan grid of thin intersecting lines wraps the damaged section, isolating it. Galvanized beams, wooden pallets and cardboard boxes sit softly out of focus behind.

### `card-mhe-safety.webp`
PROMPT: A counterbalance forklift carrying a wrapped pallet down a warehouse aisle, seen from behind and slightly above. A small matte-black camera is mounted on its overhead guard, and a soft electric-blue coverage cone spreads from it down the aisle floor ahead, landing as a glowing cyan trapezoid on the concrete.

### `card-inventory.webp`
PROMPT: A run of blue and orange pallet racking, several bays full of wrapped pallets and one bay conspicuously empty with only a dusty footprint where a pallet stood. The empty position is outlined in a glowing vivid red bracket; the full bays either side carry quiet cyan brackets.

### `card-execution.webp`
PROMPT: A wide warehouse floor seen from high up near the roof, marked walkways, staged pallets, blue and orange racking running away in both directions. Glowing cyan flow lines trace the aisles and walkways like a live map laid over the floor, with soft pulses travelling along them. No people.

### `card-mhe-health.webp`
PROMPT: A forklift parked in a maintenance bay with its battery compartment open and a charging lead connected, tools on a trolley beside it. A soft cyan diagnostic glow rises from the open battery compartment, with small floating cyan bracket markers over the battery and the drive motor. Workshop, not warehouse. No people.
