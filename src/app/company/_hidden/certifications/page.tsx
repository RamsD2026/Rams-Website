import type { Metadata } from "next";
import {
  CertCTA,
  CertClaim,
  CertFAQ,
  CertHero,
} from "@/components/sections/certifications/CertSections";
import {
  CertArchitecture,
  CertDataFlow,
  CertFeed,
  CertInterfaces,
  CertPack,
  CertPath,
  CertQuestions,
  CertRecovery,
  CertRegister,
  CertShared,
  CertStandards,
} from "@/components/sections/certifications/CertMore";

export const metadata: Metadata = {
  title: "Certifications & Security | RAMS Digital",
  description:
    "The standards, assurance evidence and security practices supporting RAMS Digital. SOC 2 Type I publicly stated; scope, period and exceptions confirmed during diligence.",
};

/**
 * /company/certifications — the trust centre, from
 * `RAMS_Digital_Certifications_and_Security.html`, section for section.
 *
 *   01 Hero          light     the Company ground and the shield
 *   02 Questions     white     four questions, four cards, each with its tag
 *   03 SOC 2         inkTeal   the seal beside the claim, three checks as rows
 *   04 Standards     ink       EN 15635 as a workflow; alignment vs accreditation
 *   05 Architecture  white     six domains, three points each
 *   06 Register      offWhite  published, configurable or contractual
 *   07 Data flow     white     discover, classify, control, verify — on a rail
 *   08 Evidence      offWhite  the principle, and an illustrative activity feed
 *   09 Interfaces    white     four source systems, one boundary, four rules
 *   10 Shared        offWhite  customer, platform, joint
 *   11 Recovery      white     availability, recovery, incident response
 *   12 Path          ink       five steps from diligence to production
 *   13 Pack          white     six items of evidence, one request
 *   14 FAQ           offWhite  seven questions
 *      Close         dark
 *
 * Surfaces alternate — no two adjacent sections share one.
 *
 * Everything below the hero is the platform pages' card vocabulary, from
 * `cert-ui`: the 12px card with the #E8E8ED hairline and two-part shadow, the
 * 48px orange-tinted tile, and the conic border shine on hover. The page had
 * shipped six of the source's sections as hairline rows and bare columns; it
 * now carries all of them, in the source's order and words.
 */
export default function CertificationsPage() {
  return (
    <>
      <CertHero />
      <CertQuestions />
      <CertClaim />
      <CertStandards />
      <CertArchitecture />
      <CertRegister />
      <CertDataFlow />
      <CertFeed />
      <CertInterfaces />
      <CertShared />
      <CertRecovery />
      <CertPath />
      <CertPack />
      <CertFAQ />
      <CertCTA />
    </>
  );
}
