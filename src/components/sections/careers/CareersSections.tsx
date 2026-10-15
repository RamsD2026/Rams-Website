"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";
import {
  DISCIPLINES,
  FAQS,
  GROWTH,
  JOURNEY,
  LOOP,
  MISSION,
  MODULE_CHIPS,
  APPLY_EVENT,
  OUTCOMES,
  PRINCIPLES,
  STACK,
  TODAY,
  TOWARD,
  TRANSPARENCY,
} from "./careers-data";

/**
 * The careers page below the explorer, in the order of DXC's careers page
 * after its categories: a talent-network band, then "about the company"
 * content, then how hiring works, then a close. The content is all RAMS's —
 * `careers-data`, from `RAMS_Digital_Careers.html`.
 */

const HAIR = "#E8E8ED";
const DHAIR = "rgba(255,255,255,0.09)";

const reveal = (i = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.6, delay: i * 0.06, ease: EASE },
});

/** Opens the general application in `CareersIntro`'s apply flow. */
function ShareProfile() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(APPLY_EVENT))}
      className="inline-flex items-center justify-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-full transition-colors hover:bg-signal-orange-hover"
    >
      Share your profile
      <ArrowRight className="w-4 h-4" aria-hidden />
    </button>
  );
}

function ViewRoles() {
  return (
    <a
      href="#jobs"
      className="inline-flex items-center justify-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-full border border-white/15 transition-colors hover:bg-white/[0.06]"
    >
      View open roles
      <ArrowUpRight className="w-4 h-4" aria-hidden />
    </a>
  );
}

/* ── 03 the talent network ────────────────────────────────────────── */

export function CareersTalent() {
  return (
    <Section surface="darkMid" padding="tight" id="talent">
      <motion.div
        {...reveal()}
        className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-8 items-center"
        style={{
          background:
            "radial-gradient(70% 120% at 0% 0%, rgba(255,106,0,0.22) 0%, transparent 60%), linear-gradient(135deg, #17171B 0%, #0C0C0F 100%)",
          boxShadow: `inset 0 0 0 1px ${DHAIR}`,
        }}
      >
        <div>
          <p className="text-[11px] font-mono font-semibold tracking-[0.2em] uppercase text-signal-orange">
            Talent network
          </p>
          <h2 className="mt-4 text-[30px] sm:text-[42px] font-bold tracking-[-0.035em] leading-[1.08] text-white">
            No exact vacancy? Share your profile anyway.
          </h2>
          <p className="mt-4 max-w-[600px] text-[15px] leading-[1.65] text-white/55">
            Send your profile, portfolio or relevant work samples with a short
            note on the problems you want to solve. We will be in touch when
            the fit is right.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:flex-col lg:items-stretch">
          <ShareProfile />
          <ViewRoles />
        </div>
      </motion.div>
    </Section>
  );
}

/* ── 04 why RAMS ──────────────────────────────────────────────────── */

export function CareersWhy() {
  return (
    <Section surface="offWhite" id="mission">
      <SectionHeader
        eyebrow="Why RAMS Digital exists"
        top="Make physical operations"
        bottom="Visible, understood and improved."
        size="compact"
        width="wide"
        body="Physical operations create enormous amounts of movement, risk and work. Too much of it is still invisible, fragmented or understood too late."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MISSION.map((m, i) => (
          <motion.div
            key={m.n}
            {...reveal(i)}
            className="p-6 rounded-2xl bg-white"
            style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
          >
            <p className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
              {m.n} · {m.verb}
            </p>
            <h3 className="mt-4 text-[19px] font-bold tracking-[-0.02em] text-carbon leading-[1.25]">
              {m.title}
            </h3>
            <p className="mt-2.5 text-[14px] leading-[1.65] text-graphite/65">{m.body}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...reveal()} className="p-7 sm:p-8 rounded-2xl bg-white" style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}>
          <p className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-graphite/45">
            How physical operations are often managed
          </p>
          <ul className="mt-5 space-y-3.5">
            {TODAY.map((t) => (
              <li key={t} className="flex items-start gap-3 text-[14.5px] leading-[1.55] text-graphite/70">
                <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-[#FDECEC] shrink-0">
                  <X className="w-3 h-3 text-[#D93D3D]" aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          {...reveal(1)}
          className="p-7 sm:p-8 rounded-2xl text-white"
          style={{ background: "linear-gradient(135deg, #17171B 0%, #0C0C0F 100%)" }}
        >
          <p className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
            What we are building toward
          </p>
          <ul className="mt-5 space-y-3.5">
            {TOWARD.map((t) => (
              <li key={t} className="flex items-start gap-3 text-[14.5px] leading-[1.55] text-white/80">
                <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-signal-orange/15 shrink-0">
                  <Check className="w-3 h-3 text-signal-orange" aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </Section>
  );
}

/* ── 05 how teams work, and what you may build ────────────────────── */

export function CareersTeams() {
  return (
    <Section surface="white" id="teams">
      <SectionHeader
        eyebrow="How teams work"
        top="Product, engineering and the field"
        bottom="Work as one system."
        size="compact"
        width="wide"
        body="RAMS problems cross software, hardware, structural safety, operations and customer delivery. Solving them well requires people who can connect disciplines."
        className="!mb-10 sm:!mb-12"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DISCIPLINES.map((d, i) => (
            <motion.div
              key={d.title}
              {...reveal(i)}
              className="p-6 rounded-2xl bg-[#F5F5F7]"
            >
              <h3 className="text-[17px] font-bold tracking-[-0.02em] text-carbon">{d.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-graphite/65">{d.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...reveal(2)}
          className="relative p-7 sm:p-8 rounded-2xl text-white overflow-hidden"
          style={{ background: "linear-gradient(135deg, #17171B 0%, #0C0C0F 100%)" }}
        >
          <p className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
            One problem · shared ownership
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {OUTCOMES.map((o) => (
              <div key={o.title} className="p-4 rounded-xl" style={{ boxShadow: `inset 0 0 0 1px ${DHAIR}`, background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[16px] font-bold tracking-[-0.02em] text-white">{o.title}</p>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-white/50">{o.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

export function CareersBuild() {
  return (
    <Section surface="darkMid" id="build">
      <SectionHeader
        eyebrow="What you may build"
        top="A physical operating system,"
        bottom="One layer at a time."
        tone="dark"
        size="compact"
        width="wide"
        body="The work spans the digital representation of a facility, live operational data, edge intelligence, application workflows and management insight."
        className="!mb-10 sm:!mb-12"
      />

      <div className="max-w-[860px] mx-auto space-y-2.5">
        {STACK.map((s, i) => (
          <motion.div
            key={s.n}
            {...reveal(i)}
            className="flex items-center gap-4 sm:gap-6 px-5 sm:px-7 py-4 sm:py-5 rounded-2xl"
            style={{
              boxShadow: `inset 0 0 0 1px ${DHAIR}`,
              background: `linear-gradient(90deg, rgba(255,106,0,${0.04 + (STACK.length - i) * 0.03}) 0%, rgba(255,255,255,0.02) 100%)`,
            }}
          >
            <span className="text-[22px] sm:text-[26px] font-bold tracking-[-0.03em] text-signal-orange tabular-nums w-10 shrink-0">
              {s.n}
            </span>
            <div className="min-w-0">
              <p className="text-[15.5px] sm:text-[17px] font-semibold tracking-[-0.01em] text-white">{s.title}</p>
              <p className="mt-0.5 text-[13px] text-white/50">{s.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {MODULE_CHIPS.map((m) => (
          <span
            key={m}
            className="px-3.5 py-1.5 rounded-full text-[12.5px] font-mono font-semibold text-white/75 border border-white/10 bg-white/[0.03]"
          >
            {m}
          </span>
        ))}
      </div>
    </Section>
  );
}

/* ── 06 how we work ───────────────────────────────────────────────── */

export function CareersHowWeWork() {
  return (
    <Section surface="offWhite" id="experience">
      <SectionHeader
        eyebrow="Field-to-product loop"
        top="Your work gets"
        bottom="Tested by reality."
        size="compact"
        width="wide"
        body="The strongest ideas survive contact with the warehouse floor. Field observations, customer workflows and live operating data continuously improve the product."
        className="!mb-10 sm:!mb-12"
      />

      <ol className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {LOOP.map((l, i) => (
          <motion.li
            key={l.title}
            {...reveal(i)}
            className="relative p-5 rounded-2xl bg-white"
            style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
          >
            <span className="text-[11px] font-mono font-bold tracking-[0.16em] text-signal-orange tabular-nums">
              0{i + 1}
            </span>
            <h3 className="mt-2.5 text-[16px] font-bold tracking-[-0.02em] text-carbon">{l.title}</h3>
            <p className="mt-1.5 text-[13px] leading-[1.55] text-graphite/60">{l.body}</p>
          </motion.li>
        ))}
      </ol>

      <h3 className="mt-16 sm:mt-20 text-center text-[24px] sm:text-[30px] font-bold tracking-[-0.03em] text-carbon">
        Principles for building in the physical world.
      </h3>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRINCIPLES.map((p, i) => (
          <motion.div
            key={p.n}
            {...reveal(i)}
            className="p-6 rounded-2xl bg-white"
            style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}
          >
            <p className="text-[28px] font-bold tracking-[-0.04em] text-signal-orange/80 tabular-nums leading-none">{p.n}</p>
            <h4 className="mt-4 text-[17px] font-bold tracking-[-0.02em] text-carbon">{p.title}</h4>
            <p className="mt-2 text-[14px] leading-[1.65] text-graphite/65">{p.body}</p>
          </motion.div>
        ))}
      </div>

      <h3 className="mt-16 sm:mt-20 text-center text-[24px] sm:text-[30px] font-bold tracking-[-0.03em] text-carbon">
        Grow by connecting disciplines.
      </h3>
      <p className="mt-3 mx-auto max-w-[680px] text-center text-[14.5px] leading-[1.65] text-graphite/60">
        A career at RAMS can expose you to software, hardware, structural safety,
        warehouse operations and enterprise transformation — depending on your role.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {GROWTH.map((g, i) => (
          <motion.div key={g.title} {...reveal(i)} className="p-6 rounded-2xl bg-white" style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}>
            <h4 className="text-[16px] font-bold tracking-[-0.02em] text-carbon">{g.title}</h4>
            <p className="mt-2 text-[13.5px] leading-[1.6] text-graphite/65">{g.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ── 07 hiring ────────────────────────────────────────────────────── */

export function CareersHiring() {
  return (
    <Section surface="white" id="hiring">
      <SectionHeader
        eyebrow="Candidate journey"
        top="A hiring process built"
        bottom="For mutual clarity."
        size="compact"
        width="wide"
        body="The sequence may vary by role, but you should understand the work, team and expectations before a decision."
        className="!mb-10 sm:!mb-12"
      />

      <ol className="relative grid grid-cols-1 lg:grid-cols-5 gap-4">
        <span aria-hidden className="hidden lg:block absolute top-5 left-[10%] right-[10%] h-px bg-signal-orange/30" />
        {JOURNEY.map((j, i) => (
          <motion.li key={j.title} {...reveal(i)} className="relative flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center">
            <span className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-signal-orange text-white text-[13px] font-bold tabular-nums shrink-0">
              {i + 1}
            </span>
            <div>
              <h3 className="lg:mt-4 text-[16px] font-bold tracking-[-0.02em] text-carbon">{j.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.6] text-graphite/60 lg:max-w-[200px]">{j.body}</p>
            </div>
          </motion.li>
        ))}
      </ol>

      <motion.div
        {...reveal()}
        className="mt-16 p-7 sm:p-9 rounded-3xl bg-[#F5F5F7]"
      >
        <p className="text-[11px] font-mono font-bold tracking-[0.18em] uppercase text-signal-orange">
          Know what you are applying for
        </p>
        <p className="mt-3 text-[15px] leading-[1.6] text-graphite/65 max-w-[640px]">
          Every published opening should make the essential working conditions
          and expectations clear.
        </p>
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRANSPARENCY.map((t) => (
            <div key={t.title} className="p-5 rounded-2xl bg-white" style={{ boxShadow: `inset 0 0 0 1px ${HAIR}` }}>
              <h4 className="text-[15px] font-bold tracking-[-0.01em] text-carbon">{t.title}</h4>
              <p className="mt-1.5 text-[13px] leading-[1.6] text-graphite/60">{t.body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

/* ── 08 FAQ ───────────────────────────────────────────────────────── */

function Toggle({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative w-3.5 h-3.5 shrink-0 mt-1">
      <span className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-signal-orange" />
      <motion.span
        className="absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 rounded-full origin-center bg-signal-orange"
        initial={false}
        animate={{ scaleY: open ? 0 : 1 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </span>
  );
}

export function CareersFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section surface="offWhite" id="faq">
      <SectionHeader
        eyebrow="Careers FAQ"
        top="Before you"
        bottom="Apply."
        size="compact"
        width="wide"
        className="!mb-10 sm:!mb-12"
      />
      <div className="max-w-[900px] mx-auto" style={{ borderTop: `1px solid #E0E0E6` }}>
        {FAQS.map((item, i) => {
          const on = open === i;
          return (
            <div key={item.q} style={{ borderBottom: `1px solid #E0E0E6` }}>
              <button
                type="button"
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
                className="w-full flex items-start justify-between gap-6 text-left py-6 group"
              >
                <span
                  className={
                    "text-[16px] sm:text-[17px] font-bold tracking-[-0.015em] leading-[1.4] transition-colors duration-300 " +
                    (on ? "text-carbon" : "text-carbon/85 group-hover:text-carbon")
                  }
                >
                  {item.q}
                </span>
                <Toggle open={on} />
              </button>
              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="pb-7 pr-10 text-[14.5px] leading-[1.7] text-graphite/65">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ── 09 close ─────────────────────────────────────────────────────── */

export function CareersClose() {
  return (
    <Section surface="darkBottom" id="join">
      <div className="max-w-[820px] mx-auto text-center">
        <motion.p {...reveal()} className="text-[11px] font-mono font-semibold tracking-[0.2em] uppercase text-signal-orange">
          Join RAMS Digital
        </motion.p>
        <motion.h2
          {...reveal(1)}
          className="mt-5 text-[34px] sm:text-[52px] lg:text-[62px] font-bold tracking-[-0.04em] leading-[1.05] text-white"
        >
          Bring your craft to
          <span className="block text-white/45">the physical world.</span>
        </motion.h2>
        <motion.p {...reveal(2)} className="mt-6 mx-auto max-w-[600px] text-[15.5px] leading-[1.65] text-white/55">
          Tell us what you have built, what you understand and where you believe
          you can contribute. If the fit is right, let&rsquo;s explore the
          problem together.
        </motion.p>
        <motion.div {...reveal(3)} className="mt-9 flex flex-wrap justify-center gap-3">
          <ShareProfile />
          <ViewRoles />
        </motion.div>
        <p className="mt-10 text-[12px] leading-[1.6] text-white/30">
          Role availability and employment terms are confirmed during the hiring process.
        </p>
      </div>
    </Section>
  );
}
