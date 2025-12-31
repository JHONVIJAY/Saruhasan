import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../lib/utils";

const services = [
  {
    id: "01",
    title: "Web Development",
    description: "Building scalable, high-performance web applications using modern technologies.",
    src: "https://images.unsplash.com/photo-1649451844813-3130d6f42f8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjB0ZWNobm9sb2d5JTIwbWluaW1hbGlzdCUyMGRhcmslMjBmdXR1cmlzdGljfGVufDF8fHx8MTc2NzE1Mzk5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["React", "Next.js", "Node.js"]
  },
  {
    id: "02",
    title: "Interaction Design",
    description: "Creating immersive digital experiences with fluid animations and intuitive interfaces.",
    src: "https://images.unsplash.com/photo-1764258906159-3f5952286f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbHVpZCUyMG5lb24lMjBhYnN0cmFjdCUyMG1vdGlvbiUyMGRlc2lnbiUyMGRhcmt8ZW58MXx8fHwxNzY3MTU0MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["WebGL", "Framer Motion", "Three.js"]
  },
  {
    id: "03",
    title: "Design Systems",
    description: "Architecting consistent and scalable design languages for enterprise applications.",
    src: "https://images.unsplash.com/photo-1729258171691-4faf8962d2fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBncmlkJTIwZ2VvbWV0cmljJTIwbWluaW1hbGlzdCUyMGRhcmt8ZW58MXx8fHwxNzY3MTU0MDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Architecture", "Tokens", "Components"]
  },
  {
    id: "04",
    title: "Technical Strategy",
    description: "Consulting on technology stack selection, performance optimization, and best practices.",
    src: "https://images.unsplash.com/photo-1763461092888-4f69d1ebc492?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHN0cmF0ZWd5JTIwbWluaW1hbGlzdCUyMGRhcmslMjBjaGVzc3xlbnwxfHx8fDE3NjcxNTQwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tags: ["Performance", "SEO", "Accessibility"]
  }
];

export function Services() {
  const [modal, setModal] = useState({ active: false, index: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse position logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth spring animation for cursor
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Calculate position relative to the container
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <section 
      id="services" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative py-32 bg-background overflow-hidden"
    >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
            <div className="mb-24 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8">
                <h2 className="text-[12vw] md:text-[6vw] font-black tracking-tighter leading-[0.8] mix-blend-difference">
                    SERVICES
                </h2>
                <div className="flex flex-col items-end gap-2 text-right">
                    <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Capabilities</span>
                    <p className="text-muted-foreground max-w-sm">
                        Comprehensive design and engineering solutions for ambitious brands.
                    </p>
                </div>
            </div>

            <div className="flex flex-col w-full">
                {services.map((service, index) => (
                    <ServiceItem 
                        key={index} 
                        index={index} 
                        title={service.title} 
                        description={service.description}
                        tags={service.tags}
                        setModal={setModal} 
                    />
                ))}
            </div>
            
            {/* Modal Cursor - Visible only on desktop */}
            <Modal modal={modal} services={services} x={xSpring} y={ySpring} />
        </div>
        
        {/* Simple Marquee at bottom */}
        <div className="mt-32 border-y border-white/5 py-6 overflow-hidden flex bg-white/5 backdrop-blur-sm">
            <motion.div 
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: "-50%" }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-12 items-center">
                        <span className="text-4xl font-black text-transparent text-outline-foreground tracking-tighter">CREATIVE DEVELOPMENT</span>
                        <span className="text-xl text-muted-foreground">★</span>
                        <span className="text-4xl font-black text-foreground tracking-tighter">INTERACTION DESIGN</span>
                        <span className="text-xl text-muted-foreground">★</span>
                        <span className="text-4xl font-black text-transparent text-outline-foreground tracking-tighter">TECHNICAL STRATEGY</span>
                        <span className="text-xl text-muted-foreground">★</span>
                    </div>
                ))}
            </motion.div>
        </div>
    </section>
  );
}

function ServiceItem({ index, title, description, tags, setModal }: { index: number, title: string, description: string, tags: string[], setModal: any }) {
  return (
    <div 
      onMouseEnter={() => setModal({ active: true, index })} 
      onMouseLeave={() => setModal({ active: false, index })} 
      className="group relative flex flex-col md:flex-row justify-between items-start md:items-center py-12 md:py-16 border-b border-white/10 cursor-pointer transition-colors hover:bg-white/[0.02]"
    >
      <div className="flex items-center gap-8 md:w-1/2">
         <span className="font-mono text-xl text-muted-foreground/50 group-hover:text-foreground transition-colors">
            0{index + 1}
         </span>
         <h2 className="text-4xl md:text-6xl font-bold tracking-tight group-hover:translate-x-4 transition-transform duration-500">
            {title}
         </h2>
      </div>
      
      <div className="mt-4 md:mt-0 flex flex-col md:items-end gap-2 md:w-1/2 overflow-hidden">
         <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300 md:text-right max-w-xs">
            {description}
         </p>
         <div className="flex gap-2 flex-wrap justify-end opacity-0 group-hover:opacity-100 transform translate-y-full group-hover:translate-y-0 transition-all duration-500">
             {tags.map(tag => (
                 <span key={tag} className="text-xs border border-white/10 px-2 py-1 rounded-full text-muted-foreground uppercase tracking-wider">
                    {tag}
                 </span>
             ))}
         </div>
      </div>
      
      <ArrowUpRight className="absolute right-4 top-12 w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 md:hidden" />
    </div>
  );
}

function Modal({ modal, services, x, y }: { modal: { active: boolean, index: number }, services: any[], x: any, y: any }) {
    const { active, index } = modal;
    
    return (
        <motion.div 
            style={{ left: x, top: y }}
            className="hidden md:flex absolute top-0 left-0 h-[350px] w-[300px] pointer-events-none overflow-hidden rounded-lg z-50 mix-blend-difference"
        >
            <motion.div 
                className="h-full w-full relative bg-zinc-900"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                    scale: active ? 1 : 0, 
                    opacity: active ? 1 : 0 
                }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            >
                <div 
                    className="h-full w-full relative transition-transform duration-500 ease-out"
                    style={{ transform: `translateY(${-index * 100}%)` }}
                >
                    {services.map((service, i) => (
                        <div key={i} className="h-full w-full flex items-center justify-center bg-zinc-900">
                           <img 
                            src={service.src}
                            alt={service.title}
                            className="h-full w-full object-cover opacity-80"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                           <div className="absolute bottom-4 left-4">
                                <span className="text-white font-mono text-xs uppercase tracking-widest border border-white/20 px-2 py-1 rounded-full backdrop-blur-md">
                                    View Project
                                </span>
                           </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
