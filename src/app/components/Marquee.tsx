import { motion } from "framer-motion";

export function Marquee() {
  const marqueeText = "SARUHASAN SANKAR — ENGINEER — JOHN — CREATIVE FORCE — ";
  
  return (
    <div className="relative w-full overflow-hidden bg-white py-4 md:py-5 border-y border-black/10 shadow-sm">
      {/* Subtle gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <div className="flex whitespace-nowrap overflow-hidden select-none">
        <motion.div 
            animate={{ x: "-50%" }}
            transition={{ duration: 45, ease: "linear", repeat: Infinity }}
            className="flex w-fit items-center"
        >
          {/* First Copy */}
          <div className="flex gap-6 md:gap-8 items-center pr-6 md:pr-8">
            {Array(5).fill(marqueeText).map((text, i) => (
              <div key={`a-${i}`} className="flex items-center gap-4 md:gap-6">
                <span className="text-[#050505] font-mono text-sm md:text-base uppercase tracking-widest font-bold">
                    {text}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              </div>
            ))}
          </div>
          {/* Second Copy for Seamless Loop */}
          <div className="flex gap-6 md:gap-8 items-center pr-6 md:pr-8">
            {Array(5).fill(marqueeText).map((text, i) => (
              <div key={`b-${i}`} className="flex items-center gap-4 md:gap-6">
                <span className="text-[#050505] font-mono text-sm md:text-base uppercase tracking-widest font-bold">
                    {text}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}