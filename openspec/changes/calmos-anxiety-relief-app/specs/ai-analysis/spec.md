## ADDED Requirements

### Requirement: Transition animation
The system SHALL display a breathing-scale circle animation (pulsing in and out) and SHALL cycle through three status messages in sequence: "正在理解你的情况…" → "识别焦虑来源…" → "匹配缓解方式…", each displayed for roughly equal intervals while the API call is in-flight.

#### Scenario: Messages cycle during loading
- **WHEN** the analysis screen is shown
- **THEN** each status message is displayed for approximately 2 seconds before cycling to the next

#### Scenario: Animation stops on completion
- **WHEN** the Claude API response is received and parsed
- **THEN** the animation stops and the app navigates to the results screen

### Requirement: OpenRouter API call
The system SHALL call `https://openrouter.ai/api/v1/chat/completions` using the OpenAI-compatible format with model `anthropic/claude-opus-4-5`, the exact system prompt, and user message structure specified in the PRD. The request SHALL use `Authorization: Bearer <OPENROUTER_API_KEY>` and `Content-Type: application/json` headers.

#### Scenario: Successful API response
- **WHEN** the API responds with a valid JSON string in `choices[0].message.content`
- **THEN** the JSON is parsed and stored in state, and the app navigates to the results screen

#### Scenario: API or parse failure
- **WHEN** the API call fails or `JSON.parse` throws
- **THEN** an error screen is shown with the message "分析遇到了问题，请重试" and a "重试" button that replays the API call

### Requirement: Structured questionnaire payload
The user message sent to Claude SHALL include the user's answers to all answered questions (Q2 and Q4 are omitted when skipped). The Q10 keyword SHALL be included verbatim.

#### Scenario: Skipped questions omitted
- **WHEN** Q2 and Q4 were skipped (Q1="说不清楚")
- **THEN** the user message does not include "具体来源" or "卡在阶段" lines
