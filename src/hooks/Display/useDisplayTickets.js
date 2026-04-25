import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "sonner";

import { DisplaysApi } from "@core/api/displays";
import { TicketsApi } from "@core/api/tickets";
import { useQueryAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";
import { speakTicket } from "@config/adapters/speakTickets";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
const DISPLAY_TOKEN_KEY = "display_token";
const displayTicketKeys = createQueryKeyFactory("displayTickets");

export const useDisplayTickets = () => {
  const { tenantId } = useParams();
  const socketRef = useRef(null);
  const token = localStorage.getItem(DISPLAY_TOKEN_KEY);
  const isEnabled = Boolean(token && tenantId);

  const { data: displayInfo, isLoading: loadingDisplay } = useQueryAdapter(
    ["display", tenantId],
    () => DisplaysApi.getCurrentDisplay(token, tenantId),
    {
      enabled: isEnabled,
      retry: false,
      showErrorToast: false,
      onError: (err) => {
        if (err.message === "DISPLAY_NOT_BELONGS_TO_TENANT") {
          toast.error("Esta pantalla no pertenece a esta notaría");
          localStorage.removeItem(DISPLAY_TOKEN_KEY);
          window.location.href = "/display";
        }

        console.error("Error cargando display:", err);
      },
    }
  );

  // Query for current ticket (most recent in_progress)
  const {
    data: currentTicket,
    isLoading: loadingCurrent,
    refetch: refetchCurrent,
  } = useQueryAdapter(
    displayTicketKeys.list({ type: "current", tenantId }),
    () => {
      if (!tenantId) {
        return Promise.resolve(null);
      }
      return TicketsApi.getCurrentDisplayTicket(tenantId);
    },
    {
      enabled: !!tenantId,
      showErrorToast: false,
    }
  );

  // Query for next pending tickets
  const {
    data: nextPendingTickets,
    isLoading: loadingPending,
    refetch: refetchPending,
  } = useQueryAdapter(
    displayTicketKeys.list({ type: "pending", tenantId, limit: 20 }),
    () => {
      if (!tenantId) {
        return Promise.resolve([]);
      }
      return TicketsApi.getNextPendingTickets(tenantId, 20);
    },
    {
      enabled: !!tenantId,
      showErrorToast: false,
    }
  );

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!tenantId || !token) return;

    // Obtener o inicializar el socket
    let displaySocket = socketRef.current;

    if (!displaySocket || !displaySocket.connected) {
      if (displaySocket) {
        displaySocket.removeAllListeners();
        displaySocket.disconnect();
      }

      displaySocket = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: { token },
        reconnection: true,
        autoConnect: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 5000,
      });

      socketRef.current = displaySocket;

      // Eventos de conexión básica
      displaySocket.on("connect", () => {
        refetchCurrent();
        refetchPending();
      });

      displaySocket.on("connect_error", (err) => {
        console.error("Error conectando display socket:", err.message);
        // Si el token falló, recargamos en 15 seg para intentar recuperar sesión
        if (err.message === "jwt expired" || err.message === "auth error") {
          setTimeout(() => window.location.reload(), 15000);
        }
      });
    }

    // Definir los Handlers de los eventos
    const handleTicketCreated = () => refetchPending();

    const handleTicketCompleted = () => {
      refetchCurrent();
      refetchPending();
    };

    const handleTicketCalled = (payload) => {
      speakTicket({
        ticketNumber: payload.ticketNumber,
        customerName: payload.customerName,
        moduleName: payload.moduleName,
        attempt: payload.attempts,
      });
      refetchCurrent();
      refetchPending();
    };

    const handleTicketRecalled = () => {
      refetchCurrent();
      refetchPending();
    };

    displaySocket.off("ticket:created").on("ticket:created", handleTicketCreated);
    displaySocket.off("ticket:completed").on("ticket:completed", handleTicketCompleted);
    displaySocket.off("ticket:abandoned").on("ticket:abandoned", handleTicketCompleted);
    displaySocket.off("ticket:called").on("ticket:called", handleTicketCalled);
    displaySocket.off("ticket:recalled").on("ticket:recalled", handleTicketRecalled);

    // Cleanup: Limpieza al desmontar
    return () => {
      if (displaySocket) {
        console.log("Limpiando listeners de socket...");
        displaySocket.removeAllListeners();
      }
    };
  }, [tenantId, token]);

  useEffect(() => {
    const unlockAudio = () => {
      const utterance = new SpeechSynthesisUtterance("");
      window.speechSynthesis.speak(utterance);
      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // --- REFRESCO PROGRAMADO (07:45 AM) ---
  // Limpia memoria y caché del navegador antes de iniciar el día.
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      if (now.getHours() === 7 && now.getMinutes() === 45) {
        console.log("Reinicio preventivo matutino.");
        window.location.reload();
      }
    };
    const scheduleInterval = setInterval(checkSchedule, 60000);
    return () => clearInterval(scheduleInterval);
  }, []);

  // --- WATCHDOG DE RED Y VISIBILIDAD ---
  // Si vuelve el internet o la pantalla se "despierta", sincroniza datos inmediatamente.
  useEffect(() => {
    const handleRecovery = () => {
      if (document.visibilityState === "visible" || navigator.onLine) {
        console.log("Sistema online/visible. Sincronizando...");
        refetchCurrent();
        refetchPending();
        if (socketRef.current && !socketRef.current.connected) {
          socketRef.current.connect();
        }
      }
    };

    window.addEventListener("visibilitychange", handleRecovery);
    window.addEventListener("online", handleRecovery);
    return () => {
      window.removeEventListener("visibilitychange", handleRecovery);
      window.removeEventListener("online", handleRecovery);
    };
  }, []);

  // --- MONITOR DE SALUD DEL SOCKET ---
  // Si el socket muere y no revive en 5 min, reinicia la app para forzar reconexión.
  useEffect(() => {
    const healthCheck = setInterval(() => {
      if (socketRef.current && !socketRef.current.connected) {
        console.warn("Socket caído. Forzando recarga del sistema...");
        window.location.reload();
      }
    }, 300000); // 5 minutos
    return () => clearInterval(healthCheck);
  }, []);

  const isLoading = loadingDisplay || loadingCurrent || loadingPending;
  const isInitialLoading = loadingDisplay && loadingCurrent && loadingPending;

  return {
    // Data
    currentTicket,
    nextPendingTickets,

    // State
    loading: isLoading,
    isInitialLoading,
  };
};
