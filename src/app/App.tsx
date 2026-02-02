import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { NavbarMix } from "./components/NavbarMix";
import { Grain } from "./components/Grain";
import { CustomCursor } from "./components/ui/CustomCursor";
import { Preloader } from "./components/Preloader";
import { Footer } from "./components/Footer";
import { ReactLenis } from "lenis/react";
import { Home } from "./pages/Home";
import { VoidPage } from "./pages/VoidPage";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { YouTubeDownloader } from "./components/YouTubeDownloader";
import { useEffect } from "react";
import { Toaster } from "sonner";

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
        <Toaster position="top-right" theme="dark" />
        <div className="relative min-h-screen bg-[#050505] text-[#EAEAEA] font-sans selection:bg-[#FFFFFF] selection:text-black md:cursor-none" style={{ position: 'relative' }}>
          <Preloader />
          <CustomCursor />
          <Grain />
          
          <Routes>
            {/* Admin Routes (No Navbar/Footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Public Routes (With Navbar/Footer) */}
            <Route path="/" element={
              <>
                <NavbarMix />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/void" element={
              <>
                <NavbarMix />
                <VoidPage />
                <Footer />
              </>
            } />
            <Route path="/downloader" element={
              <>
                <NavbarMix />
                <YouTubeDownloader />
                <Footer />
              </>
            } />
            
            {/* Catch-all route for 404s */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ReactLenis>
  );
}