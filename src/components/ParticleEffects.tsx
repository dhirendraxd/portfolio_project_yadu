import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: 'leaf' | 'droplet' | 'molecule' | 'wind' | 'tree' | 'recycle' | 'snow' | 'maple-leaf';
  color: string;
  rotation?: number;
}

const ParticleEffects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(150, Math.floor(window.innerWidth / 15)); // Even more particles

      for (let i = 0; i < particleCount; i++) {
        const types = ['leaf', 'droplet', 'molecule', 'wind', 'tree', 'recycle', 'snow', 'maple-leaf'];
        const colors = ['#10b981', '#06b6d4', '#3b82f6', '#22c55e', '#059669', '#16a34a', '#e0f2fe', '#4ade80'];
        
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 1,
          speedX: (Math.random() - 0.5) * 0.8,
          speedY: (Math.random() - 0.5) * 0.8,
          opacity: Math.random() * 0.4 + 0.1,
          type: types[Math.floor(Math.random() * types.length)] as Particle['type'],
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360
        });
      }
      
      particlesRef.current = particles;
    };

    // Draw particle based on type
    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;

      switch (particle.type) {
        case 'leaf':
          // Draw a simple leaf shape
          ctx.beginPath();
          ctx.ellipse(particle.x, particle.y, particle.size, particle.size * 1.5, Math.PI / 4, 0, 2 * Math.PI);
          ctx.fill();
          break;
        
        case 'droplet':
          // Draw a water droplet
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI);
          ctx.fill();
          break;
        
        case 'molecule':
          // Draw a simple molecule (circle with smaller circles)
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(particle.x - particle.size, particle.y - particle.size, particle.size * 0.3, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(particle.x + particle.size, particle.y + particle.size, particle.size * 0.3, 0, 2 * Math.PI);
          ctx.fill();
          break;
        
        case 'wind':
          // Draw wind lines
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = particle.size * 0.3;
          ctx.beginPath();
          ctx.moveTo(particle.x - particle.size, particle.y);
          ctx.lineTo(particle.x + particle.size, particle.y);
          ctx.stroke();
          break;
        
        case 'tree':
          // Draw simple tree shape
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.rect(particle.x - particle.size * 0.2, particle.y, particle.size * 0.4, particle.size);
          ctx.fill();
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y - particle.size * 0.2, particle.size * 0.8, 0, 2 * Math.PI);
          ctx.fill();
          break;
        
        case 'recycle':
          // Draw recycle symbol
          ctx.strokeStyle = particle.color;
          ctx.lineWidth = particle.size * 0.2;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.6, 0, Math.PI * 2 / 3);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.6, Math.PI * 2 / 3, Math.PI * 4 / 3);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.6, Math.PI * 4 / 3, Math.PI * 2);
          ctx.stroke();
          break;
        
        case 'snow':
          // Draw snowflake
          ctx.strokeStyle = '#e0f2fe';
          ctx.fillStyle = '#ffffff';
          ctx.lineWidth = particle.size * 0.1;
          
          // Center dot
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.2, 0, 2 * Math.PI);
          ctx.fill();
          
          // Six arms of snowflake
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(
              particle.x + Math.cos(angle) * particle.size * 0.6,
              particle.y + Math.sin(angle) * particle.size * 0.6
            );
            ctx.stroke();
          }
          break;
        
        case 'maple-leaf':
          // Draw maple leaf shape
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate((particle.rotation || 0) * Math.PI / 180);
          ctx.fillStyle = ['#22c55e', '#16a34a', '#15803d'][Math.floor(Math.random() * 3)];
          
          ctx.beginPath();
          ctx.moveTo(0, -particle.size);
          ctx.quadraticCurveTo(-particle.size * 0.5, -particle.size * 0.5, -particle.size * 0.8, 0);
          ctx.quadraticCurveTo(-particle.size * 0.3, particle.size * 0.3, 0, particle.size * 0.2);
          ctx.quadraticCurveTo(particle.size * 0.3, particle.size * 0.3, particle.size * 0.8, 0);
          ctx.quadraticCurveTo(particle.size * 0.5, -particle.size * 0.5, 0, -particle.size);
          ctx.fill();
          
          ctx.restore();
          break;
      }
      
      ctx.restore();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Special movement for snow - slower fall
        if (particle.type === 'snow') {
          particle.y += 0.5;
          particle.x += Math.sin(Date.now() * 0.002 + particle.y * 0.01) * 0.2;
        } else {
          // Gentle floating effect for other particles
          particle.y += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.1;
        }

        // Rotate maple leaves and leaves
        if (particle.type === 'maple-leaf' || particle.type === 'leaf') {
          particle.rotation = (particle.rotation || 0) + 0.5;
        }

        // Wrap around screen edges
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;

        // Gentle opacity oscillation
        particle.opacity = Math.abs(Math.sin(Date.now() * 0.001 + particle.x * 0.01)) * 0.3 + 0.1;

        drawParticle(particle);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'multiply'
      }}
    />
  );
};

export default ParticleEffects;