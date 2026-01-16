import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resumeData } from "../data/resume";

const projectImages = [
  "https://images.unsplash.com/photo-1649518057077-9ea3d24d66ec?q=80&w=1080&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1686476020928-1834ccef445b?q=80&w=1080&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1762280040702-dbe2f4869712?q=80&w=1080&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1765392412355-0913f7c91c67?q=80&w=1080&auto=format&fit=crop"
];

const titleVariants = {
  hidden: { y: "100%" },
  visible: (i: number) => ({
    y: 0,
    transition: {
      delay: i * 0.02,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function SplitText({ text, className }: { text: string, className?: string }) {
  return (
    <div className={`${className} overflow-hidden flex flex-wrap`}>
      {text.split("").map((char, i) => (
        <span key={`${char}-${i}`} className="inline-block overflow-hidden">
          <motion.span
            custom={i}
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

function ProjectItem({ 
    project, 
    index, 
    setHoveredIndex, 
    hoveredIndex 
}: { 
    project: any, 
    index: number, 
    setHoveredIndex: (i: number | null) => void,
    hoveredIndex: number | null 
}) {
  const isHovered = hoveredIndex === index;
  // Disable dimming on mobile by checking if we are in a hover state
  const isDimmed = hoveredIndex !== null && !isHovered;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      className={`group relative w-full border-t border-white/10 transition-all duration-500 ${isDimmed ? "lg:opacity-30 lg:blur-[2px]" : "opacity-100"}`}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      id={`project-${index}`}
    >
      <a href={project.link} target="_blank" rel="noreferrer" className="block py-10 md:py-16 lg:py-20" aria-label={`View project: ${project.title}`}>
          <div className="grid grid-cols-12 gap-y-6 md:gap-4 items-center">
             
             {/* Mobile: Image Preview */}
             <div className="col-span-12 md:hidden mb-2">
                <div className="aspect-video w-full overflow-hidden rounded-sm relative">
                   <img 
                      src={projectImages[index % projectImages.length]} 
                      alt={project.title}
                      className="w-full h-full object-cover opacity-80"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                   <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
                      <span className="font-mono text-[10px] uppercase text-white/80">0{index + 1}</span>
                   </div>
                </div>
             </div>

             {/* Index - Desktop */}
             <div className="hidden md:block col-span-1 overflow-hidden">
                <span className={`block font-mono text-xs text-white/40 transition-transform duration-500 ${isHovered ? "translate-x-2 text-sky-400" : ""}`}>
                   (0{index + 1})
                </span>
             </div>

             {/* Title */}
             <div className="col-span-12 md:col-span-6 lg:col-span-7 overflow-hidden relative">
                <h3 className={`text-2xl md:text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight break-words transition-all duration-500 py-4 leading-none ${isHovered ? "lg:text-transparent lg:bg-clip-text lg:bg-gradient-to-r lg:from-sky-300 lg:via-sky-100 lg:to-white translate-x-2" : "text-white"}`}>
                    {project.title}
                </h3>
                {/* Reveal arrow on hover (Desktop) */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: isHovered ? 0 : -20, opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                    className="hidden lg:flex absolute -left-8 top-1/2 -translate-y-1/2 items-center text-sky-400"
                >
                    <ArrowUpRight size={24} />
                </motion.div>
             </div>

             {/* Tech Stack / Category */}
             <div className="col-span-12 md:col-span-5 lg:col-span-4 flex justify-between md:justify-end items-center">
                <div className="flex flex-wrap gap-2 md:justify-end">
                    {project.tech.slice(0, 3).map((t: string, i: number) => (
                        <span key={i} className={`px-3 py-1 text-[10px] font-mono uppercase tracking-wider border rounded-full transition-all duration-500 ${isHovered ? "lg:border-sky-500/30 lg:text-sky-300 lg:bg-sky-500/10" : "border-white/10 text-white/40"}`}>
                            {t}
                        </span>
                    ))}
                </div>
                
                {/* Mobile Link Arrow */}
                <div className="md:hidden h-8 w-8 rounded-full border border-white/20 flex items-center justify-center text-white/60">
                   <ArrowUpRight size={14} />
                </div>
             </div>
          </div>
      </a>
    </motion.div>
  );
}

export function WorkGrid() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const navigate = useNavigate();

    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section id="works" ref={containerRef} className="relative bg-[#050505] text-white py-20 md:py-40 z-20 scroll-mt-24">
            
            <div className="container mx-auto px-4 md:px-8 lg:px-12">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    
                    {/* Mobile Header */}
                    <div className="lg:hidden mb-8">
                        <SplitText 
                            text="THE" 
                            className="text-[13vw] font-black uppercase tracking-tighter leading-[0.85] text-white" 
                        />
                        <SplitText 
                            text="ARCHIVE" 
                            className="text-[13vw] font-black uppercase tracking-tighter leading-[0.85] text-white" 
                        />
                        <div className="w-16 h-1 bg-sky-500 mt-6 mb-8" />
                        <p className="text-white/60 text-lg leading-relaxed font-light">
                            A curated selection of engineering challenges and digital experiences. Focusing on stability, performance, and monolithic design.
                        </p>
                    </div>

                    {/* Sticky Sidebar / Preview Area (Desktop Only) */}
                    <div className="hidden lg:block lg:w-5/12 relative">
                        <div className="sticky top-32 h-[calc(100vh-160px)] min-h-[500px] max-h-[800px] w-full flex flex-col justify-between">
                            
                            <div className="relative w-full h-full">
                                <AnimatePresence mode="wait">
                                    {hoveredIndex === null ? (
                                        <motion.div 
                                            key="default"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute inset-0 flex flex-col justify-between"
                                        >
                                            <div className="relative">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-2 h-2 bg-sky-500" />
                                                    <span className="font-mono text-sm uppercase tracking-[0.2em] text-white/50">
                                                        Selected Works
                                                    </span>
                                                </div>
                                                <SplitText 
                                                    text="THE" 
                                                    className="text-6xl xl:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white" 
                                                />
                                                <SplitText 
                                                    text="ARCHIVE" 
                                                    className="text-6xl xl:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white" 
                                                />
                                                
                                                {/* Decorative Circle - Now clickable to go to admin */}
                                                <div 
                                                    onClick={() => navigate('/admin/login')}
                                                    className="absolute top-0 right-0 w-6 h-6 rounded-full border border-white/80 cursor-pointer hover:bg-sky-500/20 hover:border-sky-500 transition-all duration-300 hover:scale-110"
                                                    title="Admin Panel"
                                                />
                                            </div>
                                            
                                            <div className="max-w-sm">
                                                <p className="text-white/50 text-lg leading-relaxed font-light mb-12">
                                                    A curated selection of engineering challenges and digital experiences. Focusing on stability, performance, and monolithic design.
                                                </p>
                                                
                                                {/* Visual Project Index */}
                                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-white/10 pt-8">
                                                    {resumeData.projects.map((p, i) => (
                                                        <div 
                                                            key={i} 
                                                            className="flex items-center gap-3 opacity-50 hover:opacity-100 cursor-pointer transition-opacity duration-300"
                                                            onMouseEnter={() => setHoveredIndex(i)}
                                                            onClick={() => document.getElementById(`project-${i}`)?.scrollIntoView({ behavior: 'smooth' })}
                                                        >
                                                            <span className="font-mono text-xs text-sky-500">0{i + 1}</span>
                                                            <span className="font-bold text-xs text-white uppercase tracking-wider truncate">
                                                                {p.title}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="preview"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                            className="absolute inset-0 w-full h-full rounded-sm overflow-hidden bg-[#111]"
                                        >
                                            <img 
                                                src={projectImages[hoveredIndex % projectImages.length]} 
                                                alt="Project Preview" 
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            
                                            <div className="absolute bottom-0 left-0 p-8 w-full">
                                                <motion.div 
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.1 }}
                                                    className="flex justify-between items-end"
                                                >
                                                    <div>
                                                        <span className="font-mono text-sky-400 text-xs tracking-widest uppercase mb-2 block">
                                                            {resumeData.projects[hoveredIndex].period}
                                                        </span>
                                                        <h4 className="text-3xl font-bold text-white uppercase">
                                                            {resumeData.projects[hoveredIndex].title}
                                                        </h4>
                                                    </div>
                                                    <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center">
                                                        <ArrowUpRight size={20} />
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </div>
                    </div>

                    {/* Project List */}
                    <div className="lg:w-7/12 lg:pt-12">
                        <div className="flex flex-col">
                            {resumeData.projects.map((project, index) => (
                               <ProjectItem 
                                    key={index} 
                                    project={project} 
                                    index={index} 
                                    setHoveredIndex={setHoveredIndex}
                                    hoveredIndex={hoveredIndex}
                               />
                            ))}
                        </div>
                        
                        <div className="lg:hidden mt-12 flex justify-center">
                            <a 
                                href={resumeData.social.github} 
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full overflow-hidden transition-all duration-300 active:scale-95"
                            >
                                <span className="font-mono text-xs text-white uppercase tracking-widest relative z-10 group-hover:text-black transition-colors">View Full Archive</span>
                                <ArrowUpRight className="w-4 h-4 text-white relative z-10 group-hover:text-black transition-colors" />
                                <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}