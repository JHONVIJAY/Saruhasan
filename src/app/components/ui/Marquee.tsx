import { motion } from "framer-motion";

interface MarqueeProps {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}

export function Marquee({ items, direction = "left", speed = 30, className }: MarqueeProps) {
  return (
    <div className={`overflow-hidden flex bg-background text-foreground py-12 select-none ${className}`}>
      <motion.div
        initial={{ x: direction === "left" ? 0 : "-100%" }}
        animate={{ x: direction === "left" ? "-100%" : 0 }}
        transition={{ ease: "linear", duration: speed, repeat: Infinity }}
        className="flex flex-shrink-0 whitespace-nowrap"
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center group relative">
             <span className="mx-8 text-6xl md:text-9xl font-black uppercase tracking-tighter text-outline-foreground/20 text-transparent transition-all duration-500 group-hover:text-foreground group-hover:text-outline-none cursor-default">
               {item}
             </span>
             {/* Decorative Star */}
             <span className="text-4xl text-blue-500/50 animate-spin-slow">HYBRID</span>
          </div>
        ))}
      </motion.div>
      <motion.div
        initial={{ x: direction === "left" ? 0 : "-100%" }}
        animate={{ x: direction === "left" ? "-100%" : 0 }}
        transition={{ ease: "linear", duration: speed, repeat: Infinity }}
        className="flex flex-shrink-0 whitespace-nowrap"
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center group relative">
             <span className="mx-8 text-6xl md:text-9xl font-black uppercase tracking-tighter text-outline-foreground/20 text-transparent transition-all duration-500 group-hover:text-foreground group-hover:text-outline-none cursor-default">
               {item}
             </span>
             <span className="text-4xl text-blue-500/50 animate-spin-slow">HYBRID</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
