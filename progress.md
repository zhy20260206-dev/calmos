# CalmOS · 项目进度

> 最后更新：2026-06-10 20:30

---

## ✅ 已完成

### 项目架构
- 前端：单 HTML 文件 `calmos.html`（`index.html` 为同步副本）
- 后端：`api/analyze.js` — Vercel Edge Function → DeepSeek `deepseek-chat`
- 数据库：Supabase PostgreSQL `calmos_sessions` 表
- 部署方式：Vercel CLI 手动部署 + 本地 `vercel dev` 开发
- 线上地址：`https://693.vercel.app`（受 vercel.app 域名国内访问影响，建议本地 `vercel dev`）
- API key (DEEPSEEK_API_KEY) + Supabase Key 存于 Vercel 环境变量，前端零暴露

### 设计语言
- 手绘涂鸦感：卡片微旋转、blob 形状头像/吉祥物、offset 实色投影、2.5px 黑色描边
- 马卡龙四主色：黄 `#FFEAA7` / 薄荷绿 `#A8E6CF` / 绿 `#B5EAD7` / 天蓝 `#A8D8EA`
- 跳色点缀：珊瑚 `#FFB4A2` / 淡紫 `#C5B4E3`
- 字体：系统原生中文字体栈（PingFang SC / Microsoft YaHei），去掉了 Google Fonts 避免国内加载问题

### 入场弹窗
- 20 个 emoji 网格选择 + 昵称 2-8 字校验
- localStorage 记录账号，返回用户跳过弹窗

### 问卷系统（9 题 × 5 路径）
- 9 题选择题，Q1 决定 Q2 选项组和 Q4 专属深挖题
- 5 条分支路径（任务/等待/人际/自我/说不清楚）
- Q1="说不清楚" 时跳过 Q2、Q4
- 每题有 🧭📌📊🎯🤝💗⏰💡📅 圆形 emoji 图标
- 选项有彩色左边框（薄荷绿/天蓝/珊瑚/淡紫/黄）+ 表情前缀

### 分析过渡页
- 中心 blob 变形动画（💫→🌟→🎯→💝 轮换）
- 5 个漂浮 mini blob（💭🔍✨💡🧠）
- 4 条文案打字机效果轮播 + 3 跳动圆点加载器

### AI 分析系统
- 系统提示词含**路径×Q8 匹配表**（5 路径×4 Q8 选项=20 种组合），模块推荐是确定性的
- 基于 `cankao/解决方案.md` 中的 CBT 循证方案设计干预模块
- 返回 `module_details` 数组（2 个元素），每个模块都有完整内容

### 匹配表摘要
| Q1 路径 | Q8 选择 | 第1模块 | 第2模块 |
|----------|---------|---------|---------|
| 有件事要做 | 直接行动 | action_plan | cognitive_reframe |
| 在等结果 | 理清下一步 | uncertainty_management | cognitive_reframe |
| 跟某人有关 | 有人陪着 | conversation_script | value_anchor |
| 对自己后悔 | 理清下一步 | cognitive_reframe | value_anchor |
| 说不清楚 | 先平静下来 | breathing | value_anchor |

### 结果页
- 根因卡片 + evidence 标签 + 2 张模块推荐卡（第1步/第2步标识）
- 点击任意一张开始干预，另一张自动排队

### 干预模块 × 6（两步串联）
- **步骤进度条**（1/2 → 2/2），完成后自动跳下一步
- `action_plan` — 行为激活拆步骤，每小步可**点击打勾 ✅**，全勾完激活 CTA
- `breathing` — 4-7-8 呼吸动画，3 循环自动跳，已加返回按钮
- `uncertainty_management` — 三场景横滑卡片 + 等待期行动 + 信息接触限制建议
- `conversation_script` — 温和版/直接版双话术 + 48h 等待窗口建议
- `cognitive_reframe` — CBT 三栏表：自动想法→思维模式→事实vs加戏→重构→好友视角
- `value_anchor` — 情绪命名 + 锚点行动 + 5-4-3 感官接地练习 + 许可语句
- 动态 CTA：「继续下一步 →」→「完成 ✓」

### 反馈页 + 持久化
- 0-10 焦虑滑条 + 前后对比 + 帮助程度 3 选 1
- **双写机制**：localStorage 即时写 + Supabase 后台异步写
- Supabase SDK 异步延迟加载 + 双 CDN 容灾（jsdelivr→unpkg）+ 8 秒超时保护

### 主页
- 时间问候语 + **真实数据标签**（连续次数/完成次数/焦虑↓%）
- 历史记录列表（localStorage 即时渲染 + Supabase 后台刷新）
- 底部状态指示（☁️云端 / 💻本地）

### 错误处理
- 全局 `window.onerror` 捕获 JS 错误，显示友好提示
- 错误页显示具体错误原因
- API 返回完整性验证（6 字段 + module_details 数组检查）

---

## 🔲 待完成

### 立即需要
| 任务 | 状态 |
|------|------|
| 本地 `vercel dev` 走通完整流程（问卷→AI分析→结果→干预→反馈）| 🔲 |
| 移动端真机测试（iOS Safari / Android Chrome） | 🔲 |

### 功能增强
| 任务 | 优先级 |
|------|--------|
| 绑定自定义域名解决 vercel.app 国内访问问题 | 高 |
| 问卷页增加跳过/暂停功能 | 低 |

### 数据持久化
| 任务 | 状态 |
|------|------|
| Supabase 建表 + RLS | ✅ |
| 前端 SDK 双写 | ✅ |
| 跨设备同步 | 中 |

---

## 本地运行

```bash
cd /home/zhang/coding/6.93
vercel dev
# → http://localhost:3000
```

环境变量已在 Vercel 云端配好，`vercel dev` 会自动拉取。
