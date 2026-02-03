export const speakTicket = ({ ticketNumber, moduleName }) => {
  if (!("speechSynthesis" in window)) return;

  // Cancela cualquier voz previa
  window.speechSynthesis.cancel();

  const text = moduleName
    ? `Turno ${ticketNumber}, dirigirse al módulo ${moduleName}`
    : `Turno ${ticketNumber}, por favor acercarse`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-CO";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  console.log("voices :>> ", voices);
  const spanishVoice = voices.find((v) => v.lang.startsWith("es"));

  if (spanishVoice) {
    utterance.voice = spanishVoice;
  }

  window.speechSynthesis.speak(utterance);
};
