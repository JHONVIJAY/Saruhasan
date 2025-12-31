import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function NavbarMix() {
  const [showAlias, setShowAlias] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAlias((prev) => !prev);
    }, 4000); // Cycles every 4 seconds
    return () => clearInterval(interval);
  }, []);

  return (
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

        <div className="pointer-events-auto md:hidden">
             <span className="font-mono text-xs uppercase tracking-widest">Menu</span>
        </div>
    </motion.nav>
  );
}