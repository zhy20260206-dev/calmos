'use client';

import { useApp } from '@/lib/state';
import { StepProgress, CtaButton } from './InterventionRouter';

interface ValueDetail {
  emotion_name?: string;
  anchor_action?: string;
  why_this_works?: string;
  permission?: string;
  [key: string]: unknown;
}

const GROUNDING_STEPS = [
  { num: '5', label: '看见', desc: '环顾四周，说出 5 个你看到的东西' },
  { num: '4', label: '触摸', desc: '感受 4 个你可以摸到的东西（衣服、桌面、手机…）' },
  { num: '3', label: '听见', desc: '安静下来，听出 3 个声音' },
];

export function ValueAnchor({ detail }: { detail: ValueDetail }) {
  const d = detail || {};

  return (
    <div className="screen">
      <button className="back-btn" onClick={() => useApp().navigate('results')}>
        ←
      </button>
      <StepProgress />
      <div className="module-badge hand-font">价值锚点</div>
      <h1 style={{ marginBottom: 8 }}>
        {d.emotion_name || '你现在的感受'}
      </h1>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
        💡 给情绪一个名字，它就已经开始变轻了。
      </p>

      <p style={{ marginBottom: 0 }}>今天可以做的一件事：</p>
      <div className="anchor-action">{d.anchor_action || ''}</div>

      {d.why_this_works && (
        <div className="sketch-box">
          <p style={{ color: 'var(--ink)' }}>{d.why_this_works}</p>
        </div>
      )}

      <div className="sketch-box">
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
          🧘 快速落地：5-4-3 感官接地
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
          当脑子停不下来时，试着把注意力拉到当下：
        </p>
        {GROUNDING_STEPS.map((g) => (
          <div
            key={g.num}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              borderBottom: '2px dashed rgba(62,54,64,0.06)',
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'var(--mac-mint-lt)',
                border: '2px solid var(--ink)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              {g.num}
            </div>
            <div>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{g.label}</span>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>
                {' '}
                — {g.desc}
              </span>
            </div>
          </div>
        ))}
      </div>

      {d.permission && (
        <div className="permission-text">&quot;{d.permission}&quot;</div>
      )}

      <div style={{ height: 80 }} />
      <CtaButton />
    </div>
  );
}
