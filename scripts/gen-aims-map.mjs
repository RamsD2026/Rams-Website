import fs from "node:fs";
import { geoEquirectangular, geoPath, geoGraticule } from "d3-geo";
import { feature } from "topojson-client";

/**
 * Builds the Management Intelligence map.
 *
 * The whole world at Natural Earth 110m, in equirectangular, emitted as
 * plain SVG paths. A world map wants every country, so the resolution drops
 * to keep the payload sane — at this scale 110m is all the detail that
 * survives anyway.
 *
 * Everything is projected here rather than in the browser: no map key, no
 * tiles, no geo library at runtime.
 */

const SRC =
  "D:/RAMS/Rams-Website-master/Rams-Website-master/node_modules/world-atlas/countries-110m.json";
const OUT =
  "D:/RAMS/Rams-Website-master/Rams-Website-master/src/components/sections/aims/aims-map-data.ts";

/* The frame stops above Antarctica and below the empty Arctic: 142° of
   latitude over 360° of longitude, which is the shape of the box. */
const LAT = [-58, 84];
const W = 960;
const H = Math.round((W * (LAT[1] - LAT[0])) / 360);

const topo = JSON.parse(fs.readFileSync(SRC, "utf8"));
const world = feature(topo, topo.objects.countries);
const byName = (n) => world.features.find((f) => f.properties.name === n);

const india = byName("India");
if (!india) throw new Error("India not found");

const FRAME = {
  type: "Polygon",
  coordinates: [
    [
      [-180, LAT[0]],
      [180, LAT[0]],
      [180, LAT[1]],
      [-180, LAT[1]],
      [-180, LAT[0]],
    ],
  ],
};

const projection = geoEquirectangular().fitExtent(
  [
    [0, 0],
    [W, H],
  ],
  FRAME,
);

/* Anything outside the frame is dropped rather than drawn off-canvas. */
projection.clipExtent([
  [0, 0],
  [W, H],
]);

const path = geoPath(projection);

/** Country labels, placed at the centroid of what is visible. */
const LABELS = [
  ["NORTH AMERICA", -100, 45],
  ["SOUTH AMERICA", -60, -15],
  ["EUROPE", 15, 52],
  ["AFRICA", 20, 5],
  ["ASIA", 90, 45],
  ["OCEANIA", 140, -25],
];

/** Cities that are not sites — context, the way a basemap carries it. */
const CONTEXT = [];

/** The network, wherever it is. */
const CITIES = [
  ["PNQ", "Pune DC-02", "India", 68.9, "Critical rack risk", 73.86, 18.52],
  ["DEL", "Delhi NCR-01", "India", 92.0, "Closure rate 94%", 77.21, 28.61],
  ["DXB", "Dubai LC-01", "UAE", 87.4, "Throughput steady", 55.27, 25.2],
  ["SIN", "Singapore WH-02", "Singapore", 93.1, "Top performer", 103.82, 1.35],
  ["FRA", "Frankfurt DC-03", "Germany", 89.6, "Inventory accuracy 98%", 8.68, 50.11],
  ["LHR", "London WH-05", "UK", 81.7, "MHE idle time high", -0.13, 51.51],
  ["JFK", "New Jersey DC-07", "USA", 90.2, "Asset health steady", -74.17, 40.73],
  ["SYD", "Sydney WH-01", "Australia", 85.9, "Closure rate improving", 151.21, -33.87],
];

const xy = ([lon, lat]) => {
  const [x, y] = projection([lon, lat]);
  return [+x.toFixed(1), +y.toFixed(1)];
};

const sites = CITIES.map(([id, name, region, index, note, lon, lat]) => {
  const [x, y] = xy([lon, lat]);
  return { id, name, region, index, note, x, y };
});

const labels = LABELS.map(([text, lon, lat]) => {
  const [x, y] = xy([lon, lat]);
  return { text, x, y, sea: text.includes("SEA") || text.includes("BAY") };
});

const context = CONTEXT.map(([name, lon, lat]) => {
  const [x, y] = xy([lon, lat]);
  return { name, x, y };
});

/* Integer precision: the map is 460px wide, so a tenth of a unit is
   invisible and doubles the payload. */
const round = (d) =>
  (d ?? "").replace(/-?\d+\.\d+/g, (n) => Math.round(Number(n)));
const graticule = round(path(geoGraticule().step([5, 5])()));

/* Every country on the map, India last so it draws over its borders. */
const around = world.features
  .filter(
    (f) =>
      f.properties.name !== "India" && f.properties.name !== "Antarctica",
  )
  .map((f) => ({ name: f.properties.name, d: round(path(f)) }))
  .filter((f) => f.d.length > 0);

const ts = `/**
 * Real geography, projected once.
 *
 * Generated from Natural Earth 50m country outlines (world-atlas) through a
 * Mercator projection fitted to India, so the coastline has its real detail
 * and every pin sits where it actually is. Emitted as constants rather than
 * projected at runtime: no map key, no tiles, no client-side geo library.
 *
 * Regenerate with \`node scripts/gen-aims-map.mjs\` if the sites change.
 */

export const MAP = { w: ${W}, h: ${H} } as const;

/** A five-degree grid, the way a basemap carries one. */
export const GRATICULE = "${graticule}";

/** India, in the projected space. */
export const INDIA = "${round(path(india))}";

/** The neighbours that give the outline context. */
export const AROUND = [
${around.map((f) => `  // ${f.name}\n  "${f.d}",`).join("\n")}
];

/** Country and sea labels, as a basemap prints them. */
export const LABELS: { text: string; x: number; y: number; sea: boolean }[] =
  ${JSON.stringify(labels, null, 2)};

/** Cities that are not sites — context only. */
export const CONTEXT_CITIES: { name: string; x: number; y: number }[] =
  ${JSON.stringify(context, null, 2)};

export type Site = {
  id: string;
  name: string;
  region: string;
  index: number;
  note: string;
  x: number;
  y: number;
};

/** Sites at their real coordinates. */
export const SITES: Site[] = ${JSON.stringify(sites, null, 2)};
`;

fs.writeFileSync(OUT, ts);
console.log("wrote", OUT);
console.log("india chars:", path(india).length, "neighbours:", around.length);
