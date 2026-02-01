import { useEffect, useRef } from "react";
import { TicketsApi } from "@core/api/tickets";
import { useAuth } from "@/store/authStore";
import { createSocketConnection } from "@config/socket";
import { useQueryAdapter } from "@config/adapters/queryAdapter";
import { createQueryKeyFactory } from "@config/adapters/queryAdapter";

const ticketKeys = createQueryKeyFactory("tickets");

export const useTicketList = (selectedTenant) => {
  const { token } = useAuth();
  const socketRef = useRef(null);

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
    if (token && selectedTenant) {
      socketRef.current = createSocketConnection(token);

      const socket = socketRef.current;

      // Join tickets room when connected
      const handleConnect = () => {
        socket.emit("join-tickets");
      };

      if (socket.connected) {
        handleConnect();
      } else {
        socket.on("connect", handleConnect);
      }

      // Listen to ticket events
      socket.on("ticket:created", () => {
        // console.log("Evento ticket:created recibido en useTicketList");
        loadPendingTickets();
      });

      socket.on("ticket:called", () => {
        // console.log("Evento ticket:called recibido en useTicketList");
        loadPendingTickets();
      });

      socket.on("ticket:started", () => {
        // console.log("Evento ticket:started recibido en useTicketList");
        loadPendingTickets();
      });

      socket.on("ticket:completed", () => {
        // console.log("Evento ticket:completed recibido en useTicketList");
        loadPendingTickets();
      });

      socket.on("ticket:abandoned", () => {
        // console.log("Evento ticket:abandoned recibido en useTicketList");
        loadPendingTickets();
      });

      return () => {
        if (socket) {
          socket.off("connect", handleConnect);
          socket.off("ticket:created");
          socket.off("ticket:called");
          socket.off("ticket:started");
          socket.off("ticket:completed");
          socket.off("ticket:abandoned");
        }
      };
    }
  }, [token, selectedTenant, loadPendingTickets]);

  return {
    pendingTickets,
    loading,
    loadPendingTickets,
  };
};
