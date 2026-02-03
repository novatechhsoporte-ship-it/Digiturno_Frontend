import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { DisplaysApi } from "@core/api/displays";
import { TicketsApi } from "@core/api/tickets";
import { createSocketConnection, disconnectSocket } from "@config/socket";
import { useQueryAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";
import { speakTicket } from "@config/adapters/speakTickets";

// import { useQueryAdapter, useMutationAdapter, createQueryKeyFactory, QUERY_PRESETS } from "@config/adapters/queryAdapter";

const DISPLAY_TOKEN_KEY = "display_token";
const displayTicketKeys = createQueryKeyFactory("displayTickets");

export const useDisplayTickets = () => {
  const { tenantId } = useParams();
  const [displayInfo, setDisplayInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  // Query for current ticket (most recent in_progress)
  const {
    data: currentTicketData,
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
      enabled: !!tenantId && !loading,
      keepPreviousData: true,
      showErrorToast: false,
    }
  );

  console.log("currentTicketData :>> ", currentTicketData);

  // Query for last called tickets
  const {
    data: lastCalledData,
    isLoading: loadingCalled,
    refetch: refetchCalled,
  } = useQueryAdapter(
    displayTicketKeys.list({ type: "called", tenantId, limit: 3 }),
    () => {
      if (!tenantId) {
        return Promise.resolve([]);
      }
      return TicketsApi.getLastCalledTickets(tenantId, 3);
    },
    {
      enabled: !!tenantId && !loading,
      showErrorToast: false,
    }
  );

  // console.log("lastCalledData :>> ", lastCalledData);

  // Query for next pending tickets
  const {
    data: nextPendingData,
    isLoading: loadingPending,
    refetch: refetchPending,
  } = useQueryAdapter(
    displayTicketKeys.list({ type: "pending", tenantId, limit: 3 }),
    () => {
      if (!tenantId) {
        return Promise.resolve([]);
      }
      return TicketsApi.getNextPendingTickets(tenantId, 3);
    },
    {
      enabled: !!tenantId && !loading,
      showErrorToast: false,
    }
  );

  // console.log("nextPendingData :>> ", nextPendingData);

  // queryAdapter now extracts axios response.data, so we get { success: true, data: ticket }
  const currentTicket = useMemo(() => {
    if (!currentTicketData) return null;
    // Backend returns { success: true, data: ticket } or just ticket
    const ticket = currentTicketData?.data !== undefined ? currentTicketData.data : currentTicketData;

    console.log("ticket :>> ", ticket);
    // If null or empty object, return null
    if (!ticket || (typeof ticket === "object" && Object.keys(ticket).length === 0)) {
      return null;
    }

    if (ticket.success === false) return null;
    return ticket;
  }, [currentTicketData]);

  console.log("currentTicket after :>> ", currentTicket);

  // Extract last called tickets - similar to useTicketList pattern
  const lastCalledTickets = useMemo(() => {
    if (!lastCalledData) return [];
    // Backend returns { success: true, data: [...] } or just array
    const tickets = lastCalledData?.data !== undefined ? lastCalledData.data : lastCalledData;
    return Array.isArray(tickets) ? tickets : [];
  }, [lastCalledData]);

  // Extract next pending tickets - similar to useTicketList pattern
  const nextPendingTickets = useMemo(() => {
    if (!nextPendingData) return [];
    // Backend returns { success: true, data: [...] } or just array
    const tickets = nextPendingData?.data !== undefined ? nextPendingData.data : nextPendingData;
    return Array.isArray(tickets) ? tickets : [];
  }, [nextPendingData]);

  // Verify token and load display info
  const verifyTokenAndLoadDisplay = useCallback(
    async (token) => {
      try {
        const response = await DisplaysApi.getCurrentDisplay(token);
        // console.log("response en ticket :>> ", response);
        const info = response.data?.data || response.data;
        // console.log("info :>> ", info);

        const displayTenantId = info.tenantId?._id?.toString() || info.tenantId?.toString();
        if (displayTenantId !== tenantId) {
          toast.error("Esta pantalla no pertenece a esta notaría");
          localStorage.removeItem(DISPLAY_TOKEN_KEY);
          window.location.href = "/display";
          return;
        }

        setDisplayInfo(info);
        setLoading(false);
      } catch (error) {
        console.error("Error verificando token del display:", error);
        localStorage.removeItem(DISPLAY_TOKEN_KEY);
        window.location.href = "/display";
      }
    },
    [tenantId]
  );

  // Initialize Socket.IO connection - similar to useTicketList pattern
  useEffect(() => {
    if (!displayInfo || loading || !tenantId) return;

    const token = localStorage.getItem(DISPLAY_TOKEN_KEY);
    if (!token) return;

    socketRef.current = createSocketConnection(token);
    const socket = socketRef.current;

    if (!socket) {
      console.error("Error conectando a Socket.IO");
      return;
    }

    // Join tickets room when connected
    const handleConnect = () => {
      console.log("Display conectado a Socket.IO");
      // Backend automatically joins tenant rooms, but we can emit if needed
      socket.emit("join-public");
      // socket.emit("join-tickets");
    };

    console.log("🧩 Socket ID display:", socket.id);

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    socket.on("joined-room", ({ room }) => {
      console.log("✅ Display unido a sala:", room);
    });

    // Listen to ticket events
    socket.on("ticket:created", () => {
      refetchPending();
    });

    socket.on("ticket:called", (payload) => {
      console.log("payload in displya:>> ", payload);
      // refetchCurrent();
      // refetchCalled();
      // refetchPending();
      // queryClient.setQueryData(displayTicketKeys.list(["current", tenantId]), payload.currentTicket);
      speakTicket({
        ticketNumber: 1,
        moduleName: "modulo 1",
        // ticketNumber: ticketData.ticketNumber,
        // moduleName: authUser?.module?.name,
      });
    });

    socket.on("ticket:started", () => {
      refetchCurrent();
      refetchCalled();
      refetchPending();
    });

    socket.on("ticket:completed", () => {
      refetchCurrent();
      refetchCalled();
      refetchPending();
    });

    socket.on("ticket:abandoned", () => {
      refetchCurrent();
      refetchCalled();
      refetchPending();
    });

    socket.on("ticket:recalled", () => {
      speakTicket({
        ticketNumber: 1,
        moduleName: "modulo 1",
        // ticketNumber: ticketData.ticketNumber,
        // moduleName: authUser?.module?.name,
      });
      refetchCurrent();
      refetchCalled();
    });

    return () => {
      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("ticket:created");
        socket.off("ticket:called");
        socket.off("ticket:started");
        socket.off("ticket:completed");
        socket.off("ticket:abandoned");
        socket.off("ticket:recalled");
      }
    };
  }, [displayInfo, loading, tenantId, refetchCurrent, refetchCalled, refetchPending]);

  // Verify token and load display info on mount
  useEffect(() => {
    const token = localStorage.getItem(DISPLAY_TOKEN_KEY);

    if (!token) {
      window.location.href = "/display";
      return;
    }

    verifyTokenAndLoadDisplay(token);
  }, [verifyTokenAndLoadDisplay]);

  useEffect(() => {
    const unlockAudio = () => {
      const utterance = new SpeechSynthesisUtterance("");
      window.speechSynthesis.speak(utterance);
      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
  }, []);

  // useEffect(() => {
  //   if ("speechSynthesis" in window) {
  //     window.speechSynthesis.getVoices();
  //   }
  // }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const isLoading = loading || loadingCurrent || loadingCalled || loadingPending;
  // const hasNoTickets = !isLoading && !currentTicket && lastCalledTickets.length === 0 && nextPendingTickets.length === 0;

  const isInitialLoading = loading && loadingCurrent && loadingCalled && loadingPending;

  // console.log("hasNoTickets :>> ", hasNoTickets);

  return {
    // Data
    currentTicket,
    lastCalledTickets,
    nextPendingTickets,
    displayInfo,

    // State
    loading: isLoading,
    // hasNoTickets,
    isInitialLoading,

    // Methods
    refetchCurrent,
    refetchCalled,
    refetchPending,
  };
};
