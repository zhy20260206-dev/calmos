## Why

Anxiety is pervasive but generic mental wellness apps offer one-size-fits-all content that doesn't address the specific type or root cause of a user's distress. CalmOS is a guided, AI-powered anxiety relief tool that diagnoses the *type* of anxiety through a short adaptive questionnaire, then delivers a targeted micro-intervention—giving users a concrete next step rather than a vague "breathe and relax" prompt.

## What Changes

- **New**: Single-page pure-frontend application (HTML/CSS/JS, no backend) with mobile-first layout
- **New**: Onboarding flow — emoji + nickname setup stored in localStorage
- **New**: 10-question adaptive questionnaire with branching logic (Q1→Q2 depends on Q1 answer; Q1=vague skips Q2 and Q4)
- **New**: Safety interception — Q10 scans for crisis keywords and shows emergency resources instead of proceeding
- **New**: AI analysis via Claude API (`claude-opus-4-5`) — sends structured questionnaire answers, receives typed JSON with anxiety classification, evidence, and personalised module recommendation
- **New**: Analysis transition page with breathing animation and rotating status copy
- **New**: Results page displaying AI summary, evidence tags, two recommended modules, and a closing message
- **New**: Five intervention modules rendered based on AI output: `action_plan`, `uncertainty_management`, `conversation_script`, `cognitive_reframe`, `value_anchor`, `breathing`
- **New**: Post-session feedback — 0–10 anxiety slider, helpfulness rating, before/after comparison
- **New**: localStorage session history — last 5 sessions shown on home screen

## Capabilities

### New Capabilities

- `onboarding`: First-time entry modal — emoji picker and nickname input; persisted to localStorage; skipped on return visits
- `home-screen`: Greeting with time-of-day salutation, primary CTA button, and recent session history list
- `questionnaire`: 10-question single-item view with progress bar, back navigation, dynamic Q2/Q4 branching, keyword safety check on Q10, and 0.3 s auto-advance after selection
- `ai-analysis`: Claude API call with structured system prompt, rotating transition animation, and typed JSON response parsing
- `results-view`: AI summary display, evidence tag list, two module recommendation cards, closing message
- `intervention-modules`: Renderer for six module types (action_plan, uncertainty_management, conversation_script, cognitive_reframe, value_anchor, breathing) each with distinct UI and completion trigger
- `session-feedback`: Post-intervention slider (0–10), helpfulness radio, before/after score comparison, localStorage write, return to home

### Modified Capabilities

## Impact

- Zero backend; all state in `localStorage`
- API key for Claude hardcoded in frontend (demo only, not for production)
- No external dependencies beyond browser fetch; implemented as a single HTML file or Vite+React bundle
- Mobile viewport primary (max-width 480 px, centered on desktop)
