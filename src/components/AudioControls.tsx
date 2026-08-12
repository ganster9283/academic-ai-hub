import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { speakText, listenSpeech } from '../utils/speech';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  lang?: string;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  lang = 'bn-BD',
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const stopRef = React.useRef<(() => void) | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      if (stopRef.current) {
        stopRef.current();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (stopRef.current) {
        stopRef.current();
        stopRef.current = null;
      }
      setIsListening(false);
      return;
    }

    setError(null);
    setIsListening(true);

    const stopFn = listenSpeech(
      (text) => {
        onTranscript(text);
        setIsListening(false);
        stopRef.current = null;
      },
      (err) => {
        setError(err);
        setIsListening(false);
        stopRef.current = null;
      },
      lang
    );

    if (stopFn) {
      stopRef.current = stopFn;
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={toggleListening}
        className={`p-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-semibold ${
          isListening
            ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-200'
            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
        } ${className}`}
        title={isListening ? 'ভয়েস ইনপুট থামান' : 'ভয়েস টাইপিং (কথা বলে প্রশ্ন করুন)'}
      >
        {isListening ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">শুনছি...</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">ভয়েস</span>
          </>
        )}
      </button>

      {error && (
        <span className="absolute bottom-full left-0 mb-1 z-20 text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
          {error}
        </span>
      )}
    </div>
  );
};

interface TTSButtonProps {
  text: string;
  lang?: string;
  className?: string;
}

export const TTSButton: React.FC<TTSButtonProps> = ({
  text,
  lang = 'bn-BD',
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(
        text,
        lang,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
        isPlaying
          ? 'bg-indigo-600 text-white shadow-xs'
          : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200'
      } ${className}`}
      title={isPlaying ? 'কথা বলা বন্ধ করুন' : 'উত্তরটি শুনুন (Listen Answer)'}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 animate-bounce" />
          <span>থামাও</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5" />
          <span>শুনুন</span>
        </>
      )}
    </button>
  );
};
