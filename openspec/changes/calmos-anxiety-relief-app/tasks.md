## 1. Project Scaffold

- [x] 1.1 Create `calmos.html` — single HTML file with `<head>` (meta viewport, title, inline `<style>`), empty `<div id="app">`, and inline `<script>` section
- [x] 1.2 Define global CSS variables: `--mint: #A8D5BA`, `--bg: #FAFAF8`, `--card: #FFFFFF`, `--radius: 16px`, base font stack, `max-width: 480px` centered container
- [x] 1.3 Define global `state` object with fields: `screen`, `user`, `answers`, `anxietyBefore`, `aiResult`, `activeModule`
- [x] 1.4 Implement `render()` dispatcher — switch on `state.screen` and replace `document.getElementById('app').innerHTML`
- [x] 1.5 Implement `navigate(screen, patch)` helper — merges `patch` into `state`, calls `render()`

## 2. localStorage Helpers

- [x] 2.1 Implement `loadUser()` — reads `calmos_user`, returns object or `null`
- [x] 2.2 Implement `saveUser(nickname, emoji)` — writes `calmos_user`
- [x] 2.3 Implement `loadSessions()` — reads `calmos_sessions`, returns array (default `[]`)
- [x] 2.4 Implement `saveSession(record)` — prepends to array, caps at 5 entries, writes `calmos_sessions`

## 3. Onboarding Modal

- [x] 3.1 Implement `renderOnboarding()` — full-screen overlay with emoji grid (20 emojis), nickname input, 「进入」 button
- [x] 3.2 Add emoji selection state and visual ring on tap
- [x] 3.3 Add nickname validation (2–8 chars) with error highlight on failed submit
- [x] 3.4 On valid submit: call `saveUser()`, set `state.user`, navigate to `'home'`
- [x] 3.5 On page load: call `loadUser()` — if null show onboarding, else go directly to `'home'`

## 4. Home Screen

- [x] 4.1 Implement `renderHome()` — header with emoji + nickname + time-of-day greeting, 「开始分析」 button, history list section
- [x] 4.2 Implement `getGreeting()` — returns "早上好" / "下午好" / "晚上好" based on `new Date().getHours()`
- [x] 4.3 Render history list from `loadSessions()` — empty state message or up to 5 rows formatted as `[date] · [primary_cause] · [before]→[after]分`
- [x] 4.4 「开始分析」 taps initialise `state.answers = {}`, `state.anxietyBefore = 7`, navigate to `'questionnaire'` at `state.currentQ = 1`

## 5. Questionnaire — Core Engine

- [x] 5.1 Define questions array: objects with `id`, `text(answers)` (function for dynamic Q2/Q10 prompts), `options(answers)` (function returning array or null for text input), `skip(answers)` (boolean function)
- [x] 5.2 Implement `getQuestionSequence(answers)` — returns ordered list of question IDs excluding skipped ones
- [x] 5.3 Implement `renderQuestionnaire()` — renders current question using `state.currentQ`; shows progress bar, back arrow, question text, options or text input
- [x] 5.4 Implement option tap handler — records answer, waits 300 ms, advances to next question or `'analysis'` screen
- [x] 5.5 Implement back arrow handler — moves to previous non-skipped question; from Q1 navigates to `'home'`

## 6. Questionnaire — Question Definitions

- [x] 6.1 Define Q1: static options list (5 options as specified in PRD)
- [x] 6.2 Define Q2: `skip` returns true when Q1="说不清楚"; `options` returns branch-specific list based on Q1
- [x] 6.3 Define Q3: static options (4 impact levels)
- [x] 6.4 Define Q4: `skip` returns true when Q1="说不清楚"; static options (4 stage options)
- [x] 6.5 Define Q5–Q9: static single-choice questions as specified in PRD
- [x] 6.6 Define Q10: text-input type; `text()` returns dynamic prompt based on Q1; 10-char limit with countdown display
- [x] 6.7 Implement Q10 submit handler: safety keyword regex check → if match show `'safety'` modal; else proceed to `'analysis'`

## 7. Safety Modal

- [x] 7.1 Implement `renderSafety()` — full-screen modal with title "你现在需要真人支持", body copy, two `tel:` hotline links, 「返回主页」 button
- [x] 7.2 「返回主页」 taps clear `state.answers`, navigate to `'home'`

## 8. Analysis Transition Screen

- [x] 8.1 Implement `renderAnalysis()` — breathing circle (CSS `@keyframes` scale 1→1.25→1 on 3 s loop), status message div
- [x] 8.2 Implement message rotation: cycle ["正在理解你的情况…", "识别焦虑来源…", "匹配缓解方式…"] every ~2 s using `setInterval`
- [x] 8.3 Implement `buildUserMessage(answers)` — formats question answers into the text template from PRD, omitting skipped questions
- [x] 8.4 Implement `callOpenRouterAPI(userMessage)` — `fetch` to `https://openrouter.ai/api/v1/chat/completions`, OpenAI-compatible body `{model: 'anthropic/claude-opus-4-5', messages: [{role:'system',...},{role:'user',...}]}`, `Authorization: Bearer` header using `OPENROUTER_API_KEY` constant; parse response from `choices[0].message.content`
- [x] 8.5 On screen mount: clear interval guard, call API, on success parse JSON → store in `state.aiResult`, clear interval, navigate to `'results'`
- [x] 8.6 On API or parse failure: clear interval, navigate to `'error'` screen with retry capability

## 9. Error Screen

- [x] 9.1 Implement `renderError()` — message "分析遇到了问题，请重试", 「重试」 button that re-navigates to `'analysis'`

## 10. Results Screen

- [x] 10.1 Implement `renderResults()` — heading "AI 对你现在状态的理解", summary paragraph, evidence pills row, two module cards, closing message
- [x] 10.2 Render evidence array as pill tags with mint-green background
- [x] 10.3 Render two module recommendation cards with: human-readable module name mapping, `reason`, "约 N 分钟" badge, 「开始」 button
- [x] 10.4 Define module name map: `{action_plan: "行动计划", uncertainty_management: "不确定性管理", conversation_script: "对话脚本", cognitive_reframe: "认知重构", value_anchor: "价值锚点", breathing: "呼吸稳定"}`
- [x] 10.5 「开始」 button tap: set `state.activeModule` to selected module type + detail, navigate to `'intervention'`

## 11. Intervention — action_plan Module

- [x] 11.1 Implement `renderActionPlan(detail)` — title using Q10 keyword, step timeline list with highlight on step 1
- [x] 11.2 Each step row: sequence number circle, title, description, duration badge
- [x] 11.3 Display `first_step_emphasis` as large bottom copy
- [x] 11.4 「我做完第 1 步了」 button navigates to `'feedback'`

## 12. Intervention — breathing Module

- [x] 12.1 Implement `renderBreathing()` — centred circle with CSS animation, phase label, cycle counter
- [x] 12.2 Define CSS `@keyframes breathe` — scale 1→1.3 over 4 s (inhale), hold 7 s, scale 1.3→1 over 8 s (exhale)
- [x] 12.3 Implement JS phase timer: `setInterval` at 1 s; track elapsed seconds within each cycle; update phase label "吸气"/"屏住"/"呼气"; count completed cycles
- [x] 12.4 After 3 complete cycles (57 s total), clear interval, navigate to `'feedback'`

## 13. Intervention — Remaining Modules

- [x] 13.1 Implement `renderUncertaintyManagement(detail)` — three scenario cards in horizontal scroll row, two waiting-actions list, `reframe` sentence, 「我知道了」 button
- [x] 13.2 Implement `renderConversationScript(detail)` — goal sentence, two script cards (温和版/直接版), channel advice, 「我准备好了」 button
- [x] 13.3 Implement `renderCognitiveReframe(detail)` — original thought (grey bg), fact vs interpretation two-column, reframed thought (green), self-compassion with 「复制这句话」 button (uses `navigator.clipboard.writeText`), 「我看到了」 button
- [x] 13.4 Implement `renderValueAnchor(detail)` — emotion name heading, large `anchor_action` text, reason, `permission`, 「我去做这件事」 button
- [x] 13.5 Implement `renderIntervention()` dispatcher — routes to correct module renderer based on `state.activeModule.type`

## 14. Feedback Screen

- [x] 14.1 Implement `renderFeedback()` — heading "做完了，感觉怎么样？", range slider 0–10 with live score display and comparison line, helpfulness radio group (3 options), 「保存」 button
- [x] 14.2 Display comparison: "[anxietyBefore] → [slider value]" and dynamic copy based on score delta
- [x] 14.3 Validate helpfulness selection before saving; highlight radio group if unselected
- [x] 14.4 On valid save: build session record, call `saveSession()`, navigate to `'home'`

## 15. Polish & Integration

- [x] 15.1 Add `transition: all 0.3s ease` to screen container for page transitions
- [x] 15.2 Verify mobile viewport: `<meta name="viewport" content="width=device-width, initial-scale=1">`, scrollable content within 480 px max-width centred layout
- [x] 15.3 Add `const OPENROUTER_API_KEY = 'YOUR_OPENROUTER_KEY_HERE'` at top of script section with a comment warning it is demo-only and not for deployment
- [x] 15.4 Smoke-test Demo Path A: Q1="有件事要做" → Q10="季度汇报" → result shows 任务堆积型 → action_plan module completes to feedback
- [x] 15.5 Smoke-test Demo Path B: Q1="在等一个结果或回复" → Q10="面试结果" → result shows 等待失控型 → uncertainty_management module completes to feedback
- [x] 15.6 Smoke-test safety flow: Q10 contains "不想活" → safety modal shown, no API call made
- [x] 15.7 Smoke-test returning user: refresh page with `calmos_user` set → onboarding skipped, history list shows last session
