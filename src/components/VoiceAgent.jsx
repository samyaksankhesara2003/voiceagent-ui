import CallStatus from './CallStatus';
import TranscriptPanel from './TranscriptPanel';
import './VoiceAgent.css';

export default function VoiceAgent({
  callStatus,
  transcript,
  isSpeaking,
  onEndCall,
}) {
  return (
    <div className="voice-agent">
      <div className="voice-agent-header">
        <CallStatus status={callStatus} />
      </div>

      <div className="mic-container">
        <div className={`mic-circle ${callStatus === 'active' ? 'mic-active' : ''} ${isSpeaking ? 'mic-speaking' : ''}`}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </div>
        {callStatus === 'connecting' && <p className="mic-label">Connecting to agent...</p>}
        {callStatus === 'active' && (
          <p className="mic-label">{isSpeaking ? 'Agent is speaking...' : 'Listening...'}</p>
        )}
      </div>

      <TranscriptPanel transcript={transcript} />

      {(callStatus === 'active' || callStatus === 'connecting') && (
        <button className="btn btn-danger" onClick={onEndCall}>
          End Call
        </button>
      )}
    </div>
  );
}
