import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { DisplaysApi } from "@core/api/displays";
import { toast } from "sonner";
import { createSocketConnection, disconnectSocket } from "@config/socket/socket";
import "./DisplayView.scss";

const DISPLAY_TOKEN_KEY = "display_token";

export const DisplayView = () => {
  const { tenantId } = useParams();
  const [displayInfo, setDisplayInfo] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify token and load display info
  const verifyTokenAndLoadDisplay = useCallback(
    async (token) => {
      try {
        const response = await DisplaysApi.getCurrentDisplay(token);
        // The response from axios is already response.data
        const info = response.data?.data || response.data;

        // Verify tenant matches
        const displayTenantId = info.tenantId?._id?.toString() || info.tenantId?.toString();
        if (displayTenantId !== tenantId) {
          toast.error("Esta pantalla no pertenece a esta notaría");
          localStorage.removeItem(DISPLAY_TOKEN_KEY);
          // window.location.href = "/display";
          return;
        }

        setDisplayInfo(info);
        setLoading(false);
      } catch (error) {
        console.error("Error verificando token del display:", error);
        // Token is invalid, redirect to pairing
        localStorage.removeItem(DISPLAY_TOKEN_KEY);
        // window.location.href = "/display";
      }
    },
    [tenantId]
  );

  // Connect to Socket.IO
  const connectSocket = useCallback(
    (token) => {
      disconnectSocket();

      const socket = createSocketConnection(token);

      if (!socket) {
        toast.error("Error conectando a Socket.IO");
        return null;
      }

      socket.on("connect", () => {
        console.log("Display conectado a Socket.IO");
      });

      socket.on("connect_error", (error) => {
        console.error("Error de conexión Socket.IO:", error);
      });

      // Listen for ticket events
      socket.on("ticket:called", (ticket) => {
        // Only show tickets for assigned modules or all if no modules assigned
        if (!displayInfo?.moduleIds?.length || displayInfo.moduleIds.some((m) => m._id === ticket.moduleId?._id)) {
          setCurrentTicket(ticket);
        }
      });

      socket.on("ticket:started", (ticket) => {
        if (!displayInfo?.moduleIds?.length || displayInfo.moduleIds.some((m) => m._id === ticket.moduleId?._id)) {
          setCurrentTicket(ticket);
        }
      });

      socket.on("ticket:completed", () => {
        setCurrentTicket(null);
      });

      socket.on("ticket:abandoned", () => {
        setCurrentTicket(null);
      });

      return socket;
    },
    [displayInfo]
  );

  // Verify token and load display info on mount
  useEffect(() => {
    const token = localStorage.getItem(DISPLAY_TOKEN_KEY);
    console.log("token :>> ", token);

    if (!token) {
      // No token, redirect to pairing page
      console.log("No display token found, redirecting to pairing");
      window.location.href = "/display";
      return;
    }

    verifyTokenAndLoadDisplay(token);
  }, [verifyTokenAndLoadDisplay]);

  // Connect to Socket.IO and listen for tickets
  useEffect(() => {
    const token = localStorage.getItem(DISPLAY_TOKEN_KEY);
    if (!token || !displayInfo) return;

    const socket = connectSocket(token);

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("connect_error");
        socket.off("ticket:called");
        socket.off("ticket:started");
        socket.off("ticket:completed");
        socket.off("ticket:abandoned");
      }
    };
  }, [displayInfo, connectSocket]);

  if (loading) {
    return (
      <div className="display-view">
        <div className="display-view__loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="display-view">
      <div className="display-view__header">
        <h1 className="display-view__title">{displayInfo?.name || "Pantalla de Turnos"}</h1>
        {displayInfo?.location && <p className="display-view__subtitle">{displayInfo.location}</p>}
      </div>

      {currentTicket ? (
        <div className="display-view__ticket">
          <div className="display-view__ticket-number">{currentTicket.ticketNumber}</div>
          <div className="display-view__ticket-customer">
            {currentTicket.customerId?.fullName || currentTicket.customer?.fullName || "Cliente"}
          </div>
          {currentTicket.moduleId?.name && (
            <div className="display-view__ticket-module">Módulo: {currentTicket.moduleId.name}</div>
          )}
        </div>
      ) : (
        <div className="display-view__empty">
          <div className="display-view__empty-icon">📋</div>
          <p className="display-view__empty-message">Esperando turno...</p>
        </div>
      )}
    </div>
  );
};
