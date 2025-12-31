import { resumeData } from "../data/resume";

export function Footer() {
  return (
    <footer id="contact" className="relative z-50 bg-[#050505] pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-12 px-4 md:px-8 border-t border-white/10 overflow-hidden">
        <div className="container mx-auto max-w-[1800px] flex flex-col items-center text-center">
            
            <span className="font-mono text-xs uppercase tracking-widest text-green-500 mb-6 md:mb-8 animate-pulse">
                ● Open to Opportunities
            </span>
            
            <a href={`mailto:${resumeData.email}`} className="text-[10vw] md:text-[8vw] lg:text-[6vw] font-black tracking-tighter leading-none hover:text-white/80 transition-colors break-all">
                {resumeData.email}
            </a>
            
            <div className="mt-8 md:mt-12 flex gap-4 md:gap-8 flex-wrap justify-center">
                <a href={resumeData.social.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-xs md:text-sm uppercase tracking-widest hover:underline">
                    LinkedIn
                </a>
                <a href={resumeData.social.github} target="_blank" rel="noopener noreferrer" className="font-mono text-xs md:text-sm uppercase tracking-widest hover:underline">
                    GitHub
                </a>
                <a href="https://wa.me/919976284929" target="_blank" rel="noopener noreferrer" className="font-mono text-xs md:text-sm uppercase tracking-widest hover:underline">
                    WhatsApp
                </a>
                <a href="https://www.instagram.com/john.saruhasan?igsh=a2xyam54MG1nempz" target="_blank" rel="noopener noreferrer" className="font-mono text-xs md:text-sm uppercase tracking-widest hover:underline">
                    Instagram
                </a>
                <a href="https://boxd.it/bmlSR" target="_blank" rel="noopener noreferrer" className="font-mono text-xs md:text-sm uppercase tracking-widest hover:underline">
                    Letterboxd
                </a>
            </div>

            <p className="mt-8 md:mt-12 font-mono text-xs text-white/30">
                © {new Date().getFullYear()} Saruhasan Sankar. All Rights Reserved.
            </p>

             <div className="mt-4 pointer-events-none select-none w-full overflow-hidden">
                 <h1 className="text-[18vw] md:text-[14vw] font-black text-[#111] leading-none text-center tracking-tighter">
                     SARUHASAN
                 </h1>
             </div>

        </div>
    </footer>
  );
}