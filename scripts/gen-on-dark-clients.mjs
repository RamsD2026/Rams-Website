/**
 * Generates `public/clients-on-dark/` from `public/clients/`, for the colour
 * logo grid in the /clients hero (`HERO_GRID` in client-data.ts).
 *
 * The originals keep every white that is enclosed by the mark — their ground
 * was knocked out by a flood fill from the border — which is right on a white
 * card and a white patch on the dark hero (Bosch's circle, IPCA's letters,
 * Supreme Petrochem's roundel). `clients-dark/` is no help here: it is a flat
 * white silhouette, and this grid keeps the brands' colours.
 *
 * So each mark gets the treatment a brand's own reversed artwork does:
 *   1. every light neutral is cut, with a soft ramp so edges stay smooth;
 *   2. black and grey ink becomes white (IPCA's "pca", Nestlé, Mahindra's
 *      "LOGISTICS"), since dark ink on a dark ground disappears;
 *   3. colours too dark to read on the ground (LM's navy, Ferrero's brown)
 *      are lifted in lightness, keeping their hue;
 *   4. the file is trimmed to its ink box.
 *
 * The originals in `public/clients/` are never touched. Re-run this when one
 * of the files below is replaced, or when a slug is added to HERO_GRID.
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";

const SRC = "public/clients";
const OUT = "public/clients-on-dark";

const SLUGS = [
  "mahindra-logistics",
  "dhl",
  "bosch",
  "ferrero",
  "ipca",
  "flipkart",
  "lm-wind-power",
  "exide",
  "kd-supply-chain",
  "continental",
  "nestle",
  "supreme-petrochem",
];

/**
 * Marks supplied as high-resolution artwork and placed in
 * `public/clients-on-dark/` by hand, trimmed to their ink box and capped at
 * 1200 wide (the grid serves them unoptimised). This script leaves them alone.
 *   bosch:              transparent as supplied, colours as is.
 *   ferrero:            transparent as supplied, colours as is.
 *   lm-wind-power:      supplied as vector artwork, served as lm-wind-power.svg.
 *   exide:              transparent as supplied, colours as is.
 *   kd-supply-chain:    transparent as supplied (the KDL mark), colours as is.
 *   continental:        transparent as supplied, colours as is.
 *   supreme-petrochem:  transparent as supplied; the white disc behind "SPL"
 *                       is part of the roundel and is kept.
 *   ipca:               supplied on a white square; white taken to alpha
 *                       (colour-to-alpha, so edges stay smooth) and the black
 *                       "ipca" set in white. The blue is as supplied.
 *   flipkart:           supplied as a WebP with a transparency checkerboard
 *                       painted in. The checker is cut (flood fill inside the
 *                       bag, so its white handle stays); edge pixels are
 *                       rebuilt from the nearest solid colour with a
 *                       projected alpha, so no light fringe is left; the
 *                       wordmark is set in one flat blue, which also clears
 *                       the stock watermark from the letters.
 *   nestle:             transparent as supplied, colours as is.
 *   dhl:                supplied on a white square, white cut (120 tall).
 *   mahindra-logistics: transparent as supplied; the grey "LOGISTICS" and
 *                       arrow set in white, Mahindra's own dark-ground form
 *                       (160 tall).
 */
const SUPPLIED = new Set(["bosch", "dhl", "mahindra-logistics", "ferrero", "lm-wind-power", "exide", "kd-supply-chain", "continental", "supreme-petrochem", "ipca", "flipkart", "nestle"]);

const luma = (r, g, b) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;
const sat = (r, g, b) => {
  const max = Math.max(r, g, b);
  return max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
};

/** 1. Cut light neutrals, ramping alpha out between luma 0.80 and 0.92. */
function cutWhites(d) {
  for (let i = 0; i < d.length; i += 4) {
    const l = luma(d[i], d[i + 1], d[i + 2]);
    if (sat(d[i], d[i + 1], d[i + 2]) < 0.15 && l > 0.8) {
      const k = Math.min(1, (l - 0.8) / 0.12);
      d[i + 3] = Math.round(d[i + 3] * (1 - k));
    }
  }
}

/** 2. Dark and mid neutrals become white. */
function reverseNeutrals(d) {
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i + 1], b = d[i + 2];
    if (sat(r, g, b) < 0.22 && Math.max(r, g, b) < 215) {
      d[i] = d[i + 1] = d[i + 2] = 245;
    }
  }
}

/** 3. Colours below HSL lightness 0.5 are lifted into 0.50–0.62. */
function liftDarkColours(d) {
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), c = max - min;
    const L = (max + min) / 2;
    if (c < 0.08 || L >= 0.5) continue;

    const s = c / (1 - Math.abs(2 * L - 1));
    let h;
    if (max === r) h = ((g - b) / c) % 6;
    else if (max === g) h = (b - r) / c + 2;
    else h = (r - g) / c + 4;
    h *= 60;
    if (h < 0) h += 360;

    const NL = 0.5 + (L / 0.5) * 0.12;
    const C = (1 - Math.abs(2 * NL - 1)) * Math.min(1, s);
    const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = NL - C / 2;
    const [rr, gg, bb] =
      h < 60 ? [C, X, 0] : h < 120 ? [X, C, 0] : h < 180 ? [0, C, X]
      : h < 240 ? [0, X, C] : h < 300 ? [X, 0, C] : [C, 0, X];
    d[i] = Math.round((rr + m) * 255);
    d[i + 1] = Math.round((gg + m) * 255);
    d[i + 2] = Math.round((bb + m) * 255);
  }
}

fs.mkdirSync(OUT, { recursive: true });

for (const slug of SLUGS) {
  if (SUPPLIED.has(slug)) continue;
  const { data, info } = await sharp(path.join(SRC, `${slug}.png`))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  cutWhites(data);
  reverseNeutrals(data);
  liftDarkColours(data);

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, `${slug}.png`));
}

console.log(`wrote ${SLUGS.length - SUPPLIED.size} files to ${OUT}`);
