/**
 * Warehouse 01, as coordinates.
 *
 * Lifted from the source document's own 900×520 plan view. Everything that
 * draws this facility — the 3D model, the flat backdrop, anything later —
 * reads from here, so there is one building rather than several that happen
 * to look alike.
 *
 * No dependencies on purpose: the backdrop must not pull three.js into its
 * bundle just to know where a rack is.
 */

/** The plan's own coordinate space. */
export const PLAN = { w: 900, h: 520 } as const;

/** Shell: x 40..860, y 40..480. */
export const SHELL = { x: 40, y: 40, w: 820, h: 440 } as const;

/** Four aisles, two rows each, thirteen bays per row. */
export const BAY_X = Array.from({ length: 13 }, (_, i) => 301 + i * 40);
export const BAY_Y = [92, 116, 184, 208, 276, 300, 368, 392];
export const BAY = { w: 38, h: 22 } as const;

/** Dock doors D1–D5, on the left wall. */
export const DOCKS = [96, 172, 248, 324, 400];
export const DOCK = { x: 34, w: 12, h: 46 } as const;

/** Structural columns, top and bottom walls. */
export const COLUMNS = [116, 264, 412, 560, 708, 856];

/** Zones: x, y, w, h, label, restricted. */
export const ZONES: [number, number, number, number, string, boolean][] = [
  [70, 92, 180, 120, "Inbound staging", false],
  [70, 248, 84, 70, "Battery", true],
  [166, 248, 84, 70, "Workshop", false],
  [70, 352, 180, 106, "Outbound", false],
];

/** The pedestrian walkway, as two runs: x, y, w, h. */
export const WALKWAYS: [number, number, number, number][] = [
  [56, 467, 788, 6],
  [269, 56, 6, 408],
];

/** Fixed sensing nodes. */
export const SENSORS: [number, number][] = [
  [300, 84],
  [820, 84],
  [300, 452],
  [820, 452],
  [272, 254],
  [272, 88],
  [46, 290],
  [560, 470],
];

/** The routes equipment actually runs, as the plan draws them. */
export const ROUTES = [
  "M100 138 L272 138 L272 206 L560 206 L560 160",
  "M100 390 L272 390 L272 298 L700 298 L700 252",
  "M120 470 L480 470 L480 384 L800 384",
];

/** Open events, at the severity the plan gives them. */
export const EVENTS: [number, number, string][] = [
  [620, 148, "#C6413A"],
  [340, 404, "#C6413A"],
  [420, 236, "#D9822B"],
  [740, 330, "#D9822B"],
];
