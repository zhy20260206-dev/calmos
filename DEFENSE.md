# CalmOS · 项目答辩文档

> 焦虑缓解器 — 从想法到上线 × 从0到1的完整复盘

---

## 一、项目概况

### 一句话介绍

**CalmOS** 是一款基于 AI 的轻量级焦虑缓解工具，通过 9 道问卷诊断焦虑来源，结合认知行为疗法（CBT）循证方案，由 DeepSeek 大模型生成个性化干预方案。

### 核心数据

| 维度 | 数据 |
|------|------|
| 技术栈 | HTML/CSS/JS + Supabase Edge Functions + DeepSeek API |
| 代码量 | 单文件前端 ~1000 行 + API ~250 行 |
| 部署方式 | GitHub Pages + Supabase Edge Functions（双端免费） |
| 国内访问 | ✅ 是（绕开 GFW，不依赖被墙域名） |
| 支持平台 | 移动端优先（480px 设计宽度），桌面端兼容 |
| 总花费 | ¥0（DeepSeek API 按量计费，千次调用约 ¥1-2） |

---

## 二、项目出发点：为什么做这个？

### 问题分析

| 痛点 | 描述 |
|------|------|
| **焦虑普遍化** | 快节奏生活下，决策困难/等待结果/人际紧张/自我怀疑等日常焦虑广泛存在 |
| **专业资源稀缺** | 心理咨询预约周期长（1-4周）、费用高（¥300-800/次）、有羞耻感 |
| **现有工具缺乏个性化** | 冥想 App 统一推送内容，不针对具体焦虑场景；AI Chatbot 缺乏结构化干预 |
| **国内特殊挑战** | Vercel/Netlify 等主流部署平台域名被 GFW 拦截，海外服务在国内不稳定 |

### 目标用户画像

- 20-35 岁，有日常焦虑但未达到临床诊断标准
- 希望获得即时、私密、低门槛的心理支持
- 对 AI 有基本信任，愿意尝试结构化自助工具

### 理论依据

认知行为疗法（CBT）是循证心理干预的黄金标准。项目将 CBT 的核心技术具象化为 6 个交互模块：

| CBT 技术 | 对应模块 |
|----------|---------|
| 行为激活 | `action_plan` — 拆解任务，降低启动门槛 |
| 腹式呼吸 | `breathing` — 4-7-8 呼吸法，生理降焦虑 |
| 不确定性容忍 | `uncertainty_management` — 三场景分析 |
| 人际效能 | `conversation_script` — 对话脚本 |
| 认知重构 | `cognitive_reframe` — 事实 vs 加戏 |
| 价值导向 | `value_anchor` — 情绪命名 + 感官接地 |

---

## 三、技术架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              index.html (单文件 SPA)                     │  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────────┐   │  │
│  │  │入场页│→│问卷页│→│分析页│→│结果页│→│干预模块页│   │  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────────┘   │  │
│  │                                      ↓                 │  │
│  │                              ┌──────────┐              │  │
│  │                              │  反馈页   │              │  │
│  │                              └──────────┘              │  │
│  └───────────────────────────────────────────────────────┘  │
│         │                          │                         │
└─────────┼──────────────────────────┼─────────────────────────┘
          │                          │
          ▼                          ▼
┌──────────────────┐    ┌─────────────────────────┐
│   GitHub Pages    │    │  Supabase Edge Function  │
│  (静态托管)       │    │  analyze/index.ts        │
│  github.io 域名   │    │  (Deno 运行时)           │
└──────────────────┘    └───────────┬─────────────┘
                                    │
                                    ▼
                         ┌──────────────────┐
                         │  DeepSeek API     │
                         │  deepseek-chat    │
                         └──────────────────┘
                                    │
                                    ▼
                         ┌──────────────────┐
                         │  Supabase DB      │
                         │  calmos_sessions  │
                         │  (用户数据存储)    │
                         └──────────────────┘
```

### 为什么是单文件 SPA？

- **零构建工具链**：不需要 Webpack/Vite/React，避免了 node_modules 依赖地狱
- **首屏加速**：单次 HTTP 请求加载全部资源（~67KB gzip）
- **离线韧性**：localStorage 本地存储不依赖网络
- **维护简单**：一个文件包含完整应用逻辑，改动即生效

### 为什么选 DeepSeek？

| 对比维度 | DeepSeek | OpenAI (GPT-4) | 国内大模型 |
|----------|----------|----------------|-----------|
| 中文能力 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| API 价格 | ¥1/百万 token | ¥45/百万 token | ¥2-10/百万 token |
| 国内访问 | ✅ 直连 | ❌ 需代理 | ✅ 直连 |
| JSON 格式遵循 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 医疗/心理安全性 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 四、问卷设计：从心理学到工程

### 设计原则

1. **最少题目**：9 题收敛到足够做出精准推荐，不过度打扰
2. **分支逻辑**：Q1 选择决定 Q2 选项组和 Q4 深挖方向，"说不清楚"路径跳过 Q2/Q4
3. **给情绪一个名字**：每道题帮助用户具象化模糊的焦虑感
4. **降低防御**：用 emoji 图标 + 彩色边框替代生硬选项编号

### 5 条分支路径 × 4 种需要的 20 种模块匹配表

```
Q1 焦虑类型                    Q8 需要什么帮助              推荐模块组合
──────────────────────────────────────────────────────────────────────
有件事要做         ─┬──────→  先平静       → breathing + action_plan
                    ├──────→  理清楚       → action_plan + cognitive_reframe
                    ├──────→  直接行动     → action_plan + cognitive_reframe
                    └──────→  有人陪       → action_plan + conversation_script

在等结果           ─┬──────→  先平静       → breathing + uncertainty_management
                    ├──────→  理清楚       → uncertainty_management + cognitive_reframe
                    ├──────→  直接行动     → uncertainty_management + action_plan
                    └──────→  有人陪       → uncertainty_management + conversation_script

人际关系           ─┬──────→  先平静       → breathing + conversation_script
                    ├──────→  理清楚       → cognitive_reframe + conversation_script
                    ├──────→  直接行动     → conversation_script + cognitive_reframe
                    └──────→  有人陪       → conversation_script + value_anchor

对自己后悔         ─┬──────→  先平静       → breathing + value_anchor
                    ├──────→  理清楚       → cognitive_reframe + value_anchor
                    ├──────→  直接行动     → value_anchor + action_plan
                    └──────→  有人陪       → cognitive_reframe + conversation_script

说不清楚           ─┬──────→  先平静       → breathing + value_anchor
                    ├──────→  理清楚       → value_anchor + cognitive_reframe
                    ├──────→  直接行动     → value_anchor + action_plan
                    └──────→  有人陪       → value_anchor + conversation_script
```

### Prompt Engineering 策略

**核心策略**：用系统提示词中的**确定性格子（Lookup Table）**替代模型自由推理，确保推荐的可预测性和安全性。

```
传统做法：请根据用户问卷，推荐合适的干预模块
  ↓ 问题：模型可能给出不存在的模块或随机推荐

本项目的做法：
  将 5×4=20 种组合的匹配表写死在 System Prompt 中，
  要求模型严格查表选择，只允许从 6 个预定义模块中选取。
  模块的输出格式（JSON schema）也写死在 Prompt 中。
```

---

## 五、6 个干预模块详解

### 模块 1：行动计划（action_plan）
- **对应 CBT 技术**：行为激活（Behavioral Activation）
- **核心机制**：把模糊的大任务拆成 3-4 个"5分钟就能完成"的小步骤
- **交互亮点**：每个步骤可点击打勾 ✅，全部完成后激活 CTA 按钮
- **心理学依据**：启动是克服拖延的第一障碍，极其简单的第一步（如"打开文档"）打破惯性

### 模块 2：呼吸稳定（breathing）
- **对应 CBT 技术**：生理调节
- **核心机制**：4-7-8 呼吸法（吸4秒→屏7秒→呼8秒）× 3 循环
- **交互亮点**：圆形 blob 随呼气/吸气缩放，完成后自动跳转下一步
- **心理学依据**：激活副交感神经系统，打断焦虑的生理循环

### 模块 3：不确定性管理（uncertainty_management）
- **对应 CBT 技术**：暴露与反应预防
- **核心机制**：三场景最佳/中等/最坏横向滑动卡片 + 等待期具体行动建议
- **交互亮点**：可横滑浏览不同场景，信息接触限制建议（如"每天只看一次相关信息"）
- **心理学依据**："命名即掌控"，把模糊的未知变成有边界的三段式预期

### 模块 4：对话脚本（conversation_script）
- **对应 CBT 技术**：人际效能训练
- **核心机制**：温和版 vs 直接版双话术 + 48小时等待窗口建议
- **交互亮点**：两种开场话术供选择，提示用"I feel"而非"你让我"
- **心理学依据**：脚本化降低开口的心理障碍，48小时窗口防止关系焦虑驱动的反复刷新

### 模块 5：认知重构（cognitive_reframe）
- **对应 CBT 技术**：认知重构（三栏表）
- **核心机制**：事实 vs 大脑加戏的对比 → 识别思维扭曲模式 → 重构替代想法 → 好友视角
- **交互亮点**：并排对比卡片（绿色事实 / 红色加戏）+ 可复制给"好朋友说的话"
- **心理学依据**：三栏表法是 CBT 最经典的工具，外化负面自动化思维

### 模块 6：价值锚点（value_anchor）
- **对应 CBT 技术**：价值澄清 + 接纳与承诺疗法（ACT）
- **核心机制**：情绪命名 → 锚点行动 → 5-4-3 感官接地 → 许可语句
- **交互亮点**：大字号情绪命名 + 可数数的接地练习
- **心理学依据**：ACT 认为不是消除负面情绪，而是带着情绪做有价值的事

---

## 六、部署方案：解决国内访问问题

### 问题：vercel.app 被 GFW 拦截

Vercel 是全球最流行的前端部署平台之一，但其默认域名 `*.vercel.app` 被 GFW DNS 污染，国内用户无法访问。

### 方案对比

| 方案 | 费用 | 国内访问 | 搭建难度 | 维护成本 |
|------|------|---------|---------|---------|
| 买域名 + ICP 备案 | ¥50-100/年 + 2-3周等待 | ✅ 完美 | 复杂 | 需要年审 |
| 国内云服务器（阿里云/腾讯云） | ¥50-500/月 | ✅ 完美 | 复杂 | 需要运维 |
| **GitHub Pages + Supabase Edge Functions** | **¥0** | **✅ 通常可访问** | **简单** | **最低** |

### 最终方案：GitHub Pages + Supabase

```
国内用户
    │
    ▼
zhy20260206-dev.github.io/calmos/   ← GitHub Pages（github.io 未被墙）
    │
    │  fetch()
    ▼
rjxbcxcnjnwplroytnan.supabase.co/functions/v1/analyze  ← Supabase Edge Function
    │
    │  fetch()
    ▼
api.deepseek.com/chat/completions   ← DeepSeek API（国内直连）
```

### 环境自适应的 API 路由

```javascript
// 前端自动选择正确的 API 地址
const API_BASE = (function() {
  if (location.hostname === 'localhost') {
    return '/api/analyze';    // 本地开发：Node server 代理
  }
  return 'https://xxx.supabase.co/functions/v1/analyze'; // 线上：Supabase
})();
```

---

## 七、数据持久化方案

### 双写策略：localStorage ⊕ Supabase

```
用户提交反馈
    │
    ├──→ localStorage.setItem('calmos_sessions', ...)  ← 同步写入，即时渲染
    │
    └──→ _supabase.from('calmos_sessions').insert(...) ← 异步写入，后台同步
               │
               ▼
         失败？ → console.warn()，不影响用户体验
```

### 为什么双写？

| 场景 | localStorage | Supabase |
|------|-------------|----------|
| 首次加载速度 | ⭐⭐⭐⭐⭐ 即时渲染 | ⭐⭐ 需要等待网络 |
| 离线使用 | ✅ 完全可用 | ❌ 不可用 |
| 跨设备同步 | ❌ 仅本设备 | ✅ 云端同步 |
| 数据可靠性 | ⚠️ 清除缓存即丢失 | ✅ 持久存储 |

### Supabase SDK 容灾

```javascript
// 双 CDN 加载：jsdelivr → unpkg 自动降级
script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/...';
script.onerror = function() {
  // 备选 CDN，国内部分地区可访问
  script2.src = 'https://unpkg.com/@supabase/supabase-js@2/...';
};
// 8 秒超时：如果 SDK 一直没加载好，用 localStorage 降级运行
setTimeout(() => { if (!_supabase) console.warn('Using localStorage only'); }, 8000);
```

---

## 八、设计语言

### 视觉理念：手绘涂鸦 × 马卡龙

- **告别"白大褂"感**：不选择严肃/医学风格，用糖果色 + 歪斜卡片传递温暖和安全
- **降低心理防御**：手绘感（微旋转、实色阴影）比完美对齐的 Material Design 更接近"朋友聊天"
- **色彩心理学**：

| 颜色 | 色值 | 语义 |
|------|------|------|
| 奶油黄 | `#FFEAA7` | 温暖、希望 |
| 薄荷绿 | `#A8E6CF` | 平静、恢复 |
| 天蓝 | `#A8D8EA` | 信任、清晰 |
| 珊瑚 | `#FFB4A2` | 跳色、能量 |
| 淡紫 | `#C5B4E3` | 温柔、接纳 |

### 交互设计原则

1. **一次只做一件事**：每个屏幕只有一个核心操作
2. **不给用户太多选择**：4-5 个选项（符合 Hick's Law）
3. **每一步都有进度条**：给出掌控感
4. **所有操作可撤销**：返回按钮无处不在
5. **文案像朋友说话**：用"我们"而非"建议您"

---

## 九、遇到的挑战与解决方案

### 挑战 1：AI 输出格式不可控

**问题**：DeepSeek 偶尔输出非标准 JSON（多余字段、markdown 包裹、字段缺失）

**解决**：
- 将完整 JSON Schema 写死在 System Prompt
- 要求 `response_format: { type: "json_object" }` 强制 JSON 模式
- **双重验证**：API 返回后检查 6 个必填字段 + `module_details` 数组长度
- 验证失败返回 502 并 prompt 用户重试（而非崩溃）

### 挑战 2：vercel.app 域名被墙

**问题**：项目最初部署在 Vercel，国内用户无法访问

**解决**：
- 将前端迁移到 GitHub Pages（`github.io` 未被墙）
- 将 API 迁移到 Supabase Edge Functions（`supabase.co` 可访问）
- 前端自动检测环境选择正确的 API 端点
- **零成本**：两个平台都提供慷慨的免费额度

### 挑战 3：Supabase CLI 认证问题

**问题**：Supabase CLI 需要浏览器交互登录，服务器环境无法完成

**解决**：
- Edge Function 部署用 MCP 工具（已预认证）
- Secret 设置指导用户在 Dashboard 手动完成
- Fallback：本地可用 `npx supabase secrets set`（需要先 `supabase login`）

### 挑战 4：单文件应用的状态管理

**问题**：994 行纯 JS，无框架，状态管理容易混乱

**解决**：
- 全局 `state` 对象集中管理所有状态
- `navigate(screen, patch)` 统一控制页面跳转和状态更新
- `render()` 函数作为单入口渲染调度器
- 每个页面有独立的 `render*()` + `attach*()` 对

### 挑战 5：GitHub 认证安全

**问题**：推送代码需要 Personal Access Token，但 Token 不能留在历史记录中

**解决**：
- Token 通过 URL 嵌入仅用于单次 push
- push 完成后立即执行 `git remote set-url origin` 移除 Token
- 提醒用户去 GitHub Settings 删除 Token
- `.env.local` 通过 `.gitignore` 排除提交（`env*` 通配）

---

## 十、完整工作流程

```
用户首次访问
    │
    ▼
[入场弹窗] 选 Emoji 头像 + 输昵称（2-8字）
    │  localStorage 记住 → 再次访问跳过
    ▼
[主页] 问候语 + 历史记录 + 焦虑↓数据
    │  点击 "开始分析"
    ▼
[9题问卷] ← Q1 决定路径
    │      ← Q1="说不清楚" 跳过 Q2/Q4
    │      ← 每题有彩色左边框 + emoji 前缀
    ▼
[分析过渡页] 中心 blob 变形动画 + 5 漂浮 mini blob
    │        + 打字机效果文案 + 跳动圆点
    │        异步调用 Supabase Edge Function → DeepSeek
    ▼
[结果页] 焦虑根因标签 + 解读摘要 + 3 证据标签
    │    + 2 张模块推荐卡（第1步/第2步）
    │    点击任一模块开始
    ▼
[干预模块1] ──→ [干预模块2]    ← 步骤进度条 1/2 → 2/2
    │              │
    ├ action_plan  ├ breathing
    ├ cognitive    ├ uncertainty
    ├ conversation ├ value_anchor
    └ ...          └ ...
    │              │
    ▼              ▼
[反馈页] 焦虑评分（前后对比 7→4）+ 帮助程度（3选1）
    │
    ▼
[主页] ← 数据已保存，历史记录刷新
    ├ localStorage：即时渲染
    └ Supabase：异步同步（标注 ☁️ / 💻）
```

---

## 十一、安全与伦理

### 安全措施

| 措施 | 实现 |
|------|------|
| API Key 零暴露 | 存储在 Supabase Secrets / Vercel 环境变量，前端代码中无任何密钥 |
| 数据隔离 | 用户数据通过 `user_id` 区分（基于昵称），RLS 策略保护 |
| XSS 防护 | 纯 Vanilla JS 渲染，不使用 `innerHTML` 插入用户输入内容 |
| 自杀风险筛查 | 所有非标准高风险回答提示真人支持热线（400-161-9995） |

### 伦理边界

- ⚠️ **不是医疗产品**：明确不替代专业心理咨询/医疗诊断
- ⚠️ **不存储敏感信息**：不收集姓名、手机号、身份证等 PII
- ⚠️ **AI 透明度**：用户明确知道分析来自 AI（项目名 CalmOS 暗示操作系统/工具角色）
- ⚠️ **紧急出口**：始终可访问的危机热线入口

---

## 十二、未来规划

| 优先级 | 功能 | 描述 |
|--------|------|------|
| 高 | 移动端真机测试 | iOS Safari / Android Chrome 兼容性验证 |
| 中 | 自定义域名 | 绑定短域名提升品牌感 |
| 中 | 跨设备同步 | 基于 Supabase 实现登录态下的数据同步 |
| 低 | 问卷暂停/恢复 | 填写到一半退出后可以继续 |
| 低 | 多语言 | 英文版本扩展海外用户 |
| 低 | 更多干预模块 | 正念冥想引导、感恩日记、情绪日志 |

---

## 附录：关键链接

| 资源 | 链接 |
|------|------|
| 主站 | https://zhy20260206-dev.github.io/calmos/ |
| 备用站 | https://693.vercel.app |
| GitHub 仓库 | https://github.com/zhy20260206-dev/calmos |
| Supabase 控制台 | https://supabase.com/dashboard/project/rjxbcxcnjnwplroytnan |
| DeepSeek 控制台 | https://platform.deepseek.com |
| 本地启动 | `PORT=3458 node server.js` → http://localhost:3458 |
