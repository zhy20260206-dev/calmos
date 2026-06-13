'use client';

import { useApp } from '@/lib/state';
import { StepProgress, CtaButton } from './InterventionRouter';

interface Scenario {
  type: string;
  first_step: string;
}

interface UncertaintyDetail {
  scenarios?: Scenario[];
  waiting_actions?: string[];
  reframe?: string;
  [key: string]: unknown;
}

export function UncertaintyManagement({ detail }: { detail: UncertaintyDetail }) {
  const scenarios = detail?.scenarios || [];
  const labels = [
    { key: 'good', label: '最好的情况', cls: 'label-good' },
    { key: 'mid', label: '中间情况', cls: 'label-mid' },
    { key: 'bad', label: '最坏的情况', cls: 'label-bad' },
  ];

  return (
    <div className="screen">
      <button className="back-btn" onClick={() => useApp().navigate('results')}>
        ←
      </button>
      <StepProgress />
      <div className="module-badge hand-font">不确定性管理</div>
      <h1 style={{ marginBottom: 20 }}>等待期间，你还是有选择的</h1>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
        💡 把&quot;未知&quot;变成&quot;有范围的已知&quot;，焦虑就会减少。
      </p>
      <div className="scenario-scroll">
        {labels.map((l) => {
          const sc =
            scenarios.find((s) => s.type === l.key) ||
            scenarios[labels.indexOf(l)] ||
            {};
          return (
            <div key={l.key} className="scenario-card">
              <div className={`scenario-label ${l.cls}`}>{l.label}</div>
              <div style={{ fontSize: 14, color: 'var(--ink)' }}>
                {(sc as Scenario).first_step || '先照顾好今天。'}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 20 }} />
      {(detail?.waiting_actions || []).map((a, i) => (
        <div
          key={i}
          className="sketch-box"
          style={{
            padding: '14px 18px',
            marginBottom: 10,
            transform: 'rotate(0.2deg)',
          }}
        >
          📌 {a}
        </div>
      ))}
      {detail?.reframe && (
        <div className="reframe-box">{detail.reframe}</div>
      )}
      <div
        className="sketch-box"
        style={{
          background: 'var(--mac-blue-lt)',
          border: '2px dashed var(--ink)',
        }}
      >
        <p style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>
          ⏰ 小建议：每天只查看一次相关信息（比如下午5点），打破反复刷新的循环。
        </p>
      </div>
      <div style={{ height: 80 }} />
      <CtaButton />
    </div>
  );
}
