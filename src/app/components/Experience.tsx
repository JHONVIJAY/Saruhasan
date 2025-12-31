import { motion } from "framer-motion";
import { useState } from "react";
import { resumeData } from "../data/resume";
import { cn } from "../lib/utils";

export function Experience() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-32 bg-background relative z-10" id="experience">
      <div className="container mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Sticky Header */}
            <div className="lg:col-span-4 relative">
                <div className="sticky top-32">
                    <h2 className="text-[12vw] lg:text-[5vw] font-black tracking-tighter leading-none mb-8 mix-blend-difference">
                        CAREER
                    </h2>
                    <p className="text-muted-foreground max-w-sm text-lg leading-relaxed">
                        A timeline of my professional journey, working with world-class agencies and startups.
                    </p>
                    <div className="mt-12 hidden lg:block">
                        <div className="h-[1px] w-full bg-white/10 mb-4" />
                        <div className="flex justify-between text-sm font-mono text-muted-foreground uppercase tracking-widest">
                            <span>2020</span>
                            <span>Present</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Experience List */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                {resumeData.experience.map((job, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={cn(
                            "relative p-8 md:p-12 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 rounded-lg group",
                            hoveredIndex !== null && hoveredIndex !== i && "opacity-50 blur-[1px]"
                        )}
                    >
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6">
                            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">
                                {job.company}
                            </h3>
                            <span className="font-mono text-sm text-muted-foreground/80 border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                                {job.period}
                            </span>
                        </div>
                        
                        <h4 className="text-xl text-white/80 mb-6 font-medium">{job.role}</h4>
                        
                        <p className="text-muted-foreground leading-relaxed text-base md:text-lg max-w-2xl">
                            {job.description}
                        </p>

                        {/* Decoration Corner */}
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                ))}

                {/* Education Mini-Section */}
                <div className="mt-16 pt-16 border-t border-white/10">
                     <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-8">Education</h3>
                     <div className="grid gap-6">
                        {resumeData.education.map((edu, i) => (
                            <div key={i} className="flex justify-between items-center group">
                                <div>
                                    <div className="text-xl font-bold text-white group-hover:text-primary transition-colors">{edu.school}</div>
                                    <div className="text-muted-foreground">{edu.degree}</div>
                                </div>
                                <div className="font-mono text-xs text-muted-foreground opacity-50">{edu.period}</div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}