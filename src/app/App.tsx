import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { NavbarMix } from "./components/NavbarMix";
import { Grain } from "./components/Grain";
import { CustomCursor } from "./components/ui/CustomCursor";
import { Preloader } from "./components/Preloader";
import { Footer } from "./components/Footer";
import { ReactLenis } from "lenis/react";
import { Home } from "./pages/Home";
import { VoidPage } from "./pages/VoidPage";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // If there is a hash, scroll to it
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // If no hash (new page), scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

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
      <BrowserRouter>
        <ScrollToTop />
        <div className="relative min-h-screen bg-[#050505] text-[#EAEAEA] font-sans selection:bg-[#FFFFFF] selection:text-black md:cursor-none" style={{ position: 'relative' }}>
          <Preloader />
          <CustomCursor />
          <Grain />
          <NavbarMix />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/void" element={<VoidPage />} />
          </Routes>
          
          <Footer />
        </div>
      </BrowserRouter>
    </ReactLenis>
  );
}