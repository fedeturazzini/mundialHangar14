# Prompt — UI V2: Cards impactantes, banderas grandes, countdown imponente

## Contexto
App Next.js 16 + React 19 + Tailwind 4 + framer-motion. El diseño actual se ve genérico ("hecho por IA"). Queremos:
1. Cards de equipos con más personalidad y carácter visual
2. Banderas mucho más grandes e imponentes
3. Countdown más dramático e impactante
4. Menos "plantilla oscura genérica", más carácter editorial

## Approach: no agregar libraries pesadas
No instalar librerías de UI. En cambio, aplicar patrones de diseño de Aceternity UI / Linear / Vercel manualmente: glassmorphism, gradient borders, spotlight hover, tipografía editorial.

---

## 1. Cards de equipos — `components/tabs/Equipos.tsx`

### Nuevo estilo de card: "gradient border + spotlight"

Reemplazar el estilo actual por cards con borde gradiente y efecto de luz en hover. Usar `onMouseMove` para el spotlight:

```tsx
'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Team, GROUPS, getInitials } from '@/lib/data';

interface Props {
  onSelect: (team: Team) => void;
}

function TeamCard({ team, delay, onSelect }: { team: Team; delay: number; onSelect: (t: Team) => void }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <motion.button
      onClick={() => onSelect(team)}
      onMouseMove={handleMouseMove}
      className="relative text-left w-full rounded-2xl overflow-hidden group"
      style={{ opacity: team.tentative ? 0.55 : 1 }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: team.tentative ? 0.55 : 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Gradient border via pseudo-element trick con div wrapper */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.4), transparent 60%)',
          padding: '1px',
        }}
      />

      {/* Spotlight hover effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(200px circle at ${x}px ${y}px, rgba(201,168,76,0.08), transparent)`
          ),
        }}
      />

      {/* Card content */}
      <div
        className="relative p-5 lg:p-6 rounded-2xl h-full flex flex-col"
        style={{
          background: 'linear-gradient(145deg, #111111, #0c0c0c)',
          border: '1px solid rgba(255,255,255,0.07)',
          // Borde dorado sutil en hover via JS — manejado con group-hover en el wrapper
        }}
      >
        {/* Flag — GRANDE */}
        <div className="text-6xl lg:text-7xl mb-4 leading-none select-none" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>
          {team.flag}
        </div>

        {/* Nombre del país */}
        <p className="text-lg lg:text-xl font-bold tracking-tight leading-none mb-3">
          {team.name}
        </p>

        {/* Jugadores */}
        <div className="flex flex-col gap-1.5 mt-auto">
          {team.players.map((player) => (
            <div key={player} className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                style={{
                  background: 'rgba(201,168,76,0.12)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  color: '#C9A84C',
                }}
              >
                {getInitials(player)}
              </div>
              <span className="text-xs text-white/50 font-medium">{player.split(' ')[0]}</span>
            </div>
          ))}
        </div>

        {team.tentative && (
          <span
            className="mt-3 self-start text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wide"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}
          >
            tentativo
          </span>
        )}
      </div>
    </motion.button>
  );
}

export default function Equipos({ onSelect }: Props) {
  return (
    <div className="px-4 lg:px-8 pt-8 pb-12">
      {GROUPS.map((group, gi) => (
        <div key={group.name} className="mb-12">
          {/* Header de grupo — editorial */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex flex-col">
              <p className="text-[11px] text-white/30 tracking-[0.3em] uppercase font-medium">Grupo</p>
              <p className="text-4xl font-black tracking-tight leading-none" style={{ color: '#C9A84C' }}>
                {group.name}
              </p>
            </div>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(201,168,76,0.2), transparent)' }} />
            <p className="text-xs text-white/20">{group.teams.length} equipos</p>
          </div>

          {/* Grid de cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {group.teams.map((team, ti) => (
              <TeamCard
                key={team.id}
                team={team}
                delay={(gi * 4 + ti) * 0.06}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 2. Countdown — `components/Countdown.tsx`

Hacerlo más dramático: número gigante, separadores verticales, fondo con borde sutil.

```tsx
function Unit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={display}
          initial={{ opacity: 0, y: -10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="font-black tabular-nums leading-none"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)', // 40px en mobile, hasta 80px en desktop
            color: '#C9A84C',
            textShadow: '0 0 40px rgba(201,168,76,0.25)',
          }}
        >
          {display}
        </motion.span>
      </AnimatePresence>
      <span className="text-[10px] uppercase tracking-[0.25em] text-white/25 mt-1 font-medium">{label}</span>
    </div>
  );
}

// En el return del componente Countdown:
return (
  <div
    className="flex items-center justify-center gap-0 mt-6 mb-2 rounded-2xl py-6 px-4 lg:px-10"
    style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.05)',
    }}
  >
    <Unit value={time.days}    label="días" />
    <div className="mx-4 lg:mx-8 flex flex-col gap-2 mb-4">
      <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,168,76,0.4)' }} />
      <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,168,76,0.4)' }} />
    </div>
    <Unit value={time.hours}   label="horas" />
    <div className="mx-4 lg:mx-8 flex flex-col gap-2 mb-4">
      <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,168,76,0.4)' }} />
      <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,168,76,0.4)' }} />
    </div>
    <Unit value={time.minutes} label="min" />
    <div className="mx-4 lg:mx-8 flex flex-col gap-2 mb-4">
      <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,168,76,0.4)' }} />
      <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,168,76,0.4)' }} />
    </div>
    <Unit value={time.seconds} label="seg" />
  </div>
);
```

---

## 3. Header — `app/page.tsx`

Hacer el título más editorial, menos centrado en "texto pequeño":

```tsx
{/* Header */}
<header className="px-4 lg:px-8 pt-12 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
  <div className="flex items-start justify-between mb-8">
    <div>
      <p className="text-[10px] text-white/25 tracking-[0.3em] uppercase mb-2 font-medium">
        3 de Julio · Hangar 14
      </p>
      <h1 className="font-black tracking-tight leading-none" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
        Mundial{' '}
        <span style={{
          color: '#C9A84C',
          textShadow: '0 0 30px rgba(201,168,76,0.3)',
        }}>
          FIFA
        </span>
        <br className="lg:hidden" />
        <span className="text-white/20"> · </span>
        Hangar 14
      </h1>
    </div>
    <button
      onClick={() => setShowAdmin(true)}
      className="text-xs px-4 py-2 rounded-lg transition-all mt-1 font-medium"
      style={{
        border: isAdmin ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.1)',
        color: isAdmin ? '#C9A84C' : 'rgba(255,255,255,0.35)',
        background: isAdmin ? 'rgba(201,168,76,0.05)' : 'transparent',
      }}
    >
      {isAdmin ? '⚡ Admin' : 'Admin'}
    </button>
  </div>
  <Countdown />
</header>
```

---

## 4. Tabs — `app/page.tsx`

Tabs más limpias, con padding mayor y estilo más editorial:

```tsx
<nav
  className="flex sticky top-0 z-40 px-4 lg:px-8"
  style={{
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(20px)',
  }}
>
  {TABS.map(tab => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className="relative flex-1 py-4 text-xs font-semibold transition-all tracking-widest uppercase"
      style={{ color: activeTab === tab.id ? '#C9A84C' : 'rgba(255,255,255,0.25)' }}
    >
      {tab.label}
      {activeTab === tab.id && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
          style={{ background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
      )}
    </button>
  ))}
</nav>
```

---

---

## 5. Precio del evento — siempre visible, editable desde Admin

### Funcionalidad
- Arriba a la izquierda del header, siempre se ve: **PRECIO DEL EVENTO: A DEFINIR** (o el valor que haya guardado el admin)
- Si el usuario está logueado como admin, al hacer click se puede editar inline
- Se guarda en `localStorage` con la clave `'hangar14_precio'`
- Valor por defecto: `'A DEFINIR'`

### Implementación

**En `app/page.tsx`**, agregar estado para el precio y pasarlo al header:

```tsx
// Nuevo estado
const [precio, setPrecio] = useState<string>('A DEFINIR');
const [editandoPrecio, setEditandoPrecio] = useState(false);
const [precioDraft, setPrecioDraft] = useState('');

// Cargar desde localStorage (dentro del useEffect existente o en uno nuevo)
useEffect(() => {
  const saved = localStorage.getItem('hangar14_precio');
  if (saved) setPrecio(saved);
}, []);

const guardarPrecio = () => {
  const val = precioDraft.trim() || 'A DEFINIR';
  setPrecio(val);
  localStorage.setItem('hangar14_precio', val);
  setEditandoPrecio(false);
};
```

**En el header**, agregar el precio arriba del título:

```tsx
{/* Precio del evento — siempre visible */}
<div className="mb-3">
  {editandoPrecio && isAdmin ? (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-white/30 tracking-[0.2em] uppercase">Precio del evento:</span>
      <input
        autoFocus
        type="text"
        value={precioDraft}
        onChange={e => setPrecioDraft(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') guardarPrecio();
          if (e.key === 'Escape') setEditandoPrecio(false);
        }}
        placeholder="ej: $5.000"
        className="bg-transparent text-xs font-semibold outline-none border-b pb-0.5"
        style={{ color: '#C9A84C', borderColor: 'rgba(201,168,76,0.4)', width: '120px' }}
        onBlur={guardarPrecio}
      />
    </div>
  ) : (
    <button
      onClick={() => {
        if (isAdmin) {
          setPrecioDraft(precio === 'A DEFINIR' ? '' : precio);
          setEditandoPrecio(true);
        }
      }}
      className="flex items-center gap-1.5 group"
      style={{ cursor: isAdmin ? 'pointer' : 'default' }}
    >
      <span className="text-[10px] text-white/30 tracking-[0.2em] uppercase">Precio del evento:</span>
      <span
        className="text-[10px] font-semibold tracking-wide"
        style={{
          color: precio === 'A DEFINIR' ? 'rgba(255,255,255,0.3)' : '#C9A84C',
        }}
      >
        {precio}
      </span>
      {isAdmin && (
        <span className="text-[9px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
          ✎ editar
        </span>
      )}
    </button>
  )}
</div>
```

### UX
- Sin admin: el precio se ve como texto estático, no es clickeable visualmente
- Con admin: hover muestra "✎ editar", click abre un input inline
- Al hacer blur o Enter guarda automáticamente
- Escape cancela sin guardar

---

## Notas finales
- No instalar ninguna librería adicional. Todos los efectos son CSS puro + framer-motion (ya instalado).
- El efecto de "spotlight" en las cards usa `useMotionValue` y `useTransform` de framer-motion — ya disponible.
- El `clamp()` en font-size hace que el título y el countdown sean automáticamente grandes en desktop y correctos en mobile.
- **No tocar** la lógica de scores, admin, bracket, partidos.
- Si `useTransform` con array genera error de TypeScript, importar `MotionValue` y tipar correctamente, o simplificar el spotlight a un hover CSS estático.
