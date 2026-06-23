'use client';

import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Team, GROUPS, getInitials } from '@/lib/data';

interface Props {
  onSelect: (team: Team) => void;
}

function TeamCard({ team, delay, onSelect }: { team: Team; delay: number; onSelect: (t: Team) => void }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBg = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(201,168,76,0.08), transparent)`;

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
      {/* Gradient border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.35), transparent 60%)',
          padding: '1px',
        }}
      />

      {/* Spotlight */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: spotlightBg }}
      />

      {/* Card content */}
      <div
        className="relative p-5 lg:p-6 rounded-2xl h-full flex flex-col"
        style={{
          background: 'linear-gradient(145deg, #111111, #0c0c0c)',
          border: '1px solid rgba(255,255,255,0.07)',
          transition: 'border-color 0.3s',
        }}
      >
        {/* Flag */}
        <div
          className="text-6xl lg:text-7xl mb-4 leading-none select-none"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
        >
          {team.flag}
        </div>

        {/* Country name */}
        <p className="text-lg lg:text-xl font-bold tracking-tight leading-none mb-3">
          {team.name}
        </p>

        {/* Players */}
        <div className="flex flex-col gap-1.5 mt-auto">
          {team.players.map(player => (
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
          {/* Editorial group header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex flex-col">
              <p className="text-[11px] text-white/30 tracking-[0.3em] uppercase font-medium">Grupo</p>
              <p className="text-4xl font-black tracking-tight leading-none" style={{ color: '#C9A84C' }}>
                {group.name}
              </p>
            </div>
            <div
              className="flex-1 h-px"
              style={{ background: 'linear-gradient(to right, rgba(201,168,76,0.2), transparent)' }}
            />
            <p className="text-xs text-white/20">{group.teams.length} equipos</p>
          </div>

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
