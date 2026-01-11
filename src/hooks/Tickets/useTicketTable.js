import { useMemo, useCallback } from "react";
import { toast } from "sonner";
import { TicketsApi } from "@core/api/tickets";
import { useAuth } from "@/store/authStore";
import { useAbility } from "@hooks/";

/**
 * Hook for managing ticket table columns and actions
 */
export const useTicketTable = (selectedModule, loadPendingTickets, handleEditCustomer) => {
  const { user: authUser } = useAuth();
  const { canAny } = useAbility();

  const canCall = canAny(["tickets.update_status", "tickets.manage"]);
  const canEdit = canAny(["tickets.edit", "tickets.manage"]);

  // Call ticket
  const callTicket = useCallback(
    async (ticketId) => {
      try {
        const payload = {
          ...(selectedModule && { moduleId: selectedModule }),
          ...(authUser?._id && { attendantId: authUser._id }),
        };

        await TicketsApi.callTicket(ticketId, payload);
        toast.success("Turno llamado exitosamente");
        loadPendingTickets();
      } catch (err) {
        toast.error(err?.response?.data?.error || err?.message || "Error llamando turno");
      }
    },
    [selectedModule, authUser?._id, loadPendingTickets]
  );

  // Start ticket (assign to module/attendant)
  const startTicket = useCallback(
    async (ticketId) => {
      if (!selectedModule) {
        toast.error("Debe seleccionar un módulo");
        return;
      }

      try {
        const payload = {
          moduleId: selectedModule,
          attendantId: authUser?._id || "",
        };

        await TicketsApi.startTicket(ticketId, payload);
        toast.success("Turno iniciado exitosamente");
        loadPendingTickets();
      } catch (err) {
        toast.error(err?.response?.data?.error || err?.message || "Error iniciando turno");
      }
    },
    [selectedModule, authUser?._id, loadPendingTickets]
  );

  // Complete ticket
  const completeTicket = useCallback(
    async (ticketId) => {
      try {
        await TicketsApi.completeTicket(ticketId);
        toast.success("Turno completado exitosamente");
        loadPendingTickets();
      } catch (err) {
        toast.error(err?.response?.data?.error || err?.message || "Error completando turno");
      }
    },
    [loadPendingTickets]
  );

  // Table columns
  const ticketColumns = useMemo(
    () => [
      {
        key: "ticketNumber",
        label: "Turno",
        accessor: (ticket) => ticket.ticketNumber,
      },
      {
        key: "customer",
        label: "Cliente",
        accessor: (ticket) => ({
          fullName: ticket.customerId?.fullName || "N/A",
          documentNumber: ticket.customerId?.documentNumber || "",
        }),
      },
      {
        key: "module",
        label: "Módulo",
        accessor: (ticket) => ticket.moduleId?.name || "Sin asignar",
      },
      {
        key: "status",
        label: "Estado",
        accessor: (ticket) => ticket.status,
      },
      {
        key: "createdAt",
        label: "Creado",
        accessor: (ticket) => new Date(ticket.createdAt).toLocaleTimeString(),
      },
    ],
    []
  );

  // Table actions
  const ticketActions = useMemo(
    () => [
      // Edit customer action
      {
        icon: "mdi:pencil",
        tooltip: "Editar Cliente",
        color: "primary",
        permission: canEdit,
        onClick: (ticket) => handleEditCustomer(ticket),
      },
      // Call ticket action
      {
        icon: "mdi:phone",
        tooltip: "Llamar Turno",
        color: "primary",
        permission: canCall,
        visible: (ticket) => ticket?.status === "pending",
        onClick: (ticket) => callTicket(ticket._id),
      },
      // Start ticket action
      {
        icon: "mdi:play",
        tooltip: "Iniciar Turno",
        color: "success",
        permission: canCall,
        visible: (ticket) => ticket?.status === "pending",
        onClick: (ticket) => startTicket(ticket._id),
      },
      // Complete ticket action
      {
        icon: "mdi:check",
        tooltip: "Completar Turno",
        color: "success",
        permission: canCall,
        visible: (ticket) => ticket?.status === "in_progress",
        onClick: (ticket) => completeTicket(ticket._id),
      },
    ],
    [canEdit, canCall, callTicket, startTicket, completeTicket, handleEditCustomer]
  );

  return {
    ticketColumns,
    ticketActions,
    callTicket,
    startTicket,
    completeTicket,
  };
};

