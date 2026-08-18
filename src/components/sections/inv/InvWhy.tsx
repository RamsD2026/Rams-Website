"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const AUDIENCES = [
  {
    n: "01",
    eyebrow: "For operations",
    title: "Find any pallet in seconds.",
    body: "Operators locate stock, resolve exceptions and confirm inventory without walking, radioing or opening a spreadsheet.",
    image: UNSPLASH("photo-1553413077-190dd305871c"),
  },
  {
    n: "02",
    eyebrow: "For finance",
    title: "Trust the number on the balance sheet.",
    body: "Continuous reconciliation replaces provisions, adjustments and end-of-quarter surprises with real-time inventory value.",
    image: UNSPLASH("photo-1454165804606-c3d57bc86b40"),
  },
  {
    n: "03",
    eyebrow: "For leadership",
    title: "Compare every site on one framework.",
    body: "Accuracy, coverage, drift and shrink normalised across the network — regional and global performance in one view.",
    image: UNSPLASH("photo-1600880292203-757bb62b4baf"),
  },
];

export function InvWhy() {
  return (
    <section className="bg-[#F5F5F7] pt-28 sm:pt-36 lg:pt-44 pb-28 sm:pb-36 lg:pb-44 overflow-hidden">
      <div className="rams-container">
        <div className="max-w-[900px] mx-auto text-center mb-20 sm:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange mb-5"
          >
            Why RAMS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, ease: EASE }}
            className="text-[40px] sm:text-[60px] lg:text-[78px] font-bold text-carbon leading-[1.0] tracking-[-0.04em]"
          >
            Built for everyone <br />
            <span className="text-graphite/50">who touches inventory.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="mt-8 text-[17px] sm:text-[19px] text-graphite/65 leading-[1.6] max-w-[620px] mx-auto"
          >
            One system of record — but three purposeful surfaces, so every
            team sees the version of the truth that matters to their work.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {AUDIENCES.map((aud, i) => (
            <AudienceCard key={aud.n} data={aud} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AudienceCard({
  data,
  index,
}: {
  data: (typeof AUDIENCES)[number];
  index: number;
}) {
  return (
    <motion.article
      initial="rest"
      animate="rest"
      whileHover="hover"
      className="group relative overflow-hidden cursor-pointer"
      style={{
        height: 500,
        borderRadius: 24,
      }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: index * 0.08, ease: EASE }}
      >
        {/* Media */}
        <motion.div
          className="absolute inset-0"
          variants={{
            rest: { scale: 1.04 },
            hover: { scale: 1.1 },
          }}
          transition={{ duration: 1, ease: EASE }}
          style={{
            background: `url(${data.image}) center/cover no-repeat`,
            willChange: "transform",
          }}
        />

        {/* Gradient overlays */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          variants={{
            rest: { opacity: 0.85 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 25%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.9) 100%)",
          }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            background:
              "linear-gradient(180deg, transparent 30%, rgba(255,106,0,0.35) 85%, rgba(255,106,0,0.7) 100%)",
          }}
        />

        {/* Number badge */}
        <div className="absolute top-6 left-6 z-10">
          <span className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase text-white/70">
            {data.eyebrow}
          </span>
        </div>

        {/* Content */}
        <motion.div
          className="absolute inset-x-0 bottom-0 p-7 sm:p-8"
          variants={{
            rest: { y: 0 },
            hover: { y: -4 },
          }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <h3 className="text-white text-[24px] sm:text-[28px] font-bold leading-[1.15] tracking-[-0.02em]">
            {data.title}
          </h3>
          <p className="mt-3 text-white/80 text-[14.5px] leading-[1.6]">
            {data.body}
          </p>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
