"use client";

import { useNavVersion } from "@/components/ui/VersionSwitcher";
import { Hero } from "./Hero";
import { HeroV2 } from "./HeroV2";

export function HeroVersioned() {
  const [version] = useNavVersion();
  return version === "v2" ? <HeroV2 /> : <Hero />;
}
