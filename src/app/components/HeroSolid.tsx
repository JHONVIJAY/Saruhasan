import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import heroImg from "../../assets/0575f999a9ea5865df7e385148b08517b640dc26.png";

import { BackgroundRipple } from "./ui/BackgroundRipple";
import { useState, useRef } from "react";

const textVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

// Pro animation variants for name toggle
const nameToggleVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 50 : -50,
    scale: 0.9,
    filter: "blur(10px)",
  }),
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Professional easing curve
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -50 : 50,
    scale: 0.9,
    filter: "blur(10px)",
    transition: {
      duration: 0.6,
      ease: [0.7, 0, 0.84, 0] as [number, number, number, number],
    },
  }),
};

const charVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.8,
  },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    y: -20,
    scale: 0.8,
    transition: {
      delay: i * 0.02,
      duration: 0.4,
      ease: [0.7, 0, 0.84, 0] as [number, number, number, number],
    },
  }),
};

function SplitText({
  text,
  className,
  stroke = false,
  onClick,
}: {
  text: string;
  className?: string;
  stroke?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      className={`${className} flex flex-wrap select-none`}
      onClick={onClick}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {text.split("").map((char, i) => (
         <motion.span
            key={`${char}-${i}`}
            custom={i}
            variants={textVariants}
            className="inline-block"
            style={stroke ? { WebkitTextStroke: "1px rgba(255, 255, 255, 0.8)", color: "transparent" } : {}}
         >
           {char === " " ? "\u00A0" : char}
         </motion.span>
      ))}
    </motion.h1>
  );
}

function AnimatedName({
  text,
  stroke = false,
  onClick,
  direction,
}: {
  text: string;
  stroke?: boolean;
  onClick?: () => void;
  direction: number;
}) {
  return (
    <motion.h1
      custom={direction}
      variants={nameToggleVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase flex flex-wrap select-none"
      onClick={onClick}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          custom={i}
          variants={charVariants}
          className="inline-block"
          style={
            stroke
              ? {
                  WebkitTextStroke: "1px rgba(255, 255, 255, 0.8)",
                  color: "transparent",
                }
              : {}
          }
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}

export function HeroSolid() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // State for name toggle
  const [displayName, setDisplayName] = useState<"JOHN" | "ANGEL">("JOHN");
  const clickCountRef = useRef(0);

  // Zero-width space for padding (U+200B)
  const ZERO_WIDTH_SPACE = "\u200B";

  // Pad "JOHN" to 5 characters to match "ANGEL"
  const paddedName =
    displayName === "JOHN" ? `JOHN${ZERO_WIDTH_SPACE}` : "ANGEL";

  const handleNameClick = () => {
    clickCountRef.current += 1;

    // Toggle after 3 clicks
    if (clickCountRef.current === 3) {
      setDisplayName((prev) => (prev === "JOHN" ? "ANGEL" : "JOHN"));
      clickCountRef.current = 0;
    }
  };

  return (
    <section 
      id="index" 
      className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center pt-20 md:pt-32 pb-20 md:pb-24 px-4 md:px-8 overflow-hidden"
    >
      
      {/* BACKGROUND RIPPLE EFFECT - MOBILE ONLY */}
      <BackgroundRipple className="absolute inset-0 z-0 md:hidden" />
      
      {/* TOP TEXT */}
      <div className="w-full max-w-[1800px] flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 mb-4 md:mb-12 overflow-visible pointer-events-none">
          <div className="flex flex-col overflow-visible pointer-events-none">
              <SplitText 
                text="SARU" 
                className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter text-white uppercase mix-blend-exclusion"
              />
              <SplitText 
                text="HASAN" 
                className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter text-white uppercase mix-blend-exclusion"
              />
          </div>
          
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
             className="mt-4 md:mt-0 md:text-right pointer-events-none"
          >
              <h2 className="text-white font-medium text-base md:text-xl mb-2">The Dual Identity</h2>
              <p className="text-white/50 text-xs md:text-sm font-mono uppercase tracking-widest max-w-xs md:ml-auto">
                  Bridging the gap between<br/>
                  System Architecture &<br/>
                  Visual Artistry
              </p>
          </motion.div>
      </div>

      {/* IMAGE CONTAINER */}
      <div className="relative w-full max-w-[1400px] h-[40vh] md:h-[65vh] overflow-hidden bg-[#050505] pointer-events-none">
          <motion.div 
            style={{ y, opacity }} 
            className="w-full h-full"
          >
             <motion.img 
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                src={heroImg} 
                alt="Saruhasan Sankar" 
                className="w-full h-full object-cover object-center"
             />
             {/* Gradient Overlay for integration */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
          </motion.div>

          {/* Floating Label */}
          <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10"
              >
                  <span className="text-[10px] md:text-xs font-mono text-white uppercase tracking-widest">
                      Est. 2025 — Chennai
                  </span>
              </motion.div>
          </div>
      </div>

      {/* BOTTOM TEXT */}
      <div className="w-full max-w-[1800px] flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 pt-4 md:pt-12 gap-4 md:gap-0 pointer-events-none">
           <div className="flex flex-col gap-6 md:gap-8">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
               className="flex gap-3 md:gap-4 items-center"
             >
               <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
               <span className="text-white/60 font-mono text-[10px] md:text-xs uppercase tracking-widest">Available for hire</span>
             </motion.div>
           </div>

        <div className="pointer-events-auto select-none">
          <AnimatePresence mode="wait">
            <AnimatedName
              key={displayName}
              text={paddedName}
              stroke={true}
              onClick={handleNameClick}
              direction={displayName === "JOHN" ? 1 : -1}
            />
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}