import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { resumeData } from "../data/resume";

export function NavbarMix() {
  const [showAlias, setShowAlias] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [currentName, setCurrentName] = useState("SARUHASAN");
  
  // Scroll detection for background toggle
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

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

  return (
    <>
    <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 transition-all duration-500 text-white ${
            scrolled 
            ? "bg-black/30 backdrop-blur-2xl border-b border-white/10 shadow-lg py-4" 
            : "bg-transparent border-transparent shadow-none py-6"
        }`}
    >
        <div className="min-w-[120px] md:min-w-[140px]">
             <Link to="/#index" className="block relative h-6 md:h-8 overflow-hidden group">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="full"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute top-0 left-0 origin-left"
                    >
                        <span className="font-black text-lg md:text-xl tracking-tighter uppercase leading-none whitespace-nowrap text-white group-hover:text-sky-400 transition-colors duration-300">
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
             ))}
        </div>

        <div className="md:hidden">
            <motion.button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={`relative z-[100] p-2 transition-colors ${scrolled ? "text-white" : "text-white"} hover:text-sky-400`}
                aria-label="Toggle menu"
            >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileMenuOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                  </motion.div>
                </AnimatePresence>
            </motion.button>
        </div>
    </motion.nav>

    {/* Mobile Menu Overlay - Preserved from previous version */}
    <AnimatePresence>
    {mobileMenuOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] bg-[#050505]/98 backdrop-blur-lg md:hidden overflow-y-auto flex flex-col"
            onClick={() => setMobileMenuOpen(false)}
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-transparent pointer-events-none" />
            
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 py-6">
                {/* Animated menu items */}
                {[
                    { name: 'Index', href: '/#index' },
                    { name: 'Works', href: '/#works' },
                    { name: 'History', href: '/#experience' },
                    { name: 'Profile', href: '/#profile' },
                    { name: 'Void', href: '/void' },
                    { name: 'Contact', href: '/#contact' }
                ].map((item, i, array) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ 
                            delay: 0.1 + i * 0.1,
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className="pb-4"
                    >
                        <Link 
                            to={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="group flex items-center gap-4 py-2"
                        >
                            <span className="font-mono text-xs text-sky-500/50 group-hover:text-sky-400 transition-colors">0{i + 1}</span>
                            <span className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter text-white/40 group-hover:text-white transition-all duration-300">
                                {item.name}
                            </span>
                        </Link>
                        {i < array.length - 1 && (
                            <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent mt-4" />
                        )}
                    </motion.div>
                ))}
            </div>

             {/* Bottom info section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full border-t border-white/10 bg-[#050505] shrink-0"
            >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-8">
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
                </div>
            </motion.div>
        </motion.div>
    )}
    </AnimatePresence>
    </>
  );
}