export interface Player {
  name: string;    // nombre completo
  short: string;   // nombre corto para cards
  photo?: string;  // ruta en /public (ej: /JugadoresFinal/ManuFerloni.png)
}

export interface Team {
  id: string;
  name: string;
  flag: string;   // emoji fallback
  code: string;   // ISO 3166-1 alpha-2 for SVG flags
  players: [Player, Player];
  tentative?: boolean;
}

export interface Group {
  name: string;
  teams: Team[];
}

export interface Match {
  id: string;
  phase: 'group' | 'semi' | 'tercero' | 'final';
  group?: number;
  home: Team | null;
  away: Team | null;
  score: [number, number] | null;
  seedHome?: string;
  seedAway?: string;
  round: number;
  ps: 1 | 2;
}

// Pre-assigned schedule: round + PS station per match.
// Group A (6 matches) interleaved with Group B (3 matches).
// No-consecutive rule is best-effort; with 3-team Group B it's mathematically unavoidable
// for some teams to play back-to-back (GER R1→R2, FRA R2→R3, BRA/HOL R4→R5).
const MATCH_SCHEDULE: Record<string, { round: number; ps: 1 | 2 }> = {
  // ── Ronda 1 ────────────────────────────────────────────────
  a_arg_bra: { round: 1, ps: 1 },  // Argentina vs Brasil
  b_ger_esp: { round: 1, ps: 2 },  // Alemania   vs España
  // ── Ronda 2 ────────────────────────────────────────────────
  a_fra_ned: { round: 2, ps: 1 },  // Francia    vs Holanda
  b_ger_por: { round: 2, ps: 2 },  // Alemania   vs Portugal
  // ── Ronda 3 ────────────────────────────────────────────────
  a_arg_fra: { round: 3, ps: 1 },  // Argentina  vs Francia
  b_esp_por: { round: 3, ps: 2 },  // España     vs Portugal
  // ── Ronda 4 (solo PS1 — ningún equipo disponible para PS2) ─
  a_bra_ned: { round: 4, ps: 1 },  // Brasil     vs Holanda
  // ── Ronda 5 ────────────────────────────────────────────────
  a_arg_ned: { round: 5, ps: 1 },  // Argentina  vs Holanda
  a_bra_fra: { round: 5, ps: 2 },  // Brasil     vs Francia
  // ── Semifinales ────────────────────────────────────────────
  semi1:     { round: 6, ps: 1 },
  semi2:     { round: 6, ps: 2 },
  // ── Ronda Final (en paralelo) ───────────────────────────────
  final:     { round: 7, ps: 1 },  // Final
  tercero:   { round: 7, ps: 2 },  // 3° y 4° puesto
};

export const GROUPS: Group[] = [
  {
    name: 'A',
    teams: [
      { id: 'arg', name: 'Argentina', flag: '🇦🇷', code: 'AR', tentative: false, players: [
        { name: 'Fede Turazzini', short: 'Tura',    photo: '/JugadoresFinal/FedericoTurazzini.png' },
        { name: 'Manu Ferloni',   short: 'Manu',    photo: '/JugadoresFinal/ManuFerloni.png' },
      ]},
      { id: 'bra', name: 'Brasil', flag: '🇧🇷', code: 'BR', tentative: false, players: [
        { name: 'Fede Ledebur', short: 'Ledebur', photo: '/JugadoresFinal/FedeLedebur.png' },
        { name: 'Trusso',       short: 'Trusso',  photo: '/JugadoresFinal/FranTrusso.png' },
      ]},
      { id: 'fra', name: 'Francia', flag: '🇫🇷', code: 'FR', tentative: false, players: [
        { name: 'Rober Curia',  short: 'Rober', photo: '/JugadoresFinal/RoberCuria.png' },
        { name: 'Santi Barcia', short: 'Santi', photo: '/JugadoresFinal/SantiagoBarcia.png' },
      ]},
      { id: 'ned', name: 'Holanda', flag: '🇳🇱', code: 'NL', tentative: false, players: [
        { name: 'Tomi Figueroa', short: 'Tomi', photo: '/JugadoresFinal/TomasFigueroa.png' },
        { name: 'Facu Diez',     short: 'Facu', photo: '/JugadoresFinal/FacundoDiez.png' },
      ]},
    ],
  },
  {
    name: 'B',
    teams: [
      { id: 'ger', name: 'Alemania', flag: '🇩🇪', code: 'DE', tentative: false, players: [
        { name: 'Lucho Scattini', short: 'Lucho', photo: '/JugadoresFinal/LucianoScattini.png' },
        { name: 'Mate Segura',    short: 'Mate',  photo: '/JugadoresFinal/MateoSegura.png' },
      ]},
      { id: 'esp', name: 'España', flag: '🇪🇸', code: 'ES', tentative: false, players: [
        { name: 'Martín Bezic',  short: 'Martín', photo: '/JugadoresFinal/MartinBezic.png' },
        { name: 'Agus Figueroa', short: 'Agus',   photo: '/JugadoresFinal/AgusFigueroa.png' },
      ]},
      { id: 'por', name: 'Portugal', flag: '🇵🇹', code: 'PT', tentative: false, players: [
        { name: 'Fede Saquer', short: 'Saquer', photo: '/JugadoresFinal/FedeSaquer.png' },
        { name: 'Rivero',      short: 'Rivero', photo: '/JugadoresFinal/PabloRivero.png' },
      ]},
    ],
  },
];

export function buildInitialMatches(): Match[] {
  const matches: Match[] = [];

  GROUPS.forEach((group, gi) => {
    const teams = group.teams;
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const id = `${group.name.toLowerCase()}_${teams[i].id}_${teams[j].id}`;
        const sched = MATCH_SCHEDULE[id] ?? { round: 99, ps: 1 as const };
        matches.push({ id, phase: 'group', group: gi, home: teams[i], away: teams[j], score: null, ...sched });
      }
    }
  });

  matches.push({ id: 'semi1',   phase: 'semi',    home: null, away: null, score: null, seedHome: '1A', seedAway: '2B', ...MATCH_SCHEDULE['semi1'] });
  matches.push({ id: 'semi2',   phase: 'semi',    home: null, away: null, score: null, seedHome: '1B', seedAway: '2A', ...MATCH_SCHEDULE['semi2'] });
  matches.push({ id: 'final',   phase: 'final',   home: null, away: null, score: null, ...MATCH_SCHEDULE['final'] });
  matches.push({ id: 'tercero', phase: 'tercero', home: null, away: null, score: null, ...MATCH_SCHEDULE['tercero'] });

  return matches.sort((a, b) => a.round - b.round || a.ps - b.ps);
}

export interface StandingRow {
  team: Team;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export function computeStandings(groupIndex: number, matches: Match[]): StandingRow[] {
  const teams = GROUPS[groupIndex].teams;
  const groupMatches = matches.filter(m => m.phase === 'group' && m.group === groupIndex);
  const rows: StandingRow[] = teams.map(t => ({ team: t, pj: 0, g: 0, e: 0, p: 0, gf: 0, ga: 0, gd: 0, pts: 0 }));

  groupMatches.forEach(m => {
    if (!m.score || !m.home || !m.away) return;
    const hi = rows.findIndex(r => r.team.id === m.home!.id);
    const ai = rows.findIndex(r => r.team.id === m.away!.id);
    const [hs, as_] = m.score;
    rows[hi].pj++; rows[ai].pj++;
    rows[hi].gf += hs; rows[hi].ga += as_;
    rows[ai].gf += as_; rows[ai].ga += hs;
    if (hs > as_)      { rows[hi].g++; rows[hi].pts += 3; rows[ai].p++; }
    else if (hs < as_) { rows[ai].g++; rows[ai].pts += 3; rows[hi].p++; }
    else               { rows[hi].e++; rows[hi].pts++;    rows[ai].e++; rows[ai].pts++; }
  });

  rows.forEach(r => (r.gd = r.gf - r.ga));
  rows.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
  return rows;
}

export function getWinner(match: Match): Team | null {
  if (!match.score) return null;
  if (match.score[0] > match.score[1]) return match.home;
  if (match.score[1] > match.score[0]) return match.away;
  return null;
}

function getLoser(match: Match): Team | null {
  if (!match.score) return null;
  if (match.score[0] > match.score[1]) return match.away;
  if (match.score[1] > match.score[0]) return match.home;
  return null;
}

export function resolveKnockout(matches: Match[]): Match[] {
  const next = matches.map(m => ({ ...m, score: m.score ? [...m.score] as [number,number] : null }));

  const semi1   = next.find(m => m.id === 'semi1')!;
  const semi2   = next.find(m => m.id === 'semi2')!;
  const fin     = next.find(m => m.id === 'final')!;
  const tercero = next.find(m => m.id === 'tercero')!;

  // Solo resolver semis si hay al menos un resultado de grupos cargado
  const hasGroupResults = next.some(m => m.phase === 'group' && m.score !== null);

  if (hasGroupResults) {
    const top2A = computeStandings(0, next).slice(0, 2).map(r => r.team);
    const top2B = computeStandings(1, next).slice(0, 2).map(r => r.team);
    semi1.home = top2A[0] ?? null;
    semi1.away = top2B[1] ?? null;
    semi2.home = top2B[0] ?? null;
    semi2.away = top2A[1] ?? null;
  } else {
    semi1.home = null; semi1.away = null;
    semi2.home = null; semi2.away = null;
  }

  fin.home     = semi1.score ? getWinner(semi1) : null;
  fin.away     = semi2.score ? getWinner(semi2) : null;
  tercero.home = semi1.score ? getLoser(semi1)  : null;
  tercero.away = semi2.score ? getLoser(semi2)  : null;

  return next;
}

export function getInitials(nameOrPlayer: string | Player): string {
  const name = typeof nameOrPlayer === 'string' ? nameOrPlayer : nameOrPlayer.name;
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export const TOURNAMENT_DATE = new Date('2026-07-03T19:00:00-03:00');
export const STORAGE_KEY = 'hangar14_scores_v2';
