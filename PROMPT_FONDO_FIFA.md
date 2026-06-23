# Prompt — Fondo Animado FIFA/PlayStation

## Concepto
Reemplazar `components/ParticleBackground.tsx` por completo. Tres capas:
1. **Líneas de cancha de fútbol** top-down — muy tenues, siempre visibles
2. **Focos de estadio** — conos de luz que barren lentamente desde arriba
3. **Símbolos PlayStation** (△ ○ × □) flotando con sus colores icónicos — sin ninguna línea entre ellos

**Eliminar completamente**: partículas de constelación y líneas de conexión entre puntos.

---

## `components/ParticleBackground.tsx` — reemplazar entero

```tsx
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

// Colores icónicos de PlayStation por símbolo
const PS_COLORS: Record<string, string> = {
  '△': 'rgba(0,180,255,OP)',   // azul
  '○': 'rgba(220,0,80,OP)',    // rojo
  '×': 'rgba(130,160,255,OP)', // violeta/azul
  '□': 'rgba(100,200,80,OP)',  // verde
};

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 30 símbolos PlayStation flotando
    const psParticles: PSParticle[] = Array.from({ length: 30 }, (_, i) => {
      const sym = PS_SYMBOLS[i % 4];
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        sym,
        color: PS_COLORS[sym],
        op: Math.random() * 0.07 + 0.04,   // sutil pero visible
        size: Math.random() * 10 + 10,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.004,
      };
    });

    // 3 focos de estadio
    const spotlights: Spotlight[] = [
      { angle: 0.3,  speed:  0.0007, cx: 0.12, len: 0.75, spread: 0.12, op: 0.022, color: '255,255,255' },
      { angle: 2.5,  speed: -0.0005, cx: 0.88, len: 0.70, spread: 0.10, op: 0.018, color: '201,168,76'  },
      { angle: 1.2,  speed:  0.0004, cx: 0.50, len: 0.65, spread: 0.09, op: 0.013, color: '255,255,255' },
    ];

    function drawField(W: number, H: number) {
      ctx.save();

      // Gradiente verde césped — muy sutil
      const grd = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.65);
      grd.addColorStop(0, 'rgba(20,55,25,0.18)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);

      const fx = W * 0.08, fy = H * 0.06, fw = W * 0.84, fh = H * 0.88;

      // Rectángulo exterior
      ctx.strokeStyle = 'rgba(255,255,255,0.055)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(fx, fy, fw, fh);

      // Línea de mitad de cancha
      ctx.beginPath();
      ctx.moveTo(fx, fy + fh / 2);
      ctx.lineTo(fx + fw, fy + fh / 2);
      ctx.stroke();

      // Círculo central
      ctx.beginPath();
      ctx.arc(fx + fw / 2, fy + fh / 2, fh * 0.15, 0, Math.PI * 2);
      ctx.stroke();

      // Punto central
      ctx.beginPath();
      ctx.arc(fx + fw / 2, fy + fh / 2, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fill();

      // Áreas de penal
      ctx.strokeStyle = 'rgba(255,255,255,0.045)';
      const pbw = fw * 0.44, pbh = fh * 0.20;
      ctx.strokeRect(fx + (fw - pbw) / 2, fy, pbw, pbh);
      ctx.strokeRect(fx + (fw - pbw) / 2, fy + fh - pbh, pbw, pbh);

      // Áreas chicas
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      const gbw = fw * 0.18, gbh = fh * 0.08;
      ctx.strokeRect(fx + (fw - gbw) / 2, fy, gbw, gbh);
      ctx.strokeRect(fx + (fw - gbw) / 2, fy + fh - gbh, gbw, gbh);

      // Arcos de córner
      ctx.strokeStyle = 'rgba(255,255,255,0.035)';
      const cr = fh * 0.035;
      ([
        [fx,      fy,      0          ],
        [fx + fw, fy,      Math.PI / 2],
        [fx,      fy + fh, -Math.PI * 1.5],
        [fx + fw, fy + fh, Math.PI   ],
      ] as [number, number, number][]).forEach(([cx, cy, sa]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, cr, sa, sa + Math.PI / 2);
        ctx.stroke();
      });

      ctx.restore();
    }

    function drawSpotlight(s: Spotlight, W: number, H: number) {
      const a = s.angle + frame * s.speed;
      const sx = W * s.cx;
      const len = H * s.len;
      const ex = sx + Math.sin(a) * len * s.spread * 5;
      const spread = len * s.spread;

      ctx.save();
      ctx.globalAlpha = s.op;
      const g = ctx.createRadialGradient(sx, 0, 0, sx, 0, len);
      g.addColorStop(0, `rgba(${s.color},0.9)`);
      g.addColorStop(1, `rgba(${s.color},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(ex - spread, H * s.len);
      ctx.lineTo(ex + spread, H * s.len);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Base negra
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, W, H);

      // Cancha
      drawField(W, H);

      // Focos
      spotlights.forEach(s => drawSpotlight(s, W, H));

      // Símbolos PlayStation — sin líneas, solo flotan
      psParticles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.rot += p.rotV;
        if (p.x < -40) p.x = W + 40; if (p.x > W + 40) p.x = -40;
        if (p.y < -40) p.y = H + 40; if (p.y > H + 40) p.y = -40;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.op;
        ctx.font = `300 ${p.size}px Arial, sans-serif`;
        ctx.fillStyle = p.color.replace('OP', '1');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.sym, 0, 0);
        ctx.restore();
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
```

---

## Ajustes rápidos

| Qué | Dónde | Valor default | Para más sutil | Para más visible |
|---|---|---|---|---|
| Opacidad símbolos PS | `op: Math.random() * 0.07 + 0.04` | 0.04–0.11 | `* 0.03 + 0.02` | `* 0.12 + 0.08` |
| Tamaño símbolos PS | `size: Math.random() * 10 + 10` | 10–20px | `* 6 + 8` | `* 14 + 14` |
| Cantidad de símbolos | `Array.from({ length: 30 }` | 30 | 18 | 45 |
| Verde del campo | `rgba(20,55,25,0.18)` | 0.18 | 0.08 | 0.3 |
| Intensidad focos | `op` en cada spotlight | 0.013–0.022 | 0.006 | 0.04 |

## Importante
- Sin partículas de constelación ni líneas de conexión — solo PS symbols + field + spotlights
- El canvas es `fixed inset-0 z-0` — siempre detrás de todo
- Colores PS: △ azul · ○ rojo · × violeta · □ verde
