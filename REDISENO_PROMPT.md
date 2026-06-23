# Rediseño — Mundial Hangar 14

## Contexto
Aplicación Next.js 15 + TypeScript + Tailwind CSS + framer-motion. Torneo FIFA interno entre amigos. Actualmente el layout está limitado a `max-w-lg` (pensado solo para mobile). Queremos que se vea bien en desktop también, con diseño minimalista de alto impacto, estilo oscuro/editorial.

## Objetivo general
- Diseño minimalista pero **imponente**: mucho más visual, cards grandes, tipografía bold
- Layout que se vea bien en **desktop** (no solo mobile)
- Fondo animado de **constelación** siempre visible
- Tab **Equipos**: cards de equipos más grandes y visuales
- Tab **Grupos**: tabla de posiciones más impresionante
- **TeamModal**: mostrar perfil de los dos jugadores con foto placeholder circular

---

## Cambios archivo por archivo

### 1. `app/page.tsx`

- Cambiar `max-w-lg` → `max-w-5xl` con `px-6 lg:px-16`
- Header más imponente en desktop:
  - Título `Mundial FIFA · Hangar 14` en `text-2xl lg:text-4xl font-bold`
  - En desktop, mostrar fecha y countdown en la misma línea (flex row en lg)
- Tabs: aumentar padding `py-4`, font-size a `text-sm lg:text-base`, tracking más amplio

---

### 2. `components/ParticleBackground.tsx`

Rediseñar completamente el fondo animado a estilo **constelación**:

```
- COUNT = 90 partículas
- Dos tipos mezclados:
    - 60% doradas: color rgba(201,168,76,opacity), opacity entre 0.06 y 0.14, radio 0.8–2.5
    - 40% blancas: color rgba(255,255,255,opacity), opacity entre 0.03 y 0.07, radio 0.5–1.5
- Velocidad muy lenta: vx/vy entre -0.15 y 0.15
- Conectar partículas cuya distancia < 140px con una línea:
    - Color: rgba(201,168,76, alpha) donde alpha = (1 - dist/140) * 0.05
    - lineWidth: 0.5
- El canvas queda fixed inset-0, z-0, pointer-events-none
- Limpiar con ctx.clearRect en cada frame
```

---

### 3. `components/tabs/Equipos.tsx`

Cards más grandes y grid responsive:

```tsx
// Grid: 2 cols en mobile, 2 cols en tablet, 4 cols en desktop para grupos de 4 equipos
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
```

**Card de equipo** (motion.button):
- Padding: `p-5 lg:p-6`
- Background: `linear-gradient(135deg, #0f0f0f 0%, #141414 100%)`
- Border: `1px solid rgba(255,255,255,0.08)`
- Hover: borde `rgba(201,168,76,0.4)` + box-shadow `0 0 24px rgba(201,168,76,0.1)`
- Contenido:
  ```
  [FLAG en text-5xl lg:text-6xl]
  [Nombre del país: text-base lg:text-lg font-bold mt-3]
  [Dos avatares circulares de jugadores side by side + nombres]
  [Badge "tentativo" si aplica]
  ```
- Avatares de jugadores en la card:
  ```tsx
  <div className="flex items-center gap-2 mt-3">
    {team.players.map(player => (
      <div key={player} className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
          style={{ background: 'rgba(201,168,76,0.15)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
          {getInitials(player)}
        </div>
        <span className="text-xs text-white/50">{player.split(' ')[0]}</span>
      </div>
    ))}
  </div>
  ```

**Header de grupo** más imponente:
```tsx
<div className="flex items-center gap-3 mb-5">
  <div className="w-0.5 h-6 rounded-full" style={{ background: '#C9A84C' }} />
  <div>
    <p className="text-sm font-bold tracking-[0.25em] uppercase text-white">Grupo {group.name}</p>
    <p className="text-xs text-white/30">{group.teams.length} equipos</p>
  </div>
</div>
```

---

### 4. `components/tabs/Grupos.tsx`

Tabla de posiciones más imponente:

**Header de grupo**: mismo estilo que en Equipos (barra dorada + texto bold).

**Tabla**:
- Agregar columna de **posición** (1, 2, 3, 4) al inicio con color:
  - Pos 1 y 2 (clasifican): `#C9A84C` con fondo `rgba(201,168,76,0.12)` en toda la fila
  - Pos 3 y 4: color `rgba(255,255,255,0.3)`, fondo transparente
- Flag del equipo más grande en la fila (text-xl)
- Número de posición: `text-sm font-bold w-5 text-center`
- En desktop: aumentar padding de celdas a `px-4 py-3.5`
- Fila del líder (pos 1): borde izquierdo dorado sutil `border-l-2 border-[#C9A84C]`
- Agregar un separador visual entre los clasificados (pos 2) y eliminados (pos 3): línea punteada sutil

Grid de columnas en la tabla: `grid-cols-[auto_1fr_repeat(5,_auto)]` aprox

---

### 5. `components/TeamModal.tsx`

Rediseñar como **modal de perfil de equipo** con los dos jugadores con foto placeholder:

**Estructura del modal**:
- Mobile: bottom sheet, min-height 65vh
- Desktop (`lg:`): modal centrado (`items-center justify-center`), max-w-lg, rounded-2xl

**Dentro del modal**:

```tsx
// Header
<div className="flex items-center gap-4 mb-8">
  <span className="text-5xl">{team.flag}</span>
  <div>
    <h2 className="text-2xl font-bold">{team.name}</h2>
    <p className="text-xs tracking-widest uppercase mt-1"
      style={{ color: team.tentative ? 'rgba(255,255,255,0.3)' : '#C9A84C' }}>
      {team.tentative ? 'Participación tentativa' : '✓ Confirmado'}
    </p>
  </div>
</div>

// Dos cards de jugador side by side
<div className="grid grid-cols-2 gap-4">
  {team.players.map((player, pi) => (
    <motion.div key={player}
      className="flex flex-col items-center text-center p-5 rounded-xl"
      style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.08)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: pi * 0.08 }}
    >
      {/* Foto placeholder circular */}
      <div className="w-20 h-20 rounded-full overflow-hidden mb-3 flex-shrink-0"
        style={{ border: '2px solid rgba(201,168,76,0.3)' }}>
        <img
          src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(player)}&backgroundColor=1a1a1a&textColor=C9A84C&fontSize=38`}
          alt={player}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-sm font-semibold leading-snug">{player}</p>
      <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Jugador {pi + 1}
      </p>
    </motion.div>
  ))}
</div>

// Nota para reemplazar fotos más adelante
<p className="text-center text-xs mt-5" style={{ color: 'rgba(255,255,255,0.2)' }}>
  Las fotos se actualizarán antes del torneo
</p>
```

**Importante**: la imagen de DiceBear usa la URL `https://api.dicebear.com/9.x/initials/svg?seed=NOMBRE` y genera un SVG con las iniciales del nombre. Cuando el usuario quiera poner fotos reales, solo hay que reemplazar el `<img src>` por la URL de la foto real de cada jugador (se puede agregar un campo `photo?: string` al tipo `Team` o `Player`).

---

### 6. `app/globals.css` (opcional)

Agregar una transición suave de scroll:
```css
html {
  scroll-behavior: smooth;
}

/* Scrollbar minimalista */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(201,168,76,0.3);
  border-radius: 2px;
}
```

---

## Paleta de colores a mantener
- Fondo principal: `#000000` / `#0a0a0a`
- Card background: `#0D0D0D` / `#111`
- Dorado principal: `#C9A84C`
- Texto primario: `#ffffff`
- Texto secundario: `rgba(255,255,255,0.4)`
- Texto terciario: `rgba(255,255,255,0.2)`
- Border sutil: `rgba(255,255,255,0.08)`

## Notas importantes
- Mantener toda la lógica existente (scores, admin, localStorage, bracket, etc.) — solo cambios visuales
- No romper el componente `Partidos.tsx` ni `Bracket.tsx` (solo mejorar si querés consistencia visual, pero no es prioridad)
- framer-motion ya está instalado, usarlo para animaciones de entrada
- El fondo animado debe estar siempre visible en todas las tabs
- Las fotos de jugadores en TeamModal son temporalmente los avatares de DiceBear; más adelante se reemplazarán con fotos reales
