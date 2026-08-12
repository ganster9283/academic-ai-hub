import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MicStatus,
  SpeechRecognitionController,
  startSpeechRecognition
} from '../utils/speech';

export interface UseSpeechToTextOptions {
  lang?: string;
  onTranscript?: (text: string) => void;
}

export function useSpeechToText({ lang = 'bn-BD', onTranscript }: UseSpeechToTextOptions = {}) {
  const [status, setStatus] = useState<MicStatus>('ready');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [interimText, setInterimText] = useState<string>('');
  const [currentLang, setCurrentLang] = useState<string>(lang);

  const controllerRef = useRef<SpeechRecognitionController | null>(null);

  useEffect(() => {
    setCurrentLang(lang);
  }, [lang]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Clean up controller on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.stop();
        controllerRef.current = null;
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.stop();
      controllerRef.current = null;
    }
    setStatus('ready');
    setInterimText('');
  }, []);

  const startListening = useCallback(async (customLang?: string) => {
    // Stop any existing controller to prevent duplicate listeners
    if (controllerRef.current) {
      controllerRef.current.stop();
      controllerRef.current = null;
    }

    setErrorMessage(null);
    setInterimText('');

    const targetLang = customLang || currentLang;

    const controller = await startSpeechRecognition({
      lang: targetLang,
      onStatusChange: (newStatus, err) => {
        setStatus(newStatus);
        if (err) setErrorMessage(err);
      },
      onInterimResult: (text) => {
        setInterimText(text);
      },
      onFinalResult: (text) => {
        if (onTranscript) {
          onTranscript(text);
        }
        setInterimText('');
      },
      onError: (errText) => {
        setErrorMessage(errText);
      }
    });

    if (controller) {
      controllerRef.current = controller;
    }
  }, [currentLang, onTranscript]);

  const toggleListening = useCallback(async () => {
    if (status === 'listening' || status === 'requesting-permission') {
      stopListening();
    } else {
      await startListening();
    }
  }, [status, startListening, stopListening]);

  const toggleLanguage = useCallback(() => {
    const nextLang = currentLang === 'bn-BD' ? 'en-US' : 'bn-BD';
    setCurrentLang(nextLang);
    if (status === 'listening' && controllerRef.current) {
      controllerRef.current.stop();
      controllerRef.current = null;
      setStatus('ready');
    }
  }, [currentLang, status]);

  return {
    status,
    isListening: status === 'listening',
    isRequesting: status === 'requesting-permission',
    isProcessing: status === 'processing',
    interimText,
    errorMessage,
    currentLang,
    setCurrentLang,
    startListening,
    stopListening,
    toggleListening,
    toggleLanguage
  };
}
