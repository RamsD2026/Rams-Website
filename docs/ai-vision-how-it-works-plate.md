# "How it works" — image prompts

**For:** the panel in `AivHow.tsx` (`/hardware/ai-vision`, section 04 —
*It doesn't just record. It responds.*).

Three images, generated **in sequence in the same conversation**, so the model
keeps the background, camera, lighting and machine between them. Attach the
current panel screenshot to prompt 1 as the layout reference.


|       | scroll step   | what changes                                                          |
| ----- | ------------- | --------------------------------------------------------------------- |
| **1** | 01 See        | Establishes the scene. Two workers, cyan detection boxes.             |
| **2** | 02 Understand | Zone lights orange, dashed predicted path, ETA label.                 |
| **3** | 03 Act        | Near worker has moved into the zone, box turns red, event card files. |




## Before you start

**Exact strings matter.** Every label below is real copy from the page. If the
generator garbles them — and short mono text is the most likely thing to come
back wrong — that is recoverable: I can strip the baked labels and re-draw just
the text in SVG over the image, keeping the photographic scene. So generate for
the picture first; the type is fixable afterwards.

**The one thing that is not recoverable** is the PPE difference. The far worker
wears a white hard hat; the near worker is bare-headed. Step 3's label reads
*ZONE BREACH · NO HELMET*. If both are helmeted the section stops making sense.

**Colours** are the site's own, so use the hex values:

- detection boxes and their labels — cyan `#00C8FF`, label text near-black
- zone outline, path, ETA, zone tag — orange `#FF6A00`
- breach box and label — red `#FF6C6C`, label text white
- event card — white `#FFFFFF`, body text dark grey

---



## Prompt 1 — 01 See

> Using the attached image as the exact layout reference, recreate this as a
> photorealistic still from a ceiling-mounted factory security camera, about
> four metres up, looking down at roughly thirty degrees.
>
> The scene: a dark industrial press shop at night. A large grey steel stamping
> press stands right of centre in the middle distance, its crown picked out in
> safety orange. Bare concrete floor running toward the camera, lit in cold
> white from high-bay fittings, the ceiling and the upper part of the frame
> falling into near-black. Charcoal and gunmetal palette, no warm light.
>
> Two workers in yellow-green high-visibility vests and dark work trousers. The
> further worker stands left of centre in the middle distance, smaller in frame,
> **wearing a white hard hat**. The nearer worker stands below and to the right
> of them, larger in frame, seen three-quarters from behind, **bare-headed with
> no hard hat and no head covering**. On the floor to the right, in front of the
> press, a large hazard area marked out in faded yellow and black diagonal
> stripes, laid flat on the concrete and receding in perspective.
>
> Overlay a clean machine-vision HUD in flat vector style, crisply drawn over
> the photograph:
>
> - A thin cyan `#00C8FF` rectangle tightly around each worker.
> - Above the further worker, a solid cyan label with near-black monospace text
> reading exactly: `PPE OK 0.96`
> - Above the nearer worker, a solid cyan label with near-black monospace text
> reading exactly: `PERSON 0.98`
> - Top left, small white monospace text reading exactly: `CAM_04 / PRESS LINE`
> - Top right, small white monospace text reading exactly: `16:02:48`
>
> 4:3 aspect ratio. No other text, signage, logos or watermarks anywhere. No
> lens flare, no depth-of-field blur, no fisheye. Exactly two people.



## Prompt 2 — 02 Understand

> Keep the photograph exactly as it is. Do not change the camera angle, the
> lighting, the background, the press, the floor, either worker's position or
> pose, or the two cyan boxes and their labels.
>
> Add only these, in the same flat vector HUD style:
>
> - Outline the striped hazard area on the floor with a bright orange `#FF6A00`
> stroke following its four edges, and tint its interior a translucent orange.
> - From the nearer worker's feet, a short orange dashed line curving to the
> right and ending in a small solid orange arrowhead just inside the left edge
> of the hazard area.
> - Beside that dashed line, a solid orange label with white monospace text
> reading exactly: `ETA ZONE 1.8 s`
> - At the lower-right corner of the hazard area, a solid orange label with
> white monospace text reading exactly: `ZONE B · PRESS`
> - Change the timestamp in the top right to exactly: `16:02:58`
>
> Everything else is unchanged. 4:3.



## Prompt 3 — 03 Act

> Keep the photograph exactly as it is — same camera, lighting, background,
> press, floor, and hazard area with its orange outline and its `ZONE B · PRESS`
> label. Keep the further worker and their cyan `PPE OK 0.96` box unchanged.
>
> Change these:
>
> - Move the nearer bare-headed worker to the right and slightly up, so he is
> now standing **inside** the hazard area, just past its left edge, mid-stride.
> - His box is now red `#FF6C6C` instead of cyan, and the label above it is a
> solid red bar with white monospace text reading exactly:
> `ZONE BREACH · NO HELMET`
> - Remove the orange dashed line, the arrowhead and the `ETA ZONE 1.8 s` label
> entirely.
> - Add a white rounded rectangle panel in the lower-left of the frame, like a
> software notification card, containing dark grey text:
> a small red dot then `EVENT 4821 · ZONE B` as a heading, a thin divider, then
> three rows — `Stop signal` right-aligned `SENT` in red, `Local alarm`
> right-aligned `ON`, `Clip · supervisor` right-aligned `FILED`.
> - Change the timestamp in the top right to exactly: `16:03:10`
>
> Everything else is unchanged. 4:3.

---



## If prompt 3 will not move him

Moving a subject is the hardest of the three edits. If the model refuses or
mangles him, fall back to: leave him exactly where he is, and instead **extend
the hazard area left so that it now reaches under his feet.** The breach still
reads — he is in the zone — and the edit is much easier. Say so and I will
adjust the copy if it needs it.

## What I will check on r

## eview

1. **PPE difference** — far worker helmeted, near worker bare-headed, in all
  three. The one unrecoverable failure.
2. **Continuity** — is the press in the same place, the same size, the same
  colour across all three? Any drift and they cannot cross-fade.
3. **Exactly two people**, in all three.
4. **Label text** — legible and correct, or garbled. If garbled I re-draw the
  labels in SVG rather than re-rolling.
5. **Aspect** — 4:3 on all three, identical dimensions.
6. **Did he actually move** between 2 and 3, and is he inside the zone.
7. **Value range** — dark enough to sit on `#0d0f12` without the panel edge
  showing as a seam.
8. **Hallucinated text or branding** anywhere.



## Dropping them in

```
public/ai-vision/how-it-works-1.png
public/ai-vision/how-it-works-2.png
public/ai-vision/how-it-works-3.png
```

Then I replace the inline SVG in `AivHow.tsx` with three stacked `<img>`
elements cross-fading on `data-step`, which is the same CSS mechanic the layers
use now — so the scroll build, the reduced-motion parked state and the
accessible labelling all keep working unchanged.