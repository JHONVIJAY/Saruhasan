import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const principles = [
  {
    id: "01",
    title: "ENGINEERING",
    domain: "SARUHASAN",
    description: "The backbone of digital reality. I architect scalable, fault-tolerant systems using Next.js, React, and Node.js. My code is not just functional; it is structural art.",
    tags: ["System Architecture", "API Design", "Performance Optimization"]
  },
  {
    id: "02",
    title: "ARTISTRY",
    domain: "JOHN",
    description: "The soul of the machine. I use WebGL, Three.js, and Framer Motion to create visceral, emotional connections. This is where logic meets chaos.",
    tags: ["Creative Coding", "Interactive 3D", "Motion Design"]
  },
  {
    id: "03",
    title: "STRATEGY",
    domain: "SHARED",
    description: "The bridge between intent and impact. Every line of code and every pixel serves a purpose. I build products that don't just exist, but perform.",
    tags: ["Product Strategy", "UX Research", "Conversion Optimization"]
  }
];

export function Philosophy() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="py-32 bg-[#050505] text-[#EAEAEA] relative z-20">
      <div className="container mx-auto px-6">
        
        <div className="mb-24 flex items-end justify-between border-b border-white/10 pb-6">
            <h2 className="text-[10vw] font-black leading-none tracking-tighter">MANIFESTO</h2>
            <span className="hidden md:block font-mono text-xs uppercase tracking-widest mb-2 text-white/50">
                Core Principles
            </span>
        </div>

        <div className="flex flex-col">
            {principles.map((p, i) => (
                <div key={i} className="border-b border-white/10">
                    <button 
                        onClick={() => setActive(active === i ? null : i)}
                        className="w-full py-12 flex items-center justify-between group hover:bg-white/5 transition-colors px-4 md:px-8"
                    >
                        <div className="flex items-baseline gap-8 md:gap-16">
                            <span className="font-mono text-sm text-white/30">0{i + 1}</span>
                            <span className={`text-4xl md:text-6xl font-bold tracking-tight transition-colors duration-300 ${active === i ? "text-orange-500" : "text-white"}`}>
                                {p.title}
                            </span>
                        </div>
                        <div className="flex items-center gap-8">
                             <span className="hidden md:block font-mono text-xs text-white/30 uppercase tracking-widest border border-white/10 px-2 py-1 rounded-full">
                                {p.domain}
                             </span>
                             {active === i ? <Minus className="w-6 h-6 text-orange-500" /> : <Plus className="w-6 h-6 text-white/30" />}
                        </div>
                    </button>
                    
                    <AnimatePresence>
                        {active === i && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden bg-white/5"
                            >
                                <div className="p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <p className="text-xl md:text-2xl font-light leading-relaxed text-white/80">
                                        {p.description}
                                    </p>
                                    <div className="flex flex-col justify-end">
                                        <p className="font-mono text-xs uppercase tracking-widest text-white/30 mb-4">Capabilities</p>
                                        <div className="flex flex-wrap gap-2">
                                            {p.tags.map(tag => (
                                                <span key={tag} className="border border-white/20 px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition-colors cursor-default">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}