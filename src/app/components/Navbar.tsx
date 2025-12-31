import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

export function Navbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-start pointer-events-none"
    >
        <div className="pointer-events-auto">
            <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white leading-none">SARUHASAN S.</span>
                <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Engineer / Creator</span>
            </div>
        </div>

        <div className="pointer-events-auto bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full hidden md:flex gap-8">
            <a href="#" className="text-xs font-mono uppercase tracking-widest text-white hover:text-orange-500 transition-colors">Index</a>
            <a href="#" className="text-xs font-mono uppercase tracking-widest text-white hover:text-orange-500 transition-colors">Manifesto</a>
            <a href="#" className="text-xs font-mono uppercase tracking-widest text-white hover:text-orange-500 transition-colors">Contact</a>
        </div>

        <div className="pointer-events-auto text-right">
            <div className="font-mono text-xs text-white/50">{time} IST</div>
            <div className="flex items-center justify-end gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold text-white tracking-wider">ONLINE</span>
            </div>
        </div>
    </motion.nav>
  );
}