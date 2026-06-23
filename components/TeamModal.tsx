'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Team } from '@/lib/data';

interface Props {
  team: Team | null;
  onClose: () => void;
}

export default function TeamModal({ team, onClose }: Props) {
  return (
    <AnimatePresence>
      {team && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end lg:items-center lg:justify-center"
          style={{ background: 'rgba(0,0,0,0.88)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Mobile: bottom sheet / Desktop: centered modal */}
          <motion.div
            className="w-full lg:max-w-lg rounded-t-2xl lg:rounded-2xl p-6 lg:p-8"
            style={{
              background: '#0D0D0D',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              minHeight: '65vh',
              display: 'flex',
              flexDirection: 'column',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle (mobile only) */}
            <div className="w-8 h-0.5 rounded-full mx-auto mb-6 lg:hidden" style={{ background: 'rgba(255,255,255,0.15)' }} />

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-5xl">{team.flag}</span>
              <div>
                <h2 className="text-2xl font-bold">{team.name}</h2>
                <p
                  className="text-xs tracking-widest uppercase mt-1"
                  style={{ color: team.tentative ? 'rgba(255,255,255,0.3)' : '#C9A84C' }}
                >
                  {team.tentative ? 'Participación tentativa' : '✓ Confirmado'}
                </p>
              </div>
            </div>

            {/* Player cards side by side */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              {team.players.map((player, pi) => (
                <motion.div
                  key={player}
                  className="flex flex-col items-center text-center p-5 rounded-xl"
                  style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.08)' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pi * 0.08 }}
                >
                  {/* Avatar via DiceBear */}
                  <div
                    className="w-20 h-20 rounded-full overflow-hidden mb-3 flex-shrink-0"
                    style={{ border: '2px solid rgba(201,168,76,0.3)' }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(player)}&backgroundColor=1a1a1a&textColor=C9A84C&fontSize=38`}
                      alt={player}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-semibold leading-snug">{player}</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Jugador {pi + 1}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-xs mt-5" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Las fotos se actualizarán antes del torneo
            </p>

            <button
              onClick={onClose}
              className="mt-4 w-full py-2.5 text-sm text-white/50 rounded-lg transition-colors hover:text-white/80"
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
