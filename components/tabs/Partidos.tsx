'use client';

import { motion } from 'framer-motion';
import { Match, GROUPS } from '@/lib/data';

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
        color: readonly ? '#fff' : '#fff',
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

function MatchCard({ match, isAdmin, onUpdateScore }: { match: Match; isAdmin: boolean; onUpdateScore: Props['onUpdateScore'] }) {
  const isFinal = match.phase === 'final';
  const hasTeams = match.home && match.away;

  return (
    <div
      className="rounded-lg px-4 py-3"
      style={{
        background: '#0D0D0D',
        border: isFinal ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center justify-between">
        {/* Home */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {match.home ? `${match.home.flag} ${match.home.name}` : (match.seedHome ?? '—')}
          </div>
          {match.home && (
            <div className="text-xs text-white/30 mt-0.5 truncate">
              {match.home.players.map(p => p.split(' ')[0]).join(' · ')}
            </div>
          )}
        </div>

        {/* Score */}
        <div className="flex items-center gap-1 px-3 flex-shrink-0">
          <ScoreInput
            value={match.score ? match.score[0] : null}
            readonly={!isAdmin || !hasTeams}
            onChange={v => onUpdateScore(match.id, 0, v)}
          />
          <span className="text-white/20 text-sm">:</span>
          <ScoreInput
            value={match.score ? match.score[1] : null}
            readonly={!isAdmin || !hasTeams}
            onChange={v => onUpdateScore(match.id, 1, v)}
          />
        </div>

        {/* Away */}
        <div className="flex-1 min-w-0 text-right">
          <div className="text-sm font-medium truncate">
            {match.away ? `${match.away.flag} ${match.away.name}` : (match.seedAway ?? '—')}
          </div>
          {match.away && (
            <div className="text-xs text-white/30 mt-0.5 truncate">
              {match.away.players.map(p => p.split(' ')[0]).join(' · ')}
            </div>
          )}
        </div>
      </div>

      {!match.score && (
        <div className="mt-2 text-center">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}
          >
            {hasTeams ? 'pendiente' : 'esperando clasificación'}
          </span>
        </div>
      )}
    </div>
  );
}

export default function Partidos({ matches, isAdmin, onUpdateScore }: Props) {
  const groupMatches = (gi: number) => matches.filter(m => m.phase === 'group' && m.group === gi);
  const semis = matches.filter(m => m.phase === 'semi');
  const finals = matches.filter(m => m.phase === 'final');

  return (
    <div className="px-4 pt-6 pb-10">
      {GROUPS.map((group, gi) => (
        <div key={group.name} className="mb-8">
          <p className="text-xs text-white/30 tracking-widest uppercase mb-3">
            Grupo {group.name} — Fase de grupos
          </p>
          <div className="space-y-2">
            {groupMatches(gi).map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <MatchCard match={m} isAdmin={isAdmin} onUpdateScore={onUpdateScore} />
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-8">
        <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Semifinales</p>
        <div className="space-y-2">
          {semis.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <MatchCard match={m} isAdmin={isAdmin} onUpdateScore={onUpdateScore} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-xs text-white/30 tracking-widest uppercase mb-3">Final</p>
        <div className="space-y-2">
          {finals.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <MatchCard match={m} isAdmin={isAdmin} onUpdateScore={onUpdateScore} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
