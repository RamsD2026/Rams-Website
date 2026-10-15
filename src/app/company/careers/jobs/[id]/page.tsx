import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JobPage } from "@/components/sections/careers/JobPage";
import { getJob, listedJobs } from "@/components/sections/careers/jobs-data";

/**
 * /company/careers/jobs/[id] — one role's page.
 *
 * Built at build time for every listed role (`listedJobs()`), and nothing
 * else: `dynamicParams = false` makes any other id a 404. While there are no
 * real roles, the listed roles are the labelled samples (see `jobs-data`).
 *
 * Sample roles are marked noindex so a search engine is never taught a
 * vacancy that does not exist.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return listedJobs().map((j) => ({ id: j.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return { title: "Role not found | RAMS Digital" };
  return {
    title: `${job.title} | Careers | RAMS Digital`,
    description: job.summary,
    robots: job.sample ? { index: false, follow: false } : undefined,
  };
}

export default async function JobRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();

  const all = listedJobs().filter((j) => j.id !== job.id);
  const others = [
    ...all.filter((j) => j.family === job.family),
    ...all.filter((j) => j.family !== job.family),
  ].slice(0, 3);

  return <JobPage job={job} others={others} />;
}
