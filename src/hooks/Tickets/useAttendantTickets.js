import { useEffect, useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { TicketsApi } from "@core/api/tickets";
import { useAuth } from "@/store/authStore";
import { getSocket } from "@config/socket";
import { useQueryAdapter, useMutationAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";

const ticketKeys = createQueryKeyFactory("tickets");

export const useAttendantTickets = () => {
  const { user: authUser, token } = useAuth();
  const queryClient = useQueryClient();
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const [pendingTicketId, setPendingTicketId] = useState(null);

  const tenantId = authUser?.tenantId;
  const attendantId = authUser?._id;

  const {
    data: { data: pendingTickets } = { data: [] },
    isLoading: loadingPending,
    refetch: refetchPendingTickets,
  } = useQueryAdapter(
    ticketKeys.list({ tenantId, status: "pending", limit: 20 }),
    () => TicketsApi.getLastPendingTickets(tenantId),
    {
      enabled: Boolean(tenantId),
      showErrorToast: true,
    }
  );

  const {
    data: currentTicketResponse,
    isLoading: loadingCurrent,
    refetch: refetchCurrentTicket,
  } = useQueryAdapter(
    ["tickets", "current", attendantId, tenantId],
    () => TicketsApi.getCurrentAttendantTicket(attendantId, tenantId),
    {
      enabled: Boolean(attendantId && tenantId),
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const currentTicket = useMemo(() => {
    if (!currentTicketResponse) return null;

    const data = currentTicketResponse?.data?.data || currentTicketResponse?.data;
    if (!data || (typeof data === "object" && !Array.isArray(data) && Object.keys(data).length === 0)) {
      return null;
    }

    return data;
  }, [currentTicketResponse]);

  const serviceTimer = useMemo(() => {
    if (!currentTicket?.startedAt) return "00:00";

    const start = new Date(currentTicket.startedAt);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);

    const minutes = Math.floor(diffSeconds / 60);
    const seconds = diffSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [currentTicket?.startedAt]);

  const callNextTicketMutation = useMutationAdapter((payload) => TicketsApi.callNextTicket(tenantId, payload), {
    successMessage: "Turno llamado exitosamente",
    invalidateQueries: [
      ticketKeys.list({ tenantId, status: "pending", limit: 20 }),
      ["tickets", "current", attendantId, tenantId],
    ],
    onSuccess: (data) => {
      // Update current ticket in cache immediately
      const ticketData = data?.data || data;
      if (ticketData) {
        queryClient.setQueryData(["tickets", "current", attendantId, tenantId], { data: ticketData });
      }
      refetchPendingTickets();
    },
  });

  const abandonTicketMutation = useMutationAdapter((ticketId) => TicketsApi.abandonTicket(ticketId), {
    successMessage: "Turno abandonado exitosamente",
    invalidateQueries: [
      ticketKeys.list({ tenantId, status: "pending", limit: 20 }),
      ["tickets", "current", attendantId, tenantId],
    ],
    onSuccess: () => {
      queryClient.setQueryData(["tickets", "current", attendantId, tenantId], null);
      refetchPendingTickets();
    },
  });

  const completeTicketMutation = useMutationAdapter(({ ticketId, notes }) => TicketsApi.completeTicket(ticketId, { notes }), {
    successMessage: "Turno completado exitosamente",
    invalidateQueries: [
      ticketKeys.list({ tenantId, status: "pending", limit: 20 }),
      ["tickets", "current", attendantId, tenantId],
    ],
    onSuccess: () => {
      queryClient.setQueryData(["tickets", "current", attendantId, tenantId], null);
      refetchPendingTickets();
    },
  });

  const recallTicketMutation = useMutationAdapter((ticketId) => TicketsApi.recallTicket(ticketId), {
    successMessage: "Turno vuelto a llamar exitosamente",
    invalidateQueries: [["tickets", "current", attendantId, tenantId]],
    onSuccess: (data) => {
      // Update current ticket in cache with updated callCount
      const ticketData = data?.data || data;
      if (ticketData) {
        queryClient.setQueryData(["tickets", "current", attendantId, tenantId], { data: ticketData });
      }
    },
  });

  const handleCallNextTicket = useCallback(() => {
    const moduleId = authUser?.module?._id;
    console.log("moduleId :>> ", moduleId);
    if (!attendantId) {
      toast.error("No se pudo identificar al asesor");
      return;
    }

    callNextTicketMutation.mutate({
      attendantId,
      ...(moduleId && { moduleId }),
    });
  }, [attendantId, callNextTicketMutation]);

  const handleAbandonTicket = useCallback((ticketId) => {
    if (!ticketId) return;
    setPendingTicketId(ticketId);
    setShowAbandonConfirm(true);
  }, []);

  const confirmAbandonTicket = useCallback(() => {
    if (pendingTicketId) {
      abandonTicketMutation.mutate(pendingTicketId);
      setShowAbandonConfirm(false);
      setPendingTicketId(null);
    }
  }, [pendingTicketId, abandonTicketMutation]);

  const handleCompleteTicket = useCallback((ticketId, notes = "") => {
    if (!ticketId) return;
    setPendingTicketId(ticketId);
    setShowCompleteConfirm(true);
  }, []);

  const confirmCompleteTicket = useCallback(
    (notes = "") => {
      if (pendingTicketId) {
        completeTicketMutation.mutate({ ticketId: pendingTicketId, notes });
        setShowCompleteConfirm(false);
        setPendingTicketId(null);
      }
    },
    [pendingTicketId, completeTicketMutation]
  );

  const handleRecallTicket = useCallback(
    (ticketId) => {
      if (!ticketId) return;
      recallTicketMutation.mutate(ticketId);
    },
    [recallTicketMutation]
  );

  const canCallNext = !currentTicket?._id && !loadingCurrent;

  /* =========== SOCKET ============ */
  useEffect(() => {
    if (!token || !tenantId) return;

    const socket = getSocket();
    if (!socket) return;

    socket.on("ticket:created", refetchPendingTickets);
    socket.on("ticket:called", refetchPendingTickets);

    socket.on("ticket:started", (ticket) => {
      const ticketData = ticket?.data || ticket;
      queryClient.setQueryData(["tickets", "current", attendantId, tenantId], { data: ticketData });
      refetchPendingTickets();
    });

    socket.on("ticket:recalled", (ticket) => {
      // Update current ticket with new callCount
      const ticketData = ticket?.data || ticket;
      queryClient.setQueryData(["tickets", "current", attendantId, tenantId], { data: ticketData });
    });

    socket.on("ticket:completed", () => {
      queryClient.setQueryData(["tickets", "current", attendantId, tenantId], null);
      refetchPendingTickets();
    });

    socket.on("ticket:abandoned", () => {
      queryClient.setQueryData(["tickets", "current", attendantId, tenantId], null);
      refetchPendingTickets();
    });

    return () => {
      socket.off("ticket:created");
      socket.off("ticket:called");
      socket.off("ticket:started");
      socket.off("ticket:completed");
      socket.off("ticket:abandoned");
      socket.off("ticket:recalled");
    };
  }, [token, tenantId, attendantId]);

  return {
    // Data
    pendingTickets,
    currentTicket,
    loading: loadingPending || loadingCurrent,
    serviceTimer,

    // Actions
    handleCallNextTicket,
    handleAbandonTicket,
    handleCompleteTicket,
    handleRecallTicket,

    // State
    canCallNext,
    isCallingNext: callNextTicketMutation.isPending,
    isAbandoning: abandonTicketMutation.isPending,
    isCompleting: completeTicketMutation.isPending,
    isRecalling: recallTicketMutation.isPending,

    // Refetch
    refetchPendingTickets,
    refetchCurrentTicket,

    // Modals
    showCompleteConfirm,
    showAbandonConfirm,
    setShowCompleteConfirm,
    setShowAbandonConfirm,
    confirmCompleteTicket,
    confirmAbandonTicket,
  };
};
