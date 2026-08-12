import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle, Radio } from 'lucide-react';
import { speakText } from '../utils/speech';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  lang?: string;
  className?: string;
  showLangToggle?: boolean;
  circular?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  lang = 'bn-BD',
  className = '',
  showLangToggle = true,
  circular = false
}) => {
  const {
    status,
    isListening,
    isRequesting,
    isProcessing,
    interimText,
    errorMessage,
    currentLang,
    toggleListening,
    toggleLanguage
  } = useSpeechToText({ lang, onTranscript });

  return (
    <div className="relative inline-flex items-center gap-1.5">
      {/* Main Mic Action Button */}
      <button
        type="button"
        onClick={toggleListening}
        className={
          circular
            ? `relative shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all flex items-center justify-center font-bold cursor-pointer shadow-md ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-rose-300 ring-4 ring-rose-400/50 scale-105'
                  : isRequesting || isProcessing
                  ? 'bg-purple-100 text-purple-800 border-2 border-purple-300'
                  : status === 'permission-denied'
                  ? 'bg-rose-100 text-rose-700 border-2 border-rose-300 hover:bg-rose-200'
                  : status === 'microphone-unavailable' || status === 'browser-not-supported'
                  ? 'bg-slate-200 text-slate-500 border-2 border-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-300'
              } ${className}`
            : `p-2 sm:px-3 sm:py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-200 border border-rose-500'
                  : isRequesting || isProcessing
                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
                  : status === 'permission-denied'
                  ? 'bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100'
                  : status === 'microphone-unavailable' || status === 'browser-not-supported'
                  ? 'bg-slate-100 text-slate-500 border border-slate-200'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              } ${className}`
        }
        title={
          isListening
            ? 'শুনছি... বন্ধ করতে ক্লিক করুন (Click to stop)'
            : 'ভয়েস টাইপিং (কথা বলে প্রশ্ন লিখুন)'
        }
      >
        {isListening ? (
          <div className="relative flex items-center justify-center">
            <span className="absolute w-12 h-12 rounded-full bg-rose-400/30 animate-ping" />
            <Radio className="w-5 h-5 text-white animate-bounce" />
          </div>
        ) : isRequesting ? (
          <Loader2 className="w-5 h-5 animate-spin text-purple-700" />
        ) : isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin text-purple-700" />
        ) : status === 'permission-denied' ? (
          <MicOff className="w-5 h-5 text-rose-600" />
        ) : status === 'microphone-unavailable' || status === 'browser-not-supported' ? (
          <MicOff className="w-5 h-5 text-slate-500" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Language Toggle Chip (BN / EN) */}
      {showLangToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleLanguage();
          }}
          className="px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 hover:bg-purple-100 text-purple-900 border border-slate-200 transition-all cursor-pointer shrink-0"
          title="ভয়েস ভাষা পরিবর্তন করুন (Switch Voice Language BN/EN)"
        >
          {currentLang === 'bn-BD' ? '🇧🇩 BN' : '🇺🇸 EN'}
        </button>
      )}

      {/* Interim Live Speech Transcript Floating Badge */}
      {isListening && interimText && (
        <div className="absolute bottom-full left-0 mb-2 z-30 pointer-events-none bg-purple-950 text-emerald-300 text-xs px-3 py-1.5 rounded-xl shadow-xl border border-purple-700 font-medium whitespace-nowrap max-w-[220px] sm:max-w-xs truncate animate-in fade-in duration-150">
          🎤 "{interimText}"
        </div>
      )}

      {/* Error / State Toast Alert */}
      {errorMessage && (
        <div className="absolute bottom-full left-0 mb-2 z-30 pointer-events-none bg-slate-900 text-rose-300 text-xs px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 font-medium whitespace-nowrap flex items-center gap-1.5 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
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
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
        isPlaying
          ? 'bg-purple-600 text-white shadow-xs'
          : 'bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-600 border border-slate-200'
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


