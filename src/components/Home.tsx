'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/state';
import { getGreeting } from '@/lib/constants';
import { loadSessions } from '@/lib/storage';
import type { SessionRecord } from '@/lib/types';

export function HomeScreen() {
  const { state, handleStartAnalysis, loadAllSessions } = useApp();
  const { nickname, emoji } = state.user!;
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [syncStatus, setSyncStatus] = useState('💻 数据仅保存在本设备');

  useEffect(() => {
    // Show local data first (instant)
    setSessions(loadSessions());

    // Then async refresh from Supabase
    loadAllSessions().then((merged) => {
      if (merged.length > 0) {
        setSessions(merged);
        setSyncStatus('☁️ 数据已同步云端');
      }
    });
  }, [loadAllSessions]);

  const greet = getGreeting();
  const completedCount = sessions.length;
  let avgReduction = 0;
  if (sessions.length > 0) {
    avgReduction = Math.round(
      sessions.reduce((sum, s) => sum + (s.anxiety_before - s.anxiety_after), 0) /
        sessions.length
    );
  }
  const streakDays = sessions.length > 0 ? Math.min(sessions.length, 7) : 0;

  return (
    <div className="screen">
      <div className="greeting-block">
        <div className="user-emoji-blob">{emoji}</div>
        <div>
          <div className="greeting-text">
            {nickname}，{greet}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            今天感觉怎么样？
          </div>
        </div>
      </div>

      <div className="tag-strip">
        {streakDays > 0 && (
          <span className="tag tag-y">🌿 连续 {streakDays} 次</span>
        )}
        {completedCount > 0 && (
          <span className="tag tag-m">✅ {completedCount} 次完成</span>
        )}
        {avgReduction > 0 && (
          <span className="tag tag-b">📉 焦虑↓{avgReduction}%</span>
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '20px 0 36px' }}>
        <button
          className="btn btn-primary hand-font"
          style={{ fontSize: 19, padding: 18 }}
          onClick={handleStartAnalysis}
        >
          ✨ 开始分析
        </button>
      </div>

      <div className="sketch-box">
        <div
          className="hand-font"
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--muted)',
            marginBottom: 12,
            letterSpacing: '0.1em',
          }}
        >
          最近记录
        </div>
        {sessions.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)' }}>
            还没有记录，开始你的第一次分析吧 ✨
          </p>
        ) : (
          sessions.map((s) => (
            <div key={s.id} className="history-row">
              <div className="history-date">{s.date}</div>
              <div>
                {s.primary_cause} ·{' '}
                <span className="score-chip">
                  {s.anxiety_before}→{s.anxiety_after}
                </span>{' '}
                · {s.helpfulness}
              </div>
            </div>
          ))
        )}
        <p
          style={{
            textAlign: 'center',
            fontSize: 10,
            color: 'var(--muted)',
            marginTop: 10,
          }}
        >
          {syncStatus}
        </p>
      </div>
    </div>
  );
}
