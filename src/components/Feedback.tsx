'use client';

import { useState } from 'react';
import { useApp } from '@/lib/state';

export function Feedback() {
  const { state, handleSaveFeedback } = useApp();
  const before = state.anxietyBefore;
  const [sliderVal, setSliderVal] = useState(5);
  const [rating, setRating] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const handleSave = () => {
    if (!rating) {
      setShowError(true);
      return;
    }
    handleSaveFeedback(sliderVal, rating);
  };

  const feedbackCopy =
    sliderVal < before
      ? '有一点变化，就已经很重要。'
      : '没关系，找到不适合的方法也是进展。';

  return (
    <div className="screen">
      <h1 className="hand-font" style={{ marginBottom: 8 }}>
        做完了，感觉怎么样？
      </h1>
      <p style={{ marginBottom: 28 }}>给现在的焦虑程度打个分。</p>

      <div className="sketch-box" style={{ transform: 'rotate(-0.2deg)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
          现在焦虑程度
        </div>
        <div className="score-display">{sliderVal}</div>
        <div className="slider-wrap">
          <input
            type="range"
            min="0"
            max="10"
            value={sliderVal}
            onChange={(e) => setSliderVal(parseInt(e.target.value))}
          />
          <div className="slider-labels">
            <span>0 完全不焦虑</span>
            <span>10 极度焦虑</span>
          </div>
        </div>
        <div className="score-compare">
          <span className="score-before">{before}</span>
          <span className="score-arrow">→</span>
          <span className="score-after">{sliderVal}</span>
        </div>
        <div className="feedback-copy">{feedbackCopy}</div>
      </div>

      <div className="sketch-box" style={{ transform: 'rotate(0.2deg)' }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
          这次有帮助吗？
        </div>
        <div className={`radio-group ${showError ? 'error' : ''}`}>
          {['有帮助', '一般', '没什么帮助'].map((opt) => (
            <button
              key={opt}
              className={`radio-opt ${rating === opt ? 'selected' : ''}`}
              onClick={() => {
                setRating(opt);
                setShowError(false);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        {showError && (
          <div className="error-msg" style={{ display: 'block' }}>
            请选择一个选项
          </div>
        )}
      </div>

      <div style={{ height: 80 }} />
      <button className="btn btn-primary btn-fixed hand-font" onClick={handleSave}>
        保存并返回主页
      </button>
    </div>
  );
}
