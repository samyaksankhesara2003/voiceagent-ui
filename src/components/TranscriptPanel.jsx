import { useEffect, useRef } from 'react';
import './TranscriptPanel.css';

export default function TranscriptPanel({ transcript }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  if (transcript.length === 0) {
    return (
      <div className="transcript-panel">
        <p className="transcript-empty">Conversation will appear here...</p>
      </div>
    );
  }

  return (
    <div className="transcript-panel">
      {transcript.map((entry, i) => (
        <div key={i} className={`transcript-entry transcript-${entry.role}`}>
          <span className="transcript-role">
            {entry.role === 'assistant' ? 'Agent' : 'You'}
          </span>
          <p className="transcript-text">{entry.text}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
