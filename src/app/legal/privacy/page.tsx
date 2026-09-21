import type { Metadata } from "next";
import {
  LegalHero,
  LegalHub,
  LegalPolicy,
} from "@/components/sections/legal/LegalPrivacy";

export const metadata: Metadata = {
  title: "Privacy Policy | RAMS Digital",
  description:
    "How RAMS Digital collects, uses, shares and protects personal information on this website and in enquiries, and how to exercise your rights.",
};

/**
 * /legal/privacy — the footer's "Privacy Policy" link.
 *
 *   01 Hero     light     the local legal navigation, the page title
 *   02 Topics   white     pairs and centred blocks, each linking below
 *   03 Policy   offWhite  the policy itself, contents beside it
 *      Close    the site footer
 */
export default function PrivacyPage() {
  return (
    <>
      <LegalHero />
      <LegalHub />
      <LegalPolicy />
    </>
  );
}
