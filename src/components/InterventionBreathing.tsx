'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useApp } from '@/lib/state';
import { StepProgress } from './InterventionRouter';

const PHASES = [
  { label: '吸气', duration: 4, scale: '1.3' },
  { label: '屏住', duration: 7, scale: '1.3' },
  { label: '呼气', duration: 8, scale: '1' },
];

export function Breathing() {
  const { handleModuleComplete } = useApp();
  const [phaseLabel, setPhaseLabel] = useState(PHASES[0].label);
  const [scale, setScale] = useState(PHASES[0].scale);
  const [cycleCount, setCycleCount] = useState(0);
  const elapsedRef = useRef(0);
  const phaseIdxRef = useRef(0);

  const tick = useCallback(() => {
    elapsedRef.current++;
    const phase = PHASES[phaseIdxRef.current];
    if (elapsedRef.current >= phase.duration) {
      elapsedRef.current = 0;
      phaseIdxRef.current++;
      if (phaseIdxRef.current >= PHASES.length) {
        phaseIdxRef.current = 0;
        setCycleCount((prev) => {
          const next = prev + 1;
          if (next >= 3) {
            setTimeout(() => handleModuleComplete(), 50);
          }
          return next;
        });
      }
      const newPhase = PHASES[phaseIdxRef.current];
      setPhaseLabel(newPhase.label);
      setScale(newPhase.scale);
    }
  }, [handleModuleComplete]);

  useEffect(() => {
    if (cycleCount >= 3) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick, cycleCount]);

  return (
    <div className="screen" style={{ justifyContent: 'center' }}>
      <div className="breathing-screen">
        <button
          className="back-btn"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => useApp().navigate('results')}
        >
          ←
        </button>
        <StepProgress />
        <div style={{ textAlign: 'center' }}>
          <h2 className="hand-font">呼吸稳定</h2>
          <p>跟着节奏，完成 3 次循环</p>
        </div>
        <div
          className="breath-big-circle hand-font"
          style={{ transform: `scale(${scale})` }}
        >
          {phaseLabel}
        </div>
        <div className="breath-counter">
          第 {Math.min(cycleCount + 1, 3)} / 3 次
        </div>
      </div>
    </div>
  );
}
