'use client';

import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const COUNT = 70;

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      radius: Math.random() * 1.8 + 0.6,
      opacity: Math.random() * 0.25 + 0.12,
      gold: Math.random() > 0.45,
    }));

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.gold
          ? `rgba(201,168,76,${p.opacity})`
          : `rgba(255,255,255,${p.opacity * 0.6})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Aurora orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '-10%',
            width: '55vw',
            height: '55vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)',
            animation: 'aurora-1 18s ease-in-out infinite',
            filter: 'blur(40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            right: '-15%',
            width: '60vw',
            height: '60vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)',
            animation: 'aurora-2 22s ease-in-out infinite',
            filter: 'blur(50px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-20%',
            left: '30%',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,80,40,0.06) 0%, transparent 70%)',
            animation: 'aurora-3 26s ease-in-out infinite',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Constellation canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
      />
    </>
  );
}
