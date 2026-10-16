import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * /company/customers — a coming-soon page.
 *
 * The footer's Company column links here. It used to redirect to /clients
 * (by way of /industries), which put the same page behind seven footer
 * links. Customer stories will live here; until they do, this says so and
 * points to the client portfolio and to contact.
 *
 * Built on the 404's dark ground for the same reason the 404 is: the header
 * expects a dark hero unless a page declares `data-hero-tone="light"`. It is
 * a server component with no client JavaScript, and it is kept out of search
 * results until it has content.
 */

export const metadata: Metadata = {
  title: "Customers | RAMS",
  description: "Customer stories from RAMS deployments are coming soon.",
  robots: { index: false, follow: true },
};

export default function CustomersPage() {
  return (
    <section
      className="relative overflow-hidden text-white min-h-[100svh] flex items-center"
      style={{
        background:
          "radial-gradient(80% 100% at 50% 0%, #1D1D1F 0%, #0E0E0F 55%, #08080A 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 10%, rgba(255,106,0,0.18), transparent 70%)",
        }}
      />

      <div className="relative rams-container w-full pt-40 sm:pt-48 pb-24 sm:pb-28">
        <div className="max-w-[760px] mx-auto text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full rounded-full bg-signal-orange opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-orange" />
            </span>
            <span className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-white/70">
              Coming soon
            </span>
          </span>

          <h1 className="mt-7 text-[40px] sm:text-[60px] lg:text-[72px] font-bold leading-[1.04] tracking-[-0.04em]">
            <span className="block text-white">Customer stories</span>
            <span className="block text-white/45">are on their way.</span>
          </h1>

          <p className="mt-6 mx-auto text-[15px] sm:text-[16px] leading-[1.6] text-white/55 max-w-[560px]">
            We are putting together how warehouses run on RAMS — the problems
            they started with, what they deployed and what changed. Until then,
            see who we work with, or ask us directly.
          </p>

          <div className="mt-9 flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/clients"
              className="inline-flex items-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover"
            >
              See our clients
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 text-white text-[14px] font-semibold px-6 py-3 rounded-lg border border-white/15 transition-colors duration-200 hover:bg-white/[0.06]"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
