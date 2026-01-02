import React, { useEffect, useRef, useState } from "react";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  particles: Particle[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

export const BackgroundRipple = ({
  className,
}: {
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
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

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Check if position overlaps with text or images
    const isOverContent = (x: number, y: number): boolean => {
      const elements = document.elementsFromPoint(x, y);
      
      for (const element of elements) {
        if (element === canvas || element.tagName === 'CANVAS') continue;
        
        // Check for text content elements
        if (element.tagName === 'H1' || element.tagName === 'H2' || 
            element.tagName === 'P' || element.tagName === 'SPAN' ||
            element.tagName === 'LABEL') {
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
      
      return false;
    };

    // Create particles around the ripple
    const createParticles = (x: number, y: number, count: number): Particle[] => {
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
        const speed = 1 + Math.random() * 2;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 2 + Math.random() * 3,
        });
      }
      return particles;
    };

    // Create ripple at position
    const createRipple = (x: number, y: number) => {
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: 300 + Math.random() * 200,
        opacity: 1,
        speed: 3 + Math.random() * 2,
        particles: createParticles(x, y, 24),
      });
    };

    // Touch/Click handler - only works when in view and in allowed area
    const handleInteraction = (e: TouchEvent | MouseEvent) => {
      if (!isInView) return;
      
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
      const textContentWidth = canvas.width * 0.55;
      const imageTopPosition = canvas.height * 0.45;
      
      const isInAllowedZone = 
        posX > textContentWidth &&
        posY < imageTopPosition;
      
      if (!isInAllowedZone) return;

      createRipple(posX, posY);
    };

    canvas.addEventListener("touchstart", handleInteraction);
    canvas.addEventListener("click", handleInteraction);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 1;

      const gridSize = 60;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw ripples
      ripplesRef.current = ripplesRef.current.filter(ripple => {
        ripple.radius += ripple.speed;
        ripple.opacity = 1 - (ripple.radius / ripple.maxRadius);

        if (ripple.opacity <= 0) return false;

        // Draw multiple concentric rings with chromatic aberration effect
        const rings = 3;
        for (let i = 0; i < rings; i++) {
          const ringRadius = ripple.radius - i * 15;
          if (ringRadius < 0) continue;

          const ringOpacity = ripple.opacity * (1 - i * 0.2);

          // Check if ring overlaps content
          const checkPoints = 8;
          let hasOverlap = false;
          for (let j = 0; j < checkPoints; j++) {
            const angle = (Math.PI * 2 * j) / checkPoints;
            const checkX = ripple.x + Math.cos(angle) * ringRadius;
            const checkY = ripple.y + Math.sin(angle) * ringRadius;
            if (isOverContent(checkX, checkY)) {
              hasOverlap = true;
              break;
            }
          }

          if (hasOverlap) continue;

          // Chromatic aberration - RGB separation
          const offset = i * 2;
          
          // Red channel
          ctx.strokeStyle = `rgba(239, 68, 68, ${ringOpacity * 0.3})`;
          ctx.lineWidth = 3 - i;
          ctx.beginPath();
          ctx.arc(ripple.x - offset, ripple.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Blue channel (main)
          ctx.strokeStyle = `rgba(56, 189, 248, ${ringOpacity * 0.8})`;
          ctx.lineWidth = 4 - i;
          ctx.shadowBlur = 20;
          ctx.shadowColor = `rgba(56, 189, 248, ${ringOpacity * 0.6})`;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();

          // Green/Cyan channel
          ctx.strokeStyle = `rgba(125, 211, 252, ${ringOpacity * 0.4})`;
          ctx.lineWidth = 2 - i * 0.5;
          ctx.beginPath();
          ctx.arc(ripple.x + offset, ripple.y, ringRadius, 0, Math.PI * 2);
          ctx.stroke();

          ctx.shadowBlur = 0;
        }

        // Draw and update particles
        ripple.particles = ripple.particles.filter(particle => {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.life -= 0.015;
          
          if (particle.life <= 0) return false;

          // Check if particle is over content
          if (isOverContent(particle.x, particle.y)) return false;

          // Draw particle with glow
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          gradient.addColorStop(0, `rgba(56, 189, 248, ${particle.life * 0.9})`);
          gradient.addColorStop(0.5, `rgba(56, 189, 248, ${particle.life * 0.5})`);
          gradient.addColorStop(1, `rgba(56, 189, 248, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          // Add trail effect
          ctx.strokeStyle = `rgba(125, 211, 252, ${particle.life * 0.3})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x - particle.vx * 3, particle.y - particle.vy * 3);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();

          return true;
        });

        // Draw energy pulse at center
        if (ripple.radius < 50) {
          const pulseSize = 8 + ripple.radius * 0.3;
          const pulseGradient = ctx.createRadialGradient(
            ripple.x, ripple.y, 0,
            ripple.x, ripple.y, pulseSize
          );
          pulseGradient.addColorStop(0, `rgba(255, 255, 255, ${ripple.opacity * 0.8})`);
          pulseGradient.addColorStop(0.4, `rgba(56, 189, 248, ${ripple.opacity * 0.6})`);
          pulseGradient.addColorStop(1, `rgba(56, 189, 248, 0)`);

          ctx.fillStyle = pulseGradient;
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, pulseSize, 0, Math.PI * 2);
          ctx.fill();
        }

        return true;
      });

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