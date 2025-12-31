import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [time, setTime] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 md:py-6 flex justify-between items-start"
    >
        <div>
            <div className="flex flex-col">
                <span className="font-bold text-base md:text-lg tracking-tight text-white leading-none">SARUHASAN S.</span>
                <span className="font-mono text-[9px] md:text-[10px] text-white/50 uppercase tracking-widest">Engineer / Creator</span>
            </div>
        </div>

        {/* Desktop Menu */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full hidden md:flex gap-8">
            <a href="#works" className="text-xs font-mono uppercase tracking-widest text-white hover:text-sky-400 transition-colors">Works</a>
            <a href="#experience" className="text-xs font-mono uppercase tracking-widest text-white hover:text-sky-400 transition-colors">Experience</a>
            <a href="#contact" className="text-xs font-mono uppercase tracking-widest text-white hover:text-sky-400 transition-colors">Contact</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
            onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden text-white p-2 -mr-2 relative z-[100] bg-[#050505]/50 rounded-md touch-manipulation"
            aria-label="Toggle menu"
        >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Time & Status */}
        <div className="text-right hidden md:block">
            <div className="font-mono text-xs text-white/50">{time} IST</div>
            <div className="flex items-center justify-end gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <span className="font-mono text-sm hover:text-white transition-colors">Available</span>
            </div>
        </div>
    </motion.nav>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
    {mobileMenuOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-[#050505]/98 backdrop-blur-lg md:hidden"
        >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-4 pt-20">
                <a 
                    href="#works" 
                    onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        setTimeout(() => {
                            document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                    }}
                    className="text-4xl font-bold uppercase tracking-tight text-white hover:text-sky-400 transition-colors"
                >
                    Works
                </a>
                <a 
                    href="#experience" 
                    onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        setTimeout(() => {
                            document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                    }}
                    className="text-4xl font-bold uppercase tracking-tight text-white hover:text-sky-400 transition-colors"
                >
                    Experience
                </a>
                <a 
                    href="#contact" 
                    onClick={(e) => {
                        e.preventDefault();
                        setMobileMenuOpen(false);
                        setTimeout(() => {
                            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                        }, 300);
                    }}
                    className="text-4xl font-bold uppercase tracking-tight text-white hover:text-sky-400 transition-colors"
                >
                    Contact
                </a>
                
                <div className="mt-12 text-center">
                    <div className="font-mono text-xs text-white/50 mb-3">{time} IST</div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        <span className="font-mono text-sm text-white/70">Available for work</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )}
    </AnimatePresence>
    </>
  );
}