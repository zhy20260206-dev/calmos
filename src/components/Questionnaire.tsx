'use client';

import { useApp } from '@/lib/state';
import {
  getQuestionSequence,
  QUESTIONS,
  Q_EMOJIS,
  OPT_EMOJIS,
  OPT_COLORS,
} from '@/lib/constants';

export function Questionnaire() {
  const { state, handleQuestionAnswer, handleBackFromQuestionnaire } = useApp();
  const { answers, currentQ } = state;

  const seq = getQuestionSequence(answers);
  const qId = 'Q' + currentQ;
  const qIndex = seq.indexOf(qId);
  const qDef = QUESTIONS.find((q) => q.id === qId);
  if (!qDef) return null;

  const total = seq.length;
  const pct = Math.round((qIndex / total) * 100);
  const opts = qDef.options(answers);
  const currentVal = answers[qId] || '';
  const qEmoji = Q_EMOJIS[qId] || '✏️';
  const optEmojis = OPT_EMOJIS[qId] || [];

  return (
    <div className="screen">
      <button className="back-btn" onClick={handleBackFromQuestionnaire}>
        ←
      </button>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: pct + '%' }} />
      </div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--muted)',
          marginBottom: 16,
          fontWeight: 700,
        }}
      >
        {qIndex + 1} / {total}
      </div>
      <div className="q-header">
        <div className="q-emoji">{qEmoji}</div>
        <h2 style={{ marginBottom: 0 }}>{qDef.text(answers)}</h2>
      </div>
      <div>
        {opts.map((o, i) => {
          const isSel = o === currentVal;
          const oe = optEmojis[i] || '';
          const colorCls = OPT_COLORS[i % OPT_COLORS.length];
          return (
            <button
              key={i}
              className={`option-btn ${colorCls} ${isSel ? 'selected' : ''}`}
              onClick={() => handleQuestionAnswer(qId, o)}
            >
              <span className="option-emoji">{oe}</span>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
