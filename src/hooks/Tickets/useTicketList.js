import { useEffect, useRef } from "react";
import { TicketsApi } from "@core/api/tickets";
import { useAuth } from "@/store/authStore";
import { createSocketConnection } from "@config/socket";
import { useQueryAdapter } from "@config/adapters/queryAdapter";
import { createQueryKeyFactory } from "@config/adapters/queryAdapter";

const ticketKeys = createQueryKeyFactory("tickets");

/**
 * Hook for managing ticket list and Socket.IO connection
 */
export const useTicketList = (selectedTenant) => {
  const { token } = useAuth();
  const socketRef = useRef(null);

  // Query for pending tickets
  const {
    data: pendingTicketsData,
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

  const pendingTickets = Array.isArray(pendingTicketsData)
    ? pendingTicketsData
    : Array.isArray(pendingTicketsData?.data)
    ? pendingTicketsData.data
    : [];

  // Initialize Socket.IO connection
  useEffect(() => {
    if (token && selectedTenant) {
      socketRef.current = createSocketConnection({
        token,
        tenantId: selectedTenant,
      });

      const socket = socketRef.current;

      socket.on("ticket:created", () => {
        loadPendingTickets();
      });

      socket.on("ticket:called", () => {
        loadPendingTickets();
      });

      socket.on("ticket:started", () => {
        loadPendingTickets();
      });

      socket.on("ticket:completed", () => {
        loadPendingTickets();
      });

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [token, selectedTenant, loadPendingTickets]);

  return {
    pendingTickets: Array.isArray(pendingTickets) ? pendingTickets : [],
    loading,
    loadPendingTickets,
  };
};
