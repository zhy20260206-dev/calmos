'use client';

import { useState } from 'react';
import { useApp } from '@/lib/state';
import { EMOJIS } from '@/lib/constants';

export function Onboarding() {
  const { handleOnboarding } = useApp();
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 8) {
      setError('昵称需要 2–8 个字哦');
      return;
    }
    handleOnboarding(trimmed, selectedEmoji);
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h2>
          欢迎来到 CalmOS <span className="hand-font">✌</span>
        </h2>
        <p>选一个陪你的表情，再告诉我你的昵称。</p>
        <div className="emoji-grid">
          {EMOJIS.map((e) => (
            <div
              key={e}
              className={`emoji-opt ${e === selectedEmoji ? 'selected' : ''}`}
              onClick={() => setSelectedEmoji(e)}
            >
              {e}
            </div>
          ))}
        </div>
        <input
          className={`input-field ${error ? 'error' : ''}`}
          type="text"
          placeholder="你的昵称（2-8字）"
          maxLength={8}
          autoComplete="off"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        />
        {error && (
          <div className="error-msg" style={{ display: 'block' }}>
            {error}
          </div>
        )}
        <div style={{ height: 16 }} />
        <button className="btn btn-primary hand-font" onClick={handleSubmit}>
          进入 →
        </button>
      </div>
    </div>
  );
}
