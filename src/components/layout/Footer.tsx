"use client";

import Link from "next/link";
import { Globe, ShieldCheck } from "lucide-react";
import { RAMSLogo } from "@/components/ui/RAMSLogo";

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z" />
  </svg>
);

const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.08 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.11 3.18a4.65 4.65 0 0 1 1.24 3.22c0 4.61-2.81 5.63-5.48 5.92.42.36.81 1.09.81 2.2v3.26c0 .32.22.7.83.58A12 12 0 0 0 12 .3" />
  </svg>
);

type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

const COLUMNS: FooterColumn[] = [
  {
    title: "Solutions",
    links: [
      { label: "Rack Intelligence", href: "/solutions/rack-intelligence" },
      { label: "MHE Intelligence", href: "/solutions/mhe-intelligence" },
      { label: "Inventory Intelligence", href: "/solutions/inventory-intelligence" },
      { label: "Warehouse Execution", href: "/solutions/warehouse-execution" },
      { label: "Management Intelligence", href: "/solutions/management-intelligence" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Digital Twin", href: "/platform/digital-twin" },
      { label: "AI Operational Intelligence", href: "/platform/ai-operational-intelligence" },
      { label: "Execution Engine", href: "/platform/execution-engine" },
      { label: "Integrations", href: "/platform/integrations" },
      { label: "Security", href: "/platform/security" },
    ],
  },
  {
    title: "Hardware",
    links: [
      { label: "AI Cameras", href: "/hardware/ai-cameras" },
      { label: "OmniBox Edge", href: "/hardware/omnibox-edge" },
      { label: "OmniBox AI", href: "/hardware/omnibox-ai" },
      { label: "LiDAR", href: "/hardware/lidar" },
      { label: "Driver Monitoring", href: "/hardware/driver-monitoring" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "3PL & Logistics", href: "/industries/3pl-logistics" },
      { label: "Retail & E-commerce", href: "/industries/retail" },
      { label: "Manufacturing", href: "/industries/manufacturing" },
      { label: "Cold Chain", href: "/industries/cold-chain" },
      { label: "Automotive", href: "/industries/automotive" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company/about" },
      { label: "Customers", href: "/company/customers" },
      { label: "Careers", href: "/company/careers" },
      { label: "Newsroom", href: "/company/newsroom" },
      { label: "Contact", href: "/company/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/resources/docs" },
      { label: "Case Studies", href: "/resources/case-studies" },
      { label: "Whitepapers", href: "/resources/whitepapers" },
      { label: "Blog", href: "/resources/blog" },
      { label: "Support", href: "/resources/support" },
    ],
  },
];


const SOCIALS = [
  { icon: LinkedInIcon, href: "https://linkedin.com/company/rams", label: "LinkedIn" },
  { icon: XIcon, href: "https://x.com/rams", label: "X" },
  { icon: YouTubeIcon, href: "https://youtube.com/@rams", label: "YouTube" },
  { icon: GitHubIcon, href: "https://github.com/rams", label: "GitHub" },
];

const LEGAL = [
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Use", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Accessibility", href: "/legal/accessibility" },
  { label: "Sitemap", href: "/sitemap" },
];

export function Footer() {
  return (
    <footer className="w-full bg-surface-dark text-white">
      <div className="rams-container pt-[72px] pb-8">
        {/* Top: Brand + Link columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand block */}
          <div className="lg:col-span-3">
            <RAMSLogo className="h-8" variant="white" />
            <p className="mt-6 text-sm leading-[1.65] text-white/55 max-w-[280px]">
              Operational intelligence for the modern warehouse. Engineering,
              AI and real-time visibility — unified in one platform.
            </p>

            {/* Social icons */}
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/25 hover:bg-white/5 transition-all duration-200"
                >
                  <Icon width={14} height={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-x-14 gap-y-12">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-white tracking-[0.01em] leading-none">
                  {col.title}
                </h3>
                <ul className="mt-5 space-y-4">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm leading-[1.5] text-white/50 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mt-[60px] mb-14" />

        {/* Trust & Security — clean horizontal band */}
        <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-x-20 gap-y-10">
          {/* Left: eyebrow + heading inline */}
          <div className="flex-1 max-w-[640px]">
            <div className="inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[0.22em] uppercase text-signal-orange mb-4">
              <ShieldCheck size={13} strokeWidth={2} />
              <span>Trust &amp; Security</span>
            </div>
            <h3 className="font-semibold text-white text-2xl leading-[34px] tracking-[-0.015em]">
              Enterprise-grade security, audited and certified.
            </h3>
            <p className="text-white/50 mt-3 text-sm leading-[22px] max-w-[520px]">
              RAMS meets the security, privacy and reliability standards
              trusted by global enterprise operations.
            </p>
          </div>

          {/* Right: floating badges — no card, clean */}
          <div className="flex items-center shrink-0 gap-x-8">
            <div className="flex flex-col items-center gap-2.5">
              <img
                src="/Product/soc-type-1.jpg"
                alt="AICPA SOC 2"
                className="w-[88px] h-[88px] rounded-full object-cover block"
              />
              <span className="text-white/45 text-[10.5px] tracking-[0.14em] font-semibold uppercase">
                SOC 2
              </span>
            </div>
            <div className="flex flex-col items-center gap-2.5">
              <img
                src="/Product/soc-type-2.jpg"
                alt="AICPA SOC 2 Type I"
                className="w-[88px] h-[88px] rounded-full object-cover block"
              />
              <span className="text-white/45 text-[10.5px] tracking-[0.14em] font-semibold uppercase">
                SOC 2 · Type I
              </span>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-px bg-white/10 mt-[60px] mb-7" />

        {/* Bottom footer */}
        <div>
          {/* Row 1 — copyright + legal links, single baseline */}
          <div className="flex flex-wrap items-center min-h-10 gap-x-6 gap-y-2">
            <span className="text-white/45 text-base leading-6">
              © 2026 RAMS Global. All rights reserved.
            </span>
            {LEGAL.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-white/45 hover:text-white transition-colors duration-200 text-base leading-6"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Row 2 — region */}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-white/45 hover:text-white transition-colors duration-200 mt-4 text-base leading-6"
            aria-label="Change region"
          >
            <Globe size={14} strokeWidth={1.75} />
            <span>United Kingdom (EN)</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
