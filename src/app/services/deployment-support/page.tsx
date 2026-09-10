import type { Metadata } from "next";
import { ServicePage } from "@/components/sections/services/ServiceShell";
import { SERVICE_BY_SLUG } from "@/components/sections/services/service-data";

const service = SERVICE_BY_SLUG["deployment-support"];

export const metadata: Metadata = {
  title: "Deployment and Support | RAMS Digital",
  description: service.meta,
};

/**
 * /services/deployment-support
 *
 * The page is the record. Every section, its order, its copy and its caveats
 * live in `service-data`; the layout, surfaces and motion live in
 * `ServiceShell`, which all six services share. See `service-types` for why
 * the sections are a list rather than fixed slots.
 */
export default function DeploymentSupportPage() {
  return <ServicePage service={service} />;
}
