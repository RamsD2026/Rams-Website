import { HeroVersioned } from "@/components/sections/HeroVersioned";
import { ProblemSelector } from "@/components/sections/ProblemSelector";
import { PhysicalOperation } from "@/components/sections/PhysicalOperation";
import { VisibilityGap } from "@/components/sections/VisibilityGap";

export default function HomePage() {
  return (
    <>
      <HeroVersioned />
      <ProblemSelector />
      <PhysicalOperation />
      <VisibilityGap />
    </>
  );
}
