## Context

CalmOS is a demo-grade pure-frontend anxiety relief tool. There is no backend, no build toolchain requirement beyond a browser, and no user account system. The target is a single deliverable HTML file (or optionally a Vite+React bundle) that runs locally or from a static host. The OpenRouter API key is provided by the developer and embedded in the source as an explicit demo trade-off.

## Goals / Non-Goals

**Goals:**
- Ship a complete, runnable demo covering the full user journey in one HTML file
- Support the two advertised demo paths (task-backlog → action_plan; waiting → uncertainty_management) plus all five module types
- Persist user profile and up to 5 session records in localStorage
- Call OpenRouter API (model `anthropic/claude-opus-4-5`) synchronously from the browser and parse the returned JSON
- Mobile-first UI with a 480 px max-width container

**Non-Goals:**
- Backend, database, or authentication
- Production API-key security (key is hardcoded—demo only)
- Offline mode or service worker
- I18n / multi-language
- Accessibility audit / WCAG compliance
- All five intervention modules at production quality—`breathing` and `action_plan` are the P0 modules; the rest are needed for results-page navigation but may have minimal UI

## Decisions

### Single HTML file vs Vite + React

**Decision**: Single HTML file with vanilla JS and inline CSS.

**Rationale**: Zero setup friction for a demo. No npm install, no build step, no node_modules. The app is small enough (~800–1200 LOC) that component abstractions are not worth the tooling overhead. A reviewer can open the file directly in a browser.

**Alternatives considered**: Vite+React would make component logic cleaner but adds a mandatory build step and complicates the "just open it" demo experience.

### State management

**Decision**: A single global `state` object in JS, mutated directly, with a `render()` dispatcher that replaces `innerHTML` of `#app` based on `state.screen`.

**Rationale**: The app has a strict linear flow with a small number of screens (~8). A full routing library is unnecessary. Keeping state in one object makes localStorage serialisation trivial.

### OpenRouter API call

**Decision**: `fetch` from the browser directly to `https://openrouter.ai/api/v1/chat/completions` using the OpenAI-compatible chat completions format. Model is `anthropic/claude-opus-4-5`. The developer's OpenRouter API key is a JS `const` at the top of the file.

**Rationale**: OpenRouter exposes an OpenAI-compatible endpoint that works from browser `fetch` without any special opt-in headers, making it simpler than calling Anthropic directly. The developer supplies their own key—no key management needed in the repo.

**Risk**: API key is visible in source. Acceptable for local demo; not for any deployed version.

**Request format**: Standard OpenAI chat completions — `{model, messages: [{role: 'system', content: systemPrompt}, {role: 'user', content: userMessage}]}`. Response text is at `choices[0].message.content`.

**Response parsing**: The system prompt instructs the model to return *only* raw JSON. The client calls `JSON.parse(choices[0].message.content)`. If parsing fails, an error screen is shown.

### Dynamic Q2 / Q4 branching

**Decision**: Q2 options are computed from Q1's stored answer at render time. Q2 and Q4 are skipped entirely (auto-answered `null`) when Q1 is "说不清楚" (vague). This keeps the questionnaire array flat and avoids tree structures.

### Safety interception

**Decision**: Q10 input is checked client-side with a regex covering the five specified terms. If matched, all state transitions stop and a full-screen safety modal replaces the flow. No API call is ever made with flagged input.

### Module detail rendering

**Decision**: The AI response includes a `module_detail` field typed to the primary recommended module. The intervention page renders from this field. The secondary module (usually `breathing`) uses a hardcoded 4-7-8 cycle timer since breathing needs no AI content.

### localStorage schema

**Decision**: Two top-level keys—`calmos_user` (object: `{nickname, emoji}`) and `calmos_sessions` (array, max 5, newest first).

### Animation approach

**Decision**: CSS `@keyframes` for breathing circle (scale + opacity). JS `setInterval` at 1-second granularity drives phase transitions (inhale 4 s → hold 7 s → exhale 8 s → repeat × 3). All other transitions use `transition: all 0.3s ease` on relevant elements.

## Risks / Trade-offs

- **API key exposure** → Acceptable for local demo; add a comment warning in code
- **No error retry** → If Claude returns a non-JSON response (rare), show a friendly error with "Try again" button that replays the analysis call
- **Single-file maintainability** → File may reach ~1000–1200 lines; keep sections clearly delineated with block comments
- **Mobile-only keyboard pushes layout** → Use `position: fixed` for bottom CTAs and test on iOS Safari viewport

## Migration Plan

N/A — greenfield file, no existing codebase to migrate.

## Open Questions

- None blocking. Model routed via OpenRouter as `anthropic/claude-opus-4-5`. Developer fills in their OpenRouter API key at the `const OPENROUTER_API_KEY` constant before running the demo.
