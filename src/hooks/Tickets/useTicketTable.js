import { useMemo } from "react";
import { useAbility } from "@hooks/";

/**
 * Hook for managing ticket table columns and actions
 */
export const useTicketTable = (handleEditCustomer) => {
  const { canAny } = useAbility();

  const canCall = canAny(["tickets.update_status", "tickets.manage"]);
  const canEdit = canAny(["tickets.edit", "tickets.manage"]);

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
        accessor: (ticket) => ticket.customerId?.fullName || "N/A",
      },
      {
        key: "documentNumber",
        label: "Documento de identidad",
        accessor: (ticket) => ticket.customerId?.documentNumber || "",
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
      {
        icon: "mdi:pencil",
        tooltip: "Editar Cliente",
        color: "primary",
        permission: canEdit,
        onClick: (ticket) => handleEditCustomer(ticket),
      },
    ],
    [canEdit, canCall, handleEditCustomer]
  );

  return {
    ticketColumns,
    ticketActions,
  };
};
