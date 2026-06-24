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
import Reglas from '@/components/tabs/Reglas';

import {
  Team,
  Match,
  buildInitialMatches,
  resolveKnockout,
} from '@/lib/data';
import { supabase, DbResult } from '@/lib/supabase';
import ScoreModal from '@/components/ScoreModal';

const TABS = [
  { id: 'equipos',  label: 'Equipos'  },
  { id: 'grupos',   label: 'Grupos'   },
  { id: 'partidos', label: 'Partidos' },
  { id: 'bracket',  label: 'Bracket'  },
  { id: 'reglas',   label: 'Reglas'   },
] as const;

type TabId = typeof TABS[number]['id'];

function applyResults(base: Match[], rows: DbResult[]): Match[] {
  const next = base.map(m => {
    const row = rows.find(r => r.match_id === m.id);
    if (!row || !row.played) return { ...m, score: null };
    return { ...m, score: [row.home_score, row.away_score] as [number, number] };
  });
  return resolveKnockout(next);
}

export default function Home() {
  const [activeTab, setActiveTab]       = useState<TabId>('equipos');
  const [matches, setMatches]           = useState<Match[]>(() => buildInitialMatches());
  const [isAdmin, setIsAdmin]           = useState(false);
  const [showAdmin, setShowAdmin]       = useState(false);
  const [selectedTeam, setSelectedTeam]   = useState<Team | null>(null);
  const [editingMatch, setEditingMatch]   = useState<Match | null>(null);

  // Precio del evento (localStorage — no necesita realtime)
  const [precio, setPrecio]                 = useState<string>('A DEFINIR');
  const [editandoPrecio, setEditandoPrecio] = useState(false);
  const [precioDraft, setPrecioDraft]       = useState('');

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

  // ── Supabase: carga inicial + suscripción realtime ──────────────────────
  useEffect(() => {
    const base = buildInitialMatches();

    // 1. Carga inicial
    supabase
      .from('results')
      .select('*')
      .then(({ data, error }) => {
        if (error) { console.error('Supabase load error:', error); return; }
        if (data) setMatches(applyResults(base, data as DbResult[]));
      });

    // 2. Realtime — cualquier cambio en la tabla `results`
    const channel = supabase
      .channel('results-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'results' },
        (payload) => {
          const row = payload.new as DbResult;
          setMatches(prev => {
            const next = prev.map(m => {
              if (m.id !== row.match_id) return m;
              const score: [number, number] | null =
                row.played ? [row.home_score, row.away_score] : null;
              return { ...m, score };
            });
            return resolveKnockout(next);
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Guardar resultado en Supabase ────────────────────────────────────────
  const handleSaveScore = (matchId: string, score: [number, number]) => {
    setMatches(prev => resolveKnockout(prev.map(m => m.id === matchId ? { ...m, score } : m)));
    supabase.from('results').upsert({
      match_id: matchId,
      home_score: score[0],
      away_score: score[1],
      played: true,
      updated_at: new Date().toISOString(),
    }).then(({ error }) => { if (error) console.error('upsert error:', error); });
  };

  const handleClearScore = (matchId: string) => {
    setMatches(prev => resolveKnockout(prev.map(m => m.id === matchId ? { ...m, score: null } : m)));
    supabase.from('results').upsert({
      match_id: matchId,
      home_score: 0,
      away_score: 0,
      played: false,
      updated_at: new Date().toISOString(),
    }).then(({ error }) => { if (error) console.error('clear error:', error); });
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
          {/* Info box — borde dorado */}
          <div
            className="mb-6 px-3 py-2.5"
            style={{
              background: 'rgba(201,168,76,0.05)',
              borderRadius: '6px',
              borderLeft: '2px solid #C9A84C',
            }}
          >
            {/* Fila 1: Precio + Org */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
              {/* Precio del evento */}
              <div>
                {editandoPrecio && isAdmin ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-medium">
                      Precio:
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
                      className="bg-transparent text-sm font-black outline-none border-b pb-0.5"
                      style={{ color: '#C9A84C', borderColor: 'rgba(201,168,76,0.5)', width: '120px' }}
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
                    <span className="text-[10px] text-white/40 tracking-[0.15em] uppercase font-medium whitespace-nowrap">
                      Precio del evento:
                    </span>
                    <span
                      className="text-sm font-black tracking-tight"
                      style={{
                        color: precio === 'A DEFINIR' ? 'rgba(255,255,255,0.3)' : '#C9A84C',
                        textShadow: precio !== 'A DEFINIR' ? '0 0 16px rgba(201,168,76,0.35)' : 'none',
                      }}
                    >
                      {precio}
                    </span>
                    {isAdmin && (
                      <span className="text-[9px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">✎</span>
                    )}
                  </button>
                )}
              </div>

              {/* Organizadores */}
              <p className="text-[10px] text-white/30 tracking-wide">
                <span style={{ color: 'rgba(201,168,76,0.6)' }}>Org.</span>{' '}
                Fede Ledebur &amp; Fede Turazzini
              </p>
            </div>

            {/* Separador */}
            <div className="my-2" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }} />

            {/* Dresscode */}
            <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span className="font-bold tracking-[0.15em] uppercase" style={{ color: 'rgba(201,168,76,0.8)' }}>
                Dresscode:
              </span>{' '}
              Se les entregará a cada integrante la indumentaria del torneo a la hora del evento.
            </p>
          </div>

          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-[10px] text-white/25 tracking-[0.3em] uppercase mb-2 font-medium">
                3 de Julio · 18:30 hs · Hangar 14
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
            {activeTab === 'equipos'  && <Equipos onSelect={setSelectedTeam} />}
            {activeTab === 'grupos'   && <Grupos matches={resolvedMatches} />}
            {activeTab === 'partidos' && (
              <Partidos
                matches={resolvedMatches}
                isAdmin={isAdmin}
                onEditMatch={setEditingMatch}
              />
            )}
            {activeTab === 'reglas'   && <Reglas />}
            {activeTab === 'bracket'  && <Bracket matches={resolvedMatches} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <ScoreModal
        match={editingMatch}
        onClose={() => setEditingMatch(null)}
        onSave={handleSaveScore}
        onClear={handleClearScore}
      />
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
