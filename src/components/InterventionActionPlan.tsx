'use client';

import { useState, useCallback } from 'react';
import { useApp } from '@/lib/state';
import { StepProgress, CtaButton } from './InterventionRouter';

interface Step {
  title: string;
  description: string;
  duration_min: number;
}

interface ActionPlanDetail {
  goal_statement?: string;
  steps?: Step[];
  [key: string]: unknown;
}

export function ActionPlan({ detail }: { detail: ActionPlanDetail }) {
  const { state, handleModuleComplete } = useApp();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const steps = detail?.steps || [];
  const keyword = state.answers.Q2 || '这件事';
  const totalSteps = steps.length;

  const toggleStep = useCallback(
    (i: number) => {
      setCompletedSteps((prev) => {
        if (prev.includes(i)) {
          return prev.filter((x) => x !== i);
        } else {
          return [...prev, i].sort((a, b) => a - b);
        }
      });
    },
    []
  );

  const remaining = totalSteps - completedSteps.length;
  const allDone = remaining === 0;

  return (
    <div className="screen">
      <button className="back-btn" onClick={() => useApp().navigate('results')}>
        ←
      </button>
      <StepProgress />
      <div className="module-badge hand-font">行动计划</div>
      <h1 style={{ marginBottom: 20 }}>
        帮你把「{keyword}」拆成几步
      </h1>
      {detail?.goal_statement && (
        <p style={{ fontSize: 15, color: 'var(--ink)', marginBottom: 8 }}>
          {detail.goal_statement}
        </p>
      )}
      <p
        style={{
          fontSize: 12,
          color: 'var(--muted)',
          marginBottom: 16,
        }}
      >
        💡 每做完一小步，点一下它打勾 ✓
      </p>
      <div className="sketch-box" style={{ padding: '8px 16px' }}>
        {steps.map((s: Step, i: number) => {
          const isDone = completedSteps.includes(i);
          const isActive = !isDone && (completedSteps.length === 0 || completedSteps[completedSteps.length - 1] === i - 1 || completedSteps.includes(i - 1));
          return (
            <div
              key={i}
              className={`step-row ${isDone ? 'done-row' : ''}`}
              onClick={() => toggleStep(i)}
            >
              <div
                className={`step-num ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <div className="step-content">
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.description}</div>
                <span className="step-duration">
                  ⏱ {s.duration_min} 分钟
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="step-hint">
        {allDone
          ? '✅ 全部完成！'
          : `👆 还剩 ${remaining} 小步 — 点一下表示完成`}
      </div>
      <div style={{ height: 80 }} />
      {allDone ? (
        <button className="btn btn-primary btn-fixed hand-font" onClick={handleModuleComplete}>
          全部完成继续 →
        </button>
      ) : (
        <button
          className="btn btn-primary btn-fixed hand-font"
          style={{ opacity: 0.4, cursor: 'default' }}
        >
          全部完成继续 →
        </button>
      )}
    </div>
  );
}
