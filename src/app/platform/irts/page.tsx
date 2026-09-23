import type { Metadata } from "next";
import { CareersComingSoon } from "@/components/sections/careers/CareersComingSoon";

export const metadata: Metadata = {
  title: "IRTS — Inventory Reconciliation & Tracking Suite | RAMS Digital",
  description:
    "IRTS, the RAMS Inventory Reconciliation and Tracking Suite. The module page is in preparation.",
};

/**
 * /platform/irts — a holding page until the module page is written.
 *
 * It is the Careers and Technical Notes holding screen with its own label.
 *
 * ── The path had a redirect on it ───────────────────────────────────
 * The inventory module was IROS, then IRTS, and is now IBIS, so
 * `/platform/irts` pointed at `/platform/ibis` for a revision. IRTS is now
 * its own entry in the Platform menu, so that redirect is gone and this
 * page answers the path instead. `/platform/iros` still points at IBIS.
 */
export default function IrtsPage() {
  return (
    <CareersComingSoon eyebrow="IRTS — Inventory Reconciliation & Tracking Suite" />
  );
}
