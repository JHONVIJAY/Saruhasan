import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { resumeData } from "../data/resume";

export function TheSignature() {
  return (
    <footer className="relative bg-[#050505] pt-32 pb-12 overflow-hidden border-t border-white/10">
      
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
            <div>
                <span className="font-mono text-orange-500 text-xs uppercase tracking-widest mb-4 block">
                    Initiate Sequence
                </span>
                <h2 className="text-5xl md:text-7xl font-bold text-white max-w-2xl tracking-tighter leading-[0.9]">
                    READY TO BUILD THE IMPOSSIBLE?
                </h2>
            </div>
            
            <a 
                href={`mailto:${resumeData.email}`}
                className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-black rounded-full overflow-hidden"
            >
                <span className="relative z-10 font-mono font-bold uppercase tracking-widest">Transmit Signal</span>
                <ArrowUpRight className="relative z-10 w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                <motion.div 
                    className="absolute inset-0 bg-orange-500"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                />
            </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-t border-white/10 pt-12">
            <div>
                <h4 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">Coordinates</h4>
                <p className="text-white text-sm">Chennai, India</p>
                <p className="text-white text-sm">GMT +5:30</p>
            </div>
            <div>
                <h4 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">Connect</h4>
                <div className="flex flex-col gap-2">
                    <a href={resumeData.social.linkedin} className="text-white text-sm hover:text-orange-500 transition-colors">LinkedIn</a>
                    <a href={resumeData.social.twitter} className="text-white text-sm hover:text-orange-500 transition-colors">Twitter / X</a>
                    <a href={resumeData.social.github} className="text-white text-sm hover:text-orange-500 transition-colors">GitHub</a>
                </div>
            </div>
            <div>
                <h4 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">Legal</h4>
                <p className="text-white text-sm text-white/50">Privacy Protocol</p>
                <p className="text-white text-sm text-white/50">Terms of Service</p>
            </div>
             <div>
                <h4 className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">Version</h4>
                <p className="text-white text-sm font-mono text-white/50">v4.0.0 [BETA]</p>
                <p className="text-white text-sm font-mono text-white/50">Sys.ID: JOHN-01</p>
            </div>
        </div>

        {/* The Massive Signature */}
        <div className="relative">
            <h1 className="text-[14vw] leading-[0.75] font-black tracking-tighter text-white/10 select-none text-center mix-blend-difference hover:text-orange-500/20 transition-colors duration-500">
                SARUHASAN
            </h1>
        </div>

      </div>
    </footer>
  );
}