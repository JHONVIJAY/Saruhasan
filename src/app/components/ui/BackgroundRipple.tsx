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

    // Check if position is over excluded elements (text, images)
    const isOverExcludedElement = (clientX: number, clientY: number): boolean => {
      const elements = document.elementsFromPoint(clientX, clientY);
      
      // Check if clicking on text, images, or other content
      for (const element of elements) {
        // Skip if it's the canvas itself
        if (element === canvas) continue;
        
        // Check if element has text content
        const hasText = element.textContent && element.textContent.trim().length > 0;
        
        // Check if element is an image
        const isImage = element.tagName === 'IMG';
        
        // Check if element has pointer-events enabled (interactive content)
        const computedStyle = window.getComputedStyle(element);
        const hasPointerEvents = computedStyle.pointerEvents !== 'none';
        
        // If it has text or is an image and has size, exclude it
        if ((hasText || isImage) && hasPointerEvents) {
          return true;
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

    // Touch/Click handler
    const handleInteraction = (e: TouchEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      let posX: number, posY: number;
      let clientX: number, clientY: number;

      if ('touches' in e) {
        // Touch event
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        posX = clientX - rect.left;
        posY = clientY - rect.top;
      } else {
        // Mouse event
        clientX = e.clientX;
        clientY = e.clientY;
        posX = clientX - rect.left;
        posY = clientY - rect.top;
      }

      // Only create ripple if not over text or images
      if (isOverExcludedElement(clientX, clientY)) {
        return;
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

      // Draw grid - subtle like reference image
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
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
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-auto ${className}`}
    />
  );
};