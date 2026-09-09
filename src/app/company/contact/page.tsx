import type { Metadata } from "next";
import { ContactHero } from "@/components/sections/contact/ContactHero";
import { ContactTrust } from "@/components/sections/contact/ContactTrust";
import { ContactFAQ } from "@/components/sections/contact/ContactFAQ";

export const metadata: Metadata = {
  title: "Contact Us | RAMS Digital",
  description:
    "Rack audits, platform demonstrations, operational solutions, partnerships and customer support. Contact RAMS Digital in Pune, with partner contacts in the United States, Australia and Ireland.",
};

/**
 * /company/contact — the hero, four points, and the footer.
 *
 *   01 Hero       dark      the reason left, the form right, the address under
 *   02 Trust      white     four points on data, access and support
 *   03 FAQ        offWhite  five questions, on the site's hairline rows
 *
 * The hero is the platform heroes' ground; the two sections under it are the
 * site's bare-column and address-block treatments. They exist because a page
 * that is only a form says nothing about who receives it or where they are.
 *
 * ── It had ten sections ─────────────────────────────────────────────
 * Routing cards, direct channels, what to bring, what happens next, four
 * locations, a support-and-safety pair, a FAQ and a close — all built from
 * the source document, all true, and none of it what a visitor came for.
 * Every section between the reader and the form is a section they scroll past
 * to reach it, so the page is now the form and the reason for it.
 *
 * Nothing important was lost. The footer already carries the registered
 * entity, the Pune address, the email and both numbers on every page, and the
 * form's own foot repeats the two direct channels for a reader who does not
 * want a form at all. `ContactRoutes`, `ContactDirect`, `ContactPrepare`,
 * `ContactNext`, `ContactGlobal`, `ContactSafety`, `ContactFAQ` and
 * `ContactCTA` are deleted rather than left unimported; the source document
 * is in `Downloads/07-09` if any of it is wanted back.
 *
 * ── The form posts nowhere, and says so ─────────────────────────────
 * It validates, builds a structured message and hands it to the visitor's
 * mail client through `mailto:`. That is the source document's own design and
 * the only honest option while no endpoint exists in this repository — see
 * the banner in `ContactForm`. The note under the button tells the reader in
 * plain words, which is the one thing a contact page cannot get wrong.
 */
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactTrust />
      <ContactFAQ />
    </>
  );
}
