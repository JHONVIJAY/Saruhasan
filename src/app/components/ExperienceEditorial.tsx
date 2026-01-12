import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { resumeData } from "../data/resume";

const textVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function SplitText({ text, className }: { text: string, className?: string }) {
  return (
    <motion.h2 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`${className} flex flex-wrap overflow-hidden`}
    >
      {text.split("").map((char, i) => (
         <motion.span
            key={`${char}-${i}`}
            custom={i}
            variants={textVariants}
            className="inline-block"
         >
           {char === " " ? "\u00A0" : char}
         </motion.span>
      ))}
    </motion.h2>
  );
}

export function ExperienceEditorial() {
  return (
    <section id="experience" className="relative z-10 bg-[#050505] text-[#EAEAEA] py-20 md:py-32 lg:py-40 border-b border-white/10">
      <div className="container mx-auto px-4 md:px-8 max-w-[1800px]">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Sidebar Title */}
            <div className="md:col-span-3">
                 <div className="md:sticky md:top-32">
                    <SplitText 
                      text="PROFESSIONAL HISTORY" 
                      className="text-xs md:text-sm font-mono uppercase tracking-widest text-white/50"
                    />
                 </div>
            </div>

            {/* List */}
            <div className="md:col-span-9 flex flex-col gap-12 md:gap-20">
                {resumeData.experience.map((job, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.15 }}
                      className="group relative pb-12 md:pb-16 border-b border-white/5 last:border-0 last:pb-0"
                    >
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16">
                          
                          {/* Left Column - Company & Role */}
                          <div className="flex gap-4 md:gap-6">
                              <span className="font-mono text-4xl md:text-5xl lg:text-6xl font-black text-white/10 md:text-white/5 md:group-hover:text-white/10 transition-colors duration-700 leading-none">
                                0{index + 1}
                              </span>
                              <div className="flex-1">
                                  <div className="flex items-start gap-3 mb-2">
                                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-sky-400/90 md:text-white md:group-hover:text-sky-400 transition-colors duration-500">
                                          {job.company}
                                      </h3>
                                      {job.link && (
                                        <a 
                                          href={job.link} 
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-white/50 md:text-white/40 hover:text-sky-400 active:text-sky-400 transition-colors duration-500 mt-1"
                                        >
                                          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                                        </a>
                                      )}
                                  </div>
                                  <p className="text-sm md:text-base lg:text-lg font-medium text-white/75 md:text-white/60 uppercase tracking-wide">
                                    {job.role}
                                  </p>
                              </div>
                          </div>

                          {/* Right Column - Description & Meta */}
                          <div className="flex flex-col justify-between gap-6">
                              <p className="text-base md:text-lg leading-relaxed font-light text-white/90 md:text-white/70 md:group-hover:text-white/90 transition-colors duration-500">
                                  {job.description}
                              </p>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-t border-white/10 pt-4">
                                  <span className="font-mono text-xs uppercase tracking-widest text-white/50 md:text-white/40 md:group-hover:text-white/60 transition-colors duration-500">
                                    {job.period}
                                  </span>
                                  <span className="hidden sm:block w-12 h-[1px] bg-white/30 md:bg-white/20 md:group-hover:bg-white/40 transition-colors duration-500" />
                                  <span className="font-mono text-xs uppercase tracking-widest text-white/50 md:text-white/40 md:group-hover:text-white/60 transition-colors duration-500">
                                    {job.location}
                                  </span>
                              </div>
                          </div>

                        </div>

                        {/* Decorative Line - Desktop only */}
                        <div className="hidden md:block absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-sky-400/0 via-sky-400/30 to-sky-400/0 transition-all duration-1500 ease-out" />

                    </motion.div>
                ))}
            </div>

        </div>

      </div>
    </section>
  );
}