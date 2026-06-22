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

  // Load saved scores from localStorage
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

      <div className="relative z-10 max-w-lg mx-auto pb-20">

        {/* Header */}
        <header className="px-4 pt-10 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] text-white/30 tracking-[0.2em] uppercase mb-1">
                3 de Julio · Hangar 14
              </p>
              <h1 className="text-xl font-semibold tracking-tight">
                Mundial FIFA{' '}
                <span style={{ color: '#C9A84C' }}>·</span>
                {' '}Hangar 14
              </h1>
            </div>
            <button
              onClick={() => setShowAdmin(true)}
              className="text-xs px-3 py-1.5 rounded transition-colors mt-1"
              style={{
                border: isAdmin ? '1px solid #C9A84C' : '1px solid rgba(255,255,255,0.15)',
                color: isAdmin ? '#C9A84C' : 'rgba(255,255,255,0.4)',
              }}
            >
              {isAdmin ? '⚡ Admin' : 'Admin'}
            </button>
          </div>
          <Countdown />
        </header>

        {/* Tabs */}
        <nav
          className="flex sticky top-0 z-40 bg-black px-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex-1 py-3 text-xs font-medium transition-colors"
              style={{ color: activeTab === tab.id ? '#C9A84C' : 'rgba(255,255,255,0.35)' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: '#C9A84C' }}
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
