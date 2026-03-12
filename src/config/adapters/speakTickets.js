const spellTicket = (ticket) => {
  return ticket
    .split("")
    .map((char) => {
      if (char === "-") return " guión ";
      return ` ${char} `;
    })
    .join("");
};

// Queue for handling simultaneous calls
let announcementQueue = [];
let isProcessingQueue = false;

/**
 * Processes the announcement queue sequentially
 */
const processQueue = () => {
  if (announcementQueue.length === 0) {
    isProcessingQueue = false;
    console.log("🏁 Cola de anuncios vacía.");
    return;
  }

  isProcessingQueue = true;
  const currentAnnouncement = announcementQueue.shift();
  const synth = window.speechSynthesis;

  const { text, ticketNumber, attempt } = currentAnnouncement;
  console.log(`🗣️ Procesando anuncio: "${text}" (Intento: ${attempt})`);

  const utterance = new SpeechSynthesisUtterance(text);

  // Configuración de voz
  utterance.lang = "es-CO";
  utterance.rate = 0.85; // Un poco más lento para mayor claridad
  utterance.pitch = 1;
  utterance.volume = 1;

  // Selección de voz
  let voices = synth.getVoices();
  const selectedVoice =
    voices.find((v) => v.lang.startsWith("es") && v.name.toLowerCase().includes("sabina")) ||
    voices.find((v) => v.lang.startsWith("es") && v.name.toLowerCase().includes("helena")) ||
    voices.find((v) => v.lang.startsWith("es")) ||
    voices.find((v) => v.default);

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onstart = () => {
    console.log(`▶️ Iniciando audio para turno: ${ticketNumber}`);
  };

  utterance.onend = () => {
    console.log(`✅ Audio finalizado para turno: ${ticketNumber}. Pasando al siguiente...`);
    // Breve pausa entre anuncios
    setTimeout(() => {
      processQueue();
    }, 500);
  };

  utterance.onerror = (event) => {
    console.error("❌ Error en SpeechSynthesis:", event.error);
    processQueue();
  };

  // Asegurar que no esté pausado (común en navegadores por inactividad)
  if (synth.paused) {
    synth.resume();
  }

  synth.speak(utterance);
};

export const speakTicket = ({ ticketNumber, customerName, moduleName, attempt = 1 }) => {
  console.log("📢 Nueva solicitud de anuncio:", { ticketNumber, moduleName, attempt });

  if (!("speechSynthesis" in window)) {
    console.error("❌ SpeechSynthesis no es soportado en este navegador.");
    return;
  }

  const spelledTicket = spellTicket(ticketNumber);
  let suffix = "";

  if (attempt >= 3) {
    suffix = ", último llamado";
  } else if (attempt === 2) {
    suffix = ", segundo llamado";
  }

  // Incluir el módulo y nombre en el texto hablado
  const modulePart = moduleName ? `, al módulo ${moduleName}` : "";
  const namePart = customerName ? `, ${customerName}` : "";
  const text = `Turno ${spelledTicket}${namePart}, por favor acercarse${modulePart}${suffix}`;

  console.log(`📝 Texto generado para la cola: "${text}"`);

  // Añadir a la cola
  announcementQueue.push({ text, ticketNumber, attempt });

  // Iniciar procesamiento si no está en marcha
  if (!isProcessingQueue) {
    console.log("🚀 Iniciando procesamiento de la cola...");
    processQueue();
  } else {
    console.log("⏱️ Anuncio añadido a la cola interna. Esperando turno...");
  }
};
