import type { Metadata } from "next";
import { SolutionsIndex } from "@/components/sections/solutions/SolutionsIndex";

export const metadata: Metadata = {
  title: "Solutions | RAMS Digital",
  description:
    "Six RAMS solutions — rack safety, MHE safety and productivity, inventory intelligence, warehouse execution, MHE diagnostics and management intelligence.",
};

/**
 * /solutions — the index the Solutions menu and every "View all Solutions"
 * link pointed at while the route did not exist.
 */
export default function SolutionsPage() {
  return <SolutionsIndex />;
}
