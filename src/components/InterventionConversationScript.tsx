'use client';

import { useApp } from '@/lib/state';
import { StepProgress, CtaButton } from './InterventionRouter';

interface ScriptExample {
  type: string;
  content: string;
  text?: string;
}

interface ConversationDetail {
  goal?: string;
  script_examples?: ScriptExample[];
  channel_advice?: string;
  [key: string]: unknown;
}

export function ConversationScript({ detail }: { detail: ConversationDetail }) {
  const examples = detail?.script_examples || [];
  const gentle = examples.find((e) => e.type === '温和版') || examples[0] || {};
  const direct = examples.find((e) => e.type === '直接版') || examples[1] || {};

  return (
    <div className="screen">
      <button className="back-btn" onClick={() => useApp().navigate('results')}>
        ←
      </button>
      <StepProgress />
      <div className="module-badge hand-font">对话脚本</div>
      <h1 style={{ marginBottom: 8 }}>先准备好怎么开口</h1>
      {detail?.goal && (
        <p style={{ fontSize: 15, color: 'var(--ink)', marginBottom: 12 }}>
          🎯 {detail.goal}
        </p>
      )}
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>
        💡 使用&quot;我感到…&quot;而不是&quot;你让我…&quot;，降低对方的防御感。
      </p>
      <div className="sketch-box" style={{ transform: 'rotate(0.2deg)' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--mac-green-dk)',
            marginBottom: 8,
          }}
        >
          🌸 温和版
        </div>
        <p style={{ color: 'var(--ink)', fontSize: 14 }}>
          {gentle.content || gentle.text || ''}
        </p>
      </div>
      <div className="sketch-box" style={{ transform: 'rotate(-0.3deg)' }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: 'var(--mac-green-dk)',
            marginBottom: 8,
          }}
        >
          ⚡ 直接版
        </div>
        <p style={{ color: 'var(--ink)', fontSize: 14 }}>
          {direct.content || direct.text || ''}
        </p>
      </div>
      {detail?.channel_advice && (
        <div className="sketch-box">
          <p style={{ color: 'var(--ink)' }}>💬 {detail.channel_advice}</p>
        </div>
      )}
      <div
        className="sketch-box"
        style={{
          background: 'var(--pop-coral-lt)',
          border: '2px dashed var(--ink)',
        }}
      >
        <p style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>
          ⏳ 小建议：如果对方没有立刻回复，给自己设&quot;48小时等待期&quot;再决定是否跟进。
        </p>
      </div>
      <div style={{ height: 80 }} />
      <CtaButton />
    </div>
  );
}
