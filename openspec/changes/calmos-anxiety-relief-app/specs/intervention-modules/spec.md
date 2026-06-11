## ADDED Requirements

### Requirement: action_plan module
The system SHALL render a step-by-step plan using `module_detail` of type `action_plan`. The first step SHALL be visually highlighted. The `first_step_emphasis` text SHALL appear as large bottom copy. The primary button text is 「我做完第 1 步了」.

#### Scenario: Steps rendered in timeline
- **WHEN** the action_plan screen loads with 3 steps
- **THEN** three step rows are rendered in order, each showing sequence number, title, description, and duration

#### Scenario: First step highlighted
- **WHEN** the action_plan screen loads
- **THEN** step 1 row has a distinct highlight colour vs steps 2+

#### Scenario: CTA completes module
- **WHEN** the user taps 「我做完第 1 步了」
- **THEN** the app navigates to the feedback screen

### Requirement: uncertainty_management module
The system SHALL render three result scenario cards (好/中/坏) from `module_detail.scenarios`, each with its `first_step` text. Cards SHALL support horizontal swipe/scroll. Two waiting-period actions SHALL be listed. The `reframe` sentence SHALL appear at the bottom. The primary button text is 「我知道了」.

#### Scenario: Three scenario cards swipeable
- **WHEN** the uncertainty_management screen loads
- **THEN** three cards are in a horizontally scrollable row labelled 好/中/坏

#### Scenario: CTA completes module
- **WHEN** the user taps 「我知道了」
- **THEN** the app navigates to the feedback screen

### Requirement: conversation_script module
The system SHALL display two talk-script cards (温和版 and 直接版) from `module_detail.script_examples`, the goal sentence, and channel advice. Primary button text is 「我准备好了」.

#### Scenario: Two script cards shown
- **WHEN** the conversation_script screen loads
- **THEN** both script cards are visible and labelled with their tone type

#### Scenario: CTA completes module
- **WHEN** the user taps 「我准备好了」
- **THEN** the app navigates to the feedback screen

### Requirement: cognitive_reframe module
The system SHALL display the original thought (grey background), a two-column fact vs. interpretation comparison, a reframed thought (green highlight), and a self-compassion sentence with a 「复制这句话」 button. Primary button text is 「我看到了」.

#### Scenario: Copy button copies text
- **WHEN** the user taps 「复制这句话」
- **THEN** the self-compassion sentence is written to the clipboard

#### Scenario: CTA completes module
- **WHEN** the user taps 「我看到了」
- **THEN** the app navigates to the feedback screen

### Requirement: value_anchor module
The system SHALL display the emotion name as a heading, `anchor_action` in large text, the reason explanation, and the `permission` sentence. Primary button text is 「我去做这件事」.

#### Scenario: CTA completes module
- **WHEN** the user taps 「我去做这件事」
- **THEN** the app navigates to the feedback screen

### Requirement: breathing module
The system SHALL display a central circle that animates with a CSS scale transition: grow over 4 s (inhale), hold for 7 s, shrink over 8 s (exhale). Text labels SHALL change to match the current phase (「吸气」/「屏住」/「呼气」). After 3 complete cycles the module SHALL automatically advance to the feedback screen.

#### Scenario: Phase text matches animation
- **WHEN** the circle is expanding
- **THEN** the phase label reads "吸气"

#### Scenario: Auto-advance after 3 cycles
- **WHEN** 3 full 4-7-8 cycles complete (57 seconds total)
- **THEN** the app navigates to the feedback screen automatically

### Requirement: Safety modal
The system SHALL display a non-dismissible full-screen modal when Q10 contains crisis keywords. The modal SHALL show crisis hotlines and a 「返回主页」 button. No AI call is made.

#### Scenario: Safety modal content
- **WHEN** the safety modal is shown
- **THEN** it displays "全国 400-161-9995" and "北京 010-82951332" as tappable tel: links

#### Scenario: Return home from safety modal
- **WHEN** the user taps 「返回主页」
- **THEN** the app navigates to the home screen and clears any in-progress questionnaire state
