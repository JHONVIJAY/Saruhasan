import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 500]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.2]);

  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-background">
      
      {/* Background Image with Parallax & Scale */}
      <motion.div 
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1763616301941-d349f6681d82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicnV0YWxpc3QlMjBhcmNoaXRlY3R1cmUlMjBjb25jcmV0ZSUyMG1pbmltYWxpc3QlMjBkYXJrfGVufDF8fHx8MTc2NzE1NDE0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Abstract Architecture"
          className="w-full h-full object-cover object-center brightness-[0.3] contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
      </motion.div>

      {/* Hero Content */}
      <div className="container relative z-10 px-4 flex flex-col items-center justify-center h-full">
        <div className="relative z-10 flex flex-col items-center">
            {/* Animated Label */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 flex items-center gap-4"
            >
                <div className="h-[1px] w-12 bg-white/30" />
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-white/70">
                    Portfolio &copy; {new Date().getFullYear()}
                </span>
                <div className="h-[1px] w-12 bg-white/30" />
            </motion.div>

            {/* Massive Typography */}
            <div className="relative text-center mix-blend-overlay">
                <OverflowText text="DIGITAL" delay={0} />
                <OverflowText text="CRAFTSMAN" delay={0.15} />
            </div>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="mt-8 text-lg md:text-xl text-white/60 max-w-lg text-center font-light leading-relaxed"
            >
                Designing future-proof digital experiences with a focus on motion, precision, and aesthetics.
            </motion.p>
        </div>

        {/* Footer Info Strip */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="absolute bottom-12 left-0 right-0 px-6 md:px-12 flex justify-between items-end text-white/80"
        >
            <div className="hidden md:block">
                <span className="text-[10px] font-mono uppercase tracking-widest block opacity-50 mb-1">Status</span>
                <div className="flex items-center gap-2 font-mono text-xs text-white/40">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                    </span>
                    <span>Available for work</span>
                </div>
            </div>

            <motion.div 
                style={{ opacity }}
                className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center gap-4"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-white" />
                <span className="text-[10px] uppercase tracking-[0.2em] animate-pulse">Scroll</span>
            </motion.div>

            <div className="hidden md:block text-right">
                 <span className="text-[10px] font-mono uppercase tracking-widest block opacity-50 mb-1">Local Time</span>
                 <TimeDisplay />
            </div>
        </motion.div>
      </div>
    </section>
  );
}

function OverflowText({ text, delay }: { text: string, delay: number }) {
    return (
        <div className="overflow-hidden">
            <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, delay: delay, ease: [0.16, 1, 0.3, 1] }}
                className="text-[14vw] md:text-[11vw] leading-[0.85] font-black tracking-tighter text-white select-none"
            >
                {text}
            </motion.h1>
        </div>
    )
}

function TimeDisplay() {
    return (
        <div className="text-xs font-bold tracking-wider tabular-nums">
             {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
        </div>
    )
}