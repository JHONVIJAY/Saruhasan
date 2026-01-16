import { HeroSolid } from "../components/HeroSolid";
import { Marquee } from "../components/Marquee";
import { WorkGrid } from "../components/WorkGrid";
import { ExperienceEditorial } from "../components/ExperienceEditorial";
import { AboutSpecs } from "../components/AboutSpecs";
import { SEO } from "../components/SEO";

export function Home() {
  return (
    <>
      <SEO />
      <div className="relative z-10 w-full pb-0">
        <HeroSolid />
        <Marquee />
        <WorkGrid />
        <ExperienceEditorial />
        <AboutSpecs />
      </div>
    </>
  );
}