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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const cellSize = 60;
    const rippleSpeed = 0.03;
    const fadeSpeed = 0.015;
    let contentElements: Array<{ rect: DOMRect; element: Element }> = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateContentElements(); // Update on resize
    };

    // Cache all content elements and their bounding boxes
    const updateContentElements = () => {
      contentElements = [];
      
      // Find all text and image elements in the hero section
      const heroSection = canvas.closest('section');
      if (!heroSection) return;
      
      // Get all text elements
      const textElements = heroSection.querySelectorAll('h1, h2, h3, p, span, label, div');
      textElements.forEach(el => {
        // Only include if it has actual text content
        if (el.textContent && el.textContent.trim().length > 0) {
          const rect = el.getBoundingClientRect();
          // Only include if it has actual size
          if (rect.width > 0 && rect.height > 0) {
            contentElements.push({ rect, element: el });
          }
        }
      });
      
      // Get all images
      const images = heroSection.querySelectorAll('img');
      images.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          contentElements.push({ rect, element: img });
        }
      });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Update content elements periodically (in case of dynamic changes)
    const updateInterval = setInterval(updateContentElements, 1000);
    
    // Initial update after a short delay to ensure DOM is ready
    setTimeout(updateContentElements, 500);

    // Get cell key
    const getCellKey = (x: number, y: number) => `${x},${y}`;

    // Get cell coordinates from touch/click position
    const getCellFromPosition = (posX: number, posY: number) => {
      return {
        x: Math.floor(posX / cellSize),
        y: Math.floor(posY / cellSize),
      };
    };

    // Check if a cell area overlaps with text or images using cached bounding boxes
    const isCellOverContent = (cellX: number, cellY: number): boolean => {
      const canvasRect = canvas.getBoundingClientRect();
      const cellScreenX = canvasRect.left + (cellX * cellSize);
      const cellScreenY = canvasRect.top + (cellY * cellSize);
      const cellScreenRight = cellScreenX + cellSize;
      const cellScreenBottom = cellScreenY + cellSize;
      
      // Check if cell overlaps with any content element
      for (const { rect, element } of contentElements) {
        // Check if rectangles overlap
        const overlaps = !(
          cellScreenRight < rect.left ||
          cellScreenX > rect.right ||
          cellScreenBottom < rect.top ||
          cellScreenY > rect.bottom
        );
        
        if (overlaps) {
          // Additional check for visibility
          const computedStyle = window.getComputedStyle(element);
          const isVisible = computedStyle.opacity !== '0' && 
                           computedStyle.visibility !== 'hidden' &&
                           computedStyle.display !== 'none';
          
          if (isVisible) {
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
        // Immediate neighbors (distance 1)
        [cellX - 1, cellY, 0.75],
        [cellX + 1, cellY, 0.75],
        [cellX, cellY - 1, 0.75],
        [cellX, cellY + 1, 0.75],
        // Diagonal neighbors (distance ~1.4)
        [cellX - 1, cellY - 1, 0.65],
        [cellX + 1, cellY - 1, 0.65],
        [cellX - 1, cellY + 1, 0.65],
        [cellX + 1, cellY + 1, 0.65],
        // Extended neighbors (distance 2)
        [cellX - 2, cellY, 0.5],
        [cellX + 2, cellY, 0.5],
        [cellX, cellY - 2, 0.5],
        [cellX, cellY + 2, 0.5],
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

    // Touch/Click handler - now accepts all clicks
    const handleInteraction = (e: TouchEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      let posX: number, posY: number;

      if ('touches' in e) {
        posX = e.touches[0].clientX - rect.left;
        posY = e.touches[0].clientY - rect.top;
      } else {
        posX = e.clientX - rect.left;
        posY = e.clientY - rect.top;
      }

      const cell = getCellFromPosition(posX, posY);
      createRipple(cell.x, cell.y, 1.2);
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

        // Spread ripple to neighbors at specific time intervals
        if (cell.rippleTime > 0.08 && cell.rippleTime < 0.12) {
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

        // Draw cell - simple and clean like reference
        const x = cell.x * cellSize;
        const y = cell.y * cellSize;

        const easedIntensity = 1 - Math.pow(1 - Math.min(cell.intensity, 1), 2);
        
        // Simple fill - subtle glow
        ctx.fillStyle = `rgba(56, 189, 248, ${easedIntensity * 0.15})`;
        ctx.fillRect(x, y, cellSize, cellSize);

        // Border only
        ctx.strokeStyle = `rgba(56, 189, 248, ${easedIntensity * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, cellSize, cellSize);
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
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-auto ${className}`}
    />
  );
};