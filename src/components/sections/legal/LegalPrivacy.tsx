"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Cookie,
  Database,
  Globe,
  Lock,
  ShieldCheck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import {
  HUB_BOTTOM,
  HUB_CENTRE,
  HUB_POLICY,
  HUB_TOP,
  LEGAL_NAV,
  POLICY,
  UPDATED,
  type HubItem,
} from "./legal-data";

/**
 * /legal/privacy — laid out on the reference the owner supplied (a legal
 * hub: a short hero with its own local navigation, then topics as pairs and
 * single centred blocks, each an icon, a heading, a line and a link) and
 * built in the site's vocabulary: the About hero's light ground and orange
 * glow, the 48px orange-tinted tile, `signal-orange` links, and
 * `SectionHeader` for the policy itself.
 *
 * Every link on the page is an anchor on this page or an existing route —
 * `/legal/terms`, `/legal/cookies` and `/legal/accessibility` do not exist
 * yet, so nothing points at them.
 */

const TILE: React.CSSProperties = {
  borderRadius: 12,
  background: "rgba(255,106,0,0.08)",
  border: "1px solid rgba(255,106,0,0.18)",
};

function Glyph({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      className="w-14 h-14 flex items-center justify-center shrink-0"
      style={TILE}
    >
      <Icon
        className="w-[26px] h-[26px] text-signal-orange"
        strokeWidth={1.9}
        aria-hidden
      />
    </span>
  );
}

function More({ link: [label, href] }: { link: [string, string] }) {
  const cls =
    "group/more inline-flex items-center gap-0.5 text-[14.5px] font-semibold text-signal-orange hover:underline underline-offset-4";
  const body = (
    <>
      {label}
      <ChevronRight
        className="w-4 h-4 transition-transform duration-200 group-hover/more:translate-x-0.5"
        aria-hidden
      />
    </>
  );
  return href.startsWith("/") ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {body}
    </a>
  );
}

function rise(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.65, delay, ease: EASE },
  } as const;
}

/** A topic in a pair: left-aligned, as the reference sets its pairs. */
function Topic({ item, icon, i }: { item: HubItem; icon: LucideIcon; i: number }) {
  return (
    <motion.div {...rise(i * 0.08)} className="max-w-[440px]">
      <Glyph icon={icon} />
      <h2 className="mt-6 text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-carbon leading-[1.15]">
        {item.title}
      </h2>
      <p className="mt-3 text-[15px] leading-[1.65] text-graphite/70">
        {item.body}
      </p>
      <div className="mt-4">
        <More link={item.link} />
      </div>
      {item.more && (
        <>
          <p className="mt-7 text-[15px] leading-[1.65] text-graphite/70">
            {item.more.body}
          </p>
          <div className="mt-4">
            <More link={item.more.link} />
          </div>
        </>
      )}
    </motion.div>
  );
}

/** A topic on its own: centred, as the reference sets its single blocks. */
function Solo({ item, icon }: { item: HubItem; icon: LucideIcon }) {
  return (
    <motion.div
      {...rise()}
      className="flex flex-col items-center text-center max-w-[760px] mx-auto"
    >
      <Glyph icon={icon} />
      <h2 className="mt-6 text-[26px] sm:text-[30px] font-bold tracking-[-0.03em] text-carbon leading-[1.15]">
        {item.title}
      </h2>
      <p className="mt-3 text-[15px] leading-[1.65] text-graphite/70">
        {item.body}
      </p>
      <div className="mt-4">
        <More link={item.link} />
      </div>
    </motion.div>
  );
}

function Pair({
  items,
  icons,
}: {
  items: [HubItem, HubItem];
  icons: [LucideIcon, LucideIcon];
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-10 max-w-[960px] mx-auto">
      {items.map((it, i) => (
        <div key={it.title} className="md:flex md:justify-center">
          <Topic item={it} icon={icons[i]} i={i} />
        </div>
      ))}
    </div>
  );
}

/* ── 01 Hero ──────────────────────────────────────────────────────── */

export function LegalHero() {
  return (
    <section
      className="relative overflow-hidden"
      id="top"
      data-hero-tone="light"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, #FFFFFF 0%, #FBFBFC 55%, #F5F5F7 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 20%, rgba(255,106,0,0.10), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(#F0F0F2 1px, transparent 1px)," +
            "linear-gradient(90deg, #F0F0F2 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 45%, transparent 100%)",
        }}
      />

      <div className="relative rams-container pt-24 sm:pt-28 pb-20 sm:pb-24 lg:pb-28">
        {/* the local navigation, as the reference carries under its header */}
        <nav
          aria-label="Legal"
          className="relative z-[1] max-w-[1180px] mx-auto flex items-center justify-between gap-6 py-3.5 border-b border-[#E4E4E9]"
        >
          <span className="text-[17px] font-bold tracking-[-0.02em] text-carbon shrink-0">
            Legal
          </span>
          <ul className="flex items-center gap-5 sm:gap-6 overflow-x-auto no-scrollbar">
            {LEGAL_NAV.map(([label, href]) => (
              <li key={href} className="shrink-0">
                <a
                  href={href}
                  className="text-[12.5px] text-graphite/70 hover:text-carbon transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative z-[1] max-w-[900px] mx-auto text-center pt-16 sm:pt-20 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur"
            style={{ boxShadow: "inset 0 0 0 1px #E8E8ED" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-signal-orange" />
            <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-graphite/70">
              Privacy &amp; legal
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.1, ease: EASE }}
            className="mt-8 text-[46px] sm:text-[72px] lg:text-[92px] font-bold leading-[1.04] tracking-[-0.045em] text-carbon"
          >
            RAMS Digital Legal
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: EASE }}
            className="mt-6 max-w-[640px] mx-auto text-[15px] sm:text-[16px] text-graphite/65 leading-[1.6]"
          >
            Find privacy and legal information for the RAMS Digital website,
            platform and services.
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/* ── 02 The topics ────────────────────────────────────────────────── */

export function LegalHub() {
  return (
    <Section surface="white" id="overview">
      <div className="flex flex-col gap-24 sm:gap-28 lg:gap-32">
        <Pair items={HUB_TOP} icons={[Globe, Database]} />
        <Solo item={HUB_CENTRE} icon={ShieldCheck} />
        <Pair items={HUB_BOTTOM} icons={[UserCheck, Cookie]} />
        <Solo item={HUB_POLICY} icon={Lock} />
      </div>
    </Section>
  );
}

/* ── 03 The policy ────────────────────────────────────────────────── */

/**
 * The policy as a reader: the contents on the left, and only the selected
 * section on the right. Choosing a section swaps the panel; previous and next
 * step through them in order.
 *
 * Section ids stay addressable. A link to `#rights` — from the topics above,
 * or from anywhere else — selects that section and brings the policy into
 * view, so the hub's links keep working with one section shown at a time.
 */
export function LegalPolicy() {
  const [active, setActive] = useState(POLICY[0].id);
  const index = Math.max(
    0,
    POLICY.findIndex((c) => c.id === active),
  );
  const clause = POLICY[index];

  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.slice(1);
      if (!POLICY.some((c) => c.id === id)) return;
      setActive(id);
      document
        .getElementById("policy")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const go = (i: number) => {
    const next = POLICY[i];
    if (!next) return;
    setActive(next.id);
    // keep the address in step, without a jump
    history.replaceState(null, "", `#${next.id}`);
  };

  return (
    <Section surface="offWhite" id="policy" className="scroll-mt-20">
      <SectionHeader
        eyebrow="Privacy Policy"
        top="How we handle"
        bottom="Personal information."
        size="compact"
        body={`Last updated ${UPDATED}.`}
        className="!mb-12 sm:!mb-14"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 lg:gap-8 max-w-[1120px] mx-auto items-start">
        {/* contents */}
        <nav
          aria-label="Policy contents"
          className="lg:sticky lg:top-28 bg-white p-2"
          style={CARD}
        >
          <ol
            role="tablist"
            aria-orientation="vertical"
            className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar"
          >
            {POLICY.map((c, i) => {
              const on = c.id === active;
              return (
                <li key={c.id} className="shrink-0">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="policy-panel"
                    onClick={() => go(i)}
                    className={
                      "relative w-full flex items-center gap-3 text-left px-4 py-3 rounded-[10px] transition-colors duration-200 " +
                      (on
                        ? "bg-[rgba(255,106,0,0.07)] text-carbon"
                        : "text-graphite/60 hover:text-carbon hover:bg-[#F5F5F7]")
                    }
                  >
                    {on && (
                      <motion.span
                        layoutId="policy-active"
                        aria-hidden
                        className="hidden lg:block absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-full bg-signal-orange"
                        transition={{ duration: 0.3, ease: EASE }}
                      />
                    )}
                    <span
                      className={
                        "font-mono text-[11px] tabular-nums " +
                        (on ? "text-signal-orange" : "text-graphite/35")
                      }
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={
                        "text-[14px] leading-[1.35] whitespace-nowrap lg:whitespace-normal " +
                        (on ? "font-semibold" : "font-medium")
                      }
                    >
                      {c.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* the selected section */}
        <div
          id="policy-panel"
          role="tabpanel"
          className="bg-white p-7 sm:p-10 lg:p-12 min-h-[420px] flex flex-col"
          style={CARD}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={clause.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <span className="text-[11px] font-mono font-semibold tracking-[0.2em] uppercase text-signal-orange tabular-nums">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(POLICY.length).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-[26px] sm:text-[32px] font-bold tracking-[-0.03em] text-carbon leading-[1.15]">
                {clause.title}
              </h3>
              {clause.paras?.map((p) => (
                <p key={p} className={PARA}>
                  {p}
                </p>
              ))}
              {clause.list && (
                <ul className="mt-5 flex flex-col gap-3.5">
                  {clause.list.map((l) => (
                    <li
                      key={l}
                      className="flex gap-3 text-[15px] sm:text-[16px] leading-[1.7] text-graphite/75"
                    >
                      <span
                        aria-hidden
                        className="mt-[11px] w-1.5 h-1.5 rounded-full bg-signal-orange shrink-0"
                      />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              )}
              {clause.after?.map((p) => (
                <p key={p} className={PARA}>
                  {p}
                </p>
              ))}
              {clause.id === "security" && (
                <div className="mt-5">
                  <More
                    link={["Certifications & Security", "/company/certifications"]}
                  />
                </div>
              )}
            </motion.article>
          </AnimatePresence>

          {/* previous / next */}
          <div className="mt-auto pt-10">
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-[#EDEDF0]">
              {index > 0 ? (
                <button
                  type="button"
                  onClick={() => go(index - 1)}
                  className="group/prev inline-flex items-center gap-1 text-[14px] font-semibold text-graphite/60 hover:text-carbon transition-colors text-left"
                >
                  <ChevronLeft
                    className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover/prev:-translate-x-0.5"
                    aria-hidden
                  />
                  {POLICY[index - 1].title}
                </button>
              ) : (
                <span />
              )}
              {index < POLICY.length - 1 && (
                <button
                  type="button"
                  onClick={() => go(index + 1)}
                  className="group/next inline-flex items-center gap-1 text-[14px] font-semibold text-signal-orange text-right"
                >
                  {POLICY[index + 1].title}
                  <ChevronRight
                    className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover/next:translate-x-0.5"
                    aria-hidden
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

const CARD: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid #E8E8ED",
  boxShadow: "0 1px 2px rgba(0,0,0,0.02), 0 8px 24px -12px rgba(0,0,0,0.06)",
};

const PARA =
  "mt-5 text-[15px] sm:text-[16px] leading-[1.75] text-graphite/75";
