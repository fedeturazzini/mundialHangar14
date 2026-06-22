'use client';

import { motion } from 'framer-motion';
import { Match, getWinner } from '@/lib/data';

interface Props {
  matches: Match[];
}

function BracketMatch({ match, borderGold = false }: { match: Match & { homeLabel: string; awayLabel: string }; borderGold?: boolean }) {
  const winner = getWinner(match);
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: borderGold ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(255,255,255,0.1)', background: '#0D0D0D' }}
    >
      {(['home', 'away'] as const).map((side, i) => {
        const label = i === 0 ? match.homeLabel : match.awayLabel;
        const score = match.score ? match.score[i] : null;
        const isWinner = winner && (i === 0 ? winner === match.home : winner === match.away);
        return (
          <div
            key={side}
            className="flex items-center justify-between px-3 py-2.5 text-xs"
            style={{
              borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              color: isWinner ? '#C9A84C' : 'rgba(255,255,255,0.7)',
            }}
          >
            <span className="truncate pr-2">{label}</span>
            <span className="font-semibold tabular-nums flex-shrink-0">{score ?? '–'}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Bracket({ matches }: Props) {
  const semis = matches
    .filter(m => m.phase === 'semi')
    .map(m => ({
      ...m,
      homeLabel: m.home ? `${m.home.flag} ${m.home.name}` : (m.seedHome ?? '—'),
      awayLabel: m.away ? `${m.away.flag} ${m.away.name}` : (m.seedAway ?? '—'),
    }));

  const finals = matches
    .filter(m => m.phase === 'final')
    .map(m => ({
      ...m,
      homeLabel: m.home ? `${m.home.flag} ${m.home.name}` : 'Ganador SF1',
      awayLabel: m.away ? `${m.away.flag} ${m.away.name}` : 'Ganador SF2',
    }));

  const champion = (() => {
    const fin = matches.find(m => m.phase === 'final');
    return fin ? getWinner(fin) : null;
  })();

  return (
    <div className="px-4 pt-6 pb-10 space-y-8">
      <div>
        <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Semifinales</p>
        <div className="grid grid-cols-2 gap-3">
          {semis.map((semi, si) => (
            <motion.div key={semi.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.07 }}>
              <p className="text-[10px] text-white/20 mb-1.5 uppercase tracking-widest">SF{si + 1}</p>
              <BracketMatch match={semi} />
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Final</p>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {finals.map(fin => (
            <BracketMatch key={fin.id} match={fin} borderGold />
          ))}
        </motion.div>
      </div>

      {champion && (
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Campeón</p>
          <div className="text-5xl mb-2">{champion.flag}</div>
          <div className="text-xl font-semibold" style={{ color: '#C9A84C' }}>{champion.name}</div>
          <div className="text-sm text-white/40 mt-1">{champion.players.join(' · ')}</div>
        </motion.div>
      )}
    </div>
  );
}
