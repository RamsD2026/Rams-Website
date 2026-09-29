"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { RAMSLogo } from "@/components/ui/RAMSLogo";
import { EASE, SURFACE } from "@/components/sections/rackiq/rackiq-shared";

/**
 * /platform/login — the sign-in screen.
 *
 * The announcement bar has carried a "Platform Login" link since the site was
 * written and it 404ed. This is the page it was pointing at.
 *
 * ── The reference ───────────────────────────────────────────────────
 * ServiceNow's sign-in, which is the screen most of RAMS's buyers already
 * sign into every morning: a split screen, brand and proof on the dark half,
 * nothing but the form on the white half, and an instance field above the
 * credentials because an enterprise customer's login is to *their* tenant,
 * not to a product. The vocabulary is taken; none of the artwork is. The
 * panel, the type and the orange are this site's own.
 *
 * ── Why it covers the site chrome ───────────────────────────────────
 * `fixed inset-0 z-50`, above the header's z-40. The root layout puts the
 * announcement bar, the mega-menu and the footer on every route, and a
 * sign-in screen with a marketing nav across the top reads as a form
 * embedded in a brochure. Covering them is one line here; excluding them
 * would mean moving every other route into a layout group.
 *
 * The panel scrolls inside itself, so a short laptop screen still reaches
 * the legal line at the bottom.
 *
 * ── The form does not sign anyone in ────────────────────────────────
 * There is no identity provider wired to this site, and a form that quietly
 * throws credentials away is worse than one that says so. It validates,
 * then states plainly that the endpoint is not connected and points at
 * support. Wire `onSubmit` to the real IdP and delete `NOT_WIRED`.
 *
 * Password managers need `autoComplete` on both fields to offer anything, so
 * they are set even while the endpoint is dark.
 */

/** Delete this, and the notice that reads it, when the IdP is connected. */
const NOT_WIRED =
  "Sign-in is not connected yet. Your RAMS administrator provisions platform access — contact support and we will get you in.";

const PROOF = [
  {
    icon: ShieldCheck,
    title: "Your tenant, your data",
    body: "Each customer runs in an isolated instance. Nothing is pooled and nothing is shared across estates.",
  },
  {
    icon: KeyRound,
    title: "Single sign-on ready",
    body: "SAML and OIDC against your own directory, so access follows the joiner-mover-leaver process you already run.",
  },
];

const field =
  "w-full px-3.5 py-3 text-[14px] text-carbon bg-white border border-[#E8E8ED] rounded-lg outline-none transition-shadow duration-200 placeholder:text-graphite/35 focus:ring-2 focus:ring-signal-orange/30 focus:border-signal-orange/40";

/**
 * The required marker is the contact form's: an orange asterisk after the
 * label, and `aria-hidden` on it because the input carries `required` and a
 * screen reader announces that itself — read out, the glyph is just "star".
 */
function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-1.5 text-[12px] font-semibold text-carbon"
    >
      {children}
      {required && (
        <span className="text-signal-orange" aria-hidden>
          {" "}
          *
        </span>
      )}
    </label>
  );
}

export function PlatformLogin() {
  const [instance, setInstance] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotice(null);

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Enter the work email your instance was provisioned with.");
      return;
    }
    if (password.length < 1) {
      setError("Enter your password.");
      return;
    }

    setError(null);
    setNotice(NOT_WIRED);
  };

  return (
    // Two independent halves: the dark panel holds still at full height and
    // only the form scrolls, so the brand and the proof stay on screen while
    // someone works down a long form on a short laptop. The scroll therefore
    // belongs to the right column, not to this container — hence
    // `overflow-hidden` here and `h-full` on the grid.
    <div className="fixed inset-0 z-50 bg-white overflow-hidden">
      <div className="h-full grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        {/* ── brand half ─────────────────────────────────────── */}
        <div
          // The logo, the words, then the legal line pushed to the floor by
          // `mt-auto`. `justify-between` sat here first and spread the three
          // evenly down the panel, which left a hand's width of empty dark
          // between the logo and the heading — the logo read as detached
          // rather than as the top of the same block.
          className="relative hidden lg:flex flex-col h-full overflow-hidden text-white px-12 xl:px-16 py-12"
          style={{ background: SURFACE.darkTop }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 55% at 15% 10%, rgba(255,106,0,0.20), transparent 70%)",
            }}
          />
          {/* The rack grid, drawn rather than photographed: the same motif the
              product pages use, at low contrast so the type stays first. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)",
              backgroundSize: "88px 64px",
              maskImage:
                "radial-gradient(75% 65% at 30% 45%, #000 20%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(75% 65% at 30% 45%, #000 20%, transparent 80%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative"
          >
            <RAMSLogo asLink className="h-9" variant="white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="relative mt-14 xl:mt-16 max-w-[520px]"
          >
            <p className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange">
              RAMS Operating System
            </p>
            <h2 className="mt-5 text-[38px] xl:text-[44px] font-bold leading-[1.08] tracking-[-0.035em]">
              <span className="block">The warehouse,</span>
              <span className="block">as it is right now.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-[1.6] text-white/55">
              Rack condition, inventory behaviour, machine health and open
              actions — one instance, one record, current to the shift.
            </p>

            <div className="mt-10 space-y-6">
              {PROOF.map((item) => (
                <div key={item.title} className="flex items-start gap-3.5">
                  <div className="mt-0.5 w-10 h-10 shrink-0 rounded-[10px] flex items-center justify-center border border-signal-orange/[0.18] bg-signal-orange/[0.08]">
                    <item.icon
                      className="w-[18px] h-[18px] text-signal-orange"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </div>
                  <div>
                    <p className="text-[14.5px] font-semibold tracking-[-0.01em] text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-[1.55] text-white/50">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <p className="relative mt-auto pt-12 mb-8 xl:mb-10 text-[12px] text-white/35">
            © 2026. All Rights Reserved by INODE RAMS BUILT ENV TECH PVT. LTD.
          </p>
        </div>

        {/* ── form half — the only half that scrolls ─────────── */}
        <div className="relative h-full overflow-y-auto">
          <div className="min-h-full flex flex-col px-6 sm:px-10 lg:px-14 xl:px-20 py-10 lg:py-12">
          <div className="flex items-center justify-between gap-4">
            <div className="lg:hidden">
              <RAMSLogo asLink className="h-8" variant="dark" />
            </div>
            <Link
              href="/"
              className="ml-auto inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-graphite/60 hover:text-carbon transition-colors duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden />
              Back to rams.digital
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="flex-1 flex flex-col justify-center py-10"
          >
            <div className="w-full max-w-[420px] mx-auto">
              <p className="text-[11px] font-mono font-semibold tracking-[0.22em] uppercase text-signal-orange">
                Platform access
              </p>
              <h1 className="mt-4 text-[32px] sm:text-[36px] font-bold leading-[1.1] tracking-[-0.035em] text-carbon">
                Sign in
              </h1>
              <p className="mt-3 text-[14px] leading-[1.6] text-graphite/60">
                Use the work email your RAMS instance was provisioned with.
              </p>

              <form onSubmit={onSubmit} noValidate className="mt-8">
                <div className="mb-4">
                  <Label htmlFor="instance">
                    Instance{" "}
                    <span className="font-normal text-graphite/45">
                      (optional)
                    </span>
                  </Label>
                  <div className="flex items-stretch">
                    <input
                      id="instance"
                      name="instance"
                      type="text"
                      inputMode="text"
                      autoComplete="organization"
                      placeholder="your-company"
                      value={instance}
                      onChange={(e) => setInstance(e.target.value)}
                      className={field + " rounded-r-none"}
                    />
                    <span className="inline-flex items-center px-3 text-[13px] text-graphite/50 bg-[#F6F6F7] border border-l-0 border-[#E8E8ED] rounded-r-lg">
                      .rams.digital
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-[1.5] text-graphite/45">
                    Leave blank and we will find your instance from your email.
                  </p>
                </div>

                <div className="mb-4">
                  <Label htmlFor="email" required>Work email</Label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(error)}
                    className={field}
                  />
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <Label htmlFor="password" required>Password</Label>
                    <Link
                      href="/company/contact"
                      className="mb-1.5 text-[12px] font-semibold text-signal-orange hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={reveal ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={Boolean(error)}
                      className={field + " pr-11"}
                    />
                    <button
                      type="button"
                      onClick={() => setReveal(!reveal)}
                      aria-label={reveal ? "Hide password" : "Show password"}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center text-graphite/45 hover:text-carbon transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-signal-orange/30"
                    >
                      {reveal ? (
                        <EyeOff className="w-[17px] h-[17px]" aria-hidden />
                      ) : (
                        <Eye className="w-[17px] h-[17px]" aria-hidden />
                      )}
                    </button>
                  </div>
                </div>

                <label className="mt-4 flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    className="w-4 h-4 shrink-0 accent-[#FF6A00]"
                  />
                  <span className="text-[12.5px] text-graphite/65">
                    Keep me signed in on this device
                  </span>
                </label>

                {error && (
                  <p
                    role="alert"
                    className="mt-4 flex items-start gap-2 text-[12.5px] leading-[1.5] text-[#E5484D]"
                  >
                    <TriangleAlert
                      className="w-4 h-4 mt-px shrink-0"
                      aria-hidden
                    />
                    {error}
                  </p>
                )}

                {notice && (
                  <div
                    role="status"
                    className="mt-5 px-4 py-3.5 rounded-lg border border-[#E8E8ED] bg-[#FAFAFA]"
                  >
                    <p className="text-[12.5px] leading-[1.55] text-graphite/70">
                      {NOT_WIRED}
                    </p>
                    <Link
                      href="/company/contact"
                      className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-signal-orange hover:underline underline-offset-4"
                    >
                      Contact support
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-signal-orange text-white text-[14px] font-semibold px-7 py-3.5 rounded-lg transition-colors duration-200 hover:bg-signal-orange-hover outline-none focus-visible:ring-2 focus-visible:ring-signal-orange/40 focus-visible:ring-offset-2"
                >
                  Sign in
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </button>

                <div className="my-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-[#E8E8ED]" />
                  <span className="text-[11px] font-mono font-semibold tracking-[0.18em] uppercase text-graphite/40">
                    or
                  </span>
                  <span className="h-px flex-1 bg-[#E8E8ED]" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setNotice(NOT_WIRED);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-carbon px-7 py-3.5 rounded-lg border border-[#E8E8ED] transition-colors duration-200 hover:bg-[#FAFAFA] outline-none focus-visible:ring-2 focus-visible:ring-carbon/20"
                >
                  <ShieldCheck className="w-4 h-4" aria-hidden />
                  Continue with single sign-on
                </button>
              </form>

              <p className="mt-8 text-[12.5px] leading-[1.6] text-graphite/55">
                Trouble signing in?{" "}
                <Link
                  href="/resources/faqs"
                  className="font-semibold text-signal-orange hover:underline underline-offset-4"
                >
                  Visit the help centre
                </Link>{" "}
                or{" "}
                <Link
                  href="/company/contact"
                  className="font-semibold text-signal-orange hover:underline underline-offset-4"
                >
                  contact us
                </Link>
                .
              </p>
            </div>
          </motion.div>

          <p className="text-[11.5px] leading-[1.6] text-graphite/40">
            Protected access. By signing in you accept the{" "}
            <Link
              href="/legal/privacy"
              className="text-graphite/60 hover:text-carbon underline underline-offset-2"
            >
              privacy policy
            </Link>
            .{" "}
            <span className="lg:hidden">
              © 2026 INODE RAMS BUILT ENV TECH PVT. LTD.
            </span>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
