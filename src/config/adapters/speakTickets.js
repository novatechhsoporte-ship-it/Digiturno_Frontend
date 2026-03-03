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
  if (!("speechSynthesis" in window)) {
    console.error("❌ SpeechSynthesis no es soportado en este navegador.");
    return;
  }

  const synth = window.speechSynthesis;

  // 1. Cancelar cualquier proceso previo para evitar colas bloqueadas
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

  // Configuración de voz
  utterance.lang = "es-CO";
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  // 2. Debugging de voces
  let voices = synth.getVoices();

  // Log de todas las voces para ver qué tiene instalado la Mini PC
  console.log("🔍 Voces totales detectadas:", voices.length);
  if (voices.length > 0) {
    console.log(
      "🎙️ Lista de voces:",
      voices.map((v) => `${v.name} (${v.lang})`)
    );
  }

  const selectedVoice =
    voices.find((v) => v.lang.startsWith("es") && v.name.toLowerCase().includes("sabina")) ||
    voices.find((v) => v.lang.startsWith("es") && v.name.toLowerCase().includes("helena")) ||
    voices.find((v) => v.lang.startsWith("es")) ||
    voices.find((v) => v.default);

  if (selectedVoice) {
    console.log("✅ Voz seleccionada:", selectedVoice.name);
    utterance.voice = selectedVoice;
  } else {
    console.warn("⚠️ No se encontró una voz en español, usando la predeterminada del sistema.");
  }

  // 3. Listeners de depuración para la Mini PC
  utterance.onstart = () => console.log("▶️ Reproducción de audio iniciada...");
  utterance.onend = () => console.log("✅ Reproducción de audio finalizada con éxito.");
  utterance.onerror = (event) => console.error("❌ Error en SpeechSynthesisUtterance:", event.error);

  // 4. Ejecución con mayor margen de tiempo (Safe Timeout)
  setTimeout(() => {
    // Forzamos el resume justo antes de hablar (crítico en TVs)
    if (synth.paused) {
      console.log("⏯️ El sintetizador estaba pausado, reanudando...");
      synth.resume();
    }

    console.log("🗣️ Intentando decir:", text);
    synth.speak(utterance);
  }, 250); // 250ms da tiempo al hardware de la Mini PC a procesar el cancel()
};
