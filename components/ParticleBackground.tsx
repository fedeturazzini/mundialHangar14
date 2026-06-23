'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; op: number; gold: boolean;
}

interface PSParticle {
  x: number; y: number;
  vx: number; vy: number;
  sym: string; op: number;
  size: number; rot: number; rotV: number;
}

interface Spotlight {
  angle: number; speed: number;
  cx: number; len: number; spread: number;
  op: number; color: string;
}

const PS_SYMBOLS = ['△', '○', '×', '□'];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!ctx) return;
    const c: CanvasRenderingContext2D = ctx;

    let animId: number;
    let frame = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Constellation particles
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.5,
      op: Math.random() * 0.22 + 0.1,
      gold: Math.random() > 0.4,
    }));

    // PlayStation symbols
    const psParticles: PSParticle[] = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      sym: PS_SYMBOLS[Math.floor(Math.random() * 4)],
      op: Math.random() * 0.1 + 0.04,
      size: Math.random() * 10 + 9,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.003,
    }));

    // Stadium spotlights
    const spotlights: Spotlight[] = [
      { angle: 0.3,  speed:  0.0007, cx: 0.12, len: 0.75, spread: 0.12, op: 0.022, color: '255,255,255' },
      { angle: 2.5,  speed: -0.0005, cx: 0.88, len: 0.70, spread: 0.10, op: 0.018, color: '201,168,76'  },
      { angle: 1.2,  speed:  0.0004, cx: 0.50, len: 0.65, spread: 0.09, op: 0.014, color: '255,255,255' },
    ];

    function drawField(W: number, H: number) {
      c.save();

      // Green pitch radial gradient
      const grd = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.65);
      grd.addColorStop(0, 'rgba(20,55,25,0.16)');
      grd.addColorStop(1, 'transparent');
      c.fillStyle = grd;
      c.fillRect(0, 0, W, H);

      // Field lines
      c.lineWidth = 0.8;
      const fx = W * 0.08, fy = H * 0.06, fw = W * 0.84, fh = H * 0.88;

      c.strokeStyle = 'rgba(255,255,255,0.055)';
      c.strokeRect(fx, fy, fw, fh);

      c.beginPath();
      c.moveTo(fx, fy + fh / 2);
      c.lineTo(fx + fw, fy + fh / 2);
      c.stroke();

      const cxF = fx + fw / 2, cyF = fy + fh / 2, cr = fh * 0.15;
      c.beginPath();
      c.arc(cxF, cyF, cr, 0, Math.PI * 2);
      c.stroke();

      c.beginPath();
      c.arc(cxF, cyF, 2, 0, Math.PI * 2);
      c.fillStyle = 'rgba(255,255,255,0.07)';
      c.fill();

      // Penalty areas
      const pbw = fw * 0.44, pbh = fh * 0.20;
      c.strokeStyle = 'rgba(255,255,255,0.05)';
      c.strokeRect(fx + (fw - pbw) / 2, fy, pbw, pbh);
      c.strokeRect(fx + (fw - pbw) / 2, fy + fh - pbh, pbw, pbh);

      // Goal areas
      const gbw = fw * 0.18, gbh = fh * 0.08;
      c.strokeStyle = 'rgba(255,255,255,0.035)';
      c.strokeRect(fx + (fw - gbw) / 2, fy, gbw, gbh);
      c.strokeRect(fx + (fw - gbw) / 2, fy + fh - gbh, gbw, gbh);

      // Corner arcs
      const cornerR = fh * 0.035;
      const corners: [number, number, number][] = [
        [fx,      fy,      0],
        [fx + fw, fy,      Math.PI / 2],
        [fx,      fy + fh, -Math.PI / 2],
        [fx + fw, fy + fh, Math.PI],
      ];
      c.strokeStyle = 'rgba(255,255,255,0.04)';
      corners.forEach(([cx2, cy2, sa]) => {
        c.beginPath();
        c.arc(cx2, cy2, cornerR, sa, sa + Math.PI / 2);
        c.stroke();
      });

      c.restore();
    }

    function drawSpotlight(s: Spotlight, W: number, H: number) {
      const a   = s.angle + frame * s.speed;
      const sx  = W * s.cx;
      const len = H * s.len;
      const ex  = sx + Math.sin(a) * len * s.spread * 5;
      const spread = len * s.spread;

      c.save();
      c.globalAlpha = s.op;
      const grad = c.createRadialGradient(sx, 0, 0, sx, 0, len);
      grad.addColorStop(0, `rgba(${s.color},0.9)`);
      grad.addColorStop(1, `rgba(${s.color},0)`);
      c.fillStyle = grad;
      c.beginPath();
      c.moveTo(sx, 0);
      c.lineTo(ex - spread, H * s.len);
      c.lineTo(ex + spread, H * s.len);
      c.closePath();
      c.fill();
      c.restore();
    }

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      c.clearRect(0, 0, W, H);

      c.fillStyle = '#050505';
      c.fillRect(0, 0, W, H);

      drawField(W, H);
      spotlights.forEach(s => drawSpotlight(s, W, H));

      // Constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            c.beginPath();
            c.moveTo(particles[i].x, particles[i].y);
            c.lineTo(particles[j].x, particles[j].y);
            c.strokeStyle = `rgba(201,168,76,${(1 - dist / 120) * 0.12})`;
            c.lineWidth = 0.6;
            c.stroke();
          }
        }
      }

      // Constellation particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        c.beginPath();
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.fillStyle = p.gold
          ? `rgba(201,168,76,${p.op})`
          : `rgba(255,255,255,${p.op * 0.55})`;
        c.fill();
      });

      // PlayStation symbols
      psParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.rot += p.rotV;
        if (p.x < -40) p.x = W + 40; if (p.x > W + 40) p.x = -40;
        if (p.y < -40) p.y = H + 40; if (p.y > H + 40) p.y = -40;
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.globalAlpha = p.op;
        c.font = `${p.size}px Arial, sans-serif`;
        c.fillStyle = 'rgba(180,155,255,1)';
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText(p.sym, 0, 0);
        c.restore();
      });

      frame++;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
    />
  );
}
