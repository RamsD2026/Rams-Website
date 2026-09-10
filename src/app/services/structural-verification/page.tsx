import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/services/ServiceShell";
import { SERVICE_BY_SLUG } from "@/components/sections/services/service-data";

const service = SERVICE_BY_SLUG["structural-verification"];

export const metadata: Metadata = {
  title: "Structural Verification | RAMS Digital",
  description: service.meta,
};

/**
 * /services/structural-verification
 *
 * The page is the record. Every section, its order, its copy and its caveats
 * live in `service-data`; the layout, surfaces and motion live in
 * `ServiceShell`, which all six services share. See `service-types` for why
 * the sections are a list rather than fixed slots.
 */
export default function StructuralVerificationPage() {
  return <ServicePage service={service} />;
}
