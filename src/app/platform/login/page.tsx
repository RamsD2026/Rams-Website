import type { Metadata } from "next";
import { PlatformLogin } from "@/components/sections/login/PlatformLogin";

export const metadata: Metadata = {
  title: "Sign in — RAMS Platform",
  description:
    "Sign in to your RAMS instance: rack condition, inventory behaviour, machine health and open actions in one operating system.",
  // A sign-in screen has nothing for a search engine and should not be the
  // result someone lands on when they search the product.
  robots: { index: false, follow: false },
};

/**
 * /platform/login.
 *
 * The announcement bar's "Platform Login" pointed here from the start and
 * the route did not exist. `PlatformLogin` is the whole page — it covers the
 * site chrome deliberately; see the note in that file.
 */
export default function PlatformLoginPage() {
  return <PlatformLogin />;
}
