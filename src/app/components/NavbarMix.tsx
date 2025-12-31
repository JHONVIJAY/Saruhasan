import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function NavbarMix() {
  const [showAlias, setShowAlias] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAlias((prev) => !prev);
    }, 4000); // Cycles every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-start p-4 md:p-6 lg:p-8 mix-blend-difference text-white pointer-events-none"
    >
        <div className="pointer-events-auto min-w-[120px] md:min-w-[140px]">
             <a href="#index" className="block relative h-8 md:h-8 overflow-hidden">
                <AnimatePresence mode="wait">
                    {!showAlias ? (
                        <motion.div
                            key="full"
                            initial={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                            exit={{ opacity: 0, filter: "blur(8px)", scale: 1.05 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-0 left-0 origin-left"
                        >
                            <span className="font-black text-lg md:text-xl tracking-tighter uppercase leading-none whitespace-nowrap">SARUHASAN</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="alias"
                            initial={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                            exit={{ opacity: 0, filter: "blur(8px)", scale: 1.05 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-0 left-0 origin-left"
                        >
                            <span className="font-black text-lg md:text-xl tracking-tighter uppercase leading-none whitespace-nowrap">JOHN</span>
                        </motion.div>
                    )}
                </AnimatePresence>
             </a>
        </div>

        <div className="pointer-events-auto hidden md:flex gap-6 lg:gap-8">
             {[
               { name: 'Index', href: '#index' },
               { name: 'Works', href: '#works' },
               { name: 'Profile', href: '#profile' },
               { name: 'Contact', href: '#contact' }
             ].map((item, i) => (
                 <a key={i} href={item.href} className="font-mono text-xs uppercase tracking-widest hover:underline underline-offset-4">
                     {item.name}
                 </a>
             ))}
        </div>

        <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="pointer-events-auto md:hidden relative z-[100] p-2 -mr-2"
            aria-label="Toggle menu"
        >
            {mobileMenuOpen ? (
                <X className="w-6 h-6" />
            ) : (
                <span className="font-mono text-xs uppercase tracking-widest">Menu</span>
            )}
        </button>
    </motion.nav>

    {/* Mobile Menu Overlay */}
    <AnimatePresence>
    {mobileMenuOpen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[90] bg-[#050505] md:hidden overflow-hidden"
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
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ 
                            duration: 0.6, 
                            delay: i * 0.1,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            setMobileMenuOpen(false);
                            setTimeout(() => {
                                const element = document.getElementById(item.href.substring(1));
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }, 400);
                        }}
                        className="group relative text-5xl font-black uppercase tracking-tighter text-white overflow-hidden"
                    >
                        {/* Hover effect background */}
                        <motion.div 
                            className="absolute inset-0 bg-sky-400/10 -z-10 rounded-lg"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{ originX: 0 }}
                        />
                        
                        <span className="relative inline-block group-hover:text-sky-400 transition-colors duration-300">
                            {item.name}
                        </span>
                        
                        {/* Underline effect */}
                        <motion.div 
                            className="absolute bottom-0 left-0 h-[2px] bg-sky-400"
                            initial={{ scaleX: 0 }}
                            whileHover={{ scaleX: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{ originX: 0 }}
                        />
                    </motion.a>
                ))}

                {/* Bottom info section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
                                    transition={{ duration: 0.5 }}
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
                                    transition={{ duration: 0.5 }}
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