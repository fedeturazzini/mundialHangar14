'use client';

import { motion } from 'framer-motion';
import { GROUPS, Match, computeStandings } from '@/lib/data';

interface Props {
  matches: Match[];
}

export default function Grupos({ matches }: Props) {
  return (
    <div className="px-4 pt-6 pb-10">
      {GROUPS.map((group, gi) => {
        const rows = computeStandings(gi, matches);
        return (
          <div key={group.name} className="mb-8">
            <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Grupo {group.name}</p>
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* header */}
              <div
                className="grid grid-cols-12 px-3 py-2 text-xs font-medium text-white/30"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="col-span-5">Equipo</div>
                <div className="col-span-1 text-center">PJ</div>
                <div className="col-span-1 text-center">G</div>
                <div className="col-span-1 text-center">E</div>
                <div className="col-span-1 text-center">P</div>
                <div className="col-span-1 text-center">GD</div>
                <div className="col-span-2 text-center">Pts</div>
              </div>

              {rows.map((row, ri) => (
                <motion.div
                  key={row.team.id}
                  className="grid grid-cols-12 px-3 py-3 items-center"
                  style={{
                    borderBottom: ri < rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: ri < 2 ? 'rgba(201,168,76,0.03)' : 'transparent',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: ri * 0.04 }}
                >
                  <div className="col-span-5 flex items-center gap-2">
                    <div
                      className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: ri < 2 ? '#C9A84C' : 'rgba(255,255,255,0.2)' }}
                    />
                    <div>
                      <div className="text-sm font-medium flex items-center gap-1.5">
                        <span>{row.team.flag}</span>
                        <span>{row.team.name}</span>
                      </div>
                      <div className="text-xs text-white/30 mt-0.5">
                        {row.team.players.map(p => p.split(' ')[0]).join(' · ')}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-center text-sm text-white/60">{row.pj}</div>
                  <div className="col-span-1 text-center text-sm text-white/60">{row.g}</div>
                  <div className="col-span-1 text-center text-sm text-white/60">{row.e}</div>
                  <div className="col-span-1 text-center text-sm text-white/60">{row.p}</div>
                  <div className="col-span-1 text-center text-sm text-white/60">
                    {row.gd >= 0 ? '+' : ''}{row.gd}
                  </div>
                  <div className="col-span-2 text-center text-sm font-semibold" style={{ color: '#C9A84C' }}>
                    {row.pts}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
