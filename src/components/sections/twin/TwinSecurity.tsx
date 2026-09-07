"use client";

import { motion } from "framer-motion";
import {
  Server,
  KeyRound,
  Lock,
  Boxes,
  ScrollText,
  FileKey,
} from "lucide-react";
import { EASE, Section } from "@/components/sections/rackiq/rackiq-shared";
import { SectionHeader } from "@/components/sections/SectionHeader";

/**
 * 10 — Security.
 *
 * The six requirements an enterprise procurement team asks about before a
 * platform touches the floor, answered plainly.
 *
 * Note what this section deliberately does not do: it shows no certification
 * badges. A logo wall is the easiest thing on this page to fake and the
 * hardest for a reader to verify, so the closing line says where the actual
 * attestations come from instead. Do not add badge images here without the
 * certificates to back them.
 */

const LINE = "rgba(255,255,255,0.10)";

const ITEMS = [
  {
    icon: Server,
    k: "Deployment choice",
    v: "Run it in our cloud, in your cloud tenancy, or entirely on premise. The model, the history and the inference can all stay inside your perimeter.",
  },
  {
    icon: KeyRound,
    k: "Access control",
    v: "Role-based access down to the site, zone and module. SSO through your identity provider, with the same groups and leavers process you already run.",
  },
  {
    icon: Lock,
    k: "Encryption",
    v: "Encrypted in transit and at rest. Device-to-edge and edge-to-platform traffic is authenticated per device, not per network.",
  },
  {
    icon: Boxes,
    k: "Data isolation",
    v: "One tenant's model, telemetry and history are separated from every other tenant's. Nothing is pooled across customers to train anything.",
  },
  {
    icon: ScrollText,
    k: "Audit trails",
    v: "Who changed what, when, and what it looked like before. The twin already keeps state history — the audit log is the same mechanism applied to people.",
  },
  {
    icon: FileKey,
    k: "Data ownership",
    v: "Your facility data is yours. Export it in full, at any point, in open formats — including the model geometry and the asset history.",
  },
];

export function TwinSecurity() {
  return (
    <Section surface="darkMid" id="security">
      <SectionHeader
        eyebrow="Security"
        top="Built to meet"
        bottom="Enterprise trust requirements."
        tone="dark"
        size="compact"
        width="wide"
        body="A twin of your facility is a map of how you operate. It gets handled accordingly."
      />

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px"
        style={{ background: LINE }}
      >
        {ITEMS.map((it, i) => (
          <motion.div
            key={it.k}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
            className="px-7 py-9 flex flex-col"
            style={{ background: "#0C0C0F", minHeight: 230 }}
          >
            <it.icon
              className="w-5 h-5 text-signal-orange"
              strokeWidth={1.6}
              aria-hidden
            />
            <h3 className="mt-6 text-[19px] font-bold leading-[1.2] tracking-[-0.02em] text-white">
              {it.k}
            </h3>
            <p className="mt-3 text-[14px] leading-[1.6] text-white/55">
              {it.v}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="mt-10 px-6 py-5 rounded-xl"
        style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${LINE}` }}
      >
        <p className="text-[12px] font-mono leading-[1.75] text-white/40 max-w-[86ch]">
          {"//"} We do not put certification badges on a web page. Current
          attestations, penetration test summaries, data processing terms and
          the deployment architecture for your chosen model are provided
          directly to your security team during procurement, under NDA.
        </p>
      </motion.div>
    </Section>
  );
}
