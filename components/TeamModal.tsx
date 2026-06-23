'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Team, getInitials } from '@/lib/data';
import Flag from '@/components/Flag';

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
              <Flag code={team.code} className="w-20 h-14 rounded-[4px]" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }} />
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
                  key={player.name}
                  className="relative rounded-xl overflow-hidden"
                  style={{ minHeight: '220px', background: '#131313' }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pi * 0.08 }}
                >
                  {/* Foto de fondo o iniciales */}
                  {player.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={player.photo}
                      alt={player.name}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-4xl font-black"
                      style={{ color: '#C9A84C' }}
                    >
                      {getInitials(player)}
                    </div>
                  )}

                  {/* Gradiente inferior + nombre */}
                  <div
                    className="absolute bottom-0 left-0 right-0 px-3 py-2.5"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }}
                  >
                    <p className="text-sm font-bold leading-tight">{player.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(201,168,76,0.7)' }}>
                      Jugador {pi + 1}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

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
