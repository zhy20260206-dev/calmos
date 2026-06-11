## ADDED Requirements

### Requirement: AI summary display
The system SHALL display the `summary` field from the Claude response under a heading "AI 对你现在状态的理解".

#### Scenario: Summary rendered
- **WHEN** the results screen loads
- **THEN** the summary text is visible below the page heading

### Requirement: Evidence tags
The system SHALL render each item of the `evidence` array as a pill/tag component in a wrapping row.

#### Scenario: Three evidence tags shown
- **WHEN** the `evidence` array contains three strings
- **THEN** three distinct pill tags are rendered

### Requirement: Module recommendation cards
The system SHALL render exactly two cards, one per entry in `recommended_modules`. Each card SHALL display: module type (mapped to a human-readable name), the `reason` text, estimated time ("约 N 分钟"), and a 「开始」 button.

#### Scenario: Primary card navigates to intervention
- **WHEN** the user taps 「开始」 on the primary module card
- **THEN** the app navigates to the intervention screen for that module type, passing the corresponding `module_detail` object

#### Scenario: Secondary breathing card navigates to breathing
- **WHEN** the user taps 「开始」 on a card with type "breathing"
- **THEN** the app navigates to the breathing intervention screen

### Requirement: Closing message
The system SHALL display the `closing_message` field at the bottom of the results screen.

#### Scenario: Closing message rendered
- **WHEN** results load
- **THEN** the closing message appears below the two module cards
