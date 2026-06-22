export interface Team {
  id: string;
  name: string;
  flag: string;
  players: [string, string];
  tentative?: boolean;
}

export interface Group {
  name: string;
  teams: Team[];
}

export interface Match {
  id: string;
  phase: 'group' | 'semi' | 'final';
  group?: number;
  home: Team | null;
  away: Team | null;
  score: [number, number] | null;
  seedHome?: string;
  seedAway?: string;
}

export const GROUPS: Group[] = [
  {
    name: 'A',
    teams: [
      { id: 'arg', name: 'Argentina', flag: '🇦🇷', players: ['Fede Tura', 'Manu Ferloni'],    tentative: false },
      { id: 'bra', name: 'Brasil',    flag: '🇧🇷', players: ['Fede Ledebur', 'Trusso'],       tentative: false },
      { id: 'fra', name: 'Francia',   flag: '🇫🇷', players: ['Rober Curia', 'Santi Barcia'],  tentative: false },
      { id: 'ned', name: 'Holanda',   flag: '🇳🇱', players: ['Tomi Figueroa', 'Facu 10'],     tentative: true  },
    ],
  },
  {
    name: 'B',
    teams: [
      { id: 'ger', name: 'Alemania', flag: '🇩🇪', players: ['Lucho Scattini', 'Mate Segura'], tentative: false },
      { id: 'esp', name: 'España',   flag: '🇪🇸', players: ['Martín Bezic', 'Agus Figueroa'], tentative: false },
      { id: 'por', name: 'Portugal', flag: '🇵🇹', players: ['Fede Saquer', 'Rivero'],         tentative: false },
    ],
  },
];

export function buildInitialMatches(): Match[] {
  const matches: Match[] = [];

  GROUPS.forEach((group, gi) => {
    const teams = group.teams;
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          id: `${group.name.toLowerCase()}_${teams[i].id}_${teams[j].id}`,
          phase: 'group',
          group: gi,
          home: teams[i],
          away: teams[j],
          score: null,
        });
      }
    }
  });

  matches.push({ id: 'semi1', phase: 'semi', home: null, away: null, score: null, seedHome: '1A', seedAway: '2B' });
  matches.push({ id: 'semi2', phase: 'semi', home: null, away: null, score: null, seedHome: '1B', seedAway: '2A' });
  matches.push({ id: 'final', phase: 'final', home: null, away: null, score: null });

  return matches;
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

export function resolveKnockout(matches: Match[]): Match[] {
  const next = matches.map(m => ({ ...m, score: m.score ? [...m.score] as [number,number] : null }));

  const top2A = computeStandings(0, next).slice(0, 2).map(r => r.team);
  const top2B = computeStandings(1, next).slice(0, 2).map(r => r.team);

  const semi1 = next.find(m => m.id === 'semi1')!;
  const semi2 = next.find(m => m.id === 'semi2')!;
  const fin   = next.find(m => m.id === 'final')!;

  semi1.home = top2A[0] ?? null;
  semi1.away = top2B[1] ?? null;
  semi2.home = top2B[0] ?? null;
  semi2.away = top2A[1] ?? null;

  fin.home = semi1.score ? getWinner(semi1) : null;
  fin.away = semi2.score ? getWinner(semi2) : null;

  return next;
}

export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export const TOURNAMENT_DATE = new Date('2026-07-03T19:00:00-03:00');
export const STORAGE_KEY = 'hangar14_scores_v2';
