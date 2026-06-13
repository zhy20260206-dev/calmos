// localStorage helpers for CalmOS
import type { User, SessionRecord } from './types';

export function getDeviceToken(): string {
  if (typeof window === 'undefined') return 'ssr';
  let token = localStorage.getItem('calmos_device_token');
  if (!token) {
    token = 'dev_' + crypto.randomUUID();
    localStorage.setItem('calmos_device_token', token);
  }
  return token;
}

export function loadUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem('calmos_user') || 'null');
  } catch {
    return null;
  }
}

export function saveUser(nickname: string, emoji: string): void {
  const deviceToken = getDeviceToken();
  localStorage.setItem(
    'calmos_user',
    JSON.stringify({ nickname, emoji, deviceToken })
  );
}

export function loadSessions(): SessionRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('calmos_sessions') || '[]');
  } catch {
    return [];
  }
}

export function saveSessionLocal(record: SessionRecord): void {
  const s = loadSessions();
  s.unshift(record);
  if (s.length > 5) s.pop();
  localStorage.setItem('calmos_sessions', JSON.stringify(s));
}
