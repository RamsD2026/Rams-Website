"use client";

import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

const AUDIENCES = [
  {
    n: "01",
    title: "Safety teams",
    body: "Identify unsafe behaviour, review impact events, validate operator access and improve compliance in high-risk zones.",
    image: UNSPLASH("photo-1553413077-190dd305871c"),
  },
  {
    n: "02",
    title: "Operations teams",
    body: "Understand where fleet time is being spent, reduce idle behaviour and improve throughput using movement-based insights.",
    image: UNSPLASH("photo-1586528116311-ad8dd3c8310d"),
  },
  {
    n: "03",
    title: "Management",
    body: "Compare fleet usage, unsafe events and productivity trends across warehouses with a standard monitoring framework.",
    image: UNSPLASH("photo-1487017159836-4e23ece2e4cf"),
  },
  {
    n: "04",
    title: "Warehouse supervisors",
    body: "Spot unsafe behaviour, congestion and pallet-flow delays during shifts so teams can intervene quickly and keep operations moving efficiently.",
    image: UNSPLASH("photo-1587293852726-70cdb56c2866"),
  },
];

export function MheWhy() {
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
            MHE safety is{" "}
            <span className="text-signal-orange">
              operational control, not just tracking.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-base sm:text-lg text-graphite/60 leading-[1.65] max-w-[620px]"
          >
            RAMS is the MHE visibility and control layer that supports both
            safety improvement and measurable warehouse productivity — across
            teams and sites.
          </motion.p>
        </div>

        {/* Image cards — 4-up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: index * 0.06, ease: EASE }}
      >
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
