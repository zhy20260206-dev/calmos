'use client';

import { useEffect, useState, useRef } from 'react';
import { ANALYSIS_MSGS, MINI_BLOBS, BLOB_EMOJIS } from '@/lib/constants';

export function Analysis() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [blobEmoji, setBlobEmoji] = useState(BLOB_EMOJIS[0]);
  const charIdxRef = useRef(0);
  const textRef = useRef(ANALYSIS_MSGS[0]);

  // Typewriter effect
  useEffect(() => {
    const fullTexts = [...ANALYSIS_MSGS];
    let charIdx = 0;
    let currentMsgIdx = 0;
    let currentText = fullTexts[0];
    let timeoutId: ReturnType<typeof setTimeout>;

    function typeNext() {
      if (charIdx <= currentText.length) {
        setDisplayText(currentText.slice(0, charIdx));
        charIdx++;
        timeoutId = setTimeout(
          typeNext,
          charIdx > currentText.length ? 1800 : 60 + Math.random() * 40
        );
        if (charIdx > currentText.length) {
          currentMsgIdx = (currentMsgIdx + 1) % fullTexts.length;
          currentText = fullTexts[currentMsgIdx];
          charIdx = 0;
          setMsgIdx(currentMsgIdx);
        }
      }
    }

    timeoutId = setTimeout(typeNext, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  // Blob emoji rotation
  useEffect(() => {
    let blobIdx = 0;
    const interval = setInterval(() => {
      blobIdx = (blobIdx + 1) % BLOB_EMOJIS.length;
      setBlobEmoji(BLOB_EMOJIS[blobIdx]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="screen" style={{ justifyContent: 'center' }}>
      <div className="analysis-screen">
        {MINI_BLOBS.map((b) => (
          <div
            key={b.emoji}
            className="analysis-blob-mini"
            style={{
              left: b.x,
              top: b.y,
              background: b.color,
              ['--d' as string]: b.d,
              width: 44,
              height: 44,
            }}
          >
            {b.emoji}
          </div>
        ))}
        <div className="analysis-blob-main">{blobEmoji}</div>
        <div className="analysis-msg">{displayText}</div>
        <div className="analysis-dots">
          <div className="analysis-dot" />
          <div className="analysis-dot" />
          <div className="analysis-dot" />
        </div>
      </div>
    </div>
  );
}
