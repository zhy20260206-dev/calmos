'use client';

import { useApp } from '@/lib/state';
import { MODULE_NAMES } from '@/lib/constants';

const MODULE_ICONS = ['⚡', '🌱', '🧩', '💬', '🎯', '🌬'];

export function Results() {
  const { state, handleModuleSelect } = useApp();
  const r = state.aiResult;
  if (!r) return null;

  return (
    <div className="screen">
      <div className="cause-banner">
        <div className="cause-icon">📋</div>
        <div>
          <div className="cause-label">识别结果</div>
          <div className="cause-name">{r.primary_cause}</div>
        </div>
      </div>

      <div className="sketch-box" style={{ transform: 'rotate(-0.2deg)' }}>
        <p style={{ color: 'var(--ink)', fontSize: 14, lineHeight: 1.8 }}>
          {r.summary}
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        {(r.evidence || []).map((e: string) => (
          <span key={e} className="pill">
            {e}
          </span>
        ))}
      </div>

      <p
        style={{
          fontSize: 12,
          color: 'var(--muted)',
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        👇 我们分两步来缓解，点击任意一个开始
      </p>

      {(r.recommended_modules || []).map((m, i) => {
        const icon = MODULE_ICONS[i] || '✨';
        const stepTag =
          i === 0 ? (
            <span
              style={{
                fontSize: 10,
                background: 'var(--pop-coral)',
                color: '#fff',
                borderRadius: 99,
                padding: '2px 8px',
                marginLeft: 6,
                display: 'inline-block',
              }}
            >
              第1步
            </span>
          ) : (
            <span
              style={{
                fontSize: 10,
                background: 'var(--mac-blue)',
                color: 'var(--ink)',
                borderRadius: 99,
                padding: '2px 8px',
                marginLeft: 6,
                display: 'inline-block',
              }}
            >
              第2步
            </span>
          );

        return (
          <div
            key={i}
            className="sketch-box"
            style={{
              position: 'relative',
              transform: i === 0 ? 'rotate(0.3deg)' : 'rotate(-0.4deg)',
            }}
          >
            <div className="module-card-dot" />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div className="module-icon-box">{icon}</div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 800,
                    color: 'var(--muted)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                  }}
                >
                  {MODULE_NAMES[m.type] || m.type}
                  {stepTag}
                  <span
                    style={{
                      fontSize: 11,
                      background: 'rgba(62,54,64,0.05)',
                      borderRadius: 99,
                      padding: '2px 8px',
                      marginLeft: 6,
                    }}
                  >
                    约 {m.estimated_minutes} 分钟
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{m.title}</div>
              </div>
            </div>
            <p style={{ marginBottom: 14, fontSize: 13 }}>{m.reason}</p>
            <button
              className="btn btn-primary hand-font btn-start-module"
              onClick={() => handleModuleSelect(i)}
              style={{
                boxShadow:
                  '3px 3px 0 ' +
                  (i === 0 ? 'var(--mac-mint)' : 'var(--mac-blue)'),
              }}
            >
              Go 开始 →
            </button>
          </div>
        );
      })}

      <div
        style={{
          padding: '16px 0',
          fontSize: 14,
          color: 'var(--muted)',
          textAlign: 'center',
          lineHeight: 1.7,
          fontWeight: 600,
        }}
      >
        {r.closing_message}
      </div>
    </div>
  );
}
