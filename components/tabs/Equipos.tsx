'use client';

import { motion } from 'framer-motion';
import { Team, GROUPS, getInitials } from '@/lib/data';

interface Props {
  onSelect: (team: Team) => void;
}

export default function Equipos({ onSelect }: Props) {
  return (
    <div className="pt-8 pb-10">
      {GROUPS.map((group, gi) => (
        <div key={group.name} className="mb-10">
          {/* Group header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-0.5 h-6 rounded-full" style={{ background: '#C9A84C' }} />
            <div>
              <p className="text-sm font-bold tracking-[0.25em] uppercase text-white">
                Grupo {group.name}
              </p>
              <p className="text-xs text-white/30">{group.teams.length} equipos</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {group.teams.map((team, ti) => (
              <motion.button
                key={team.id}
                onClick={() => onSelect(team)}
                className="text-left p-5 lg:p-6 rounded-lg transition-all"
                style={{
                  background: 'linear-gradient(135deg, #0f0f0f 0%, #141414 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  opacity: team.tentative ? 0.55 : 1,
                }}
                whileHover={{
                  borderColor: 'rgba(201,168,76,0.4)',
                  boxShadow: '0 0 24px rgba(201,168,76,0.1)',
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: team.tentative ? 0.55 : 1, y: 0 }}
                transition={{ delay: (gi * 4 + ti) * 0.05, duration: 0.3 }}
              >
                <div className="text-5xl lg:text-6xl mb-3">{team.flag}</div>
                <div className="text-base lg:text-lg font-bold">{team.name}</div>

                {/* Player avatars */}
                <div className="flex flex-col gap-1.5 mt-3">
                  {team.players.map(player => (
                    <div key={player} className="flex items-center gap-1.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                        style={{
                          background: 'rgba(201,168,76,0.15)',
                          color: '#C9A84C',
                          border: '1px solid rgba(201,168,76,0.3)',
                        }}
                      >
                        {getInitials(player)}
                      </div>
                      <span className="text-xs text-white/50 truncate">{player.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>

                {team.tentative && (
                  <span
                    className="mt-3 inline-block text-[10px] px-2 py-0.5 rounded-full"
                    style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.3)' }}
                  >
                    tentativo
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
