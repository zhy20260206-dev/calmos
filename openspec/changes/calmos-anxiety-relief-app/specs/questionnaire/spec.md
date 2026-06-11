## ADDED Requirements

### Requirement: Single-question view with progress bar
The system SHALL display one question at a time. A linear progress bar at the top SHALL reflect the ratio of completed questions to the total (10, or fewer when skip logic removes Q2/Q4).

#### Scenario: Progress advances on answer
- **WHEN** the user selects an option on Q3
- **THEN** the progress bar fills to reflect 3 / total-questions ratio

### Requirement: Auto-advance after selection
The system SHALL automatically advance to the next question 300 ms after the user selects an option on any single-choice question (Q1–Q9). No explicit "下一题" button is required for these questions.

#### Scenario: Tap-to-advance timing
- **WHEN** the user taps an option on Q1
- **THEN** after exactly 300 ms the screen transitions to Q2 (or Q3 if Q1="说不清楚")

### Requirement: Back navigation
The system SHALL display a back-arrow button in the top-left corner of every question screen. Tapping it navigates to the immediately preceding question (skipping over skipped questions).

#### Scenario: Back from Q3 when Q2 was skipped
- **WHEN** Q1 was "说不清楚" (so Q2 was skipped) and the user taps back on Q3
- **THEN** the app navigates to Q1, not Q2

### Requirement: Q2 dynamic options
The system SHALL display Q2 only when Q1 answer is NOT "说不清楚". Q2 option list SHALL be determined by Q1's answer per the mapping in the PRD.

#### Scenario: Q2 skipped for vague Q1
- **WHEN** Q1 answer is "说不清楚"
- **THEN** Q2 is skipped entirely and the app advances directly to Q3

#### Scenario: Task options shown
- **WHEN** Q1 answer is "有件事要做，但还没开始"
- **THEN** Q2 shows: "工作项目 / 学习考试 / 生活事务 / 一直拖着没做的事"

### Requirement: Q4 conditional skip
The system SHALL skip Q4 when Q1 answer is "说不清楚".

#### Scenario: Q4 skipped
- **WHEN** Q1 answer is "说不清楚"
- **THEN** after Q3 the app advances to Q5, not Q4

### Requirement: Q10 text input
Q10 SHALL display a text input with a 10-character limit. A character countdown ("剩 N 字") SHALL appear to the right of the input. The question prompt text SHALL be dynamic based on Q1 answer per the PRD mapping.

#### Scenario: Character limit enforced
- **WHEN** the user types an 11th character
- **THEN** the additional character is blocked and the countdown shows "剩 0 字"

#### Scenario: Dynamic prompt for task type
- **WHEN** Q1 answer is "有件事要做，但还没开始"
- **THEN** Q10 prompt reads "我一直耽搁的这件事是："

### Requirement: Safety keyword check
The system SHALL inspect Q10 input for the words: 死、不想活、消失、自杀、伤害自己. If any are found, the safety modal SHALL be shown and the analysis flow SHALL be interrupted.

#### Scenario: Flagged keyword triggers safety modal
- **WHEN** the user submits Q10 with the text "我不想活了"
- **THEN** the safety modal is shown immediately and no API call is made

#### Scenario: Clean input proceeds normally
- **WHEN** the user submits Q10 with the text "季度汇报"
- **THEN** the app transitions to the analysis transition screen
