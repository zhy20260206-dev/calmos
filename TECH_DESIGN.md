# CalmOS 技术设计方案

> 本文档描述 CalmOS 的技术架构、选型理由与实现细节。
> 产品设计决策请参见 `PRODUCT_DESIGN.md`。
>
> 最后更新：2026-06-13

---

## 一、技术选型

### 1.1 技术栈总览

| 层级 | 技术 | 选型核心理由 |
|------|------|-------------|
| 前端 | Vanilla JS（HTML/CSS/JS 单文件 SPA） | 零构建工具链，~1000 行代码可维护 |
| AI 引擎 | DeepSeek `deepseek-chat` | 中文能力最优、¥1/百万 token、国内直连 |
| API 运行时 | Supabase Edge Functions (Deno) | 免费额度慷慨、supabase.co 国内可访问 |
| 静态托管 | GitHub Pages | 免费、github.io 域名未被 GFW 拦截 |
| 数据库 | Supabase PostgreSQL | 免费 500MB，内置 RLS 安全策略 |
| 本地缓存 | localStorage | 即时渲染、离线可用、无网络依赖 |
| 本地开发 | Node.js HTTP Server | 单文件启动、自动读取 .env.local |
| Supabase SDK 加载 | jsdelivr CDN → unpkg fallback | 双 CDN 容灾 + 8 秒超时降级 |

### 1.2 为什么不选 Next.js？

项目选择了 Vanilla JS 单文件 SPA，这在以下方面存在局限：

| 局限 | 具体影响 | 未来改进方向 |
|------|---------|------------|
| 无法开发独立 API | AI Key 和 Prompt 需在浏览器端请求中暴露 | Next.js API Routes 可隐藏密钥 |
| 可扩展性差 | 功能增多后单文件维护困难 | 组件化框架提供更好的模块隔离 |
| GitHub Pages 仅静态 | 无法部署后端服务，API 需依赖 Supabase | Vercel/Next.js 可前后端一体部署 |

> 上述局限在当前 MVP 规模下不明显，后续迭代可考虑迁移至 Next.js。

### 1.3 API 方案选择

| 方案 | 保密性 | 国内访问 | 延迟 |
|------|--------|---------|------|
| ~~浏览器直连 DeepSeek~~ | ❌ API Key 暴露 | ✅ | 低 |
| Supabase Edge Function 代理 | ✅ Key 存于 Secrets | ✅ | 中（多一跳） |
| Vercel Edge Function 代理 | ✅ Key 存于环境变量 | ⚠️ vercel.app 被墙 | 中 |
| **当前方案：Supabase（主）+ Vercel（备）** | ✅ | ✅ | 中 |

---

## 二、系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                       用户浏览器                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │          index.html (单文件 SPA, ~67KB gzip)       │    │
│  │  入场→问卷→分析→结果→干预模块→反馈→主页             │    │
│  └─────────────────────────────────────────────────┘    │
│         │                          │                     │
└─────────┼──────────────────────────┼─────────────────────┘
          │                          │
          ▼                          ▼
┌──────────────────┐    ┌─────────────────────────┐
│  GitHub Pages     │    │  Supabase Edge Function   │
│  (静态托管)       │    │  analyze/index.ts (Deno)  │
│  github.io 域名   │    │  ├─ System Prompt 查表    │
└──────────────────┘    │  ├─ DeepSeek API 调用     │
                        │  └─ 返回完整性验证        │
                        └───────────┬─────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
          ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
          │ DeepSeek API  │ │ Supabase DB  │ │ localStorage │
          │ deepseek-chat │ │ calmos_      │ │ (即时渲染 +  │
          │ (AI 分析引擎)  │ │ sessions 表  │ │  离线降级)   │
          └──────────────┘ └──────────────┘ └──────────────┘
```

### 2.2 API 路由（环境自适应）

```
用户发起分析请求
    │
    ▼
API_BASE 环境检测
    ├── localhost → /api/analyze (Node server 代理)
    └── 线上域名 → https://xxx.supabase.co/functions/v1/analyze
```

### 2.3 数据流

```
用户提交反馈
    │
    ├──→ localStorage 同步写入 → 即时渲染主页
    │
    └──→ Supabase 异步写入（后台，不阻塞 UI）
              │
              ├─ 成功 → 下次加载标注 "☁️ 已同步云端"
              └─ 失败 → console.warn()，标注 "💻 仅本设备"
```

---

## 三、数据模型

### 3.1 前端状态（state 对象）

```javascript
state = {
  screen: 'onboarding' | 'home' | 'questionnaire' | 'analysis' |
          'error' | 'results' | 'intervention' | 'feedback',
  user: { nickname: string, emoji: string } | null,
  answers: { Q1: string, Q2?: string, ..., Q9: string },
  currentQ: number,
  anxietyBefore: number,       // 默认 7
  aiResult: object | null,
  activeModule: object | null,
  pendingModules: object[],
  currentModuleIdx: number,
  totalModules: number,
}
```

### 3.2 数据库表：calmos_sessions

| 列 | 类型 | 说明 |
|----|------|------|
| `id` | BIGINT (PK) | Unix timestamp 生成 |
| `user_id` | TEXT | 用户昵称（用于数据隔离）|
| `created_at` | TIMESTAMPTZ | 创建时间 |
| `date` | TEXT | 中文日期格式 |
| `keyword` | TEXT | 焦虑关键词 |
| `primary_cause` | TEXT | AI 识别根因 |
| `anxiety_before` | INTEGER | 干预前焦虑分 (0-10) |
| `anxiety_after` | INTEGER | 干预后焦虑分 (0-10) |
| `module_used` | TEXT | 完成的模块类型 |
| `helpfulness` | TEXT | 帮助程度 |
| `answers` | JSONB | 9 题完整答案 |
| `ai_result` | JSONB | AI 返回完整结果 |

### 3.3 本地存储

| localStorage Key | 内容 | 用途 |
|-----------------|------|------|
| `calmos_user` | `{ nickname, emoji }` | 用户身份，跳过入场弹窗 |
| `calmos_sessions` | `[session, ...]`（最多 5 条）| 历史记录即时渲染 |

### 3.4 用户数据隔离

```
数据隔离策略（修复后）：
┌─────────────────────────────────────────────┐
│  客户端层：Supabase 查询 .eq('user_id', nickname)  │
│  数据库层：RLS 策略限制跨用户访问              │
│  本地层：localStorage 天然设备隔离            │
└─────────────────────────────────────────────┘
```

---

## 四、AI Prompt 工程设计

### 4.1 核心策略：确定性格子查表

不依赖模型自由推理，而是将 5×4=20 种模块匹配表写死在 System Prompt 中，要求严格查表。

```
传统做法：请根据用户问卷，推荐合适的干预模块
  ↓ 问题：模型可能给出不存在的模块或随机推荐

CalmOS 做法：
  匹配表写死在 System Prompt → 模型查表选择 → 仅允许 6 个预定义模块
```

### 4.2 输出规范

System Prompt 中定义了完整的 JSON Schema：

```
{
  primary_cause:      "10字以内根因标签",
  summary:            "80-120字个性化解读",
  evidence:           ["3个证据标签，各8字以内"],
  recommended_modules: [
    { type, title, reason, estimated_minutes },
    { type, title, reason, estimated_minutes }
  ],
  module_details:     [ { 模块1详细内容 }, { 模块2详细内容 } ],
  closing_message:    "20-35字收尾鼓励语"
}
```

### 4.3 容错机制

| 层级 | 措施 |
|------|------|
| 格式约束 | `response_format: { type: "json_object" }` 强制 JSON |
| 字段验证 | 检查 6 个必填字段是否齐全 |
| 数组验证 | `module_details` 至少 2 个元素 |
| 降级策略 | 验证失败返回 502 + "请重试"，不展示原始错误 |

### 4.4 特殊处理

- `breathing` 模块不需要 AI 生成内容（标准化的 4-7-8 节奏）
- Q1="说不清楚"路径下 Q2/Q4 缺失，不影响 AI 分析
- `module_details` 数组顺序与 `recommended_modules` 一致

---

## 五、部署方案

### 5.1 双端部署

| 环境 | 地址 | 国内访问 | 用途 |
|------|------|---------|------|
| **主站** | `zhy20260206-dev.github.io/calmos/` | ✅ 可访问 | 生产 |
| 备用站 | `693.vercel.app` | ⚠️ 可能受限 | 备用/国际 |
| 本地开发 | `localhost:3458` | N/A | 开发 |

### 5.2 密钥管理

| 密钥 | 存储位置 | 暴露风险 |
|------|---------|---------|
| `DEEPSEEK_API_KEY` | Supabase Edge Function Secrets | 无（服务端代理） |
| `SUPABASE_URL` | 前端代码（公开） | 无（公开信息） |
| `SUPABASE_ANON_KEY` | 前端代码（publishable key） | 低（仅允许 RLS 授权的操作） |

### 5.3 部署命令

```bash
# 本地开发
PORT=3458 node server.js

# Supabase Edge Function 部署
npx supabase functions deploy analyze --project-ref rjxbcxcnjnwplroytnan

# GitHub Pages 部署（push 即部署）
git push origin main
```

---

## 六、容灾设计

### 6.1 降级层级

| 层级 | 故障 | 降级行为 |
|------|------|---------|
| Supabase SDK 加载超时 | CDN 不可用 | 8 秒超时后全功能运行（仅 localStorage） |
| Supabase 数据库写入失败 | 网络/服务故障 | console.warn()，不影响用户 |
| DeepSeek API 故障 | 返回 502 | 错误页 + 重试按钮 |
| DeepSeek 返回格式异常 | JSON 解析失败或字段缺失 | 验证失败返回 502 + "请重试" |
| JS 运行时错误 | 全局 window.onerror 捕获 | 友好提示 + 刷新按钮 |

### 6.2 Supabase SDK 双 CDN 加载

```
jsdelivr CDN（优先）
    │
    ├── 成功 → 初始化 Supabase 客户端
    │
    └── 失败 → unpkg CDN（备用）
                  │
                  ├── 成功 → 初始化
                  │
                  └── 失败 → 8s 超时 → localStorage 模式运行
```

### 6.3 数据一致性

- localStorage 始终为权威本地源（同步写入）
- Supabase 为云端副本（异步写入，best-effort）
- 合并策略：云端数据优先，本地未同步数据补充，按 id 去重

---

## 七、代码结构

### 7.1 文件组织

```
6.93/
├── index.html                # 主应用（~1000 行 SPA）
│   ├── <style> (~400 行 CSS)
│   └── <script> (~600 行 JS)
├── server.js                 # 本地开发服务器（~135 行）
├── api/analyze.js            # Vercel Edge Function（备用 API，~250 行）
├── supabase-functions/analyze/index.ts  # Supabase Edge Function（主 API）
├── vercel.json               # Vercel 路由配置
├── .env.local                # 本地环境变量（gitignore）
└── .env.example              # 环境变量模板
```

### 7.2 前端架构模式

采用简单的状态机 + 渲染器模式：

```
state 对象（全局集中状态）
    │
    ▼
navigate(screen, patch)       ← 统一状态更新 + 页面跳转
    │
    ▼
render()                      ← 按 state.screen 分发渲染
    │
    ├── renderOnboarding() + attachOnboarding()
    ├── renderHomeSync()     + attachHome()
    ├── renderQuestionnaire()+ attachQuestionnaire()
    ├── renderAnalysis()     + startAnalysis()
    ├── renderResults()      + attachResults()
    ├── renderIntervention() + attachIntervention()
    └── renderFeedback()     + attachFeedback()
```

### 7.3 干预模块渲染

```
renderIntervention()
    │
    └── switch(activeModule.type)
          ├── 'action_plan'            → renderActionPlan(detail)
          ├── 'breathing'              → renderBreathing() + startBreathing()
          ├── 'uncertainty_management' → renderUncertaintyManagement(detail)
          ├── 'conversation_script'    → renderConversationScript(detail)
          ├── 'cognitive_reframe'      → renderCognitiveReframe(detail)
          └── 'value_anchor'           → renderValueAnchor(detail)
```
