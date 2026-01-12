import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
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
    // Disable browser's default scroll restoration to prevent conflicts
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    if (hash) {
      // If there is a hash, scroll to it with a slight delay to ensure content is rendered
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // If no hash (new page), scroll to top immediately
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
            {/* Catch-all route for 404s */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Footer />
        </div>
      </BrowserRouter>
    </ReactLenis>
  );
}