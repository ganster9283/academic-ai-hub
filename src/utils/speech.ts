// Speech Recognition & Speech Synthesis Utility for UEI

export const listenSpeech = (
  onResult: (text: string) => void,
  onError: (errorMsg: string) => void,
  lang: string = 'bn-BD'
): (() => void) | undefined => {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('এই ব্রাউজারে ভয়েস টাইপিং সমর্থিত নয়।');
    return undefined;
  }

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        onResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      const err = event?.error;
      console.warn('Speech recognition status:', err);

      // Handle expected/non-critical status events silently
      if (err === 'aborted') {
        // Recognition was aborted normally (e.g. user toggled off or stopped listening); do not trigger user error
        return;
      }
      if (err === 'no-speech') {
        onError('কোনো কথা শোনা যায়নি। আবার চেষ্টা করুন।');
        return;
      }
      if (err === 'not-allowed' || err === 'service-not-allowed') {
        onError('মাইক্রোফোন ব্যবহারের অনুমতি দিন।');
        return;
      }

      onError('মাইক্রোফোনে শুনতে পাওয়া যায়নি। আবার বলুন।');
    };

    recognition.start();

    return () => {
      try {
        recognition.abort();
      } catch (e) {
        // Ignore abort error if already stopped
      }
    };
  } catch (e) {
    console.error('Failed to start SpeechRecognition:', e);
    onError('ভয়েস টাইপিং শুরু করা যায়নি।');
    return undefined;
  }
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
