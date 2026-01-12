import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
<<<<<<< HEAD
        <div className="min-w-[120px] md:min-w-[140px] relative z-[60]">
             <a href="#index" className="block relative h-6 md:h-8 overflow-hidden group">
=======
        <div className="min-w-[120px] md:min-w-[140px]">
             <Link to="/#index" className="block relative h-6 md:h-8 overflow-hidden group">
>>>>>>> 64bb70d0ca086f94b60aa82dca901c05e6e78005
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
             </Link>
        </div>

<<<<<<< HEAD
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center bg-white/5 backdrop-blur-sm px-6 py-2.5 rounded-full border border-white/5 hover:border-white/10 transition-colors duration-300">
             {navLinks.map((item, i) => (
                 <a key={i} href={item.href} className="relative font-mono text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors duration-300 group">
                     {item.name}
                     <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-sky-400 transition-all duration-300 group-hover:w-full" />
                 </a>
=======
        {/* Enhanced Desktop Navigation */}
        <div className="hidden md:flex items-center gap-10">
             {[
               { name: 'Index', href: '/#index' },
               { name: 'Works', href: '/#works' },
               { name: 'History', href: '/#experience' },
               { name: 'Profile', href: '/#profile' },
               { name: 'Void', href: '/void' },
               { name: 'Contact', href: '/#contact' }
             ].map((item, i) => (
                 <Link key={i} to={item.href} className="relative font-mono text-[11px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300 group">
                     {item.name}
                     <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-sky-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                 </Link>
>>>>>>> 64bb70d0ca086f94b60aa82dca901c05e6e78005
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
            
<<<<<<< HEAD
            <div className="flex-1 flex flex-col justify-center px-8 gap-6">
                {navLinks.map((item, i) => (
=======
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 py-8">
                {/* Animated menu items */}
                {[
                    { name: 'Index', href: '/#index' },
                    { name: 'Works', href: '/#works' },
                    { name: 'History', href: '/#experience' },
                    { name: 'Profile', href: '/#profile' },
                    { name: 'Void', href: '/void' },
                    { name: 'Contact', href: '/#contact' }
                ].map((item, i, array) => (
>>>>>>> 64bb70d0ca086f94b60aa82dca901c05e6e78005
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
                        className="pb-6"
                    >
                        <Link 
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-5xl font-black uppercase tracking-tighter text-white/50 hover:text-white transition-colors duration-300"
                        >
<<<<<<< HEAD
                            {item.name}
                        </a>
                        <div className="w-full h-[1px] bg-white/5 mt-6" />
=======
                            <span className="font-mono text-xs text-sky-500/50 group-hover:text-sky-400 transition-colors">0{i + 1}</span>
                            <span className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white/40 group-hover:text-white transition-all duration-300">
                                {item.name}
                            </span>
                        </Link>
                        {i < array.length - 1 && (
                            <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent mt-6" />
                        )}
>>>>>>> 64bb70d0ca086f94b60aa82dca901c05e6e78005
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
<<<<<<< HEAD
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-4">Connect</p>
                <div className="flex gap-6">
                    <a href={resumeData.social.linkedin} className="text-white hover:text-sky-400 transition-colors">LinkedIn</a>
                    <a href={resumeData.social.github} className="text-white hover:text-sky-400 transition-colors">GitHub</a>
                    <a href={`mailto:${resumeData.email}`} className="text-white hover:text-sky-400 transition-colors">Email</a>
=======
                <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-8">
                    <div className="flex flex-col gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Connect</span>
                        <div className="flex gap-5">
                            <a href={resumeData.social.linkedin} target="_blank" rel="noreferrer" className="group text-white/40 transition-colors hover:text-sky-400" aria-label="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-1">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                    <rect width="4" height="12" x="2" y="9" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </a>
                            <a href={resumeData.social.github} target="_blank" rel="noreferrer" className="group text-white/40 transition-colors hover:text-sky-400" aria-label="GitHub">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-1">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                    <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/john.saruhasan?igsh=a2xyam54MG1nempz" target="_blank" rel="noreferrer" className="group text-white/40 transition-colors hover:text-sky-400" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-1">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                            </a>
                            <a href="https://wa.me/919976284929" target="_blank" rel="noreferrer" className="group text-white/40 transition-colors hover:text-sky-400" aria-label="WhatsApp">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-1">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </a>
                            <a href={`mailto:${resumeData.email}`} className="group text-white/40 transition-colors hover:text-sky-400" aria-label="Email">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-1">
                                    <rect width="20" height="16" x="2" y="4" rx="2" />
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 items-start sm:items-end">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Identity</span>
                        <div className="relative h-6 w-32 overflow-hidden text-left sm:text-right">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={showAlias ? "john" : "saru"}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-start sm:justify-end"
                                >
                                    <span className="text-sm font-bold uppercase tracking-wider text-white/40">
                                        {showAlias ? "JOHN" : "SARUHASAN"}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
>>>>>>> 64bb70d0ca086f94b60aa82dca901c05e6e78005
                </div>
            </motion.div>
        </motion.div>
    )}
    </AnimatePresence>
    </>
  );
}