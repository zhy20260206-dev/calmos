'use client';

import { useApp } from '@/lib/state';
import { StepProgress, CtaButton } from './InterventionRouter';

interface FactVsInterpretation {
  fact?: string;
  interpretation?: string;
}

interface CognitiveDetail {
  original_thought?: string;
  distortion_pattern?: string;
  fact_situation?: string;
  distorted_interpretation?: string;
  fact_vs_interpretation?: FactVsInterpretation;
  reframed_thought?: string;
  self_compassion_perspective?: string;
  self_compassion_action?: string;
  [key: string]: unknown;
}

export function CognitiveReframe({ detail }: { detail: CognitiveDetail }) {
  const d = detail || {};
  const original = d.original_thought || '';
  const pattern = d.distortion_pattern || '';

  let factText = d.fact_situation || '';
  let twistText = d.distorted_interpretation || '';
  if (!factText && d.fact_vs_interpretation) {
    factText = d.fact_vs_interpretation.fact || '';
    twistText = d.fact_vs_interpretation.interpretation || '';
  }

  const reframed = d.reframed_thought || '';
  const compassionText =
    d.self_compassion_perspective || d.self_compassion_action || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(compassionText);
  };

  return (
    <div className="screen">
      <button className="back-btn" onClick={() => useApp().navigate('results')}>
        ←
      </button>
      <StepProgress />
      <div className="module-badge hand-font">认知重构</div>
      <h1 style={{ marginBottom: 8 }}>把这个想法拆开看看</h1>
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
        大脑有时会自动给事实&quot;加料&quot;。拆开来看，你会发现真相没那么可怕。
      </p>

      {original && (
        <div className="original-thought">
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: 'var(--muted)',
              marginBottom: 4,
            }}
          >
            💭 你可能在这样想
          </div>
          {original}
        </div>
      )}

      {pattern && (
        <div style={{ marginBottom: 16 }}>
          <div className="cog-label">🧠 这是一种常见的思维模式</div>
          <div className="distortion-tag">{pattern}</div>
        </div>
      )}

      <div className="cog-compare">
        <div className="cog-compare-box fact">
          <div className="cog-compare-label" style={{ color: '#1a4a2e' }}>
            ✅ 事实
          </div>
          {factText || '（分析中）'}
        </div>
        <div className="cog-compare-box twist">
          <div className="cog-compare-label" style={{ color: '#c0392b' }}>
            🎭 大脑加的戏
          </div>
          {twistText || '（分析中）'}
        </div>
      </div>

      {reframed && (
        <div className="reframe-box">
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: 'var(--mac-green-dk)',
              marginBottom: 4,
            }}
          >
            💡 更接近真相的说法
          </div>
          {reframed}
        </div>
      )}

      {compassionText && (
        <div className="compassion-box">
          <div className="compassion-label">
            💬 如果是好朋友经历这件事，你会对ta说
          </div>
          <p
            style={{
              fontSize: 15,
              color: 'var(--ink)',
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            {compassionText}
          </p>
          <button className="btn btn-ghost copy-btn" onClick={handleCopy}>
            📋 复制这句话
          </button>
        </div>
      )}

      <div style={{ height: 80 }} />
      <CtaButton />
    </div>
  );
}
