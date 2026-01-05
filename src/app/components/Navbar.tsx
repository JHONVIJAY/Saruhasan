import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [time, setTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAlt, setShowAlt] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAlt((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { label: "Works", href: "#works" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
    <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 md:py-6 flex justify-between items-start transition-all duration-700",
          "bg-white/10 backdrop-blur-2xl border-b border-white/30 shadow-xl shadow-black/50",
          scrolled && "bg-white/15 backdrop-blur-3xl border-b border-white/40 shadow-2xl shadow-black/70"
        )}
    >
        {/* Logo with Dual Identity */}
        <motion.div
          className="cursor-pointer group"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="flex flex-col relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={showAlt ? "john" : "saruhasan"}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="font-bold text-base md:text-lg tracking-tight text-white leading-none"
                  >
                    {showAlt ? "JOHN" : "SARUHASAN S."}
                  </motion.span>
                </AnimatePresence>
                <span className="font-mono text-[9px] md:text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
                  Engineer / Creator
                </span>
            </div>
        </motion.div>

        {/* Desktop Menu */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-2.5 rounded-full hidden md:flex gap-8 items-center">
            {menuItems.map((item, index) => (
              <a 
                key={item.href}
                href={item.href} 
                className="relative text-xs font-mono uppercase tracking-widest text-white/70 hover:text-white transition-colors duration-500 group/link"
              >
                {item.label}
                <motion.span 
                  className="absolute -bottom-1 left-0 h-[1px] bg-sky-400 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: "100%" }}
                />
              </a>
            ))}
        </div>

        {/* Mobile Menu Button */}
        <motion.button 
            onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
            }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden text-white p-2 -mr-2 relative z-[100] bg-[#050505]/95 backdrop-blur-xl border border-white/20 rounded-md touch-manipulation"
            aria-label="Toggle menu"
        >
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileMenuOpen ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </AnimatePresence>
        </motion.button>

        {/* Desktop Time & Status */}
        <div className="text-right hidden md:block">
            <div className="font-mono text-xs text-white/50">{time} IST</div>
            <motion.div 
              className="flex items-center justify-end gap-2 mt-1 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <span className="font-mono text-sm text-white/70 hover:text-white transition-colors duration-500">Available</span>
            </motion.div>
        </div>
    </motion.nav>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
    {mobileMenuOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] bg-[#050505]/98 backdrop-blur-lg md:hidden"
        >
            <div className="flex flex-col items-center justify-center h-full gap-12 px-4 pt-20">
                {menuItems.map((item, index) => (
                  <motion.a 
                      key={item.href}
                      href={item.href} 
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -30, opacity: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        ease: [0.22, 1, 0.36, 1],
                        delay: index * 0.1 
                      }}
                      onClick={(e) => {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          setTimeout(() => {
                              document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
                          }, 300);
                      }}
                      className="relative text-5xl font-bold uppercase tracking-tight text-white hover:text-sky-400 transition-colors duration-500 group"
                  >
                      {item.label}
                      <motion.span 
                        className="absolute -bottom-2 left-0 h-[2px] bg-sky-400 origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        style={{ width: "100%" }}
                      />
                  </motion.a>
                ))}
                
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3 
                  }}
                  className="mt-12 text-center"
                >
                    <div className="font-mono text-xs text-white/50 mb-3">{time} IST</div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        <span className="font-mono text-sm text-white/70">Available for work</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )}
    </AnimatePresence>
    </>
  );
}