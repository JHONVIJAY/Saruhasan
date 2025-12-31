import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { resumeData } from "../data/resume";

export function WorkGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="bg-[#050505] relative z-20 pb-32">
      <div className="container mx-auto px-6 mb-24">
         <h2 className="text-[10vw] font-black leading-none tracking-tighter text-[#EAEAEA] border-b border-white/10 pb-6">
            ARTIFACTS
         </h2>
      </div>

      <div className="flex flex-col gap-0 relative">
        {resumeData.projects.map((project, index) => (
            <ProjectItem key={index} project={project} index={index} total={resumeData.projects.length} />
        ))}
      </div>
      
      <div className="h-[20vh] flex items-center justify-center">
          <a href={resumeData.social.github} target="_blank" className="group flex items-center gap-4 text-white/50 hover:text-orange-500 transition-colors">
              <span className="font-mono text-sm uppercase tracking-widest">View Archives</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
      </div>
    </section>
  );
}

function ProjectItem({ project, index, total }: { project: any, index: number, total: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const [scrollRange, setScrollRange] = useState([0, 1]);

    useEffect(() => {
        const updatePosition = () => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const offsetTop = rect.top + scrollTop;
            // h-screen implies height = window.innerHeight usually, but let's measure
            // Range: ["start end", "center center"]
            // start end: top hits bottom (enters) -> offsetTop - windowHeight
            // center center: top hits top (if full height) -> offsetTop
            
            const start = offsetTop - window.innerHeight;
            const end = offsetTop;
            
            setScrollRange([start, end]);
        };
        updatePosition();
        window.addEventListener("resize", updatePosition);
        return () => window.removeEventListener("resize", updatePosition);
    }, []);

    const scale = useTransform(scrollY, scrollRange, [0.8, 1]);
    const opacity = useTransform(scrollY, [scrollRange[0], scrollRange[0] + (scrollRange[1]-scrollRange[0])*0.5], [0, 1]);

    // Wrapped in a relative container for stable scroll tracking
    return (
        <div ref={ref} className="relative h-screen w-full">
            <motion.div 
                style={{ scale, opacity }}
                className="sticky top-0 h-full w-full flex items-center justify-center p-4 md:p-12 overflow-hidden bg-[#050505]"
            >
                <div className="relative w-full max-w-6xl h-[80vh] bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black flex flex-col md:flex-row">
                    
                    {/* Image Side */}
                    <div className="w-full md:w-2/3 h-1/2 md:h-full relative overflow-hidden group">
                        <img 
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
                        
                        <div className="absolute top-6 left-6 z-10">
                            <span className="bg-black/50 backdrop-blur-md text-white text-xs font-mono px-3 py-1 rounded-full border border-white/10">
                                0{index + 1} / 0{total}
                            </span>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full md:w-1/3 h-1/2 md:h-full bg-[#0A0A0A] p-8 md:p-12 flex flex-col justify-between border-l border-white/5">
                        <div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tech.map((t: string) => (
                                    <span key={t} className="text-[10px] font-mono uppercase tracking-widest text-orange-500/80 border border-orange-500/20 px-2 py-1 rounded">
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">{project.title}</h3>
                            <p className="text-white/60 font-light leading-relaxed text-sm">
                                {project.description}
                            </p>
                        </div>

                        <div className="mt-8">
                            <a 
                                href={project.link} 
                                target="_blank"
                                className="w-full py-4 border border-white/20 text-white font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all duration-300"
                            >
                                Visit Deployment <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}