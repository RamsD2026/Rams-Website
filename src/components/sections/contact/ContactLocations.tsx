"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { EASE } from "@/components/sections/rackiq/rackiq-shared";
import { EMAIL, PHONE_1, PHONE_2, tel } from "./contact-data";

/**
 * The address block, at the foot of the hero.
 *
 * The registered address and the three published partner locations, as an
 * address block rather than as cards: a small icon, then the line. Addresses
 * are read, not chosen between, and a box around each one turns a set of
 * details into a set of options.
 *
 * ── It is inside the hero, not a section of its own ─────────────────
 * It renders no `Section` and no `SectionHeader` — `ContactHero` owns the
 * surface and this sits under its two columns behind a hairline. A page whose
 * whole content is a form and a set of contact details does not need the
 * details introduced by an eyebrow, a two-line heading and a subline; the two
 * column headings say what they are.
 *
 * ── Everything is written for the dark ground ───────────────────────
 * White type, `rgba(255,255,255,0.10)` rules, orange icons. It ran on a light
 * offWhite surface before it moved up here, and carrying the light values
 * into a dark hero is the mistake this file exists to not make: graphite at
 * 0.60 on white and white at 0.60 on near-black are not the same contrast, so
 * the values are picked against this ground rather than translated from the
 * old one.
 *
 * ── The office and the partners are labelled differently ────────────
 * "Address" for Pune and "Global partners" for the other three, which is the
 * source document's own distinction and the one that matters: RAMS has one
 * office and three partner presences. A single heading over all four would
 * claim four offices.
 *
 * That is also why the office is the wider column and carries the registered
 * entity, both numbers and the mailbox, while a partner carries a place and a
 * number. The layout states the difference the labels are making.
 *
 * The source document's hedge — that availability, territory and service
 * scope should be confirmed per location — sat under this block until it was
 * removed on request. The two headings are now the only thing separating an
 * office from a partner presence, so they should stay as they are.
 *
 * ── Every number is a link ──────────────────────────────────────────
 * `tel:` through the shared helper, which strips everything but digits and
 * the leading plus — the four numbers are published with spaces, hyphens and
 * neither, and a dialler should not have to guess. Same reason the footer's
 * numbers are links.
 */

const RULE = "rgba(255,255,255,0.10)";

const PARTNERS: { country: string; lines: string[]; phone: string }[] = [
  {
    country: "USA",
    lines: ["California, 92651", "United States"],
    phone: "+1 347-342-7021",
  },
  {
    country: "Australia",
    lines: ["Queanbeyan West", "NSW 2620, Australia"],
    phone: "+61 424 243 514",
  },
  {
    country: "Ireland",
    lines: ["Crossreagh, Mullagh", "Ireland"],
    phone: "+353 89 457 7198",
  },
];

const link =
  "font-semibold text-white/85 hover:text-signal-orange transition-colors duration-200";

function Row({
  icon: Icon,
  children,
}: {
  icon: typeof MapPin;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <Icon
        className="w-[16px] h-[16px] mt-[3px] shrink-0 text-signal-orange"
        strokeWidth={2}
        aria-hidden
      />
      <span className="flex flex-col gap-0.5">{children}</span>
    </div>
  );
}

export function ContactLocations() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="mt-16 sm:mt-20 pt-12 sm:pt-14"
      style={{ borderTop: `1px solid ${RULE}` }}
      id="locations"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 lg:gap-16">
        {/* ── the office ───────────────────────────── */}
        <div>
          <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-white leading-[1.2]">
            Address
          </h2>

          <div className="mt-6 flex flex-col gap-5">
            <Row icon={MapPin}>
              <span className="text-[14px] font-semibold text-white/85 leading-[1.5]">
                INODE RAMS BUILT ENV TECH PVT. LTD.
              </span>
              <span className="text-[14px] text-white/50 leading-[1.5]">
                5th Floor, Sadanand Business Centre, Baner, Pune – 411045
              </span>
            </Row>

            <Row icon={Phone}>
              <span className="text-[14px] leading-[1.5]">
                <a href={tel(PHONE_1)} className={link}>
                  {PHONE_1}
                </a>
                <span className="mx-2 text-white/20">|</span>
                <a href={tel(PHONE_2)} className={link}>
                  {PHONE_2}
                </a>
              </span>
            </Row>

            <Row icon={Mail}>
              <a
                href={`mailto:${EMAIL}`}
                className={link + " text-[14px] w-fit leading-[1.5]"}
              >
                {EMAIL}
              </a>
            </Row>
          </div>
        </div>

        {/* ── the partners ─────────────────────────── */}
        <div className="lg:pl-16 lg:border-l" style={{ borderColor: RULE }}>
          <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-white leading-[1.2]">
            Global partners
          </h2>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-9">
            {PARTNERS.map((p) => (
              <div key={p.country} className="flex flex-col">
                <span className="text-[15px] font-semibold tracking-[-0.02em] text-white leading-[1.3]">
                  {p.country}
                </span>

                <div className="mt-3.5 flex flex-col gap-3.5">
                  <Row icon={MapPin}>
                    {p.lines.map((l) => (
                      <span
                        key={l}
                        className="text-[13.5px] text-white/50 leading-[1.5]"
                      >
                        {l}
                      </span>
                    ))}
                  </Row>

                  <Row icon={Phone}>
                    <a
                      href={tel(p.phone)}
                      className={link + " text-[13.5px] w-fit leading-[1.5]"}
                    >
                      {p.phone}
                    </a>
                  </Row>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
