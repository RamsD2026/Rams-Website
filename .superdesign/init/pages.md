# Page dependency trees

The candidate `--context-file` set for each page. Apply the PAYLOAD BUDGET rule
— do not pass a whole tree blindly.

## The bundle that matters

Almost every section file imports exactly two things beyond framer-motion and
lucide:

```
src/components/sections/rackiq/rackiq-shared.tsx   ← surfaces, tone table, Section, chrome
src/components/sections/SectionHeader.tsx          ← the section header + page header
```

So the **minimum useful context for designing any page here** is those two plus
`src/app/globals.css` (or the compact summary in `theme.md`), plus one built
reference page's sections. Everything else is page-specific.

## /hardware/ai-vision
Entry: `src/app/hardware/ai-vision/page.tsx`
Local dependency files: 0

- (none)

## /solutions/rack-safety-intelligence
Entry: `src/app/solutions/rack-safety-intelligence/page.tsx`
Local dependency files: 10

- src/components/sections/irds/IrdsHero.tsx
- src/components/sections/irds/IrdsStatsBand.tsx
- src/components/sections/irds/IrdsCapabilities.tsx
- src/components/sections/irds/IrdsFeaturePanels.tsx
- src/components/sections/irds/IrdsWorkflow.tsx
- src/components/sections/irds/IrdsRackHealth.tsx
- src/components/sections/irds/IrdsRiskAnalytics.tsx
- src/components/sections/irds/IrdsWhy.tsx
- src/components/sections/irds/IrdsProofResults.tsx
- src/components/sections/irds/IrdsCTA.tsx

## /solutions/inventory-intelligence
Entry: `src/app/solutions/inventory-intelligence/page.tsx`
Local dependency files: 11

- src/components/sections/inv/InvHero.tsx
- src/components/sections/inv/InvStatsBand.tsx
- src/components/sections/inv/InvFeatures.tsx
- src/components/sections/inv/InvABC.tsx
- src/components/sections/inv/InvATOS.tsx
- src/components/sections/inv/InvFeaturePanels.tsx
- src/components/sections/inv/InvWorkflow.tsx
- src/components/sections/inv/InvAnalytics.tsx
- src/components/sections/inv/InvWhy.tsx
- src/components/sections/inv/InvProofResults.tsx
- src/components/sections/inv/InvCTA.tsx

## /solutions/warehouse-execution
Entry: `src/app/solutions/warehouse-execution/page.tsx`
Local dependency files: 10

- src/components/sections/wex/WexHero.tsx
- src/components/sections/wex/WexStatsBand.tsx
- src/components/sections/wex/WexCapabilities.tsx
- src/components/sections/wex/WexFeaturePanels.tsx
- src/components/sections/wex/WexWorkflow.tsx
- src/components/sections/wex/WexReprioritisation.tsx
- src/components/sections/wex/WexAnalytics.tsx
- src/components/sections/wex/WexWhy.tsx
- src/components/sections/wex/WexProofResults.tsx
- src/components/sections/wex/WexCTA.tsx

## /platform/irds
Entry: `src/app/platform/irds/page.tsx`
Local dependency files: 20

- src/components/sections/rds/RdsHero.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx
  - src/components/ui/background-beams.tsx
    - src/lib/utils.ts
  - src/components/sections/rackiq/RiqClients.tsx
    - src/data/clients.ts
- src/components/sections/rds/RdsProblem.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx
- src/components/sections/rds/RdsOverview.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/rds/RdsHow.tsx
  - src/components/sections/twin/TwinFacility.tsx
    - src/components/sections/twin/twin-plan.ts
  - src/components/sections/rds/RdsPanels.tsx
    - src/components/sections/twin/TwinPanels.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/rds/RdsCapabilities.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/rds/RdsExperience.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/rds/RdsOutcomes.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/rds/RdsIntegrations.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/rds/RdsFAQ.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/rds/RdsCTA.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)

## /platform/digital-twin
Entry: `src/app/platform/digital-twin/page.tsx`
Local dependency files: 21

- src/components/sections/twin/TwinHero.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx
  - src/components/ui/background-beams.tsx
    - src/lib/utils.ts
  - src/components/sections/rackiq/RiqClients.tsx
    - src/data/clients.ts
  - src/components/sections/twin/TwinScene.tsx
    - src/components/sections/twin/twin-plan.ts
- src/components/sections/twin/TwinProblem.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx
- src/components/sections/twin/TwinOverview.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/twin/TwinHow.tsx
  - src/components/sections/twin/TwinFacility.tsx
    - src/components/sections/twin/twin-plan.ts  (listed above)
  - src/components/sections/twin/TwinPanels.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/twin/TwinLayers.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/twin/TwinExperience.tsx
  - src/components/sections/twin/TwinFacility.tsx  (listed above)
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/twin/TwinOutcomes.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/twin/TwinIntegrations.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/twin/TwinProof.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/twin/TwinFAQ.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/twin/TwinCTA.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)

## /platform/meps
Entry: `src/app/platform/meps/page.tsx`
Local dependency files: 20

- src/components/sections/meps/MepsHero.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx
  - src/components/ui/background-beams.tsx
    - src/lib/utils.ts
  - src/components/sections/rackiq/RiqClients.tsx
    - src/data/clients.ts
- src/components/sections/meps/MepsProblem.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx
- src/components/sections/meps/MepsCapture.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/meps/MepsHow.tsx
  - src/components/sections/twin/TwinFacility.tsx
    - src/components/sections/twin/twin-plan.ts
  - src/components/sections/meps/MepsPanels.tsx
    - src/components/sections/twin/TwinPanels.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/meps/MepsCapabilities.tsx
  - src/components/sections/twin/TwinFacility.tsx  (listed above)
  - src/components/sections/meps/MepsPanels.tsx  (listed above)
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/meps/MepsExperience.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/meps/MepsIntegrations.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/meps/MepsProof.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/meps/MepsFAQ.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)
  - src/components/sections/SectionHeader.tsx  (listed above)
- src/components/sections/meps/MepsCTA.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx  (listed above)

## /services/rack-inspection
Entry: `src/app/services/rack-inspection/page.tsx`
Local dependency files: 5

- src/components/sections/services/ServiceShell.tsx
  - src/components/sections/rackiq/rackiq-shared.tsx
  - src/components/sections/SectionHeader.tsx
  - src/components/sections/services/service-types.ts
- src/components/sections/services/service-data.ts
  - src/components/sections/services/service-types.ts  (listed above)

## / (home)
Entry: `src/app/page.tsx`
Local dependency files: 26

- src/components/sections/HeroVersioned.tsx
  - src/components/ui/VersionSwitcher.tsx
    - src/lib/utils.ts
  - src/components/sections/Hero.tsx
  - src/components/sections/HeroV2.tsx
- src/components/sections/SectionsVersioned.tsx
  - src/components/ui/VersionSwitcher.tsx  (listed above)
  - src/components/sections/PlatformReveal.tsx
  - src/components/sections/EcosystemSection.tsx
  - src/components/sections/ChallengeSelector.tsx
  - src/components/sections/OperationShowcase.tsx
  - src/components/sections/ThreeWaysToStart.tsx
  - src/components/sections/BentoGrid.tsx
    - src/components/ui/glowing-effect.tsx
      - src/lib/utils.ts  (listed above)
    - src/components/ui/AIVisionWidget.tsx
    - src/components/ui/InventoryWidget.tsx
    - src/components/ui/DigitalTwinWidget.tsx
  - src/components/sections/ProblemSelector.tsx
  - src/components/sections/PhysicalOperation.tsx
  - src/components/sections/VisibilityGap.tsx
  - src/components/sections/WhyRAMS.tsx
  - src/components/sections/TechnologySystems.tsx
  - src/components/sections/IndustriesCarousel.tsx
    - src/components/sections/IndustryModal.tsx
  - src/components/sections/TrustCinematic.tsx
  - src/components/sections/CustomerSuccess.tsx
  - src/components/sections/FinalCTA.tsx

