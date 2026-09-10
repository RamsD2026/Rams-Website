import type { Metadata } from "next";
import {
  CertArchitecture,
  CertCTA,
  CertClaim,
  CertFAQ,
  CertHero,
  CertPack,
  CertRegister,
} from "@/components/sections/certifications/CertSections";

export const metadata: Metadata = {
  title: "Certifications & Security | RAMS Digital",
  description:
    "The standards, assurance evidence and security practices supporting RAMS Digital. SOC 2 Type I publicly stated; scope, period and exceptions confirmed during diligence.",
};

/**
 * /company/certifications — the trust centre.
 *
 *   01 Hero          light     the claim, and the assurance panel
 *   02 Certification white     SOC 2 Type I, what to ask for, and what is
 *                              *not* claimed — plus the four questions trust
 *                              actually turns on
 *   03 Architecture  offWhite  six security domains
 *   04 Register      white     six rows: published, configurable, contractual
 *   05 Trust pack    offWhite  six evidence items, requested as one pack
 *   06 FAQ           white     seven questions, the first three in the order
 *                              a procurement team asks them
 *      Close         dark      the site's unified close
 *
 * ── It is a Company page, in the Company pages' style ──────────────
 * The hero is `AboutHero`'s ground — the solutions heroes' radial inverted
 * between white and offWhite, the same orange glow at 0.10, a 46/72/92
 * heading in one colour, pt-36/44/48 — and it closes on the assurance panel
 * rather than a client strip.
 *
 * It was built on `LightHeroGround` and the orbiting tiles for a revision.
 * That is the five `/resources` index pages' signature and the wrong one
 * here; a reader arriving from About or Partners should recognise the section
 * they are in.
 *
 * What the sections below share with those pages is the site's own system —
 * `SectionHeader` at `compact`, white cards on a hairline, alternating
 * surfaces, the hairline FAQ and the unified dark close — which Partners and
 * Contact use as well.
 *
 * The pack is the downloads pack builder on evidence instead of brochures —
 * select what your security team needs, and a tray turns the selection into
 * one pre-filled email. The mechanic is right for the same reason it was
 * there: the source says the materials "may depend on confidentiality,
 * deployment scope and approval", so nothing on this page links to a file. A
 * security questionnaire response and a subprocessor list are not public
 * assets.
 *
 * ── No badge inflation ──────────────────────────────────────────────
 * This is the thing to know before editing anything here, and it matters more
 * on this page than on any other: a security page is read by a procurement
 * team deciding whether to skip a diligence step.
 *
 * RAMS Digital publicly states **SOC 2 Type I**. The source then says, in its
 * own words, what that is not — and every one of those sentences is carried
 * through unchanged:
 *
 *   "This page does not imply SOC 2 Type II, ISO 27001 certification or
 *    automatic regulatory compliance."
 *   "Alignment is not accreditation."
 *   "No platform guarantees compliance on its own."
 *
 * So the non-claim sits inside the certification block directly under the
 * claim, framed, as the second thing read on the page. The register gives
 * only the SOC 2 row a green dot, because it is the only row that is a public
 * claim — the other five are things a customer configures or agrees, and
 * colouring them alike would turn a permission matrix into a certification.
 * The FAQ's ISO 27001 answer is a plain no and stays one.
 *
 * Nothing here was upgraded from what the source said. Where it says
 * "publicly stated", so does this; where it says "confirm during diligence",
 * so does this.
 *
 * ── The nav has linked this for a while ─────────────────────────────
 * `/company/certifications` is in `navigation-v2.ts` under Company and
 * returned a 404 until now — the same reason the case studies, videos,
 * newsroom, webinars, downloads, technical notes, compliance guides and FAQ
 * pages were built.
 */
export default function CertificationsPage() {
  return (
    <>
      <CertHero />
      <CertClaim />
      <CertArchitecture />
      <CertRegister />
      <CertPack />
      <CertFAQ />
      <CertCTA />
    </>
  );
}
