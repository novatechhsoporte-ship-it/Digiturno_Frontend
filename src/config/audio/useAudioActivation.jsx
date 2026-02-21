import { useEffect, useState, useCallback } from "react";

const SILENCE_URL = `/sounds/silence.wav`;

export const useAudioActivation = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const tryPlay = async () => {
    try {
      const audio = document.createElement("audio");
      audio.src = SILENCE_URL;
      audio.setAttribute("playsinline", "true");
      document.body.appendChild(audio);

      await audio.play();
      audio.pause();
      audio.remove();

      return true;
    } catch {
      return false;
    }
  };

  const unlockAudio = useCallback(async () => {
    const success = await tryPlay();
    if (success) {
      setIsUnlocked(true);
      console.log("Audio desbloqueado");
    } else {
      console.log("El navegador sigue bloqueando audio");
    }
  }, []);

  useEffect(() => {
    const check = async () => {
      const unlocked = await tryPlay();
      setIsUnlocked(unlocked);
      setIsChecking(false);
    };

    check();
  }, []);

  return {
    isUnlocked,
    isChecking,
    unlockAudio,
  };
};
