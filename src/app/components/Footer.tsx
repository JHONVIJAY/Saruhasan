import { resumeData } from "../data/resume";

export function Footer() {
  return (
    <footer id="contact" className="relative z-50 bg-[#050505] pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-12 px-4 md:px-8 border-t border-white/10 overflow-hidden">
        <div className="container mx-auto max-w-[1800px] flex flex-col items-center text-center">
            
            <span className="font-mono text-xs uppercase tracking-widest text-sky-500 mb-6 md:mb-8 animate-pulse">
                ● Open to Opportunities
            </span>
            
            <a href={`mailto:${resumeData.email}`} className="text-[10vw] md:text-[8vw] lg:text-[6vw] font-black tracking-tighter leading-none hover:text-white/80 active:text-white/80 transition-colors duration-300 break-all">
                {resumeData.email}
            </a>
            
            <div className="mt-8 md:mt-12 flex gap-4 md:gap-8 flex-wrap justify-center">
                <a href={resumeData.social.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-xs md:text-sm uppercase tracking-widest hover:text-sky-400 active:text-sky-400 transition-colors duration-300 hover:underline underline-offset-4">
                    LinkedIn
                </a>
                <a href={resumeData.social.github} target="_blank" rel="noopener noreferrer" className="font-mono text-xs md:text-sm uppercase tracking-widest hover:text-sky-400 active:text-sky-400 transition-colors duration-300 hover:underline underline-offset-4">
                    GitHub
                </a>
                <a href="https://wa.me/919976284929" target="_blank" rel="noopener noreferrer" className="font-mono text-xs md:text-sm uppercase tracking-widest hover:text-sky-400 active:text-sky-400 transition-colors duration-300 hover:underline underline-offset-4">
                    WhatsApp
                </a>
                <a href="https://www.instagram.com/john.saruhasan?igsh=a2xyam54MG1nempz" target="_blank" rel="noopener noreferrer" className="font-mono text-xs md:text-sm uppercase tracking-widest hover:text-sky-400 active:text-sky-400 transition-colors duration-300 hover:underline underline-offset-4">
                    Instagram
                </a>
                <a href="https://boxd.it/bmlSR" target="_blank" rel="noopener noreferrer" className="font-mono text-xs md:text-sm uppercase tracking-widest hover:text-sky-400 active:text-sky-400 transition-colors duration-300 hover:underline underline-offset-4">
                    Letterboxd
                </a>
            </div>

            <p className="mt-8 md:mt-12 font-mono text-xs text-white/30">
                © {new Date().getFullYear()} Saruhasan Sankar. All Rights Reserved.
            </p>

        </div>
    </footer>
  );
}