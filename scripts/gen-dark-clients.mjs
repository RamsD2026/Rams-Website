/**
 * Generates `public/clients-dark/` from `public/clients/`.
 *
 *   node scripts/gen-dark-clients.mjs
 *
 * The originals in `public/clients/` are never touched — they are the light
 * strip's files, in the marks' real colours. This writes a second set for the
 * dark hero strip.
 *
 * ── Why the dark strip needs its own files ──────────────────────────
 * On a dark ground the real colours fail — Caterpillar's black and Ferrero's
 * brown vanish against #0E0E0F — so the dark strip shows every mark in white.
 * It used to do that with `filter: brightness(0) invert(1)`, which paints
 * every opaque pixel white. That works for a plain wordmark and destroys any
 * mark whose letters are white on a coloured fill: JCB's letters sit white in
 * a black box, Volvo's in a blue band, GE's script in a blue disc. Fill and
 * letters become the same white and the logo turns into a solid block.
 *
 * ── One flat white, with cut-outs ───────────────────────────────────
 * Every output pixel is pure white. Inside a shape it is fully opaque; the
 * only partial alpha anywhere is the anti-aliasing along an edge. A source
 * pixel darker than the cut line becomes solid white and a lighter one
 * becomes a hole, so the fill of a badge turns white and the letters inside
 * it are cut out of it — which is how a brand prints its own single-colour
 * reversal.
 *
 * Where two coloured parts touch, the lighter one is the one cut away:
 * Flipkart's yellow bag drops out and its blue "f" stays. Two
 * colours that differ only in hue cannot both be solid white and still be
 * told apart, so one of them has to become the gap.
 *
 * ── Why the cut is made at 4× ───────────────────────────────────────
 * A soft cut — a ramp either side of the line — leaves any colour that sits
 * on the line half-transparent; JCB's yellow, which sits right on it, came
 * out grey.
 * A hard cut at native size fixes that and steps every edge. So each mark is
 * upscaled 4×, cut hard there (every pixel solid or empty, no in-between),
 * and scaled back down. Interiors come out exactly flat and the downscale
 * supplies the anti-aliasing along the edges.
 *
 * The cut line is luma 0.70 (Rec.601 on sRGB).
 *
 * A mark drawn mostly in light colour would lose most of its ink to that line
 * and come out as a ghost. Any logo that keeps less than 35% of its opaque
 * area is cut again with only true whites removed (luma above 0.88 and
 * saturation under 0.12) and every coloured pixel kept.
 *
 * Re-run this whenever a file in `public/clients/` is added or replaced.
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const SRC = "public/clients";
const OUT = "public/clients-dark";

const SCALE = 4;
const CUT = 0.7;
const MIN_KEPT = 0.35;

/**
 * Per-mark cut lines, where the default leaves debris.
 *
 * Flipkart: the bag is shaded, and its darker rim and handle sit just under
 * 0.70 while the bag body sits above it, so the default cut drops the bag but
 * leaves its rim behind as a row of specks and an arc over the "f". The blue
 * of the wordmark and the "f" is luma 0.42, so a line at 0.55 takes the whole
 * bag out and keeps every blue pixel.
 *
 * JCB: the frame's yellow measures luma 0.700 — exactly on the default line,
 * with a 0.727 variant beside it — so whether the frame came out solid,
 * holed or patchy would depend on rounding. A line at 0.80 keeps the yellow
 * frame and the black box solid and cuts only the white letters, which is
 * JCB's own single-colour reversal: a white badge with the name cut through.
 */
const OVERRIDES = { flipkart: 0.55, jcb: 0.8 };

const luma = (r, g, b) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;

/** Keep this source colour as solid white, at a given cut line? */
const keepBelow = (line) => (r, g, b) => luma(r, g, b) < line;

/** The fallback: cut only genuine whites, keep every colour. */
function keepByWhite(r, g, b) {
  const max = Math.max(r, g, b);
  const sat = max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
  return !(luma(r, g, b) > 0.88 && sat < 0.12);
}

/** Hard cut on the upscaled pixels: alpha is the source's, or nothing. */
function cut(data, keep) {
  const out = Buffer.alloc(data.length);
  let inkIn = 0;
  let inkOut = 0;
  for (let i = 0; i < data.length; i += 4) {
    out[i] = 255;
    out[i + 1] = 255;
    out[i + 2] = 255;
    const a = data[i + 3];
    if (a === 0) continue;
    inkIn += a;
    if (keep(data[i], data[i + 1], data[i + 2])) {
      /* Source alpha is kept so the mark's own outer edge stays smooth;
         anything above half is treated as fully inside the shape. */
      const solid = a >= 128 ? 255 : a;
      out[i + 3] = solid;
      inkOut += a;
    }
  }
  return { out, kept: inkIn ? inkOut / inkIn : 1 };
}

fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".png"));
const fellBack = [];

for (const f of files) {
  const src = path.join(SRC, f);
  const meta = await sharp(src).metadata();
  const W = meta.width * SCALE;
  const H = meta.height * SCALE;

  const { data } = await sharp(src)
    .ensureAlpha()
    .resize(W, H, { kernel: "cubic" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const slug = f.replace(".png", "");
  let { out, kept } = cut(data, keepBelow(OVERRIDES[slug] ?? CUT));
  if (kept < MIN_KEPT) {
    ({ out } = cut(data, keepByWhite));
    fellBack.push(`${slug} (${Math.round(kept * 100)}%)`);
  }

  await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .resize(meta.width, meta.height, { kernel: "lanczos3" })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, f));
}

console.log(`wrote ${files.length} files to ${OUT}`);
if (fellBack.length) {
  console.log(`true-white cut only, for mostly-light marks: ${fellBack.join(", ")}`);
}
