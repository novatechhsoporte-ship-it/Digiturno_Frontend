import { useState, useCallback } from "react";

export const useAudioActivation = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlockAudio = useCallback(() => {
    try {
      if (!("speechSynthesis" in window)) {
        console.warn("SpeechSynthesis no soportado");
        return;
      }

      const utterance = new SpeechSynthesisUtterance(" ");
      utterance.volume = 0;
      utterance.rate = 1;
      utterance.pitch = 1;

      window.speechSynthesis.speak(utterance);

      setIsUnlocked(true);
      console.log("🔊 Speech desbloqueado correctamente");
    } catch (err) {
      console.error("Error desbloqueando speech:", err);
    }
  }, []);

  return {
    isUnlocked,
    unlockAudio,
  };
};
