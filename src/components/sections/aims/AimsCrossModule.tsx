"use client";

import { Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { AimsFlow } from "./AimsFlow";

/**
 * Across-module analytics.
 *
 * The centred header, then the intelligence layer itself: module signals in
 * from the left, one connected record at the centre, management action out to
 * the right. See docs/irds-intelligence-animation.md for the pattern.
 */

export function AimsCrossModule() {
  return (
    <Section surface="ink" id="how-it-works">
      {/* the grid the whole section sits on */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(70% 62% at 50% 62%, #000 10%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(70% 62% at 50% 62%, #000 10%, transparent 82%)",
        }}
      />

      <SectionHeader
        eyebrow="AIMS"
        top="Across-module analytics"
        bottom="That individual systems cannot reveal."
        body="AIMS connects data across Rack Safety, MHE, Inventory, People and Maintenance modules. It identifies relationships, patterns and operational causes — then converts them into management-ready insights."
        tone="dark"
        size="compact"
        width="wide"
      />

      <div className="mt-2">
        <AimsFlow />
      </div>
    </Section>
  );
}
