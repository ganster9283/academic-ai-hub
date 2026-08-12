// Speech Recognition & Speech Synthesis Utility for UEI

export type MicStatus =
  | 'ready'
  | 'requesting-permission'
  | 'listening'
  | 'processing'
  | 'permission-denied'
  | 'microphone-unavailable'
  | 'browser-not-supported';

export interface SpeechRecognitionOptions {
  lang?: string; // e.g. 'bn-BD' | 'en-US'
  onStatusChange?: (status: MicStatus, errorMessage?: string) => void;
  onInterimResult?: (interimText: string) => void;
  onFinalResult?: (finalText: string) => void;
  onError?: (errorMsg: string) => void;
}

export interface SpeechRecognitionController {
  stop: () => void;
  lang: string;
}

export const requestMicrophonePermission = async (): Promise<boolean> => {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Immediately stop tracks so the device is freed for SpeechRecognition
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (err: any) {
    console.warn('Microphone permission request failed:', err);
    return false;
  }
};

export const startSpeechRecognition = async (
  options: SpeechRecognitionOptions
): Promise<SpeechRecognitionController | null> => {
  const {
    lang = 'bn-BD',
    onStatusChange,
    onInterimResult,
    onFinalResult,
    onError
  } = options;

  if (typeof window === 'undefined') {
    onStatusChange?.('browser-not-supported', 'ভয়েস সাপোর্ট উপলব্ধ নয়।');
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onStatusChange?.('browser-not-supported', 'এই ব্রাউজারে ভয়েস টাইপিং সমর্থিত নয় (Speech recognition not supported in this browser).');
    onError?.('এই ব্রাউজারে ভয়েস টাইপিং সমর্থিত নয়।');
    return null;
  }

  onStatusChange?.('requesting-permission');

  // Request audio permission via getUserMedia first for mobile/Android Chrome compatibility
  const hasPermission = await requestMicrophonePermission();
  if (!hasPermission) {
    onStatusChange?.('permission-denied', 'মাইক্রোফোনের অনুমতি দেওয়া হয়নি (Microphone permission denied).');
    onError?.('মাইক্রোফোনের অনুমতি দেওয়া হয়নি। অনুগ্রহ করে ব্রাউজার পারমিশন চেক করুন।');
    return null;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let accumulatedFinal = '';
    let isStoppedManually = false;

    recognition.onstart = () => {
      onStatusChange?.('listening');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) {
          accumulatedFinal += (accumulatedFinal ? ' ' : '') + transcript.trim();
        } else {
          interim += transcript;
        }
      }

      if (interim && onInterimResult) {
        onInterimResult(interim);
      }
    };

    recognition.onerror = (event: any) => {
      const err = event?.error;
      console.warn('SpeechRecognition error:', err);

      if (err === 'aborted') {
        return;
      }
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        onStatusChange?.('permission-denied', 'মাইক্রোফোন ব্যবহারের অনুমতি দেওয়া হয়নি (Permission denied).');
        onError?.('মাইক্রোফোনের অনুমতি দেওয়া হয়নি।');
        return;
      }
      if (err === 'audio-capture') {
        onStatusChange?.('microphone-unavailable', 'মাইক্রোফোন পাওয়া যায়নি (Microphone unavailable).');
        onError?.('মাইক্রোফোন পাওয়া যায়নি।');
        return;
      }
      if (err === 'no-speech') {
        onStatusChange?.('ready');
        onError?.('কোনো কথা শোনা যায়নি। আবার চেষ্টা করুন।');
        return;
      }
      if (err === 'network') {
        onStatusChange?.('ready');
        onError?.('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।');
        return;
      }

      onStatusChange?.('ready');
      onError?.('মাইক্রোফোনে শুনতে পাওয়া যায়নি। আবার বলুন।');
    };

    recognition.onend = () => {
      if (isStoppedManually) {
        onStatusChange?.('ready');
        return;
      }

      if (accumulatedFinal.trim()) {
        onStatusChange?.('processing');
        onFinalResult?.(accumulatedFinal.trim());
        setTimeout(() => onStatusChange?.('ready'), 300);
      } else {
        onStatusChange?.('ready');
      }
    };

    recognition.start();

    return {
      stop: () => {
        isStoppedManually = true;
        try {
          recognition.stop();
        } catch (e) {
          try {
            recognition.abort();
          } catch (e2) {
            // ignore
          }
        }
        onStatusChange?.('ready');
      },
      lang
    };
  } catch (e: any) {
    console.error('Failed to start SpeechRecognition:', e);
    onStatusChange?.('microphone-unavailable', 'ভয়েস টাইপিং শুরু করা যায়নি।');
    onError?.('ভয়েস টাইপিং শুরু করা যায়নি।');
    return null;
  }
};

// Legacy fallback wrapper for backwards compatibility
export const listenSpeech = (
  onResult: (text: string) => void,
  onError: (errorMsg: string) => void,
  lang: string = 'bn-BD'
): (() => void) | undefined => {
  let controller: SpeechRecognitionController | null = null;
  startSpeechRecognition({
    lang,
    onFinalResult: onResult,
    onError
  }).then((ctrl) => {
    controller = ctrl;
  });

  return () => {
    if (controller) {
      controller.stop();
    }
  };
};

export const speakText = (
  text: string,
  lang: string = 'bn-BD',
  onEnd?: () => void,
  onError?: () => void
) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    if (onError) onError();
    return;
  }

  window.speechSynthesis.cancel();

  // Strip markdown formatting symbols for natural reading
  const cleanText = text.replace(/[*_#`~>|-]/g, ' ').replace(/\s+/g, ' ');

  const utterance = new SpeechSynthesisUtterance(cleanText.slice(0, 400));
  utterance.lang = lang;
  utterance.rate = 0.95;

  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;

  window.speechSynthesis.speak(utterance);
};

