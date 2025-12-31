import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight } from "lucide-react";

export function HeroDual() {
  const [identity, setIdentity] = useState<"SARUHASAN" | "JOHN">("SARUHASAN");
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Cursor interaction for identity switch
  const handleHover = () => {
    setIdentity((prev) => (prev === "SARUHASAN" ? "JOHN" : "SARUHASAN"));
  };

  return (
    <section ref={containerRef} className="relative h-[110vh] w-full bg-[#050505] text-[#EAEAEA] overflow-hidden flex flex-col items-center justify-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1760978631939-32968f2e1813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBmdXR1cmlzdGljJTIwZGlnaXRhbCUyMHRleHR1cmV8ZW58MXx8fHwxNzY3MTU0NzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')] bg-cover bg-center opacity-20 mix-blend-color-dodge" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center">
        
        {/* Top Label */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-[-30vh] md:top-[-25vh] left-0 flex items-center gap-4 mix-blend-exclusion"
        >
            <span className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.3em]">System Online</span>
        </motion.div>

        {/* The Dual Identity Name */}
        <div className="relative cursor-pointer group" onMouseEnter={handleHover} onClick={handleHover}>
            <motion.h1 
                style={{ y: y1 }}
                className="text-[12vw] md:text-[13vw] leading-[0.85] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 select-none relative z-20 transition-all duration-700"
            >
                {identity === "SARUHASAN" ? "SARUHASAN" : "JOHN"}
            </motion.h1>
            
            {/* Ghost/Glitch Effect */}
            <motion.h1 
                 className="absolute top-0 left-1 text-[12vw] md:text-[13vw] leading-[0.85] font-black tracking-tighter text-orange-500/0 group-hover:text-orange-500/30 select-none z-10 transition-colors duration-100 mix-blend-screen blur-[2px]"
            >
                 {identity === "SARUHASAN" ? "JOHN" : "SARUHASAN"}
            </motion.h1>

            <motion.h1 
                style={{ y: y2 }}
                className="text-[12vw] md:text-[13vw] leading-[0.85] font-black tracking-tighter text-white/5 select-none absolute top-full left-0 right-0 z-0 scale-y-[-1] origin-top opacity-50 blur-sm"
            >
                {identity === "SARUHASAN" ? "SARUHASAN" : "JOHN"}
            </motion.h1>
        </div>

        {/* Subtitle / Role */}
        <motion.div 
            style={{ opacity }}
            className="mt-12 md:mt-20 flex flex-col md:flex-row items-center gap-8 md:gap-20"
        >
            <div className="text-right hidden md:block">
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Role</p>
                <p className="text-lg font-light">Creative Technologist</p>
            </div>
            
            <div className="h-[1px] w-20 bg-white/20 hidden md:block" />

            <div className="text-center md:text-left max-w-md">
                 <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed">
                    Oscillating between <span className="text-white font-medium">structured engineering</span> and <span className="text-white font-medium">chaotic creativity</span>. 
                    Building digital monuments for the modern web.
                 </p>
            </div>
        </motion.div>

      </div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-6 md:left-12 flex flex-col gap-4"
      >
          <div className="h-12 w-[1px] bg-gradient-to-b from-orange-500 to-transparent" />
          <ArrowDownRight className="text-white/50 w-6 h-6 animate-bounce" />
      </motion.div>

      <div className="absolute bottom-12 right-6 md:right-12 font-mono text-xs text-white/30 text-right">
          <p>LOC: CHENNAI, IN</p>
          <p>LAT: 13.0827° N</p>
      </div>

    </section>
  );
}