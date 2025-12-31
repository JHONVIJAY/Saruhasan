import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if we should hide the default cursor
      if (target.closest("[data-cursor='hidden']")) {
          setIsHovered(false);
          cursorX.set(-100); 
          cursorY.set(-100);
          return;
      }

      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-hover")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed left-0 top-0 z-[9999] pointer-events-none hidden md:flex items-center justify-center mix-blend-difference"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
    >
      <motion.div
        animate={{
          scale: isHovered ? 2.5 : 1,
          backgroundColor: isHovered ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)",
          borderWidth: isHovered ? "0px" : "2px",
        }}
        transition={{
          scale: { type: "spring", stiffness: 300, damping: 25 },
          backgroundColor: { duration: 0.2 },
          borderWidth: { duration: 0.2 },
        }}
        className="w-4 h-4 rounded-full border-white"
        style={{ borderStyle: "solid", borderColor: "rgba(255, 255, 255, 1)" }}
      />
    </motion.div>
  );
}