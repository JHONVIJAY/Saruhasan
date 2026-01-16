import { motion, useScroll, useTransform } from "framer-motion";
import heroImg from "../../assets/0575f999a9ea5865df7e385148b08517b640dc26.png";
import { ArrowDown } from "lucide-react";
import { BackgroundRipple } from "./ui/BackgroundRipple";
import { useState } from "react";

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

function SplitText({
  text,
  className,
  stroke = false,
  onClick,
}: {
  text: string;
  className?: string;
  stroke?: boolean;
  onClick?: () => void;
}) {
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      className={`${className} flex flex-wrap ${
        onClick ? "cursor-pointer select-none" : ""
      }`}
      onClick={onClick}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          custom={i}
          variants={textVariants}
          className="inline-block"
          style={
            stroke
              ? {
                  WebkitTextStroke: "1px rgba(255, 255, 255, 0.8)",
                  color: "transparent",
                }
              : {}
          }
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}

function FlipText({ text, className }: { text: string; className?: string }) {
  // Add invisible character to JOHN to match ANGEL's 5 letters
  const displayText = text === "JOHN" ? "JOHN " : text;

  return (
    <div className={`${className} flex flex-wrap`}>
      {displayText.split("").map((char, i) => (
        <div
          key={i}
          className="inline-block relative"
          style={{
            overflow: "clip",
            overflowClipMargin: "0.2em",
            height: "1em",
            lineHeight: "1",
            display: "inline-flex",
            alignItems: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`${char}-${i}`}
              initial={{
                y: "150%",
                opacity: 0,
                scale: 0.5,
                rotateX: 90,
                filter: "blur(10px)",
              }}
              animate={{
                y: 0,
                opacity: char === " " && displayText === "JOHN " ? 0 : 1,
                scale: 1,
                rotateX: 0,
                filter: "blur(0px)",
              }}
              exit={{
                y: "-150%",
                opacity: 0,
                scale: 0.5,
                rotateX: -90,
                filter: "blur(10px)",
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.04,
                ease: [0.34, 1.56, 0.64, 1],
                scale: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
              className="inline-block"
              style={{
                WebkitTextStroke: "1px rgba(255, 255, 255, 0.8)",
                color: "transparent",
                transformOrigin: "center center",
                lineHeight: "1",
                transformStyle: "preserve-3d",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function HeroSolid() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const [clickCount, setClickCount] = useState(0);
  const [displayName, setDisplayName] = useState<"JOHN" | "ANGEL">("JOHN");

  const handleNameClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // After 3 clicks, toggle the name
    if (newCount === 3) {
      setDisplayName((prev) => (prev === "JOHN" ? "ANGEL" : "JOHN"));
      setClickCount(0); // Reset counter
    }
  };

  return (
    <section
      id="index"
      className="relative w-full min-h-screen bg-[#050505] flex flex-col items-center pt-20 md:pt-32 pb-20 md:pb-24 px-4 md:px-8 overflow-hidden"
    >
      {/* BACKGROUND RIPPLE EFFECT - MOBILE ONLY */}
      <BackgroundRipple className="absolute inset-0 z-0 md:hidden" />

      {/* TOP TEXT */}
      <div className="w-full max-w-[1800px] flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 mb-4 md:mb-12 overflow-visible pointer-events-none">
        <div className="flex flex-col overflow-visible pointer-events-none">
          <SplitText
            text="SARU"
            className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter text-white uppercase"
          />
          <SplitText
            text="HASAN"
            className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter text-white uppercase"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 md:mt-0 md:text-right pointer-events-none"
        >
          <h2 className="text-white font-medium text-base md:text-xl mb-2">
            The Dual Identity
          </h2>
          <p className="text-white/50 text-xs md:text-sm font-mono uppercase tracking-widest max-w-xs md:ml-auto">
            Bridging the gap between
            <br />
            System Architecture &<br />
            Visual Artistry
          </p>
        </motion.div>
      </div>

      {/* IMAGE CONTAINER */}
      <div className="relative w-full max-w-[1400px] h-[40vh] md:h-[65vh] overflow-hidden bg-[#050505] pointer-events-none">
        <motion.div style={{ y, opacity }} className="w-full h-full">
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            src={heroImg}
            alt="Saruhasan Sankar - Full Stack Developer and Designer"
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchpriority="high"
          />
          {/* Gradient Overlay for integration */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
        </motion.div>

        {/* Floating Label */}
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/10"
          >
            <span className="text-[10px] md:text-xs font-mono text-white uppercase tracking-widest">
              Est. 2025 — Chennai
            </span>
          </motion.div>
        </div>
      </div>

      {/* BOTTOM TEXT */}
      <div className="w-full max-w-[1800px] flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 pt-4 md:pt-12 gap-4 md:gap-0 pointer-events-none">
        <div className="flex flex-col gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-3 md:gap-4 items-center"
          >
            <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
            <span className="text-white/60 font-mono text-[10px] md:text-xs uppercase tracking-widest">
              Available for hire
            </span>
          </motion.div>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={handleNameClick}
            className="cursor-pointer select-none bg-transparent border-0 p-0 touch-manipulation"
            aria-label={`Toggle between JOHN and ANGEL - Click ${
              3 - clickCount
            } more time${3 - clickCount !== 1 ? "s" : ""}`}
            type="button"
          >
            <FlipText
              text={displayName}
              className="text-[14vw] md:text-[10vw] leading-[0.85] font-black tracking-tighter uppercase"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
