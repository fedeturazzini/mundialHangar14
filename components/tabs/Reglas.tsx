'use client';

import { motion } from 'framer-motion';

interface RuleSection {
  icon: string;
  title: string;
  items: string[];
}

const SECTIONS: RuleSection[] = [
  {
    icon: '⚽',
    title: 'Formato del torneo',
    items: [
      '7 selecciones divididas en 2 grupos',
      'Grupo A: 4 equipos — todos contra todos',
      'Grupo B: 3 equipos — todos contra todos',
      'Los 2 primeros de cada grupo clasifican a semifinales',
      'Semifinales, partido por 3° y 4° puesto, y Final',
    ],
  },
  {
    icon: '🎮',
    title: 'Duración de los partidos',
    items: [
      'Fase de grupos: 6 minutos',
      'Semifinales: 8 minutos',
      'Partido por 3° y 4° puesto: 8 minutos',
      'Final: 8 minutos',
    ],
  },
  {
    icon: '⏱️',
    title: 'Empates',
    items: [
      'Fase de grupos: el empate es válido, suma 1 punto a cada equipo',
      'Semifinales, 3°/4° y Final: si hay empate se juega tiempo extra; si sigue igualado, penales',
    ],
  },
  {
    icon: '🏆',
    title: 'Clasificación en grupos',
    items: [
      '1. Puntos (G = 3 pts · E = 1 pt · P = 0 pts)',
      '2. Diferencia de goles',
      '3. Goles a favor',
      '4. Resultado del enfrentamiento directo',
    ],
  },
  {
    icon: '🕹️',
    title: 'Dinámica de partidos',
    items: [
      'Se juegan 2 partidos en paralelo en PS1 y PS2 simultáneamente',
      'Ningún equipo juega dos rondas seguidas',
      'Los partidos se organizan en rondas para maximizar el descanso',
    ],
  },
  {
    icon: '🍕',
    title: 'Lo importante',
    items: [
      'El campeón se lleva la gloria eterna de Hangar 14',
      'Tomar unas ricas birritas y comer riquitico 🍺🍗',
    ],
  },
];

export default function Reglas() {
  return (
    <div className="px-4 lg:px-8 pt-6 pb-12 space-y-6">
      {SECTIONS.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.06 }}
          className="rounded-[6px] overflow-hidden"
          style={{ background: '#111' }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <span className="text-lg">{section.icon}</span>
            <span
              className="text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: '#C9A84C' }}
            >
              {section.title}
            </span>
          </div>

          {/* Items */}
          <ul className="px-4 py-3 space-y-2.5">
            {section.items.map((item, ii) => (
              <li key={ii} className="flex items-start gap-2.5">
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: 'rgba(201,168,76,0.5)' }} />
                <span className="text-sm text-white/60 leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
