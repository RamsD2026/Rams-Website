"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const AUDIENCES = [
  {
    n: "01",
    title: "Safety teams",
    body: "Prioritise risk and maintain visibility on open corrective actions.",
    image: UNSPLASH("photo-1553413077-190dd305871c"),
  },
  {
    n: "02",
    title: "Warehouse teams",
    body: "Know exactly where each issue exists without searching through long reports.",
    image: UNSPLASH("photo-1586528116311-ad8dd3c8310d"),
  },
  {
    n: "03",
    title: "Leadership",
    body: "Compare rack health and closure performance across sites with a common framework.",
    image: UNSPLASH("photo-1600880292203-757bb62b4baf"),
  },
];

export function IrdsWhy() {
  return (
    <section className="bg-off-white-cool py-24 sm:py-32 lg:py-40 overflow-hidden">
      <div className="rams-container">
        {/* Header — stacked, left-aligned */}
        <div className="max-w-[860px] mb-14 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-4"
          >
            Why RAMS
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-carbon leading-[1.04] tracking-[-0.03em]"
          >
            Built for the{" "}
            <span className="text-signal-orange">
              full rack-safety lifecycle.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-base sm:text-lg text-graphite/60 leading-[1.65] max-w-[620px]"
          >
            RAMS is not an inspection vendor — it is the intelligence layer
            that connects inspection, engineering evidence, action tracking
            and ongoing rack safety.
          </motion.p>
        </div>

        {/* Image cards — 3-up */}
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
      className="group relative overflow-hidden cursor-pointer rounded-lg"
      style={{
        height: 460,
      }}
    >
      {/* Entrance wrapper */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      >
        {/* Media */}
        <motion.div
          className="absolute inset-0"
          variants={{
            rest: { scale: 1.04 },
            hover: { scale: 1.1 },
          }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            background: `url(${data.image}) center/cover no-repeat`,
            willChange: "transform",
          }}
        />

        {/* Bottom gradient overlay */}
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
              "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.88) 100%)",
          }}
        />

        {/* Orange bottom gradient on hover */}
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
              "linear-gradient(180deg, transparent 30%, rgba(255,106,0,0.45) 85%, rgba(255,106,0,0.85) 100%)",
          }}
        />

        {/* Content */}
        <motion.div
          className="absolute inset-x-0 bottom-0 p-6 sm:p-7"
          variants={{
            rest: { y: 0 },
            hover: { y: -4 },
          }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <h3 className="text-white text-2xl sm:text-[26px] font-semibold leading-[1.15] tracking-[-0.02em]">
            {data.title}
          </h3>
          <p className="mt-2.5 text-white/80 text-[14px] leading-[1.55]">
            {data.body}
          </p>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
