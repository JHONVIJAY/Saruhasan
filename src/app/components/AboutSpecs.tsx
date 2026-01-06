import { resumeData } from "../data/resume";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.01, // Faster delay for longer text
      duration: 0.6,
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
      className={`${className} flex flex-wrap`}
      style={{ lineHeight: '0.95' }}
    >
      {text.split(" ").map((word, wIndex) => (
        <span key={`word-${wIndex}`} className="inline-flex mr-[0.35em] pb-1">
            {word.split("").map((char, cIndex) => {
                const globalIndex = wIndex * 10 + cIndex;
                return (
                    <motion.span
                        key={`${char}-${cIndex}`}
                        custom={globalIndex}
                        variants={textVariants}
                        className="inline-block"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                )
            })}
        </span>
      ))}
    </motion.h2>
  );
}

export function AboutSpecs() {
  return (
    <section id="profile" className="relative z-10 bg-[#050505] text-[#EAEAEA] py-20 md:py-32 lg:py-40 scroll-mt-24">
      <div className="container mx-auto px-4 md:px-8 max-w-[1800px]">
        
        {/* Intro */}
        <div className="mb-20 md:mb-32 max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 bg-sky-500" />
                <span className="font-mono text-sm uppercase tracking-[0.2em] text-white/50">
                    Profile & Specs
                </span>
            </div>
            
            <SplitText 
                text="Engineering digital perfection through rigorous design & code."
                className="text-[7vw] md:text-[5vw] lg:text-[4vw] leading-[0.9] font-bold tracking-tighter mb-8 md:mb-12"
            />
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
            >
                <p className="text-lg md:text-xl font-light text-white/70 leading-relaxed border-l border-white/10 pl-6">
                    {resumeData.summary}
                </p>
            </motion.div>
        </div>

        {/* Specs Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10"
        >
            
            {/* Education */}
            <div className="group bg-[#050505] p-8 md:p-12 hover:bg-[#0A0A0A] transition-colors duration-500">
                 <h3 className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-white/50 mb-8 group-hover:text-sky-400 transition-colors">
                    <span className="w-1.5 h-1.5 bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity"/> 
                    Education
                 </h3>
                 {resumeData.education.map((edu, i) => (
                     <div key={i} className="mb-8 last:mb-0 group/item">
                         <h4 className="text-xl md:text-2xl font-bold mb-2 text-white group-hover/item:text-sky-100 transition-colors">{edu.degree}</h4>
                         <p className="text-white/60 mb-2 font-light">{edu.school}</p>
                         <p className="font-mono text-xs text-white/30 uppercase tracking-wider">{edu.period} • {edu.score}</p>
                     </div>
                 ))}
            </div>

            {/* Skills */}
            <div className="group bg-[#050505] p-8 md:p-12 hover:bg-[#0A0A0A] transition-colors duration-500">
                 <h3 className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-white/50 mb-8 group-hover:text-sky-400 transition-colors">
                    <span className="w-1.5 h-1.5 bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity"/> 
                    Expertise
                 </h3>
                 <ul className="flex flex-col gap-4">
                     {resumeData.skills.map((skill, i) => (
                         <li key={i} className="group/item flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0 hover:border-sky-500/30 transition-colors">
                             <span className="text-base md:text-lg font-medium text-white/80 group-hover/item:text-white transition-colors">{skill}</span>
                             <span className="text-xs font-mono text-white/30 group-hover/item:text-sky-400 transition-colors">0{i+1}</span>
                         </li>
                     ))}
                 </ul>
            </div>

            {/* Tools */}
             <div className="group bg-[#050505] p-8 md:p-12 hover:bg-[#0A0A0A] transition-colors duration-500">
                 <h3 className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-white/50 mb-8 group-hover:text-sky-400 transition-colors">
                    <span className="w-1.5 h-1.5 bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity"/> 
                    Toolkit
                 </h3>
                 <div className="flex flex-wrap gap-2">
                     {resumeData.tools.map((tool, i) => (
                         <span key={i} className="px-3 md:px-4 py-1.5 md:py-2 border border-white/10 bg-white/5 text-white/60 hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-300 rounded-sm text-xs md:text-sm font-mono transition-all duration-300 cursor-default">
                             {tool}
                         </span>
                     ))}
                 </div>
            </div>

        </motion.div>

      </div>
    </section>
  );
}