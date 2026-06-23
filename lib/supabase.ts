import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key);

export interface DbResult {
  match_id: string;
  home_score: number;
  away_score: number;
  played: boolean;
  updated_at: string;
}
