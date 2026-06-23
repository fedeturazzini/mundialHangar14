'use client';

import { motion } from 'framer-motion';
import { Match } from '@/lib/data';

interface Props {
  matches: Match[];
  isAdmin: boolean;
  onUpdateScore: (matchId: string, idx: 0 | 1, val: number) => void;
}

function ScoreInput({
  value,
  readonly,
  onChange,
}: {
  value: number | null;
  readonly: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      max={99}
      readOnly={readonly}
      defaultValue={value ?? undefined}
      key={value}
      placeholder="–"
      className="w-8 text-center text-lg font-semibold bg-transparent border-none outline-none tabular-nums"
      style={{
        color: '#fff',
        cursor: readonly ? 'default' : 'text',
        MozAppearance: 'textfield',
      } as React.CSSProperties}
      onFocus={e => {
        if (!readonly) e.target.value = value != null ? String(value) : '0';
        e.target.style.color = '#C9A84C';
      }}
      onBlur={e => {
        e.target.style.color = '#fff';
        if (!readonly) onChange(parseInt(e.target.value) || 0);
      }}
      onChange={e => {
        if (!readonly) onChange(parseInt(e.target.value) || 0);
      }}
    />
  );
}

function MatchRow({
  match,
  isAdmin,
  onUpdateScore,
}: {
  match: Match;
  isAdmin: boolean;
  onUpdateScore: Props['onUpdateScore'];
}) {
  const isFinal = match.phase === 'final';
  const hasTeams = !!(match.home && match.away);

  return (
    <div
      className="rounded-lg"
      style={{
        background: isFinal ? 'rgba(201,168,76,0.04)' : '#0D0D0D',
        border: isFinal
          ? '1px solid rgba(201,168,76,0.3)'
          : '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* PS label bar */}
      <div
        className="flex items-center gap-2 px-3 pt-2.5 pb-1.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span
          className="text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
          style={{
            background: 'rgba(201,168,76,0.12)',
            color: '#C9A84C',
            border: '1px solid rgba(201,168,76,0.2)',
          }}
        >
          PS{match.ps}
        </span>
        <span className="text-[10px] text-white/25 tracking-wider uppercase">
          {match.phase === 'group'
            ? `Grupo ${match.group === 0 ? 'A' : 'B'}`
            : match.phase === 'semi'
            ? 'Semifinal'
            : 'Final'}
        </span>
        {match.score && (
          <span
            className="ml-auto text-[10px] text-white/30 tracking-wider uppercase"
          >
            Finalizado
          </span>
        )}
      </div>

      {/* Teams + score */}
      <div className="flex items-center gap-2 px-3 py-3">
        {/* Home */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">
            {match.home ? `${match.home.flag} ${match.home.name}` : (match.seedHome ?? '—')}
          </div>
          {match.home && (
            <div className="text-xs text-white/30 mt-0.5 truncate">
              {match.home.players.map(p => p.split(' ')[0]).join(' · ')}
            </div>
          )}
        </div>

        {/* Score */}
        <div className="flex items-center gap-0.5 px-2 flex-shrink-0">
          <ScoreInput
            value={match.score ? match.score[0] : null}
            readonly={!isAdmin || !hasTeams}
            onChange={v => onUpdateScore(match.id, 0, v)}
          />
          <span className="text-white/20 text-base px-0.5">:</span>
          <ScoreInput
            value={match.score ? match.score[1] : null}
            readonly={!isAdmin || !hasTeams}
            onChange={v => onUpdateScore(match.id, 1, v)}
          />
        </div>

        {/* Away */}
        <div className="flex-1 min-w-0 text-right">
          <div className="text-sm font-semibold truncate">
            {match.away ? `${match.away.flag} ${match.away.name}` : (match.seedAway ?? '—')}
          </div>
          {match.away && (
            <div className="text-xs text-white/30 mt-0.5 truncate">
              {match.away.players.map(p => p.split(' ')[0]).join(' · ')}
            </div>
          )}
        </div>
      </div>

      {/* Pending pill */}
      {!match.score && (
        <div className="pb-2.5 text-center">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.25)' }}
          >
            {hasTeams ? 'pendiente' : 'esperando clasificación'}
          </span>
        </div>
      )}
    </div>
  );
}

function roundLabel(round: number, phase: string): string {
  if (phase === 'semi') return 'Semifinales';
  if (phase === 'final') return 'Final';
  return `Ronda ${round}`;
}

export default function Partidos({ matches, isAdmin, onUpdateScore }: Props) {
  // Group matches by round, preserving sort order (already sorted by round + ps in buildInitialMatches)
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
            {/* Round header */}
            <div className="flex items-center gap-3 mb-3">
              {isKnockout ? (
                <div className="flex items-center gap-3">
                  <div className="w-0.5 h-5 rounded-full" style={{ background: '#C9A84C' }} />
                  <span className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: '#C9A84C' }}>
                    {label}
                  </span>
                </div>
              ) : (
                <>
                  <span
                    className="text-xs font-bold tracking-[0.2em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    {label}
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <span className="text-[10px] text-white/20">
                    {roundMatches.length === 1 ? '1 partido' : `${roundMatches.length} en paralelo`}
                  </span>
                </>
              )}
            </div>

            {/* Matches in this round */}
            <div className="space-y-2">
              {roundMatches.map(m => (
                <MatchRow
                  key={m.id}
                  match={m}
                  isAdmin={isAdmin}
                  onUpdateScore={onUpdateScore}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
