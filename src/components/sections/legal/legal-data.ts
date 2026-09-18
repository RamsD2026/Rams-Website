import { EMAIL } from "@/components/sections/contact/contact-data";

/**
 * The privacy page's copy.
 *
 * DRAFT FOR LEGAL REVIEW. Every statement about this website was checked
 * against the code when it was written: the contact form hands the enquiry to
 * the visitor's own mail client (`ContactForm`, `mailto:`), the fonts are
 * self-hosted through `next/font`, and no analytics or advertising script is
 * loaded. If any of that changes — a form endpoint, an analytics tag, a
 * marketing pixel — this copy has to change with it.
 *
 * Nothing here names a retention period, a subprocessor or a certification
 * the company has not stated; those belong to the customer agreement.
 */

export const LEGAL_ENTITY = "INODE RAMS BUILT ENV TECH PVT. LTD.";
export const LEGAL_ADDRESS =
  "5th Floor, Sadanand Business Centre, Baner, Pune – 411045, India";
export const LEGAL_EMAIL = EMAIL;
export const UPDATED = "18 September 2026";

/** The hero's local navigation — every entry is an anchor on this page. */
export const LEGAL_NAV: [string, string][] = [
  ["Overview", "#overview"],
  ["Privacy Policy", "#policy"],
  ["Your rights", "#rights"],
  ["Cookies", "#cookies"],
  ["Contact", "#contact"],
];

export type HubItem = {
  title: string;
  body: string;
  link: [string, string];
  /** a second paragraph and link, as the reference's first two tiles carry */
  more?: { body: string; link: [string, string] };
};

export const HUB_TOP: [HubItem, HubItem] = [
  {
    title: "Website privacy",
    body: "What this website collects when you browse it or contact us, why, and who it is shared with.",
    link: ["Information we collect", "#collect"],
    more: {
      body: "Enquiries leave through your own email client — the site itself does not store what you type into the contact form.",
      link: ["How enquiries are handled", "#collect"],
    },
  },
  {
    title: "Platform data",
    body: "Operational data processed in the RAMS platform is governed by the agreement with each customer, not by this website notice.",
    link: ["Customer data", "#customer"],
    more: {
      body: "Scope, retention, locations and subprocessors are confirmed during diligence and set out in the contract.",
      link: ["Request the trust pack", `mailto:${EMAIL}?subject=RAMS%20Digital%20trust%20pack`],
    },
  },
];

export const HUB_CENTRE: HubItem = {
  title: "Security and assurance",
  body: "The standards, assurance evidence and security practices that support RAMS Digital, and what to ask for during diligence.",
  link: ["Visit Certifications & Security", "/company/certifications"],
};

export const HUB_BOTTOM: [HubItem, HubItem] = [
  {
    title: "Your rights",
    body: "Access, correct or erase the personal data we hold about you, withdraw consent, or raise a grievance.",
    link: ["Exercise your rights", "#rights"],
  },
  {
    title: "Cookies and storage",
    body: "This website does not set advertising or analytics cookies. What it does keep on your device, and why.",
    link: ["Read about cookies", "#cookies"],
  },
];

export const HUB_POLICY: HubItem = {
  title: "Privacy Policy",
  body: "RAMS Digital is committed to your privacy. Read the full policy for a clear explanation of how we collect, use, share, transfer and protect personal information, and how to contact us about it.",
  link: ["Read the Privacy Policy", "#policy"],
};

/* ── the policy ────────────────────────────────────────────────────── */

export type Clause = {
  id: string;
  title: string;
  paras?: string[];
  list?: string[];
  after?: string[];
};

export const POLICY: Clause[] = [
  {
    id: "who",
    title: "Who we are",
    paras: [
      `This policy is issued by ${LEGAL_ENTITY} ("RAMS Digital", "we", "us"), ${LEGAL_ADDRESS}. We are responsible for the personal data described in it.`,
      "It covers this website and the enquiries you send us. It does not cover data our customers process in the RAMS platform — see Customer data below.",
    ],
  },
  {
    id: "collect",
    title: "Information we collect",
    paras: ["We collect only what we need to respond to you and to run this website:"],
    list: [
      "What you send us. When you contact us — by email, by phone, or through the contact form — we receive the details you choose to give: typically your name, company, work email, phone number, country and the content of your message.",
      "How the contact form works. The form does not submit to our servers. It prepares an email in your own mail client, and nothing is sent until you send that email yourself.",
      "Technical data. Like any website, the servers that deliver these pages record standard request information — such as IP address, browser type, the page requested and the time of the request — to deliver, secure and troubleshoot the site.",
    ],
    after: ["We do not ask for, and ask you not to send, sensitive personal data through general enquiries."],
  },
  {
    id: "use",
    title: "How we use it",
    list: [
      "To respond to your enquiry and route it to the right product, engineering, delivery or support team.",
      "To arrange discovery calls, demonstrations and site visits you ask for.",
      "To provide support to existing customers.",
      "To operate, secure and improve this website.",
      "To meet legal, regulatory and accounting obligations.",
    ],
    after: ["We do not sell personal data, and we do not use it for automated decisions that have legal or similarly significant effects on you."],
  },
  {
    id: "share",
    title: "Who we share it with",
    list: [
      "Service providers who host this website and our email, acting on our instructions.",
      "RAMS partners in the region you are enquiring from, where that is needed to answer your enquiry — for example a partner who will carry out a site visit.",
      "Authorities, advisers or counterparties where the law requires it, or to establish, exercise or defend legal claims.",
    ],
  },
  {
    id: "transfer",
    title: "International transfers",
    paras: [
      "RAMS Digital is based in India and works with partners in other countries, and our hosting providers may process data outside India. Where personal data is transferred across borders, we do so in line with applicable law and with safeguards appropriate to the transfer.",
    ],
  },
  {
    id: "retain",
    title: "How long we keep it",
    paras: [
      "We keep enquiry correspondence for as long as it is needed to deal with the enquiry and any relationship that follows, and for any longer period the law requires. Technical request logs are kept for a limited period for security and troubleshooting.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paras: [
      "We use technical and organisational measures appropriate to the data we hold, to protect it against loss, misuse and unauthorised access. The practices and assurance evidence behind them are described on our Certifications & Security page.",
    ],
  },
  {
    id: "rights",
    title: "Your rights",
    paras: [
      "Depending on where you are — including under India's Digital Personal Data Protection Act, 2023 and, where it applies to you, the EU or UK GDPR — you may have the right to:",
    ],
    list: [
      "access the personal data we hold about you, and a summary of how it is processed;",
      "have inaccurate or incomplete data corrected or updated;",
      "have your data erased where it is no longer needed or the law allows;",
      "withdraw consent you have given, without affecting processing before withdrawal;",
      "object to or restrict certain processing;",
      "raise a grievance with us, and complain to the data protection authority where you live.",
    ],
    after: [`To exercise any of these, write to ${EMAIL}. We may need to verify your identity before we act on a request.`],
  },
  {
    id: "cookies",
    title: "Cookies and similar technologies",
    paras: [
      "This website does not set advertising or analytics cookies, and does not load third-party tracking scripts. Our fonts are served from our own domain.",
      "If that changes, we will update this section before any such technology is used and, where the law requires it, ask for your consent first.",
    ],
  },
  {
    id: "customer",
    title: "Customer data in the RAMS platform",
    paras: [
      "When an organisation uses the RAMS platform, the operational data it puts into the platform — including any personal data of its workforce — is processed on that customer's instructions, under the agreement between us. The customer decides the purpose; we process on its behalf.",
      "If you are an employee or contractor of a RAMS customer and have a question about that data, please contact your employer first. We will support them in responding.",
    ],
  },
  {
    id: "children",
    title: "Children",
    paras: ["This website and our services are intended for businesses. They are not directed to children, and we do not knowingly collect children's personal data."],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paras: ["We may update this policy from time to time. The date at the top of this policy shows when it was last changed; material changes will be highlighted on this page."],
  },
  {
    id: "contact",
    title: "Contact and grievances",
    paras: [
      `For any question, request or grievance about this policy or your personal data, contact us at ${EMAIL}, or write to ${LEGAL_ENTITY}, ${LEGAL_ADDRESS}.`,
    ],
  },
];
