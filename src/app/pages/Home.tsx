import { HeroSolid } from "../components/HeroSolid";
import { Marquee } from "../components/Marquee";
import { WorkGrid } from "../components/WorkGrid";
import { ExperienceEditorial } from "../components/ExperienceEditorial";
import { AboutSpecs } from "../components/AboutSpecs";

export function Home() {
  return (
    <main className="relative z-10 w-full pb-0">
      <HeroSolid />
      <Marquee />
      <WorkGrid />
      <ExperienceEditorial />
      <AboutSpecs />
    </main>
  );
}
