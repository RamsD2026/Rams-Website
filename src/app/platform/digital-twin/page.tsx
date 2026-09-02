import type { Metadata } from "next";
import { TwinHero } from "@/components/sections/twin/TwinHero";
import { TwinGap } from "@/components/sections/twin/TwinGap";
import { TwinCreate } from "@/components/sections/twin/TwinCreate";
import { TwinPlanning } from "@/components/sections/twin/TwinPlanning";
import { TwinTransition } from "@/components/sections/twin/TwinTransition";
import { TwinAttach } from "@/components/sections/twin/TwinAttach";
import { TwinStack } from "@/components/sections/twin/TwinStack";
import { TwinSignal } from "@/components/sections/twin/TwinSignal";
import { TwinAI } from "@/components/sections/twin/TwinAI";
import { TwinEdge } from "@/components/sections/twin/TwinEdge";
import { TwinLifecycle } from "@/components/sections/twin/TwinLifecycle";
import { TwinAsset } from "@/components/sections/twin/TwinAsset";
import { TwinProof } from "@/components/sections/twin/TwinProof";
import { TwinApps } from "@/components/sections/twin/TwinApps";
import { TwinSensors } from "@/components/sections/twin/TwinSensors";
import { TwinCTA } from "@/components/sections/twin/TwinCTA";

export const metadata: Metadata = {
  title: "Digital Twin | RAMS Platform",
  description:
    "One live spatial model of your warehouse that every RAMS system reads from and writes back to — every rack, bay, pallet, vehicle and task with a single address the whole operation agrees on.",
};

export default function DigitalTwinPage() {
  return (
    <>
      <TwinHero />
      <TwinGap />
      <TwinCreate />
      <TwinPlanning />
      <TwinTransition />
      <TwinAttach />
      <TwinStack />
      <TwinSignal />
      <TwinAI />
      <TwinEdge />
      <TwinLifecycle />
      <TwinAsset />
      <TwinProof />
      <TwinApps />
      <TwinSensors />
      <TwinCTA />
    </>
  );
}
