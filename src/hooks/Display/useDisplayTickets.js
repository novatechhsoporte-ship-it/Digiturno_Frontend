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
    displayTicketKeys.list({ type: "pending", tenantId, limit: 6 }),
    () => {
      if (!tenantId) {
        return Promise.resolve([]);
      }
      return TicketsApi.getNextPendingTickets(tenantId, 6);
    },
    {
      enabled: !!tenantId,
      showErrorToast: false,
    }
  );

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!tenantId) return;
    if (!token) return;

    // Crear conexión independiente para display (no usar el singleton)
    let displaySocket = socketRef.current;

    // Si no hay socket o está desconectado, crear uno nuevo
    if (!displaySocket || !displaySocket.connected) {
      // Desconectar socket anterior si existe
      if (displaySocket) {
        displaySocket.removeAllListeners();
        displaySocket.disconnect();
      }

      // Crear nueva conexión con token de display
      displaySocket = io(SOCKET_URL, {
        transports: ["websocket"],
        auth: { token },
        reconnection: true,
        autoConnect: true,
        reconnectionAttempts: 5,
      });

      socketRef.current = displaySocket;

      // Handlers para eventos de conexión
      const handleConnect = () => {
        // console.log("Display socket conectado:", displaySocket.id);
        refetchCurrent();
        refetchPending();
      };

      const handleConnectError = (err) => {
        console.error("Error conectando display socket:", err.message);
      };

      // Registrar listeners de conexión
      displaySocket.on("connect", handleConnect);
      displaySocket.on("connect_error", handleConnectError);
    }

    // Handlers para eventos de tickets
    const handleTicketCreated = () => {
      refetchPending();
    };

    // const handleTicketCalled = (payload) => {
    //   speakTicket({
    //     ticketNumber: payload.ticketNumber,
    //     moduleName: payload.moduleName,
    //     attempt: payload.attempts,
    //   });
    //   refetchCurrent();
    //   refetchPending();
    // };
    const handleTicketCalled = (payload) => {
      speakTicket({
        audioUrl: payload.audioUrl,
      });
    };

    const handleTicketRecalled = () => {
      refetchCurrent();
      refetchPending();
    };

    // Agregar listeners de tickets
    displaySocket.on("ticket:created", handleTicketCreated);
    displaySocket.on("ticket:called", handleTicketCalled);
    displaySocket.on("ticket:recalled", handleTicketRecalled);

    // Cleanup: limpiar listeners y desconectar cuando cambien tenantId o token
    return () => {
      if (displaySocket) {
        // Limpiar todos los listeners
        displaySocket.removeAllListeners();

        // Desconectar y limpiar referencia
        displaySocket.disconnect();
        socketRef.current = null;
      }
    };
  }, [tenantId, token]);

  // useEffect(() => {
  //   const unlockAudio = () => {
  //     const utterance = new SpeechSynthesisUtterance("");
  //     window.speechSynthesis.speak(utterance);
  //     document.removeEventListener("click", unlockAudio);
  //   };

  //   document.addEventListener("click", unlockAudio);
  // }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
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
