'use client';

import { useEffect, useRef } from 'react';

interface PSParticle {
  x: number; y: number;
  vx: number; vy: number;
  sym: string;
  color: string;
  op: number;
  size: number;
  rot: number;
  rotV: number;
}

interface Spotlight {
  angle: number;
  speed: number;
  cx: number;
  len: number;
  spread: number;
  op: number;
  color: string;
}

const PS_SYMBOLS = ['△', '○', '×', '□'];

const PS_COLORS: Record<string, string> = {
  '△': 'rgba(0,180,255,OP)',
  '○': 'rgba(220,0,80,OP)',
  '×': 'rgba(130,160,255,OP)',
  '□': 'rgba(100,200,80,OP)',
};

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

    const psParticles: PSParticle[] = Array.from({ length: 90 }, (_, i) => {
      const sym = PS_SYMBOLS[i % 4];
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        sym,
        color: PS_COLORS[sym],
        op: Math.random() * 0.07 + 0.04,
        size: Math.random() * 10 + 10,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.004,
      };
    });

    const spotlights: Spotlight[] = [
      { angle: 0.3,  speed:  0.0007, cx: 0.12, len: 0.75, spread: 0.12, op: 0.022, color: '255,255,255' },
      { angle: 2.5,  speed: -0.0005, cx: 0.88, len: 0.70, spread: 0.10, op: 0.018, color: '201,168,76'  },
      { angle: 1.2,  speed:  0.0004, cx: 0.50, len: 0.65, spread: 0.09, op: 0.013, color: '255,255,255' },
    ];

    function drawField(W: number, H: number) {
      c.save();

      const grd = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.65);
      grd.addColorStop(0, 'rgba(20,55,25,0.18)');
      grd.addColorStop(1, 'transparent');
      c.fillStyle = grd;
      c.fillRect(0, 0, W, H);

      const fx = W * 0.08, fy = H * 0.06, fw = W * 0.84, fh = H * 0.88;

      c.strokeStyle = 'rgba(255,255,255,0.055)';
      c.lineWidth = 0.8;
      c.strokeRect(fx, fy, fw, fh);

      c.beginPath();
      c.moveTo(fx, fy + fh / 2);
      c.lineTo(fx + fw, fy + fh / 2);
      c.stroke();

      c.beginPath();
      c.arc(fx + fw / 2, fy + fh / 2, fh * 0.15, 0, Math.PI * 2);
      c.stroke();

      c.beginPath();
      c.arc(fx + fw / 2, fy + fh / 2, 2, 0, Math.PI * 2);
      c.fillStyle = 'rgba(255,255,255,0.08)';
      c.fill();

      c.strokeStyle = 'rgba(255,255,255,0.045)';
      const pbw = fw * 0.44, pbh = fh * 0.20;
      c.strokeRect(fx + (fw - pbw) / 2, fy, pbw, pbh);
      c.strokeRect(fx + (fw - pbw) / 2, fy + fh - pbh, pbw, pbh);

      c.strokeStyle = 'rgba(255,255,255,0.03)';
      const gbw = fw * 0.18, gbh = fh * 0.08;
      c.strokeRect(fx + (fw - gbw) / 2, fy, gbw, gbh);
      c.strokeRect(fx + (fw - gbw) / 2, fy + fh - gbh, gbw, gbh);

      c.strokeStyle = 'rgba(255,255,255,0.035)';
      const cr = fh * 0.035;
      ([ [fx, fy, 0], [fx + fw, fy, Math.PI / 2], [fx, fy + fh, -Math.PI * 1.5], [fx + fw, fy + fh, Math.PI] ] as [number, number, number][])
        .forEach(([cx2, cy2, sa]) => {
          c.beginPath();
          c.arc(cx2, cy2, cr, sa, sa + Math.PI / 2);
          c.stroke();
        });

      c.restore();
    }

    function drawSpotlight(s: Spotlight, W: number, H: number) {
      const a = s.angle + frame * s.speed;
      const sx = W * s.cx;
      const len = H * s.len;
      const ex = sx + Math.sin(a) * len * s.spread * 5;
      const spread = len * s.spread;

      c.save();
      c.globalAlpha = s.op;
      const g = c.createRadialGradient(sx, 0, 0, sx, 0, len);
      g.addColorStop(0, `rgba(${s.color},0.9)`);
      g.addColorStop(1, `rgba(${s.color},0)`);
      c.fillStyle = g;
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

      psParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.rot += p.rotV;
        if (p.x < -40) p.x = W + 40; if (p.x > W + 40) p.x = -40;
        if (p.y < -40) p.y = H + 40; if (p.y > H + 40) p.y = -40;

        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.globalAlpha = p.op;
        c.font = `300 ${p.size}px Arial, sans-serif`;
        c.fillStyle = p.color.replace('OP', '1');
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
