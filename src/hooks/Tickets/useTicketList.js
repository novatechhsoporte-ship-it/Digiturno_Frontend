import { useEffect } from "react";
import { TicketsApi } from "@core/api/tickets";
import { useAuth } from "@/store/authStore";
import { useQueryAdapter, createQueryKeyFactory } from "@config/adapters/queryAdapter";
import { getSocket } from "@config/socket/socket";

const ticketKeys = createQueryKeyFactory("tickets");

export const useTicketList = (selectedTenant) => {
  const { token } = useAuth();

  // Query for pending tickets
  const {
    data: pendingTickets = [],
    isLoading: loading,
    refetch: loadPendingTickets,
  } = useQueryAdapter(
    ticketKeys.list({ tenantId: selectedTenant, status: "pending" }),
    () => {
      if (!selectedTenant) {
        return Promise.resolve([]);
      }
      return TicketsApi.getLastPendingTickets(selectedTenant);
    },
    {
      enabled: !!selectedTenant,
      showErrorToast: true,
    }
  );

  // Initialize Socket.IO connection
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const events = ["ticket:created", "ticket:called", "ticket:started", "ticket:completed", "ticket:abandoned"];

    const handler = () => {
      console.log("Refrescando tickets por evento de socket");
      loadPendingTickets();
    };

    const registerEvents = () => {
      events.forEach((event) => socket.on(event, handler));
    };

    if (socket.connected) {
      registerEvents();
    } else {
      socket.once("connect", registerEvents);
    }

    return () => {
      events.forEach((event) => socket.off(event, handler));
      socket.off("connect", registerEvents);
    };
  }, [token, selectedTenant, loadPendingTickets]);

  return {
    pendingTickets,
    loading,
    loadPendingTickets,
  };
};
