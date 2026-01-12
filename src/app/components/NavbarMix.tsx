import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { resumeData } from "../data/resume";

export function NavbarMix() {
  const [showAlias, setShowAlias] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [currentName, setCurrentName] = useState("SARUHASAN");
  
  // Scroll handling for smart navbar behavior
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Determine if scrolled past threshold to change style
    setScrolled(latest > 50);
    
    // Determine scroll direction for hiding/showing navbar
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Initial typing effect on page load
  useEffect(() => {
    if (!isTyping || displayText.length === currentName.length) return;

    const timeout = setTimeout(() => {
      setDisplayText(currentName.slice(0, displayText.length + 1));
    }, 50); // Faster typing

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentName]);

  // Wait 5 seconds after typing completes, then start deleting
  useEffect(() => {
    if (isTyping && displayText.length === currentName.length) {
      const timeout = setTimeout(() => {
        setIsTyping(false);
        setIsDeleting(true);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [isTyping, displayText, currentName]);

  // Deleting animation
  useEffect(() => {
    if (!isDeleting) return;

    if (displayText.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, 50); // Faster deleting
      return () => clearTimeout(timeout);
    } else {
      // Finished deleting, switch to the other name and start typing
      setIsDeleting(false);
      setIsTyping(true);
      setCurrentName(currentName === "SARUHASAN" ? "JOHN" : "SARUHASAN");
      setShowAlias(!showAlias);
    }
  }, [displayText, isDeleting, currentName, showAlias]);

  const navLinks = [
    { name: 'Index', href: '#index' },
    { name: 'Works', href: '#works' },
    { name: 'Profile', href: '#profile' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <>
    <motion.nav 
        variants={{
            visible: { y: 0 },
            hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center transition-all duration-300 ${
            scrolled 
            ? "py-3 px-4 md:px-8 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20" 
            : "py-5 px-4 md:px-12 bg-transparent border-transparent"
        }`}
    >
        <div className="min-w-[120px] md:min-w-[140px] relative z-[60]">
             <a href="#index" className="block relative h-6 md:h-8 overflow-hidden group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="full"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute top-0 left-0 origin-left"
                    >
                        <span className="font-black text-lg md:text-xl tracking-tighter uppercase leading-none whitespace-nowrap text-white mix-blend-difference">
                            {displayText.split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: { opacity: 1 },
                                        exit: { opacity: 0 }
                                    }}
                                    transition={{
                                        duration: 0.03,
                                        delay: i * 0.03
                                    }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    </motion.div>
                </AnimatePresence>
             </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center bg-white/5 backdrop-blur-sm px-6 py-2.5 rounded-full border border-white/5 hover:border-white/10 transition-colors duration-300">
             {navLinks.map((item, i) => (
                 <a key={i} href={item.href} className="relative font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-300 group">
                     {item.name}
                     <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-sky-400 transition-all duration-300 group-hover:w-full" />
                 </a>
             ))}
             <div className="w-[1px] h-4 bg-white/20 mx-2" />
             <a 
                href={resumeData.social.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="text-white/60 hover:text-sky-400 transition-colors duration-300"
             >
                 <ArrowUpRight size={14} />
             </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
            <motion.button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
                className="relative z-[100] w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white"
                aria-label="Toggle menu"
            >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileMenuOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mobileMenuOpen ? (
                        <X className="w-5 h-5" />
                    ) : (
                        <Menu className="w-5 h-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
            </motion.button>
        </div>
    </motion.nav>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
    {mobileMenuOpen && (
        <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] bg-[#0A0A0A] md:hidden flex flex-col"
        >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-[0.03]" />
            
            <div className="flex-1 flex flex-col justify-center px-8 gap-6">
                {navLinks.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ 
                            delay: 0.1 + i * 0.1,
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                    >
                        <a 
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-5xl font-black uppercase tracking-tighter text-white/50 hover:text-white transition-colors duration-300"
                        >
                            {item.name}
                        </a>
                        <div className="w-full h-[1px] bg-white/5 mt-6" />
                    </motion.div>
                ))}
            </div>

            {/* Footer of Mobile Menu */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-8 pb-12 bg-white/5"
            >
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">Connect</p>
                <div className="flex gap-6">
                    <a href={resumeData.social.linkedin} className="text-white hover:text-sky-400 transition-colors">LinkedIn</a>
                    <a href={resumeData.social.github} className="text-white hover:text-sky-400 transition-colors">GitHub</a>
                    <a href={`mailto:${resumeData.email}`} className="text-white hover:text-sky-400 transition-colors">Email</a>
                </div>
            </motion.div>
        </motion.div>
    )}
    </AnimatePresence>
    </>
  );
}