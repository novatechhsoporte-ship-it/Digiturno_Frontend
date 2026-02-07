import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { DisplaysApi } from "@core/api/displays";
import { TicketsApi } from "@core/api/tickets";
import { createSocketConnection } from "@config/socket";
import { getSocket } from "@config/socket";
import { useQueryAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";
import { speakTicket } from "@config/adapters/speakTickets";

const DISPLAY_TOKEN_KEY = "display_token";
const displayTicketKeys = createQueryKeyFactory("displayTickets");

export const useDisplayTickets = () => {
  const { tenantId } = useParams();
  const socketRef = useRef(null);
  const token = localStorage.getItem(DISPLAY_TOKEN_KEY);
  const isEnabled = Boolean(token && tenantId);

  const fetchDisplayInfo = async (token, tenantId) => {
    const response = await DisplaysApi.getCurrentDisplay(token);
    const info = response.data?.data || response.data;
    const displayTenantId = info.tenantId?._id?.toString() || info.tenantId?.toString();

    if (displayTenantId !== tenantId) {
      throw new Error("DISPLAY_NOT_BELONGS_TO_TENANT");
    }

    return response;
  };

  const { data: displayInfo, isLoading: loadingDisplay } = useQueryAdapter(
    ["display", tenantId],
    () => fetchDisplayInfo(token, tenantId),
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
      // keepPreviousData: true,
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

    const token = localStorage.getItem(DISPLAY_TOKEN_KEY);
    if (!token) return;

    let socket = getSocket();
    if (!socket) {
      socket = createSocketConnection(token);
    }

    socketRef.current = socket;

    socket.on("connect", () => {
      // console.log("🧩 Socket conectado (display):", socket.id);
      refetchCurrent();
      refetchPending();
    });

    // Listen to ticket events
    socket.on("ticket:created", () => {
      refetchPending();
    });

    socket.on("ticket:called", (payload) => {
      speakTicket({
        ticketNumber: payload.ticketNumber,
        moduleName: payload.moduleName,
        attempt: payload.attempts,
      });
      refetchCurrent();
      refetchPending();
    });

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("ticket:created");
        socket.off("ticket:recalled");
      }
    };
  }, [tenantId]);

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
