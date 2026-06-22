'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  open: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

export default function AdminModal({ open, isAdmin, onClose, onLogin, onLogout }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const tryLogin = () => {
    if (password === 'hangar14') {
      setError('');
      setPassword('');
      onLogin();
    } else {
      setError('Contraseña incorrecta.');
    }
  };

  return (
    <AnimatePresence>
      {open && (
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

            {!isAdmin ? (
              <>
                <h2 className="text-base font-semibold mb-1">Acceso Admin</h2>
                <p className="text-xs text-white/40 mb-4">Ingresá la contraseña para editar marcadores.</p>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && tryLogin()}
                  placeholder="Contraseña"
                  autoComplete="off"
                  className="w-full bg-transparent rounded px-3 py-2.5 text-sm text-white outline-none mb-3 transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.15)' }}
                  onFocus={e => (e.target.style.borderColor = '#C9A84C')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.15)')}
                />
                {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
                <div className="flex gap-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 text-sm text-white/50 rounded transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={tryLogin}
                    className="flex-1 py-2.5 text-sm bg-white text-black rounded font-medium hover:opacity-90 transition-opacity"
                  >
                    Ingresar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-base font-semibold mb-1" style={{ color: '#C9A84C' }}>Modo Admin activo</h2>
                <p className="text-xs text-white/40 mb-4">Podés editar los marcadores tocando los números.</p>
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 text-sm text-white/50 rounded transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Salir de Admin
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
