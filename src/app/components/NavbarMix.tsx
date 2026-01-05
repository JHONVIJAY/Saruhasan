import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function NavbarMix() {
  const [showAlias, setShowAlias] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [currentName, setCurrentName] = useState("SARUHASAN");

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
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 md:p-6 lg:p-8 bg-white/10 backdrop-blur-2xl border-b border-white/20 shadow-xl shadow-black/50 text-white"
    >
        <div className="min-w-[120px] md:min-w-[140px]">
             <a href="#index" className="block relative h-6 md:h-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="full"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute top-0 left-0 origin-left"
                    >
                        <span className="font-black text-lg md:text-xl tracking-tighter uppercase leading-none whitespace-nowrap">
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

        <div className="hidden md:flex gap-6 lg:gap-8">
             {[
               { name: 'Index', href: '#index' },
               { name: 'Works', href: '#works' },
               { name: 'Profile', href: '#profile' },
               { name: 'Contact', href: '#contact' }
             ].map((item, i) => (
                 <a key={i} href={item.href} className="relative font-mono text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors duration-500 group">
                     {item.name}
                     <motion.span 
                       className="absolute -bottom-1 left-0 h-[1px] bg-sky-400 origin-left w-full"
                       initial={{ scaleX: 0 }}
                       whileHover={{ scaleX: 1 }}
                       transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                     />
                 </a>
             ))}
        </div>

        <div className="md:hidden">
            <motion.button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-[100] bg-[#050505]/80 backdrop-blur-xl border border-white/20 rounded-md p-2 touch-manipulation"
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
                        <span className="font-mono text-xs uppercase tracking-widest px-1">Menu</span>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] bg-[#050505]/98 backdrop-blur-lg md:hidden overflow-hidden"
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

            <div className="relative flex flex-col items-center justify-center h-full gap-8 px-6 py-20">
                {/* Animated menu items */}
                {[
                    { name: 'Index', href: '#index' },
                    { name: 'Works', href: '#works' },
                    { name: 'Profile', href: '#profile' },
                    { name: 'Contact', href: '#contact' }
                ].map((item, i) => (
                    <motion.a 
                        key={i}
                        href={item.href}
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                        transition={{ 
                            duration: 0.6, 
                            delay: i * 0.1,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            setMobileMenuOpen(false);
                            setTimeout(() => {
                                const element = document.getElementById(item.href.substring(1));
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }, 300);
                        }}
                        className="group relative text-5xl font-black uppercase tracking-tighter text-white overflow-hidden"
                    >
                        <span className="relative inline-block">
                            {item.name}
                        </span>
                        
                        {/* Underline effect */}
                        <motion.div 
                            className="absolute -bottom-2 left-0 right-0 h-[2px] bg-sky-400"
                            initial={{ scaleX: 0 }}
                            whileTap={{ scaleX: 1 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            style={{ originX: 0 }}
                        />
                    </motion.a>
                ))}

                {/* Bottom info section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-8 text-center"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        <span className="font-mono text-xs text-white/70 uppercase tracking-widest">Available for work</span>
                    </div>
                    
                    {/* Cycling identity */}
                    <div className="relative h-8 overflow-hidden">
                        <AnimatePresence mode="wait">
                            {!showAlias ? (
                                <motion.div
                                    key="full-mobile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <span className="font-black text-xl tracking-tighter uppercase text-white/40">SARUHASAN</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="alias-mobile"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <span className="font-black text-xl tracking-tighter uppercase text-white/40">JOHN</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )}
    </AnimatePresence>
    </>
  );
}