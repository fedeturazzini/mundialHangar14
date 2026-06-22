'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Team, getInitials } from '@/lib/data';

interface Props {
  team: Team | null;
  onClose: () => void;
}

export default function TeamModal({ team, onClose }: Props) {
  return (
    <AnimatePresence>
      {team && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg mx-auto rounded-t-2xl p-6"
            style={{ background: '#0D0D0D', borderTop: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-8 h-0.5 rounded-full mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.15)' }} />

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{team.flag}</span>
              <div>
                <h2 className="text-lg font-semibold">{team.name}</h2>
                <p className="text-xs text-white/40">
                  {team.tentative ? 'Participación tentativa' : 'Confirmado'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {team.players.map((player, pi) => (
                <motion.div
                  key={player}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: pi * 0.06 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                    style={{ background: '#1a1a1a', border: '1px solid #333', color: '#C9A84C' }}
                  >
                    {getInitials(player)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{player}</p>
                    <p className="text-xs text-white/30">Jugador {pi + 1}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full py-2.5 text-sm text-white/50 rounded transition-colors hover:text-white/80"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
