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
    >
      {text.split(" ").map((word, wIndex) => (
        <span key={`word-${wIndex}`} className="inline-flex overflow-hidden mr-[0.35em]">
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
    <section id="profile" className="relative z-10 bg-[#050505] text-[#EAEAEA] py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-8 max-w-[1800px]">
        
        {/* Intro */}
        <div className="mb-20 md:mb-32 max-w-4xl">
            <SplitText 
                text="Engineering digital perfection through rigorous design & code."
                className="text-[7vw] md:text-[5vw] lg:text-[4vw] leading-[0.9] font-bold tracking-tighter mb-8 md:mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <p className="text-lg md:text-xl font-light text-white/70 leading-relaxed">
                    {resumeData.summary}
                </p>
            </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/20 border border-white/20">
            
            {/* Education */}
            <div className="bg-[#050505] p-8 md:p-12 hover:bg-[#0A0A0A] transition-colors">
                 <h3 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-6 md:mb-8">Education</h3>
                 {resumeData.education.map((edu, i) => (
                     <div key={i} className="mb-6 md:mb-8 last:mb-0">
                         <h4 className="text-lg md:text-xl font-bold mb-2">{edu.degree}</h4>
                         <p className="text-white/70 mb-2">{edu.school}</p>
                         <p className="font-mono text-xs text-white/40">{edu.period} • {edu.score}</p>
                     </div>
                 ))}
            </div>

            {/* Skills */}
            <div className="bg-[#050505] p-8 md:p-12 hover:bg-[#0A0A0A] transition-colors">
                 <h3 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-6 md:mb-8">Expertise</h3>
                 <ul className="flex flex-col gap-4">
                     {resumeData.skills.map((skill, i) => (
                         <li key={i} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0 last:pb-0">
                             <span className="text-base md:text-lg font-medium">{skill}</span>
                             <span className="text-xs font-mono text-white/30">0{i+1}</span>
                         </li>
                     ))}
                 </ul>
            </div>

            {/* Tools */}
             <div className="bg-[#050505] p-8 md:p-12 hover:bg-[#0A0A0A] transition-colors">
                 <h3 className="font-mono text-xs uppercase tracking-widest text-white/50 mb-6 md:mb-8">Toolkit</h3>
                 <div className="flex flex-wrap gap-2">
                     {resumeData.tools.map((tool, i) => (
                         <span key={i} className="px-3 md:px-4 py-1.5 md:py-2 border border-white/20 rounded-full text-xs md:text-sm font-mono hover:bg-white hover:text-black transition-colors cursor-default">
                             {tool}
                         </span>
                     ))}
                 </div>
            </div>

        </div>

      </div>
    </section>
  );
}