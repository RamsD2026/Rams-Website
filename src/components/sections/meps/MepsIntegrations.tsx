"use client";

import { motion } from "framer-motion";
import { Database, Boxes, Truck, Cog, Radio, Shield } from "lucide-react";

const CATEGORIES = [
  {
    icon: Database,
    label: "WMS",
    items: ["SAP EWM", "Manhattan", "Blue Yonder", "Körber", "Infor"],
  },
  {
    icon: Boxes,
    label: "ERP",
    items: ["SAP S/4HANA", "Oracle", "Microsoft Dynamics", "NetSuite"],
  },
  {
    icon: Truck,
    label: "TMS",
    items: ["Manhattan TMS", "MercuryGate", "Transporeon"],
  },
  {
    icon: Cog,
    label: "MHE OEMs",
    items: ["Toyota", "Linde", "Jungheinrich", "Crown", "Hyster-Yale"],
  },
  {
    icon: Radio,
    label: "Identity and IoT",
    items: ["RFID", "BLE Beacons", "UWB", "LiDAR"],
  },
  {
    icon: Shield,
    label: "Safety and CCTV",
    items: ["Milestone", "Genetec", "Hikvision", "Axis"],
  },
];

export function MepsIntegrations() {
  return (
    <section className="bg-white py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-14">
        <div className="mb-14 sm:mb-20 max-w-[720px]">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
            className="text-[10.5px] font-mono font-bold tracking-[0.22em] uppercase text-signal-orange mb-4"
          >
            Integrations
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-[34px] sm:text-[46px] lg:text-[56px] font-bold text-carbon leading-[1.06] tracking-[-0.02em]"
          >
            Fits your stack.
            <br />
            <span className="text-signal-orange">Never dictates it.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-[15px] sm:text-[17px] text-graphite/60 leading-[1.65] max-w-[560px]"
          >
            MEPS is WMS-agnostic and OEM-neutral. Bring your existing systems —
            we connect through open APIs, standard protocols, and certified
            adapters.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-steel-soft border border-steel-soft">
          {CATEGORIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: (i % 3) * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="bg-white p-7 lg:p-9"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 border border-steel-soft bg-off-white-cool flex items-center justify-center">
                    <Icon
                      className="w-4 h-4 text-graphite"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold tracking-[0.22em] uppercase text-graphite/70">
                    {c.label}
                  </span>
                </div>

                <ul className="space-y-2.5">
                  {c.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-center gap-2.5 text-[14px] text-graphite/75"
                    >
                      <span className="w-1 h-1 bg-signal-orange shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 text-[13px] font-mono tracking-[0.14em] uppercase text-graphite/45 text-center"
        >
          Custom adapters available on request — REST · GraphQL · MQTT · OPC-UA · Kafka
        </motion.p>
      </div>
    </section>
  );
}
