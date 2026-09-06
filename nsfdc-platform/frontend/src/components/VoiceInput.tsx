'use client';

import { useState, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript?: (text: string) => void;
  language?: string;
  className?: string;
}

export default function VoiceInput({ onTranscript, language = 'hi-IN', className = '' }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        // TODO: Send audioBlob to Bhashini ASR endpoint
        await new Promise((r) => setTimeout(r, 1000));
        const placeholderText = 'Voice input received — Bhashini integration pending.';
        setTranscript(placeholderText);
        onTranscript?.(placeholderText);
        setIsProcessing(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access denied:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`relative p-3.5 rounded-full transition-all duration-300 ${
          isRecording
            ? 'bg-red-500/20 text-red-400 shadow-lg shadow-red-500/20'
            : isProcessing
              ? 'bg-white/5 text-slate-500'
              : 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 hover:shadow-lg hover:shadow-violet-500/10'
        }`}
        title={isRecording ? 'Stop recording' : 'Start voice input'}
      >
        {/* Pulsing ring when recording */}
        {isRecording && (
          <>
            <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
            <span className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-pulse" />
          </>
        )}

        {isProcessing ? (
          <Loader2 size={20} className="animate-spin" />
        ) : isRecording ? (
          <MicOff size={20} className="relative z-10" />
        ) : (
          <Mic size={20} />
        )}
      </button>

      {/* Audio waveform visualization when recording */}
      {isRecording && (
        <div className="flex items-center gap-0.5 h-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-red-400 rounded-full"
              style={{
                height: `${Math.random() * 20 + 4}px`,
                animation: `wave 0.5s ease-in-out ${i * 0.05}s infinite alternate`,
              }}
            />
          ))}
        </div>
      )}

      {transcript && !isRecording && (
        <p className="text-xs text-slate-400 italic max-w-xs truncate">
          &ldquo;{transcript}&rdquo;
        </p>
      )}
    </div>
  );
}
