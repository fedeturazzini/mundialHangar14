'use client';

import { motion } from 'framer-motion';
import { Team, GROUPS } from '@/lib/data';

interface Props {
  onSelect: (team: Team) => void;
}

export default function Equipos({ onSelect }: Props) {
  return (
    <div className="px-4 pt-6 pb-10">
      {GROUPS.map((group, gi) => (
        <div key={group.name} className="mb-8">
          <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Grupo {group.name}</p>
          <div className="grid grid-cols-2 gap-2">
            {group.teams.map((team, ti) => (
              <motion.button
                key={team.id}
                onClick={() => onSelect(team)}
                className="text-left p-4 rounded-lg transition-colors"
                style={{
                  background: '#0D0D0D',
                  border: '1px solid rgba(255,255,255,0.08)',
                  opacity: team.tentative ? 0.5 : 1,
                }}
                whileHover={{ borderColor: 'rgba(255,255,255,0.2)', scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: team.tentative ? 0.5 : 1, y: 0 }}
                transition={{ delay: (gi * 4 + ti) * 0.05 }}
              >
                <div className="text-2xl mb-2">{team.flag}</div>
                <div className="text-sm font-medium">{team.name}</div>
                <div className="text-xs text-white/40 mt-0.5">
                  {team.players[0].split(' ')[0]} · {team.players[1].split(' ')[0]}
                </div>
                {team.tentative && (
                  <span
                    className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full"
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
