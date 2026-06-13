'use client';

import { useApp } from '@/lib/state';
import { ActionPlan } from './InterventionActionPlan';
import { Breathing } from './InterventionBreathing';
import { UncertaintyManagement } from './InterventionUncertainty';
import { ConversationScript } from './InterventionConversationScript';
import { CognitiveReframe } from './InterventionCognitiveReframe';
import { ValueAnchor } from './InterventionValueAnchor';

export function InterventionRouter() {
  const { state } = useApp();
  const { type, detail } = state.activeModule || { type: '', detail: {} };

  switch (type) {
    case 'action_plan':
      return <ActionPlan detail={detail} />;
    case 'breathing':
      return <Breathing />;
    case 'uncertainty_management':
      return <UncertaintyManagement detail={detail} />;
    case 'conversation_script':
      return <ConversationScript detail={detail} />;
    case 'cognitive_reframe':
      return <CognitiveReframe detail={detail} />;
    case 'value_anchor':
      return <ValueAnchor detail={detail} />;
    default:
      return (
        <div className="screen">
          <p>未知模块</p>
        </div>
      );
  }
}

export function StepProgress() {
  const { state } = useApp();
  const cur = Math.max(state.currentModuleIdx, 1);
  const tot = state.totalModules;
  const pct = Math.round((cur / tot) * 100);
  const nextLabel =
    state.pendingModules.length > 0 ? '完成后进入下一步 →' : '完成后看效果';

  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          fontWeight: 700,
          color: 'var(--muted)',
          marginBottom: 6,
        }}
      >
        <span>
          步骤 {cur} / {tot}
        </span>
        <span>{nextLabel}</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}

export function CtaButton() {
  const { state, handleModuleComplete } = useApp();
  const label =
    state.pendingModules.length > 0 ? '继续下一步 →' : '完成 ✓';

  return (
    <button
      className="btn btn-primary btn-fixed hand-font"
      id="moduleCta"
      onClick={handleModuleComplete}
    >
      {label}
    </button>
  );
}
