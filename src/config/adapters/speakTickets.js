const spellTicket = (ticket) => {
  return ticket
    .split("")
    .map((char) => {
      if (char === "-") return " guión ";
      return ` ${char} `;
    })
    .join("");
};

export const speakTicket = ({ ticketNumber, moduleName, attempt = 1 }) => {
  if (!("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;

  // 🔹 Si está pausado (pasa en TVs)
  if (synth.paused) {
    synth.resume();
  }

  // 🔹 Cancelar cualquier voz anterior
  synth.cancel();

  const spelledTicket = spellTicket(ticketNumber);

  let suffix = "";
  if (attempt >= 3) {
    suffix = ", último llamado";
  } else if (attempt === 2) {
    suffix = ", segundo llamado";
  }

  const text = moduleName
    ? `Turno ${spelledTicket}, dirigirse al módulo ${moduleName}${suffix}`
    : `Turno ${spelledTicket}, por favor acercarse${suffix}`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-CO";
  utterance.rate = 0.9; // 🔹 ligeramente más estable que 0.85
  utterance.pitch = 1;
  utterance.volume = 1;

  // 🔹 Asegurar que las voces estén cargadas
  let voices = synth.getVoices();

  if (!voices.length) {
    synth.onvoiceschanged = () => {
      voices = synth.getVoices();
    };
  }

  const selectedVoice =
    voices.find((v) => v.lang.startsWith("es") && v.name.toLowerCase().includes("sabina")) ||
    voices.find((v) => v.lang.startsWith("es") && v.name.toLowerCase().includes("helena")) ||
    voices.find((v) => v.lang.startsWith("es")) ||
    voices.find((v) => v.default);

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  setTimeout(() => {
    synth.speak(utterance);
  }, 100);
};
