// Supabase client for CalmOS
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SessionRecord } from './types';
import { loadSessions } from './storage';

const SUPABASE_URL = 'https://rjxbcxcnjnwplroytnan.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_zFObYEugRZYsooLN-OxOUQ_9O8OIi5r';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_supabase) return _supabase;
  if (typeof window === 'undefined') return null;
  try {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return _supabase;
  } catch {
    return null;
  }
}

export async function loadSessionsCloud(
  userId: string
): Promise<SessionRecord[]> {
  const sb = getSupabase();
  if (!sb) return loadSessions();

  try {
    const { data, error } = await sb
      .from('calmos_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const cloud = ((data || []) as SessionRecord[]).map((r) => ({
      id: r.id,
      date: r.date,
      keyword: r.keyword,
      primary_cause: r.primary_cause,
      anxiety_before: r.anxiety_before,
      anxiety_after: r.anxiety_after,
      module_used: r.module_used,
      helpfulness: r.helpfulness,
    }));

    // Merge cloud + local, deduplicate by id
    const local = loadSessions();
    const merged = [...cloud];
    for (const l of local) {
      if (!merged.find((m) => m.id === l.id)) merged.push(l);
    }
    merged.sort((a, b) => b.id - a.id);
    merged.splice(5);
    return merged;
  } catch {
    return loadSessions();
  }
}

export async function saveSessionCloud(
  record: SessionRecord,
  userId: string,
  nickname: string,
  answers: Record<string, string>,
  aiResult: unknown
): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;

  try {
    const { error } = await sb.from('calmos_sessions').insert({
      id: record.id,
      user_id: userId,
      nickname,
      date: record.date,
      keyword: record.keyword || '',
      primary_cause: record.primary_cause || '',
      anxiety_before: record.anxiety_before,
      anxiety_after: record.anxiety_after,
      module_used: record.module_used,
      helpfulness: record.helpfulness,
      answers: answers || {},
      ai_result: aiResult || {},
      created_at: new Date().toISOString(),
    });
    if (error) console.warn('Supabase save failed', error.message);
  } catch (e: unknown) {
    console.warn('Supabase save failed', (e as Error).message);
  }
}
