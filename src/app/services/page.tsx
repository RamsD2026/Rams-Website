import type { Metadata } from "next";
import { ServicesIndex } from "@/components/sections/services/ServicesIndex";

export const metadata: Metadata = {
  title: "Services | RAMS Digital",
  description:
    "Rack inspection, structural verification, inventory reconciliation, MHE productivity assessment, safety and operational assessment, and deployment and support.",
};

/**
 * /services — the index the mega menu, the footer and every service page's
 * close already link at. The six cards are derived from `SERVICES`.
 */
export default function ServicesPage() {
  return <ServicesIndex />;
}
