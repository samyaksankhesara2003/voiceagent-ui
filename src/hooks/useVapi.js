import VapiModule from '@vapi-ai/web';
const Vapi = VapiModule.default || VapiModule;
import { useState, useRef, useCallback } from 'react';

const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

export function useVapi() {
  const vapiRef = useRef(null);
  const [callStatus, setCallStatus] = useState('idle'); // idle | connecting | active | ended
  const [transcript, setTranscript] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callId, setCallId] = useState(null);

  // Initialize Vapi lazily (only when starting a call)
  const getVapi = useCallback(() => {
    if (vapiRef.current) return vapiRef.current;

    try {
      const vapi = new Vapi(VAPI_PUBLIC_KEY);

      vapi.on('call-start', () => setCallStatus('active'));
      vapi.on('call-end', () => {
        setCallStatus('ended');
        setIsSpeaking(false);
      });
      vapi.on('speech-start', () => setIsSpeaking(true));
      vapi.on('speech-end', () => setIsSpeaking(false));
      vapi.on('error', (err) => console.error('Vapi error:', err));
      vapi.on('message', (msg) => {
        if (msg.type === 'transcript' && msg.transcriptType === 'final') {
          setTranscript((prev) => [...prev, { role: msg.role, text: msg.transcript }]);
        }
      });

      vapiRef.current = vapi;
      return vapi;
    } catch (err) {
      console.error('Failed to initialize Vapi:', err);
      return null;
    }
  }, []);

  const startCall = useCallback(async () => {
    const vapi = getVapi();
    if (!vapi) {
      console.error('Vapi SDK not available');
      return;
    }

    setCallStatus('connecting');
    setTranscript([]);
    setCallId(null);

    try {
      const call = await vapi.start(ASSISTANT_ID);
      if (call?.id) {
        setCallId(call.id);
      }
    } catch (err) {
      console.error('Failed to start call:', err);
      setCallStatus('idle');
    }
  }, [getVapi]);

  const endCall = useCallback(() => {
    vapiRef.current?.stop();
  }, []);

  const resetCall = useCallback(() => {
    setCallStatus('idle');
    setTranscript([]);
    setCallId(null);
    setIsSpeaking(false);
  }, []);

  return { callStatus, transcript, isSpeaking, callId, startCall, endCall, resetCall };
}
