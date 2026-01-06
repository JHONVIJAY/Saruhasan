import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, MapPin, Calendar } from "lucide-react";
import { resumeData } from "../data/resume";

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
  index, 
  isLast 
}: { 
  job: any, 
  index: number, 
  isLast: boolean 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="relative pl-8 md:pl-16 pb-16 md:pb-24 last:pb-0 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-[3px] md:left-[7px] top-3 bottom-0 w-px bg-white/10 group-hover:bg-white/20 transition-colors duration-500" />
      )}
      
      {/* Timeline Dot */}
      <motion.div 
        initial={{ scale: 1, backgroundColor: "#050505", borderColor: "rgba(255,255,255,0.2)" }}
        whileInView={{ 
          scale: 1.25, 
          backgroundColor: "#0ea5e9", 
          borderColor: "#0ea5e9",
          transition: { duration: 0.5, delay: 0.2 } 
        }}
        viewport={{ once: false, margin: "-45% 0px -45% 0px" }}
        className={`absolute left-0 top-3 w-1.5 h-1.5 md:w-3 md:h-3 rounded-full border transition-all duration-500 z-10 ${isHovered ? "border-sky-500 bg-sky-500 scale-125" : ""}`} 
      />

      <motion.div 
        className="flex flex-col gap-6 md:gap-8 p-6 -m-6 rounded-2xl transition-colors duration-500 hover:bg-white/[0.02]"
        whileHover={{ x: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-4">
          <h3 className={`text-2xl md:text-5xl font-bold uppercase tracking-tight transition-colors duration-500 break-words ${isHovered ? "text-sky-400" : "text-white"}`}>
            {job.company}
          </h3>
          <span className="font-mono text-xs md:text-sm text-white/40 uppercase tracking-widest">
            {job.role}
          </span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
           
           {/* Meta Info (Mobile: Top, Desktop: Left) */}
           <div className="md:col-span-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-white/50 group-hover:text-white/70 transition-colors duration-500">
                 <Calendar className="w-4 h-4" />
                 <span className="font-mono text-xs uppercase tracking-widest">{job.period}</span>
              </div>
              <div className="flex items-center gap-3 text-white/50 group-hover:text-white/70 transition-colors duration-500">
                 <MapPin className="w-4 h-4" />
                 <span className="font-mono text-xs uppercase tracking-widest">{job.location}</span>
              </div>
           </div>

           {/* Description */}
           <div className="md:col-span-8">
              <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light group-hover:text-white/80 transition-colors duration-500">
                {job.description}
              </p>
              
              {job.link && (
                 <motion.a 
                   href={job.link}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 mt-6 text-sky-400 hover:text-sky-300 transition-colors"
                   whileHover={{ x: 5 }}
                 >
                    <span className="font-mono text-xs uppercase tracking-widest">Visit Company</span>
                    <ArrowUpRight className="w-4 h-4" />
                 </motion.a>
              )}
           </div>

        </div>

      </motion.div>
    </motion.div>
  );
}

export function ExperienceEditorial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // Use scroll progress for opacity of certain elements if needed, or remove if unused.
  // Keeping opacityTransform for potential future use or consistency.
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <section id="experience" className="relative bg-[#050505] text-white py-20 md:py-32 z-10 scroll-mt-24">
      
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Mobile Header */}
          <div className="lg:hidden mb-12">
             <SplitText 
                 text="WORK" 
                 className="text-[13vw] font-black uppercase tracking-tighter leading-[0.85] text-white" 
             />
             <SplitText 
                 text="HISTORY" 
                 className="text-[13vw] font-black uppercase tracking-tighter leading-[0.85] text-white" 
             />
             <div className="flex items-center justify-between mt-8 border-t border-white/10 pt-6">
                 <div className="w-16 h-1 bg-sky-500" />
                 
                 <a 
                    href="/resume.pdf" 
                    target="_blank" 
                    className="flex items-center gap-3 text-white/70 hover:text-sky-400 transition-colors group"
                 >
                    <span className="font-mono text-xs uppercase tracking-widest">
                        Resume.pdf
                    </span>
                    <ArrowUpRight className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                 </a>
             </div>
             
             <p className="text-white/60 text-lg leading-relaxed font-light mt-8">
                A definitive archive of technical leadership. Navigating the intersection of complex systems and user-centric design with precision.
             </p>
          </div>

          {/* Sticky Sidebar (Desktop Only) */}
          <div className="hidden lg:block lg:w-1/3 shrink-0 relative">
             <div className="sticky top-32 w-full">
                
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-2 bg-sky-500" />
                    <span className="font-mono text-sm uppercase tracking-[0.2em] text-white/50">
                        Chronology
                    </span>
                </div>

                <div className="flex flex-col mb-12 relative">
                    <SplitText 
                        text="WORK" 
                        className="text-6xl xl:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white" 
                    />
                    <SplitText 
                        text="HISTORY" 
                        className="text-6xl xl:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white" 
                    />

                </div>

                <div className="relative space-y-8">
                    <p className="text-white/60 text-lg leading-relaxed font-light">
                        A definitive archive of technical leadership. Navigating the intersection of complex systems and user-centric design with precision.
                    </p>
                    
                    <a 
                        href="/resume.pdf" 
                        target="_blank" 
                        className="flex items-center gap-4 text-white hover:text-sky-400 transition-colors group w-fit"
                    >
                        <div className="flex items-center justify-center w-12 h-12 border border-white/10 group-hover:border-sky-500 group-hover:bg-sky-500/10 rounded-full transition-all duration-300">
                            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                        </div>
                        <span className="font-mono text-xs uppercase tracking-widest">
                            Resume_2024.pdf
                        </span>
                    </a>
                </div>

             </div>
          </div>

          {/* Right Panel: The Stream */}
          <div className="flex-1 lg:pt-4" ref={containerRef}>
             <div className="relative">
                {resumeData.experience.map((job, index) => (
                   <ExperienceItem 
                     key={index} 
                     job={job} 
                     index={index} 
                     isLast={index === resumeData.experience.length - 1} 
                   />
                ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
