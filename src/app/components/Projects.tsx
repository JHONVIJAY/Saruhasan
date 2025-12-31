import { motion, useTransform, useScroll, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { resumeData } from "../data/resume";

export function Projects() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [scrollRange, setScrollRange] = useState([0, 1]);

  useEffect(() => {
    const updatePosition = () => {
      if (!targetRef.current) return;
      const rect = targetRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const offsetTop = rect.top + scrollTop;
      const height = rect.height;

      // Range: ["start start", "end end"]
      // start start: top hits top -> offsetTop
      // end end: bottom hits bottom -> offsetTop + height - windowHeight
      
      const start = offsetTop;
      const end = offsetTop + height - window.innerHeight;
      
      setScrollRange([start, end]);
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  const x = useTransform(scrollY, scrollRange, ["0%", "-75%"]);

  return (
    <div ref={targetRef} className="relative h-[400vh] bg-background">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Intro Card - Fixed Left */}
        <div className="absolute left-0 top-0 h-full w-[30vw] hidden md:flex flex-col justify-center px-12 z-10 bg-background/95 backdrop-blur-sm border-r border-white/5">
             <div className="mb-8">
                 <span className="text-xs font-mono uppercase tracking-widest text-primary mb-2 block">Selected Works</span>
                 <h2 className="text-[4vw] font-black leading-[0.9] tracking-tighter">
                    DIGITAL <br />
                    <span className="text-outline-transparent text-foreground">IMPACT</span>
                 </h2>
             </div>
             <p className="text-muted-foreground max-w-xs leading-relaxed">
                 A curation of interfaces designed to engage, convert, and inspire. Each project represents a unique challenge solved through code and design.
             </p>
             <div className="mt-12 flex items-center gap-4">
                 <div className="h-[1px] w-12 bg-white/20" />
                 <span className="text-xs font-mono opacity-50">SCROLL TO EXPLORE</span>
             </div>
        </div>

        {/* Moving Track */}
        <motion.div style={{ x }} className="flex gap-0 md:pl-[30vw]">
          {resumeData.projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
          
          {/* End Card */}
          <div className="h-screen min-w-[100vw] md:min-w-[50vw] flex items-center justify-center bg-foreground text-background">
             <div className="text-center group cursor-pointer">
                <h3 className="text-[5vw] font-black leading-none mb-4 group-hover:scale-110 transition-transform duration-500">GITHUB</h3>
                <a 
                    href={resumeData.social.github} 
                    target="_blank"
                    className="inline-flex items-center gap-2 text-xl font-medium border-b border-background/30 pb-1 hover:border-background transition-all"
                >
                    View All Repositories <ArrowUpRight className="w-5 h-5" />
                </a>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: any, index: number }) {
  // Cursor Follow Logic for Card
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      x.set(e.clientX - rect.left - 50); // Center offset
      y.set(e.clientY - rect.top - 50);
  };

  return (
    <div 
        ref={ref}
        data-cursor="hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative h-screen min-w-[100vw] md:min-w-[60vw] overflow-hidden bg-background border-r border-white/5 flex flex-col"
    >
       {/* Image Area - 70% Height */}
       <div className="relative h-[65%] w-full overflow-hidden">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
          <img 
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
          
          {/* Floating Cursor Button */}
          <motion.div 
            style={{ left: springX, top: springY, opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
            className="absolute z-30 pointer-events-none w-24 h-24 bg-white rounded-full flex items-center justify-center mix-blend-difference hidden md:flex"
          >
             <span className="text-black font-bold text-xs uppercase tracking-widest">View</span>
          </motion.div>
       </div>

       {/* Content Area - 30% Height */}
       <div className="h-[35%] w-full p-8 md:p-12 flex flex-col justify-between bg-card relative z-20">
          <div className="flex justify-between items-start">
             <div>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((t: string) => (
                        <span key={t} className="text-xs font-mono uppercase tracking-wider text-muted-foreground/60 border border-white/10 px-2 py-1 rounded-full">
                            {t}
                        </span>
                    ))}
                 </div>
                 <h3 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all">
                    {project.title}
                 </h3>
             </div>
             <span className="text-9xl font-black text-white/5 absolute right-4 bottom-4 -z-10 select-none">
                0{index + 1}
             </span>
          </div>

          <div className="flex justify-between items-end">
             <p className="text-muted-foreground max-w-md text-sm md:text-base leading-relaxed line-clamp-2">
                {project.description}
             </p>
             <a 
                href={project.link} 
                target="_blank" 
                className="md:hidden inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full text-sm font-bold"
            >
                Visit Site
            </a>
          </div>
       </div>
    </div>
  );
}
