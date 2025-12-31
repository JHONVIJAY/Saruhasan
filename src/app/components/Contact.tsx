import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, Copy, Linkedin, Twitter, Github } from "lucide-react";
import { resumeData } from "../data/resume";
import { useRef, useState } from "react";
import { toast } from "sonner";

const textVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 1,
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
      className={`${className} flex justify-center flex-wrap`}
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

export function Contact() {
  const [copied, setCopied] = useState(false);

  // Magnetic Button Logic
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!ref.current) return;
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      x.set(e.clientX - (left + width / 2));
      y.set(e.clientY - (top + height / 2));
  };

  const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(resumeData.email);
    setCopied(true);
    toast.success("Email copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer id="contact" className="h-full w-full bg-zinc-950 flex flex-col justify-between pt-24 pb-12 px-6 md:px-12 overflow-hidden relative">
      
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")` }} 
      />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center">
         <div className="text-center">
             <SplitText 
                text="LET'S TALK" 
                className="text-[15vw] leading-[0.8] font-black tracking-tighter text-white select-none mix-blend-difference"
             />
         </div>

         <div className="mt-12">
             <motion.button 
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => window.location.href = `mailto:${resumeData.email}`}
                style={{ x: xSpring, y: ySpring }}
                className="group relative px-12 py-6 rounded-full bg-white text-black text-xl font-bold overflow-hidden"
             >
                <span className="relative z-10 flex items-center gap-3">
                    Start a Project <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                </span>
                <motion.div 
                    className="absolute inset-0 bg-blue-500 z-0"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.5, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                />
             </motion.button>
         </div>
      </div>

      {/* Footer Grid */}
      <div className="relative z-10 border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-white/60">
         <div className="flex flex-col gap-4">
             <span className="text-xs uppercase tracking-widest font-mono text-white/40">Contact</span>
             <div className="flex items-center gap-4">
                 <button onClick={copyEmail} className="hover:text-white transition-colors flex items-center gap-2">
                    {resumeData.email} <Copy className="w-3 h-3" />
                 </button>
             </div>
             <div>+91 96291 38531</div>
         </div>

         <div className="flex flex-col gap-4">
             <span className="text-xs uppercase tracking-widest font-mono text-white/40">Socials</span>
             <div className="flex gap-4">
                 <SocialLink href={resumeData.social.github} icon={<Github className="w-5 h-5" />} />
                 <SocialLink href={resumeData.social.linkedin} icon={<Linkedin className="w-5 h-5" />} />
                 <SocialLink href={resumeData.social.twitter} icon={<Twitter className="w-5 h-5" />} />
             </div>
         </div>

         <div className="flex flex-col gap-4 md:text-right">
             <span className="text-xs uppercase tracking-widest font-mono text-white/40">Location</span>
             <div>Chennai, India</div>
             <div className="text-xs text-white/30 mt-auto">
                 &copy; 2025 Saruhasan Sankar. All rights reserved.
             </div>
         </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string, icon: any }) {
    return (
        <a 
            href={href} 
            target="_blank" 
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:border-transparent transition-all duration-300"
        >
            {icon}
        </a>
    )
}