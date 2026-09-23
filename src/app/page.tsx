import type { Metadata } from "next";
import { HomePage } from "@/components/sections/home/HomePage";
import "@/styles/homepage.css";

export const metadata: Metadata = {
  title: "RAMS Digital — The Operating System for Intelligent Facilities",
  description:
    "RAMS connects and augments physical facilities through Digital Twin technology, intelligent hardware and operational software — bringing racks, MHEs, pallets, people, infrastructure and future robotic systems into one connected operating environment.",
};

/**
 * `/` — the front door.
 *
 * A port of the supplied design, `RAMS_Digital_Physical_Warehouse_Homepage-10
 * .html`, with the page's own 3D warehouse running where its hero image was.
 * What was adapted on the way in, and why, is in
 * `components/sections/home/HomePage.tsx` and the head of
 * `styles/homepage.css`.
 *
 * It was built at `/homepage` first so the two could be compared; that route
 * is now a redirect here (`next.config.ts`). The page it replaced — the
 * `HeroVersioned` / `SectionsVersioned` pair and the v1/v2 nav experiment
 * behind them — is left on disk, unrouted, as `AGENTS.md` asks.
 */
export default function Home() {
  return <HomePage />;
}
