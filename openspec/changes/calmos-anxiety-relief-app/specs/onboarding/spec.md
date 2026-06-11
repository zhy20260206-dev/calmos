## ADDED Requirements

### Requirement: First-visit detection
The system SHALL detect whether the user has completed onboarding by checking `calmos_user` in localStorage. If absent or incomplete, the onboarding modal SHALL be shown immediately on page load before any other content.

#### Scenario: First visit shows modal
- **WHEN** `calmos_user` key is absent from localStorage
- **THEN** the onboarding modal is displayed as an overlay, blocking the home screen

#### Scenario: Returning visit skips modal
- **WHEN** `calmos_user` key exists and contains valid `nickname` and `emoji` fields
- **THEN** the onboarding modal is skipped and the home screen renders immediately

### Requirement: Emoji selection
The system SHALL display exactly 20 preset emoji options (🐱 🐻 🦊 🐸 🌸 🌙 ⭐ 🍀 🦋 🌺 🐨 🦁 🐼 🦄 🌻 🍁 🌈 🐧 🦉 🎀) in a scrollable grid. Exactly one emoji MUST be selected before the user can proceed.

#### Scenario: Default selection
- **WHEN** the modal first appears
- **THEN** the first emoji (🐱) is pre-selected and highlighted with a visible selection ring

#### Scenario: Emoji tap selects it
- **WHEN** the user taps any emoji in the grid
- **THEN** that emoji gains the selection ring and any previously selected emoji loses it

### Requirement: Nickname input
The system SHALL provide a text input for a nickname between 2 and 8 characters (inclusive). The input SHALL display a placeholder of "你的昵称".

#### Scenario: Short nickname rejected
- **WHEN** the user taps 「进入」 and the nickname is fewer than 2 characters
- **THEN** the input is highlighted in error state and no navigation occurs

#### Scenario: Long nickname rejected
- **WHEN** the user taps 「进入」 and the nickname exceeds 8 characters
- **THEN** the input is highlighted in error state and no navigation occurs

#### Scenario: Valid submission persists and navigates
- **WHEN** the user taps 「进入」 with a valid emoji selected and a 2–8 character nickname
- **THEN** `calmos_user` is written to localStorage with `{nickname, emoji}` and the home screen is shown
