'use client';

import { motion } from 'framer-motion';
import { Match } from '@/lib/data';

interface Props {
  matches: Match[];
  isAdmin: boolean;
  onEditMatch: (match: Match) => void;
}

function MatchRow({
  match,
  isAdmin,
  onEditMatch,
}: {
  match: Match;
  isAdmin: boolean;
  onEditMatch: (m: Match) => void;
}) {
  const isFinal  = match.phase === 'final';
  const hasTeams = !!(match.home && match.away);
  const canEdit  = isAdmin && hasTeams;

  const homeName = match.home ? `${match.home.flag} ${match.home.name}` : (match.seedHome ?? '—');
  const awayName = match.away ? `${match.away.flag} ${match.away.name}` : (match.seedAway ?? '—');

  const inner = (
    <>
      {/* PS label bar */}
      <div
        className="flex items-center gap-2 px-3 pt-2.5 pb-1.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span
          className="text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}
        >
          PS{match.ps}
        </span>
        <span className="text-[10px] text-white/25 tracking-wider uppercase">
          {match.phase === 'group' ? `Grupo ${match.group === 0 ? 'A' : 'B'}` : match.phase === 'semi' ? 'Semifinal' : 'Final'}
        </span>
        {match.score && (
          <span className="ml-auto text-[10px] text-white/30 tracking-wider uppercase">Finalizado</span>
        )}
        {canEdit && !match.score && (
          <span className="ml-auto text-[10px] tracking-wider" style={{ color: 'rgba(201,168,76,0.4)' }}>
            toca para cargar
          </span>
        )}
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-2 px-3 py-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{homeName}</div>
          {match.home && (
            <div className="text-xs text-white/30 mt-0.5 truncate">
              {match.home.players.map(p => p.split(' ')[0]).join(' · ')}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 px-2 flex-shrink-0">
          <span className="text-xl font-black tabular-nums w-7 text-center" style={{ color: match.score ? '#fff' : 'rgba(255,255,255,0.2)' }}>
            {match.score != null ? match.score[0] : '–'}
          </span>
          <span className="text-white/20 text-base">:</span>
          <span className="text-xl font-black tabular-nums w-7 text-center" style={{ color: match.score ? '#fff' : 'rgba(255,255,255,0.2)' }}>
            {match.score != null ? match.score[1] : '–'}
          </span>
        </div>

        <div className="flex-1 min-w-0 text-right">
          <div className="text-sm font-semibold truncate">{awayName}</div>
          {match.away && (
            <div className="text-xs text-white/30 mt-0.5 truncate">
              {match.away.players.map(p => p.split(' ')[0]).join(' · ')}
            </div>
          )}
        </div>
      </div>

      {!match.score && !canEdit && (
        <div className="pb-2.5 text-center">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)' }}
          >
            {hasTeams ? 'pendiente' : 'esperando clasificación'}
          </span>
        </div>
      )}
    </>
  );

  const baseStyle = {
    background: isFinal ? 'rgba(201,168,76,0.04)' : '#0D0D0D',
    border: isFinal ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.07)',
  };

  if (canEdit) {
    return (
      <button
        className="w-full rounded-lg text-left transition-all active:scale-[0.99]"
        style={{ ...baseStyle, cursor: 'pointer' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = isFinal ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.07)')}
        onClick={() => onEditMatch(match)}
      >
        {inner}
      </button>
    );
  }

  return <div className="rounded-lg" style={baseStyle}>{inner}</div>;
}

function roundLabel(round: number, phase: string): string {
  if (phase === 'semi') return 'Semifinales';
  if (phase === 'final') return 'Final';
  return `Ronda ${round}`;
}

export default function Partidos({ matches, isAdmin, onEditMatch }: Props) {
  const rounds = matches.reduce<Map<number, Match[]>>((acc, m) => {
    if (!acc.has(m.round)) acc.set(m.round, []);
    acc.get(m.round)!.push(m);
    return acc;
  }, new Map());

  return (
    <div className="pt-6 pb-10">
      {Array.from(rounds.entries()).map(([round, roundMatches], ri) => {
        const firstMatch = roundMatches[0];
        const isKnockout = firstMatch.phase !== 'group';
        const label = roundLabel(round, firstMatch.phase);

        return (
          <motion.div
            key={round}
            className="mb-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ri * 0.05 }}
          >
            <div className="flex items-center gap-3 mb-3">
              {isKnockout ? (
                <div className="flex items-center gap-3">
                  <div className="w-0.5 h-5 rounded-full" style={{ background: '#C9A84C' }} />
                  <span className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: '#C9A84C' }}>{label}</span>
                </div>
              ) : (
                <>
                  <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.25)' }}>{label}</span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <span className="text-[10px] text-white/20">{roundMatches.length === 1 ? '1 partido' : `${roundMatches.length} en paralelo`}</span>
                </>
              )}
            </div>

            <div className="space-y-2">
              {roundMatches.map(m => (
                <MatchRow key={m.id} match={m} isAdmin={isAdmin} onEditMatch={onEditMatch} />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
