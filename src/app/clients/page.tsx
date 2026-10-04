import type { Metadata } from "next";
import { ClientsWall } from "@/components/sections/clients/ClientsWall";

export const metadata: Metadata = {
  title: "Clients | RAMS Digital",
  description:
    "The RAMS customer portfolio — 90 organisations across logistics, manufacturing, automotive, FMCG, pharma, retail and industrial operations.",
};

/**
 * /clients — the only page under the Clients menu.
 *
 * It lived at `/industries` and carried nine industry essays, one per sector.
 * The portfolio replaced them, the menu has said Clients for some time, and a
 * section with one page has no reason to keep a path that names something
 * else. `/industries` and anything under it now redirects here, so the
 * anchors the footer links to — `#3pl`, `#ecommerce`, `#manufacturing`,
 * `#cold-storage`, `#automotive` — survive the move: a browser reapplies the
 * fragment after a redirect.
 *
 * The industry essays are in git history if that writing is wanted back.
 */
export default function ClientsPage() {
  return <ClientsWall />;
}
