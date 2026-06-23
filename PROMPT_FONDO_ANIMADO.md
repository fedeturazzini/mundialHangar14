# Prompt — Fondo Animado (Aurora + Partículas visibles)

## Problema actual
El fondo animado en `components/ParticleBackground.tsx` usa partículas con opacidad de 0.04–0.08, prácticamente invisible. Necesitamos reemplazarlo por un fondo **visiblemente animado** que esté siempre presente detrás de todo el contenido.

## Solución: Aurora CSS + partículas visibles

Reemplazar `ParticleBackground.tsx` completamente con una combinación de:
1. **Orbes de gradiente animados** (CSS puro, via `globals.css` o `<style>`)
2. **Partículas de canvas** más visibles

---

### Paso 1 — Agregar keyframes en `app/globals.css`

```css
@keyframes aurora-1 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  33%       { transform: translate(15%, -20%) scale(1.15); }
  66%       { transform: translate(-10%, 10%) scale(0.9); }
}
@keyframes aurora-2 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  33%       { transform: translate(-20%, 15%) scale(1.2); }
  66%       { transform: translate(10%, -5%) scale(0.85); }
}
@keyframes aurora-3 {
  0%, 100% { transform: translate(0%, 0%) scale(1); }
  50%       { transform: translate(5%, -15%) scale(1.1); }
}
```

---

### Paso 2 — Reemplazar `components/ParticleBackground.tsx`

```tsx
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

    // Tipos de partícula: doradas visibles + blancas sutiles
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      radius: Math.random() * 1.8 + 0.6,
      // opacidad MÁS ALTA para que se vean
      opacity: Math.random() * 0.25 + 0.12,
      gold: Math.random() > 0.45,
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Conexiones entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.12; // MÁS visible que antes
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Partículas
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const color = p.gold ? `rgba(201,168,76,${p.opacity})` : `rgba(255,255,255,${p.opacity * 0.6})`;
        ctx.fillStyle = color;
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
      {/* Orbes de gradiente animados (aurora) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        {/* Orbe central-izquierda — dorado */}
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
        {/* Orbe derecha — dorado más sutil */}
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
        {/* Orbe inferior-centro — sutil verde campo */}
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

      {/* Canvas de constelación encima */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden
      />
    </>
  );
}
```

---

## Resultado esperado
- Tres orbes de luz suaves que se mueven lentamente (aurora dorada + toque verde campo)
- Red de constelación de partículas doradas y blancas mucho más visible que antes
- Todo `fixed` detrás del contenido, en `z-0`
- No afecta la interactividad ni el contenido

## Nota
Los keyframes `aurora-1`, `aurora-2`, `aurora-3` deben estar en `app/globals.css`. Si el proyecto usa Tailwind 4 con `@import "tailwindcss"` al inicio del CSS, agregar los keyframes debajo de ese import.
