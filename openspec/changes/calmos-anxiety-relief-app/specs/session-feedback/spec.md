## ADDED Requirements

### Requirement: Post-intervention anxiety slider
The system SHALL display a 0–10 range slider labelled "现在焦虑程度" and SHALL compare it to the `anxiety_before` score captured at questionnaire start. Default slider value SHALL be 5.

#### Scenario: Score decrease shown positively
- **WHEN** the user sets the slider to a value below `anxiety_before`
- **THEN** the comparison display shows "[before] → [after]，下降了 [diff] 分" and the feedback copy reads "有一点变化，就已经很重要。"

#### Scenario: Score equal or higher shown neutrally
- **WHEN** the user sets the slider to a value equal to or above `anxiety_before`
- **THEN** the feedback copy reads "没关系，找到不适合的方法也是进展。"

### Requirement: Helpfulness rating
The system SHALL display three radio-style options: 有帮助 / 一般 / 没什么帮助. One MUST be selected before saving.

#### Scenario: Default no selection
- **WHEN** the feedback screen first renders
- **THEN** none of the three options is pre-selected

#### Scenario: Save blocked without selection
- **WHEN** the user taps 「保存」 without selecting a helpfulness option
- **THEN** the options area is highlighted and no navigation occurs

### Requirement: Session persistence
The system SHALL write a session record to `calmos_sessions` in localStorage on save, then navigate to the home screen. The record schema is `{id, date, keyword, primary_cause, anxiety_before, anxiety_after, module_used, helpfulness}`. If `calmos_sessions` already contains 5 entries the oldest SHALL be dropped before inserting the new record.

#### Scenario: Session saved and home shown
- **WHEN** the user taps 「保存」 with a valid helpfulness selection
- **THEN** a new session object is prepended to `calmos_sessions` and the app navigates to the home screen

#### Scenario: Oldest session dropped at limit
- **WHEN** `calmos_sessions` already has 5 entries and a new session is saved
- **THEN** the oldest entry is removed and `calmos_sessions` still contains exactly 5 entries
