"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function MheCTA() {
  return (
    <section className="bg-off-white-cool py-24 sm:py-28 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="mx-auto"
        style={{
          width: "min(1180px, calc(100% - 40px))",
          borderRadius: 28,
          padding: "58px",
          background: "linear-gradient(125deg, #FF6A00, #FF8A3C)",
          color: "#111",
          display: "grid",
          gridTemplateColumns: "1.25fr .75fr",
          gap: 30,
          alignItems: "center",
        }}
      >
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-[7px] h-[7px] rounded-full bg-white" />
            <span className="text-[12px] font-bold tracking-[0.14em] uppercase text-white">
              Safer fleets. Better throughput.
            </span>
          </div>

          <h2
            className="text-white font-bold leading-[1.05] tracking-[-0.03em]"
            style={{ fontSize: "clamp(28px, 3.4vw, 44px)", margin: "0 0 12px" }}
          >
            Make MHE movement visible, safer and more productive.
          </h2>

          <p
            className="text-white/85 leading-[1.6] m-0"
            style={{ maxWidth: 700, fontSize: 15 }}
          >
            Talk to RAMS Digital about MHE safety monitoring, fleet utilisation
            analysis and connected movement intelligence for your warehouse.
          </p>
        </div>

        <Link
          href="/book-a-demo"
          className="inline-flex items-center justify-center gap-2 bg-carbon text-white font-semibold text-[15px] px-7 py-4 rounded-md transition-all duration-200 hover:-translate-y-px hover:bg-carbon-alt justify-self-end"
          style={{ minWidth: 220 }}
        >
          Book a Discussion
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </motion.div>

      <style>{`
        @media (max-width: 900px) {
          section > div[style*="1.25fr"] {
            grid-template-columns: 1fr !important;
          }
          section > div[style*="1.25fr"] a {
            justify-self: start !important;
          }
        }
        @media (max-width: 560px) {
          section > div[style*="1.25fr"] {
            padding: 34px !important;
            width: calc(100% - 26px) !important;
          }
        }
      `}</style>
    </section>
  );
}
