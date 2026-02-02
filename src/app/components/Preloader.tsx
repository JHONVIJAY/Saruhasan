import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Set dimensions immediately
    setDimension({ width: window.innerWidth, height: window.innerHeight });
    
    // Lock scroll during preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = originalOverflow;
    }, 2200); // Reduced to 2.2s for snappier feel
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width/2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: {
      d: initialPath,
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const, delay: 0.2 }
    }
  };

  // Prevent rendering until we have dimensions
  if (dimension.width === 0) return null;

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#050505]"
          style={{ cursor: 'wait' }}
        >
           {/* SVG Curtain */}
           <svg className="absolute top-0 left-0 w-full h-[calc(100%+300px)] pointer-events-none z-10">
              <motion.path 
                 variants={curve} 
                 initial="initial" 
                 exit="exit"
                 fill="#050505"
              />
           </svg>

           {/* Content */}
           <motion.div 
             className="relative z-20 flex flex-col items-center gap-4 text-white"
             exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] } }}
           >
              <div className="h-16 md:h-24 flex items-center justify-center relative w-full">
                <SequenceWords />
              </div>
              
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                className="h-[2px] bg-white/20 mt-4 overflow-hidden relative"
              >
                 <motion.div 
                   initial={{ x: "-100%" }}
                   animate={{ x: "100%" }}
                   transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                   className="w-full h-full bg-white"
                 />
              </motion.div>
           </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SequenceWords() {
  const [index, setIndex] = useState(0);
  const words = ["SARUHASAN", "ENGINEER", "JOHN", "DESIGNER"];
  
  useEffect(() => {
    if (index === words.length - 1) return;
    
    const timeout = setTimeout(() => {
      setIndex(index + 1);
    }, 400); // Slightly faster cycling
    
    return () => clearTimeout(timeout);
  }, [index, words.length]);

  return (
    <div className="relative text-center w-full px-4">
       <AnimatePresence mode="wait">
          <motion.h2
            key={`word-${index}`}
            initial={{ y: 50, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -50, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase text-white whitespace-nowrap"
          >
             {words[index]}
          </motion.h2>
       </AnimatePresence>
    </div>
  );
}