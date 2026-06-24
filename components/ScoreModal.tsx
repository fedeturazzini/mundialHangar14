'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Match } from '@/lib/data';
import Flag from '@/components/Flag';

interface Props {
  match: Match | null;
  onClose: () => void;
  onSave: (matchId: string, score: [number, number]) => void;
  onClear: (matchId: string) => void;
}

function ModalInner({ match, onClose, onSave, onClear }: Required<Props> & { match: Match }) {
  const [home, setHome] = useState<number>(match.score?.[0] ?? 0);
  const [away, setAway] = useState<number>(match.score?.[1] ?? 0);

  const homeNode = match.home
    ? <><Flag code={match.home.code} className="w-8 h-5 rounded-[2px] mx-auto mb-1" />{match.home.name}</>
    : <>{match.seedHome ?? '—'}</>;
  const awayNode = match.away
    ? <><Flag code={match.away.code} className="w-8 h-5 rounded-[2px] mx-auto mb-1" />{match.away.name}</>
    : <>{match.seedAway ?? '—'}</>;
  const hasTeams  = !!(match.home && match.away);
  const hasScore  = !!match.score;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center"
      style={{ background: 'rgba(0,0,0,0.88)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full lg:max-w-sm rounded-t-2xl lg:rounded-2xl p-6"
        style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-8 h-0.5 rounded-full mx-auto mb-5 lg:hidden" style={{ background: 'rgba(255,255,255,0.15)' }} />

        {/* Phase label */}
        <p className="text-[10px] text-white/30 tracking-widest uppercase mb-4">
          {match.phase === 'group' ? `Grupo ${match.group === 0 ? 'A' : 'B'}` : match.phase === 'semi' ? 'Semifinal' : 'Final'}
          {' · '}PS{match.ps}
        </p>

        {/* Score editor */}
        <div className="flex items-center justify-between gap-3 mb-6">
          {/* Home */}
          <div className="flex-1 text-center">
            <p className="text-sm font-semibold mb-3 leading-tight flex flex-col items-center">{homeNode}</p>
            <input
              type="number"
              min={0}
              max={99}
              value={home}
              onChange={e => setHome(Math.max(0, parseInt(e.target.value) || 0))}
              disabled={!hasTeams}
              className="w-16 h-16 text-3xl font-black text-center rounded-xl outline-none tabular-nums"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                MozAppearance: 'textfield',
              } as React.CSSProperties}
              onFocus={e => { e.target.style.borderColor = '#C9A84C'; e.target.select(); }}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
          </div>

          <span className="text-2xl font-black text-white/20 pb-6">:</span>

          {/* Away */}
          <div className="flex-1 text-center">
            <p className="text-sm font-semibold mb-3 leading-tight flex flex-col items-center">{awayNode}</p>
            <input
              type="number"
              min={0}
              max={99}
              value={away}
              onChange={e => setAway(Math.max(0, parseInt(e.target.value) || 0))}
              disabled={!hasTeams}
              className="w-16 h-16 text-3xl font-black text-center rounded-xl outline-none tabular-nums"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                MozAppearance: 'textfield',
              } as React.CSSProperties}
              onFocus={e => { e.target.style.borderColor = '#C9A84C'; e.target.select(); }}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => { onSave(match.id, [home, away]); onClose(); }}
            disabled={!hasTeams}
            className="w-full py-3 rounded-xl text-sm font-bold tracking-wide transition-opacity disabled:opacity-40"
            style={{ background: '#C9A84C', color: '#000' }}
          >
            Guardar
          </button>

          {hasScore && (
            <button
              onClick={() => { onClear(match.id); onClose(); }}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.25)', color: 'rgba(220,80,80,0.9)' }}
            >
              Borrar resultado
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm text-white/40 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ScoreModal({ match, onClose, onSave, onClear }: Props) {
  return (
    <AnimatePresence>
      {match && (
        <ModalInner
          key={match.id}
          match={match}
          onClose={onClose}
          onSave={onSave}
          onClear={onClear}
        />
      )}
    </AnimatePresence>
  );
}
