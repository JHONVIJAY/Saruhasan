import React, { useEffect, useRef, useState } from "react";

interface Cell {
  x: number;
  y: number;
  intensity: number;
  rippleTime: number;
}

export const BackgroundRipple = ({
  className,
}: {
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cellsRef = useRef<Map<string, Cell>>(new Map());
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scroll handler to detect if hero is in view
    const handleScroll = () => {
      const heroSection = document.getElementById('index');
      if (!heroSection) return;
      
      const rect = heroSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      setIsInView(inView);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const cellSize = 60;
    const rippleSpeed = 0.05; // Increased from 0.03 for faster animation
    const fadeSpeed = 0.008; // Decreased from 0.015 for longer fade (more elegant)

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Get cell key
    const getCellKey = (x: number, y: number) => `${x},${y}`;

    // Get cell coordinates from touch/click position
    const getCellFromPosition = (posX: number, posY: number) => {
      return {
        x: Math.floor(posX / cellSize),
        y: Math.floor(posY / cellSize),
      };
    };

    // Check if a cell area overlaps with text or images
    const isCellOverContent = (cellX: number, cellY: number): boolean => {
      const x = cellX * cellSize;
      const y = cellY * cellSize;
      
      // Check center and corners of the cell
      const checkPoints = [
        [x + cellSize / 2, y + cellSize / 2], // Center
        [x + 5, y + 5], // Top-left
        [x + cellSize - 5, y + 5], // Top-right
        [x + 5, y + cellSize - 5], // Bottom-left
        [x + cellSize - 5, y + cellSize - 5], // Bottom-right
      ];
      
      for (const [pointX, pointY] of checkPoints) {
        const elements = document.elementsFromPoint(pointX, pointY);
        
        for (const element of elements) {
          // Skip canvas and structural elements
          if (element === canvas || element.tagName === 'CANVAS') continue;
          
          // Check for text content elements
          if (element.tagName === 'H1' || element.tagName === 'H2' || 
              element.tagName === 'P' || element.tagName === 'SPAN' ||
              element.tagName === 'LABEL') {
            // Check if it actually has visible text
            const hasVisibleText = element.textContent && element.textContent.trim().length > 0;
            const computedStyle = window.getComputedStyle(element);
            const isVisible = computedStyle.opacity !== '0' && computedStyle.visibility !== 'hidden';
            
            if (hasVisibleText && isVisible) {
              return true;
            }
          }
          
          // Check for images
          if (element.tagName === 'IMG') {
            return true;
          }
          
          // Check for elements with background images
          const computedStyle = window.getComputedStyle(element);
          if (computedStyle.backgroundImage && computedStyle.backgroundImage !== 'none') {
            return true;
          }
        }
      }
      
      return false;
    };

    // Create ripple at cell
    const createRipple = (cellX: number, cellY: number, intensity: number = 1) => {
      const key = getCellKey(cellX, cellY);
      cellsRef.current.set(key, {
        x: cellX,
        y: cellY,
        intensity,
        rippleTime: 0,
      });
    };

    // Spread ripple to neighbors with distance-based intensity
    const spreadRipple = (cellX: number, cellY: number, intensity: number) => {
      if (intensity < 0.05) return;

      // Extended neighbor range for smoother spread
      const neighbors = [
        // Immediate neighbors (distance 1) - STRONGER falloff
        [cellX - 1, cellY, 0.85],
        [cellX + 1, cellY, 0.85],
        [cellX, cellY - 1, 0.85],
        [cellX, cellY + 1, 0.85],
        // Diagonal neighbors (distance ~1.4)
        [cellX - 1, cellY - 1, 0.75],
        [cellX + 1, cellY - 1, 0.75],
        [cellX - 1, cellY + 1, 0.75],
        [cellX + 1, cellY + 1, 0.75],
        // Extended neighbors (distance 2)
        [cellX - 2, cellY, 0.65],
        [cellX + 2, cellY, 0.65],
        [cellX, cellY - 2, 0.65],
        [cellX, cellY + 2, 0.65],
        // Far neighbors (distance 3) - for wider spread
        [cellX - 3, cellY, 0.45],
        [cellX + 3, cellY, 0.45],
        [cellX, cellY - 3, 0.45],
        [cellX, cellY + 3, 0.45],
      ];

      neighbors.forEach(([nx, ny, falloff]) => {
        const key = getCellKey(nx, ny);
        const existingCell = cellsRef.current.get(key);
        const newIntensity = intensity * (falloff as number);

        if (!existingCell || existingCell.intensity < newIntensity) {
          cellsRef.current.set(key, {
            x: nx,
            y: ny,
            intensity: newIntensity,
            rippleTime: 0,
          });
        }
      });
    };

    // Touch/Click handler - only works when in view and in allowed area
    const handleInteraction = (e: TouchEvent | MouseEvent) => {
      if (!isInView) return; // Don't create ripples when scrolled away
      
      const rect = canvas.getBoundingClientRect();
      let posX: number, posY: number;

      if ('touches' in e) {
        posX = e.touches[0].clientX - rect.left;
        posY = e.touches[0].clientY - rect.top;
      } else {
        posX = e.clientX - rect.left;
        posY = e.clientY - rect.top;
      }

      // Define the interactive zone (upper-right empty area on mobile)
      // This is the area to the right of text content and above the image
      const textContentWidth = canvas.width * 0.55; // Text takes ~55% of width
      const imageTopPosition = canvas.height * 0.45; // Image starts at ~45% from top
      
      // Only create ripples in the empty upper-right zone
      const isInAllowedZone = 
        posX > textContentWidth && // Right of text content
        posY < imageTopPosition;   // Above image
      
      if (!isInAllowedZone) return; // Don't create ripples outside the zone

      const cell = getCellFromPosition(posX, posY);
      createRipple(cell.x, cell.y, 1.5); // Increased from 1.2
    };

    canvas.addEventListener("touchstart", handleInteraction);
    canvas.addEventListener("click", handleInteraction);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid - visible everywhere
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw cells
      const cellsToRemove: string[] = [];
      const cellsToSpread: Array<{ x: number; y: number; intensity: number }> = [];

      cellsRef.current.forEach((cell, key) => {
        cell.rippleTime += rippleSpeed;

        // Spread ripple to neighbors at specific time intervals - FASTER spread
        if (cell.rippleTime > 0.05 && cell.rippleTime < 0.1) {
          cellsToSpread.push({ x: cell.x, y: cell.y, intensity: cell.intensity });
        }

        // Fade out
        cell.intensity -= fadeSpeed;

        if (cell.intensity <= 0) {
          cellsToRemove.push(key);
          return;
        }

        // ONLY DRAW RIPPLE IF NOT OVER CONTENT
        if (isCellOverContent(cell.x, cell.y)) {
          return; // Skip rendering this cell, but keep it in the map for spreading
        }

        // Draw cell - MODERN ENHANCED VERSION
        const x = cell.x * cellSize;
        const y = cell.y * cellSize;

        // Advanced easing for more dramatic effect
        const easedIntensity = Math.sin((Math.min(cell.intensity, 1) * Math.PI) / 2); // Sine ease-out
        const pulseEffect = Math.sin(cell.rippleTime * 8) * 0.1 + 0.9; // Subtle pulse
        const finalIntensity = easedIntensity * pulseEffect;
        
        // Layer 1: Outer glow (soft shadow effect)
        ctx.shadowBlur = 25;
        ctx.shadowColor = `rgba(56, 189, 248, ${finalIntensity * 0.6})`;
        ctx.fillStyle = `rgba(56, 189, 248, ${finalIntensity * 0.08})`;
        ctx.fillRect(x - 2, y - 2, cellSize + 4, cellSize + 4);
        
        // Layer 2: Main fill with gradient effect
        const gradient = ctx.createRadialGradient(
          x + cellSize / 2, y + cellSize / 2, 0,
          x + cellSize / 2, y + cellSize / 2, cellSize * 0.8
        );
        gradient.addColorStop(0, `rgba(56, 189, 248, ${finalIntensity * 0.35})`);
        gradient.addColorStop(0.6, `rgba(56, 189, 248, ${finalIntensity * 0.2})`);
        gradient.addColorStop(1, `rgba(56, 189, 248, ${finalIntensity * 0.05})`);
        
        ctx.shadowBlur = 15;
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, cellSize, cellSize);

        // Layer 3: Bright border with enhanced glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = `rgba(56, 189, 248, ${finalIntensity * 0.8})`;
        ctx.strokeStyle = `rgba(56, 189, 248, ${finalIntensity * 0.7})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, cellSize, cellSize);
        
        // Layer 4: Inner bright accent (for extra pop)
        ctx.shadowBlur = 10;
        ctx.strokeStyle = `rgba(125, 211, 252, ${finalIntensity * 0.9})`; // Lighter sky-300
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 3, y + 3, cellSize - 6, cellSize - 6);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
      });

      // Remove faded cells
      cellsToRemove.forEach(key => cellsRef.current.delete(key));

      // Spread ripples
      cellsToSpread.forEach(({ x, y, intensity }) => spreadRipple(x, y, intensity));

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("touchstart", handleInteraction);
      canvas.removeEventListener("click", handleInteraction);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-auto ${className}`}
    />
  );
};