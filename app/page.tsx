'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import ParticleBackground from '@/components/ParticleBackground';
import Countdown from '@/components/Countdown';
import AdminModal from '@/components/AdminModal';
import TeamModal from '@/components/TeamModal';
import Equipos from '@/components/tabs/Equipos';
import Grupos from '@/components/tabs/Grupos';
import Partidos from '@/components/tabs/Partidos';
import Bracket from '@/components/tabs/Bracket';

import {
  Team,
  Match,
  buildInitialMatches,
  resolveKnockout,
  STORAGE_KEY,
} from '@/lib/data';

const TABS = [
  { id: 'equipos',  label: 'Equipos'  },
  { id: 'grupos',   label: 'Grupos'   },
  { id: 'partidos', label: 'Partidos' },
  { id: 'bracket',  label: 'Bracket'  },
] as const;

type TabId = typeof TABS[number]['id'];

export default function Home() {
  const [activeTab, setActiveTab]       = useState<TabId>('equipos');
  const [matches, setMatches]           = useState<Match[]>(() => buildInitialMatches());
  const [isAdmin, setIsAdmin]           = useState(false);
  const [showAdmin, setShowAdmin]       = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Precio del evento
  const [precio, setPrecio]               = useState<string>('A DEFINIR');
  const [editandoPrecio, setEditandoPrecio] = useState(false);
  const [precioDraft, setPrecioDraft]     = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved: { id: string; score: [number, number] | null }[] = JSON.parse(raw);
      setMatches(prev => {
        const next = prev.map(m => {
          const found = saved.find(s => s.id === m.id);
          return found ? { ...m, score: found.score } : m;
        });
        return resolveKnockout(next);
      });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('hangar14_precio');
    if (saved) setPrecio(saved);
  }, []);

  const guardarPrecio = () => {
    const val = precioDraft.trim() || 'A DEFINIR';
    setPrecio(val);
    localStorage.setItem('hangar14_precio', val);
    setEditandoPrecio(false);
  };

  const handleUpdateScore = (matchId: string, idx: 0 | 1, val: number) => {
    setMatches(prev => {
      const next = prev.map(m => {
        if (m.id !== matchId) return m;
        const score: [number, number] = m.score ? [...m.score] as [number, number] : [0, 0];
        score[idx] = val;
        return { ...m, score };
      });
      const resolved = resolveKnockout(next);
      const toSave = resolved.map(m => ({ id: m.id, score: m.score }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      return resolved;
    });
  };

  const resolvedMatches = useMemo(() => resolveKnockout(matches), [matches]);

  return (
    <div className="relative min-h-screen bg-black text-white">
      <ParticleBackground />

      <div className="relative z-10 max-w-5xl mx-auto pb-20">

        {/* Header */}
        <header
          className="px-4 lg:px-8 pt-12 pb-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Precio del evento */}
          <div className="mb-4">
            {editandoPrecio && isAdmin ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/40 tracking-[0.2em] uppercase font-medium">
                  Precio del evento:
                </span>
                <input
                  autoFocus
                  type="text"
                  value={precioDraft}
                  onChange={e => setPrecioDraft(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') guardarPrecio();
                    if (e.key === 'Escape') setEditandoPrecio(false);
                  }}
                  placeholder="ej: $5.000"
                  className="bg-transparent text-lg font-black outline-none border-b pb-0.5"
                  style={{ color: '#C9A84C', borderColor: 'rgba(201,168,76,0.5)', width: '150px' }}
                  onBlur={guardarPrecio}
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  if (isAdmin) {
                    setPrecioDraft(precio === 'A DEFINIR' ? '' : precio);
                    setEditandoPrecio(true);
                  }
                }}
                className="flex items-center gap-2 group"
                style={{ cursor: isAdmin ? 'pointer' : 'default' }}
              >
                <span className="text-xs text-white/40 tracking-[0.2em] uppercase font-medium">
                  Precio del evento:
                </span>
                <span
                  className="text-lg font-black tracking-tight"
                  style={{
                    color: precio === 'A DEFINIR' ? 'rgba(255,255,255,0.25)' : '#C9A84C',
                    textShadow: precio !== 'A DEFINIR' ? '0 0 20px rgba(201,168,76,0.3)' : 'none',
                  }}
                >
                  {precio}
                </span>
                {isAdmin && (
                  <span className="text-[10px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    ✎
                  </span>
                )}
              </button>
            )}
          </div>

          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-[10px] text-white/25 tracking-[0.3em] uppercase mb-2 font-medium">
                3 de Julio · Hangar 14
              </p>
              <h1 className="font-black tracking-tight leading-none" style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
                Mundial{' '}
                <span style={{ color: '#C9A84C', textShadow: '0 0 30px rgba(201,168,76,0.3)' }}>
                  FIFA
                </span>
                <br className="lg:hidden" />
                <span className="text-white/20"> · </span>
                Hangar 14
              </h1>
            </div>
            <button
              onClick={() => setShowAdmin(true)}
              className="text-xs px-4 py-2 rounded-lg transition-all mt-1 font-medium flex-shrink-0"
              style={{
                border: isAdmin ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.1)',
                color: isAdmin ? '#C9A84C' : 'rgba(255,255,255,0.35)',
                background: isAdmin ? 'rgba(201,168,76,0.05)' : 'transparent',
              }}
            >
              {isAdmin ? '⚡ Admin' : 'Admin'}
            </button>
          </div>

          <Countdown />
        </header>

        {/* Tabs */}
        <nav
          className="flex sticky top-0 z-40 px-4 lg:px-8"
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 py-4 text-xs font-semibold transition-all tracking-widest uppercase"
              style={{ color: activeTab === tab.id ? '#C9A84C' : 'rgba(255,255,255,0.25)' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(to right, transparent, #C9A84C, transparent)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 'equipos' && (
              <Equipos onSelect={setSelectedTeam} />
            )}
            {activeTab === 'grupos' && (
              <Grupos matches={resolvedMatches} />
            )}
            {activeTab === 'partidos' && (
              <Partidos
                matches={resolvedMatches}
                isAdmin={isAdmin}
                onUpdateScore={handleUpdateScore}
              />
            )}
            {activeTab === 'bracket' && (
              <Bracket matches={resolvedMatches} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <TeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
      <AdminModal
        open={showAdmin}
        isAdmin={isAdmin}
        onClose={() => setShowAdmin(false)}
        onLogin={() => { setIsAdmin(true); setShowAdmin(false); }}
        onLogout={() => { setIsAdmin(false); setShowAdmin(false); }}
      />
    </div>
  );
}
