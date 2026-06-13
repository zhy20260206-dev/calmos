'use client';

import { useApp } from '@/lib/state';

export function ErrorScreen() {
  const { state, navigate } = useApp();

  return (
    <div
      className="screen"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <div style={{ fontSize: 48 }}>😔</div>
      <h2>分析遇到了问题</h2>
      <p style={{ textAlign: 'center' }}>
        网络或 API 出了点状况，请稍后重试。
      </p>
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
        {state.supabaseReady
          ? '☁️ 云端已连接 | ' + state.errorDetail
          : state.errorDetail}
      </p>
      <button
        className="btn btn-primary hand-font"
        onClick={() => navigate('analysis')}
      >
        重试
      </button>
      <button className="btn btn-ghost" onClick={() => navigate('home')}>
        返回主页
      </button>
    </div>
  );
}
