## ADDED Requirements

### Requirement: Personalised greeting
The system SHALL display the user's emoji and nickname alongside a time-of-day greeting: "早上好" (05:00–11:59), "下午好" (12:00–17:59), "晚上好" (18:00–04:59).

#### Scenario: Morning greeting
- **WHEN** the home screen renders at 09:00
- **THEN** the header shows "[emoji] [nickname]，早上好"

#### Scenario: Evening greeting
- **WHEN** the home screen renders at 21:00
- **THEN** the header shows "[emoji] [nickname]，晚上好"

### Requirement: Start-analysis CTA
The system SHALL display a prominent 「开始分析」 button as the primary action on the home screen.

#### Scenario: CTA navigates to questionnaire
- **WHEN** the user taps 「开始分析」
- **THEN** the app navigates to the questionnaire screen at Q1 and records the start-time anxiety score of 7 as the default (to be replaced at Q10 or left as default)

### Requirement: Session history list
The system SHALL read `calmos_sessions` from localStorage and display the most recent 5 sessions in reverse-chronological order. Each row SHALL show: date, anxiety type (primary_cause), and before/after anxiety scores.

#### Scenario: No history shows empty state
- **WHEN** `calmos_sessions` is empty or absent
- **THEN** a placeholder message "还没有记录，开始你的第一次分析吧" is shown instead of the list

#### Scenario: History row format
- **WHEN** at least one session exists in localStorage
- **THEN** each row displays in format "[date] · [primary_cause] · [anxiety_before]→[anxiety_after]分"

#### Scenario: Capped at five rows
- **WHEN** more than 5 sessions exist in localStorage
- **THEN** only the 5 most recent are displayed
