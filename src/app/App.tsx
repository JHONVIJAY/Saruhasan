import { NavbarMix } from "./components/NavbarMix";
import { HeroSolid } from "./components/HeroSolid";
import { Marquee } from "./components/Marquee";
import { WorkGrid } from "./components/WorkGrid";
import { ExperienceEditorial } from "./components/ExperienceEditorial";
import { AboutSpecs } from "./components/AboutSpecs";
import { Grain } from "./components/Grain";
import { CustomCursor } from "./components/ui/CustomCursor";
import { Preloader } from "./components/Preloader";
import { Footer } from "./components/Footer";
import { ReactLenis } from "lenis/react";

export default function App() {
  const lenisOptions = {
    duration: 1.5,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical' as const,
    gestureDirection: 'vertical' as const,
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  };

  return (
    <ReactLenis root options={lenisOptions}>
      <div className="relative min-h-screen bg-[#050505] text-[#EAEAEA] font-sans selection:bg-[#FFFFFF] selection:text-black md:cursor-none">
        <Preloader />
        <CustomCursor />
        <Grain />
        <NavbarMix />
        
        <main className="relative z-10 w-full pb-0">
          <HeroSolid />
          <Marquee />
          <WorkGrid />
          <ExperienceEditorial />
          <AboutSpecs />
        </main>
        
        <Footer />
      </div>
    </ReactLenis>
  );
}