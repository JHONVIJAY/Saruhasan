import { useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { resumeData } from "../data/resume";
import { cn } from "../lib/utils";

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

function ExperienceItem({ 
  job, 
  index 
}: { 
  job: any, 
  index: number 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative border-t border-white/10 last:border-b"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`Experience at ${job.company} as ${job.role}`}
    >
      <div className={cn(
          "py-12 md:py-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-baseline transition-all duration-500",
          isHovered ? "bg-white/[0.02]" : ""
      )}>
        
        {/* Index & Period - Desktop Left */}
        <div className="md:col-span-3 lg:col-span-4 flex flex-col justify-between h-full px-4 md:pl-0">
           <div className="flex items-center gap-4 mb-4 md:mb-0">
               <span className={cn(
                   "font-mono text-xs transition-colors duration-300",
                   isHovered ? "text-sky-400" : "text-white/30"
               )}>
                   (0{index + 1})
               </span>
               <span className="font-mono text-xs text-white/50 uppercase tracking-widest">
                   {job.period}
               </span>
           </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-9 lg:col-span-8 px-4 md:pr-0">
            <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h3 className={cn(
                            "text-3xl md:text-5xl font-bold uppercase tracking-tight transition-all duration-500",
                            isHovered ? "text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-sky-100 to-white translate-x-2" : "text-white"
                        )}>
                            {job.company}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                             <span className={cn(
                                "text-sm font-mono uppercase tracking-wider transition-colors duration-300",
                                isHovered ? "text-sky-400" : "text-white/50"
                             )}>
                                 {job.role}
                             </span>
                             <span className="hidden md:inline-block w-1 h-1 bg-white/20 rounded-full" />
                             <span className="flex items-center gap-1 text-xs font-mono text-white/30 uppercase">
                                 <MapPin className="w-3 h-3" /> {job.location}
                             </span>
                        </div>
                    </div>

                    {/* Arrow Action */}
                    {job.link && (
                        <motion.a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white/50 hover:text-black hover:bg-white hover:border-white transition-all duration-300"
                            whileHover={{ scale: 1.1, rotate: 45 }}
                        >
                            <ArrowUpRight className="w-5 h-5" />
                        </motion.a>
                    )}
                </div>
                
                <p className="text-lg text-white/60 leading-relaxed font-light max-w-2xl">
                    {job.description}
                </p>

                {/* Mobile Link Button */}
                {job.link && (
                    <div className="md:hidden mt-4">
                        <a 
                           href={job.link}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline-flex items-center gap-2 text-xs font-mono uppercase text-sky-400"
                        >
                           Visit Company <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </div>
                )}
            </div>
        </div>

      </div>
    </motion.div>
  );
}

export function ExperienceEditorial() {
  const containerRef = useRef<HTMLDivElement>(null);
  useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section id="experience" className="relative bg-[#050505] text-white py-20 md:py-40 z-10">
      
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Mobile Header */}
          <div className="lg:hidden mb-12">
             <SplitText 
                 text="CAREER" 
                 className="text-[13vw] font-black uppercase tracking-tighter leading-[0.85] text-white" 
             />
             <SplitText 
                 text="HISTORY" 
                 className="text-[13vw] font-black uppercase tracking-tighter leading-[0.85] text-white" 
             />
             <div className="w-16 h-1 bg-sky-500 mt-8 mb-8" />
             <p className="text-white/60 text-lg leading-relaxed font-light">
                A definitive archive of technical leadership. Navigating the intersection of complex systems and user-centric design with precision.
             </p>
          </div>

          {/* Sticky Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:w-5/12 shrink-0 relative">
             <div className="sticky top-32">
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-2 h-2 bg-sky-500" />
                    <span className="font-mono text-sm uppercase tracking-[0.2em] text-white/50">
                        Chronology
                    </span>
                </div>

                <div className="flex flex-col mb-12">
                    <SplitText 
                        text="CAREER" 
                        className="text-6xl xl:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white" 
                    />
                    <SplitText 
                        text="HISTORY" 
                        className="text-6xl xl:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white" 
                    />
                </div>

                <div className="max-w-sm space-y-8">
                    <p className="text-white/50 text-lg leading-relaxed font-light">
                        A definitive archive of technical leadership. Navigating the intersection of complex systems and user-centric design with precision.
                    </p>
                    
                    <a 
                        href="/resume.pdf" 
                        target="_blank" 
                        className="group inline-flex items-center gap-3 text-white hover:text-sky-400 transition-colors"
                    >
                        <span className="h-px w-8 bg-white/20 group-hover:bg-sky-400 transition-colors" />
                        <span className="font-mono text-xs uppercase tracking-widest">
                            Download Resume
                        </span>
                        <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                </div>

             </div>
          </div>

          {/* Right Panel: The List */}
          <div className="lg:w-7/12" ref={containerRef}>
             <div className="flex flex-col">
                {resumeData.experience.map((job, index) => (
                   <ExperienceItem 
                     key={index} 
                     job={job} 
                     index={index} 
                   />
                ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
