/**
 * The six enquiry types, shared by the form and the routing cards.
 *
 * Both sections in the source document list the same six — the form's
 * "Enquiry type" select and the "Choose the right conversation" cards — so
 * they live here once. Two hand-typed copies of one list is how the client
 * strips on this site drifted apart before they were pulled into
 * `src/data/clients.ts`.
 *
 * The form carried a `guide` on each of these — a three-part panel beside the
 * fields saying what context helps and what happens next. That panel is gone;
 * a second column of reading material beside the only thing on the page a
 * visitor came to use is a form nobody reaches. Section 03 routes by type and
 * section 05 says what to bring, which is where that belongs.
 */

export type EnquiryType = {
  /** Used as the form value and the anchor. */
  id: string;
  /** The mono code on the routing card. */
  code: string;
  /** The label in the form's chips and select. */
  label: string;
  /** The routing card's heading. */
  title: string;
  /** The routing card's line. */
  body: string;
  /** The routing card's call to action. */
  cta: string;
};

export const ENQUIRIES: EnquiryType[] = [
  {
    id: "demo",
    code: "DEMO",
    label: "Platform demo",
    title: "Explore the platform",
    body: "See Digital Twin, operational applications and management intelligence in a relevant workflow.",
    cta: "Request a demonstration",
  },
  {
    id: "audit",
    code: "AUDIT",
    label: "Rack audit",
    title: "Book a rack audit",
    body: "Discuss facility scope, rack types, inspection objectives and required certification pathway.",
    cta: "Discuss an audit",
  },
  {
    id: "solution",
    code: "SOLN",
    label: "Solution enquiry",
    title: "Solve an operational problem",
    body: "Explore safety, productivity, inventory, maintenance or customer-specific applications.",
    cta: "Start solution discovery",
  },
  {
    id: "partnership",
    code: "PART",
    label: "Partnership",
    title: "Build a partnership",
    body: "Discuss technology integration, channel collaboration or field-delivery capability.",
    cta: "Talk partnerships",
  },
  {
    id: "support",
    code: "HELP",
    label: "Customer support",
    title: "Existing customer support",
    body: "Provide the affected site, module, issue and operational impact for efficient triage.",
    cta: "Prepare a support enquiry",
  },
  {
    id: "careers",
    code: "TEAM",
    label: "Careers",
    title: "Join RAMS Digital",
    body: "Share your profile, relevant work and the career area where you can contribute.",
    cta: "Contact the careers team",
  },
];

/** The published contact points, used by three sections. */
export const EMAIL = "connect@rams.digital";
export const PHONE_1 = "+91 91758 70099";
export const PHONE_2 = "+91 90286 38907";
/**
 * `tel:` wants digits and a leading plus, and nothing else. Stripping only
 * spaces leaves the US number as `tel:+1347-342-7021` — a hyphen is legal in
 * the URI but some dialers keep it, and the published forms of these four
 * numbers use spaces, hyphens and neither. Strip everything that is not a
 * digit or the plus, once, here.
 */
export const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;
