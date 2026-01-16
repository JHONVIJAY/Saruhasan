import { resumeData } from "../data/resume";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const socialLinks = [
    { name: "LinkedIn", url: resumeData.social.linkedin },
    { name: "GitHub", url: resumeData.social.github },
    { name: "WhatsApp", url: "https://wa.me/919976284929" },
    { name: "Instagram", url: "https://www.instagram.com/john.saruhasan?igsh=a2xyam54MG1nempz" },
    { name: "Letterboxd", url: "https://boxd.it/bmlSR" }
  ];

  return (
    <footer id="contact" className="relative z-50 bg-[#050505] pt-20 md:pt-32 lg:pt-40 pb-12 md:pb-16 px-4 md:px-8 border-t border-white/10 overflow-hidden scroll-mt-24" role="contentinfo">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-500/[0.02] to-transparent pointer-events-none" />
        
        <div className="container mx-auto max-w-[1800px] flex flex-col items-center text-center relative">
            
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 md:mb-12"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-white/70">
                  Available for Opportunities
                </span>
              </div>
            </motion.div>
            
            {/* Email CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mb-4 md:mb-6"
            >
              <h2 className="text-sm md:text-base font-mono uppercase tracking-widest text-white/40 mb-4 md:mb-6">
                Let's Create Together
              </h2>
              <a 
                href={`mailto:${resumeData.email}`} 
                className="group relative text-[10vw] md:text-[8vw] lg:text-[6vw] font-black tracking-tighter leading-none hover:text-sky-400 focus:text-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-4 focus:ring-offset-[#050505] rounded transition-colors duration-700 break-all inline-block"
                aria-label={`Send email to ${resumeData.email}`}
              >
                {resumeData.email}
                <motion.span 
                  className="absolute -bottom-2 left-0 right-0 h-[2px] md:h-[3px] bg-sky-400 origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                />
              </a>
            </motion.div>
            
            {/* Social Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 md:mt-16 flex gap-6 md:gap-10 flex-wrap justify-center"
            >
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative font-mono text-xs md:text-sm uppercase tracking-widest text-white/60 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#050505] rounded transition-colors duration-500 inline-flex items-center gap-2"
                    aria-label={`Visit ${link.name}`}
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus:opacity-100 group-focus:translate-x-0.5 group-focus:-translate-y-0.5 transition-all duration-500" />
                    <motion.span 
                      className="absolute -bottom-1 left-0 right-0 h-[1px] bg-sky-400 origin-left"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </motion.a>
                ))}
            </motion.div>

            {/* Divider */}
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-12 md:mt-16 mb-8 md:mb-12"
            />

            {/* Copyright */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="font-mono text-xs text-white/30 text-center md:text-left"
                >
                    © {new Date().getFullYear()} Saruhasan Sankar. All Rights Reserved.
                </motion.p>

                <motion.button
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="font-mono text-xs text-white/30 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-[#050505] rounded uppercase tracking-widest transition-colors flex items-center gap-2 group cursor-pointer touch-manipulation"
                    aria-label="Scroll back to top"
                    type="button"
                >
                    Back to Top
                    <span className="group-hover:-translate-y-1 group-focus:-translate-y-1 transition-transform duration-300">↑</span>
                </motion.button>
            </div>

        </div>
    </footer>
  );
}