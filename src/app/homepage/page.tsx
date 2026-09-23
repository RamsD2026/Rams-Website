import type { Metadata } from "next";
import { HomePage } from "@/components/sections/home/HomePage";
import "./homepage.css";

export const metadata: Metadata = {
  title: "RAMS Digital — Clarity in Motion",
  description:
    "Your warehouse already produces the answers. RAMS makes them visible, located and live — AI vision, rack intelligence, MHE telemetry, indoor location and the digital twin that holds them together.",
};

/**
 * /homepage — the rebuilt front door.
 *
 * Built here rather than on `/` so the live homepage stays untouched and the
 * two can be compared side by side. Moving it across is a one-line change to
 * `app/page.tsx` once it is signed off; nothing here depends on the route.
 *
 * The design and the decisions behind it are in
 * `docs/superpowers/specs/2026-09-21-homepage-digital-twin-design.md`.
 */
export default function RebuiltHomePage() {
  return <HomePage />;
}
