'use client';

import { motion } from 'framer-motion';
import { GROUPS, Match, computeStandings } from '@/lib/data';
import Flag from '@/components/Flag';

interface Props {
  matches: Match[];
}

export default function Grupos({ matches }: Props) {
  return (
    <div className="pt-8 pb-10">
      {GROUPS.map((group, gi) => {
        const rows = computeStandings(gi, matches);
        const qualifyCount = 2;

        return (
          <div key={group.name} className="mb-10">
            {/* Group header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-0.5 h-6 rounded-full" style={{ background: '#C9A84C' }} />
              <div>
                <p className="text-sm font-bold tracking-[0.25em] uppercase text-white">
                  Grupo {group.name}
                </p>
                <p className="text-xs text-white/30">{group.teams.length} equipos · 2 clasifican</p>
              </div>
            </div>

            <div className="overflow-hidden" style={{ background: '#111', borderRadius: '6px' }}>
              {/* Table header */}
              <div
                className="grid px-4 py-2.5 text-xs font-medium text-white/30 tracking-wider"
                style={{
                  gridTemplateColumns: 'auto auto 1fr repeat(5, auto)',
                  gap: '0 1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: '#0F0F0F',
                }}
              >
                <div className="w-5 text-center">#</div>
                <div className="w-7" />
                <div>Equipo</div>
                <div className="text-center w-7">PJ</div>
                <div className="text-center w-7">G</div>
                <div className="text-center w-7">E</div>
                <div className="text-center w-7">P</div>
                <div className="text-center w-10">Pts</div>
              </div>

              {rows.map((row, ri) => {
                const qualifies = ri < qualifyCount;
                const isLast = ri === rows.length - 1;
                const isDivider = ri === qualifyCount - 1 && qualifyCount < rows.length;

                return (
                  <motion.div key={row.team.id}>
                    <div
                      className="grid px-4 items-center"
                      style={{
                        gridTemplateColumns: 'auto auto 1fr repeat(5, auto)',
                        gap: '0 1rem',
                        paddingTop: '0.875rem',
                        paddingBottom: '0.875rem',
                        borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.03)',
                        background: qualifies ? 'rgba(201,168,76,0.04)' : 'transparent',
                        borderLeft: ri === 0 ? '2px solid #C9A84C' : '2px solid transparent',
                      }}
                    >
                      {/* Position */}
                      <div
                        className="w-5 text-center text-sm font-bold"
                        style={{ color: qualifies ? '#C9A84C' : 'rgba(255,255,255,0.25)' }}
                      >
                        {ri + 1}
                      </div>

                      {/* Flag */}
                      <div className="w-7">
                        <Flag code={row.team.code} className="w-7 h-5 rounded-[2px]" />
                      </div>

                      {/* Team name + players */}
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate">{row.team.name}</div>
                        <div className="text-xs text-white/30 mt-0.5 truncate">
                          {row.team.players.map(p => p.short).join(' · ')}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="w-7 text-center text-sm text-white/50">{row.pj}</div>
                      <div className="w-7 text-center text-sm text-white/50">{row.g}</div>
                      <div className="w-7 text-center text-sm text-white/50">{row.e}</div>
                      <div className="w-7 text-center text-sm text-white/50">{row.p}</div>
                      <div
                        className="w-10 text-center text-sm font-bold"
                        style={{ color: qualifies ? '#C9A84C' : 'rgba(255,255,255,0.6)' }}
                      >
                        {row.pts}
                      </div>
                    </div>

                    {/* Dotted divider after last qualifier */}
                    {isDivider && (
                      <div
                        className="mx-4"
                        style={{ borderTop: '1px dashed rgba(255,255,255,0.08)' }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
