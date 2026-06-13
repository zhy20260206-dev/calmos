// Questions, options, emojis, and module names for CalmOS

export const MODULE_NAMES: Record<string, string> = {
  action_plan: '行动计划',
  uncertainty_management: '不确定性管理',
  conversation_script: '对话脚本',
  cognitive_reframe: '认知重构',
  value_anchor: '价值锚点',
  breathing: '呼吸稳定',
};

export const EMOJIS = [
  '🐱', '🐻', '🦊', '🐸', '🌸', '🌙', '⭐', '🍀', '🦋',
  '🌺', '🐨', '🦁', '🐼', '🦄', '🌻', '🍁', '🌈', '🐧', '🦉', '🎀',
];

export const Q_EMOJIS: Record<string, string> = {
  Q1: '🧭', Q2: '📌', Q3: '📊', Q4: '🎯', Q5: '🤝',
  Q6: '💗', Q7: '⏰', Q8: '💡', Q9: '📅',
};

export const OPT_EMOJIS: Record<string, string[]> = {
  Q1: ['📋', '⏳', '💬', '🔍', '🌫️'],
  Q2: ['💼', '📝', '🏠', '💚', '📦', '🏥', '📧', '🎨'],
  Q3: ['💚', '💛', '🟠', '🔴'],
  Q4: ['🤷', '🧠', '🚧', '😰'],
  Q5: ['🔒', '💬', '🤗'],
  Q6: ['💓', '🤕', '🧠', '😔', '🌫️'],
  Q7: ['🔙', '📍', '🔜', '🔄'],
  Q8: ['🧘', '🗺️', '🏃', '🤗'],
  Q9: ['🌤️', '📆', '🗓️', '⏳'],
};

export const OPT_COLORS = [
  'option-color-1', 'option-color-2', 'option-color-3',
  'option-color-4', 'option-color-5',
];

export const Q2_OPTIONS: Record<string, string[]> = {
  '有件事要做': [
    '工作汇报 / 项目 / 截止日期', '考试 / 论文 / 学习任务',
    '生活事务（搬家 / 手续 / 账单）', '健康相关（运动 / 饮食 / 看病预约）',
    '一直想做但拖着没做的事',
  ],
  '在等一个结果或回复': [
    '面试 / 录取 / 晋升结果', '考试 / 竞赛成绩',
    '健康检查 / 病理报告', '某个人的回复或态度',
    '审批 / 贷款 / 签证 / 合同',
  ],
  '跟某个人或某段关系有关': [
    '伴侣或暧昧对象', '父母或长辈', '好友 / 闺蜜 / 兄弟',
    '领导 / 同事 / 合伙人', '前任 / 断联的人',
  ],
  '对自己某件事感到后悔或不满': [
    '说了某句话，事后很后悔', '错过了一个机会，感觉很可惜',
    '做了一个无法挽回的决定', '觉得自己一直没有进步',
    '总是拿自己和别人比较',
  ],
};

export const Q4_OPTIONS: Record<string, string[]> = {
  '有件事要做': [
    '完全没思路，不知道从哪下手', '有思路，但一直没动手',
    '已经开始了，但卡在中间推不下去', '快做完了，但很担心结果不够好',
  ],
  '在等一个结果或回复': [
    '反复预想最坏的结果，脑子停不下来', '觉得自己对结果毫无掌控，很无力',
    '不知道还要等多久，时间感很差', '怕结果出来后不知道怎么面对',
  ],
  '跟某个人或某段关系有关': [
    '有话想说，但不知道怎么开口', '关系出现了裂痕，不知道能不能修复',
    '对方的态度或行为让我看不懂', '我可能做了什么让对方不舒服',
  ],
  '对自己某件事感到后悔或不满': [
    '脑子里反复回放，但知道已经改不了了', '觉得自己真的很差，不只是这一次',
    '想去弥补或修正，但不知道怎么做', '怕别人知道，或者担心已经影响了别人对我的看法',
  ],
};

export const Q4_TEXTS: Record<string, string> = {
  '有件事要做': '这件事现在卡在哪里？',
  '在等一个结果或回复': '等待过程中，你最难受的是？',
  '跟某个人或某段关系有关': '这段关系让你焦虑的，主要是？',
  '对自己某件事感到后悔或不满': '关于这件事，你现在最卡的是？',
};

export const Q6_OPTIONS = [
  '心跳加速、胸闷、呼吸急促',
  '头痛、胃痛、肌肉紧绷或发抖',
  '思绪停不下来，反复想同一件事',
  '疲惫无力，什么都不想干',
  '说不清的难受，就是浑身不对劲',
];

export interface QuestionDef {
  id: string;
  text: (answers: Record<string, string>) => string;
  options: (answers: Record<string, string>) => string[];
  skip: (answers: Record<string, string>) => boolean;
  type: string;
}

export const QUESTIONS: QuestionDef[] = [
  {
    id: 'Q1',
    text: () => '现在让你焦虑的，主要是哪类事？',
    options: () => ['有件事要做', '在等一个结果或回复', '跟某个人或某段关系有关', '对自己某件事感到后悔或不满', '说不清楚，就是感觉不太对'],
    skip: () => false,
    type: 'choice',
  },
  {
    id: 'Q2',
    text: () => '这件事主要是关于？',
    options: (a) => Q2_OPTIONS[a.Q1] || [],
    skip: (a) => a.Q1 === '说不清楚，就是感觉不太对',
    type: 'choice',
  },
  {
    id: 'Q3',
    text: () => '这件事对你最近的影响有多大？',
    options: () => ['有一点影响，但还能正常做事', '有些影响，有时会分神', '影响比较大，经常难以集中注意力', '影响非常大，几乎做不了其他事'],
    skip: () => false,
    type: 'choice',
  },
  {
    id: 'Q4',
    text: (a) => Q4_TEXTS[a.Q1] || '这件事现在卡在哪里？',
    options: (a) => Q4_OPTIONS[a.Q1] || [],
    skip: (a) => a.Q1 === '说不清楚，就是感觉不太对',
    type: 'choice',
  },
  {
    id: 'Q5',
    text: () => '关于这件事，你目前是？',
    options: () => ['没有跟任何人说过', '说了，但感觉没有得到真正帮助', '身边有人支持，但问题本身还在'],
    skip: () => false,
    type: 'choice',
  },
  {
    id: 'Q6',
    text: () => '焦虑的时候，你的状态更接近哪一种？',
    options: () => Q6_OPTIONS,
    skip: () => false,
    type: 'choice',
  },
  {
    id: 'Q7',
    text: () => '你的思绪主要集中在？',
    options: () => ['过去：反复回放已经发生的事', '现在：眼前一堆事乱成一团', '未来：一直预想还没发生的事', '在过去/现在/未来之间来回跳'],
    skip: () => false,
    type: 'choice',
  },
  {
    id: 'Q8',
    text: () => '现在的你更需要哪种帮助？',
    options: () => ['先让身体和情绪平静下来', '理清楚这件事，找到下一步怎么办', '直接开始行动，打破现在的卡住状态', '有人陪着，不想一个人扛'],
    skip: () => false,
    type: 'choice',
  },
  {
    id: 'Q9',
    text: () => '这件事困扰你多久了？',
    options: () => ['今天才有这种感觉', '最近几天', '已经好几周了', '很长一段时间了，记不清从什么时候开始'],
    skip: () => false,
    type: 'choice',
  },
];

export const ANALYSIS_MSGS = [
  '正在理解你的情况…',
  '识别焦虑来源…',
  '匹配缓解方式…',
  '生成你的专属分析…',
];

export const MINI_BLOBS = [
  { emoji: '💭', color: 'var(--mac-yellow)', x: '15%', y: '25%', d: '3.2s' },
  { emoji: '🔍', color: 'var(--mac-blue)', x: '78%', y: '20%', d: '3.8s' },
  { emoji: '✨', color: 'var(--pop-lavender)', x: '82%', y: '62%', d: '2.9s' },
  { emoji: '💡', color: 'var(--pop-coral)', x: '12%', y: '65%', d: '3.5s' },
  { emoji: '🧠', color: 'var(--mac-green)', x: '50%', y: '78%', d: '4.0s' },
];

export const BLOB_EMOJIS = ['💫', '🌟', '🎯', '💝'];

export function getQuestionSequence(answers: Record<string, string>): string[] {
  return QUESTIONS.filter((q) => !q.skip(answers)).map((q) => q.id);
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return '早上好';
  if (h >= 12 && h < 18) return '下午好';
  return '晚上好';
}

export function buildUserMessage(answers: Record<string, string>): string {
  const lines: string[] = [];
  const labelMap: Record<string, string> = {
    Q1: '焦虑类型', Q2: '具体情境', Q3: '影响程度', Q4: '路径深挖',
    Q5: '社交支持', Q6: '身体情绪信号', Q7: '思维方向', Q8: '此刻需要', Q9: '持续时间',
  };
  for (const [k, label] of Object.entries(labelMap)) {
    if (answers[k] != null) lines.push(label + '：' + answers[k]);
  }
  return '用户问卷答案：\n' + lines.join('\n');
}
