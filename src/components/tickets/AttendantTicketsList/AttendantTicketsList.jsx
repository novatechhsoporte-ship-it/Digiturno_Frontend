import { useMemo } from "react";
import { CustomTable } from "@components/common";
import "./AttendantTicketsList.scss";

export const AttendantTicketsList = ({ pendingTickets, loading, onAbandonTicket }) => {
  const columns = useMemo(
    () => [
      {
        key: "ticketNumber",
        label: "Turno",
        render: (ticket) => <span className="attendant-tickets-list__ticket-number">{ticket.ticketNumber}</span>,
      },
      {
        key: "customer",
        label: "Cliente",
        render: (ticket) => (
          <div className="attendant-tickets-list__customer">
            <span className="attendant-tickets-list__customer-name">{ticket.customerId?.fullName || "N/A"}</span>
            <span className="attendant-tickets-list__customer-document">{ticket.customerId?.documentNumber || ""}</span>
          </div>
        ),
      },
      {
        key: "createdAt",
        label: "Creado",
        render: (ticket) => <span>{new Date(ticket.createdAt).toLocaleTimeString()}</span>,
      },
    ],
    []
  );

  return (
    <div className="attendant-tickets-list">
      {loading ? (
        <div className="attendant-tickets-list__loading">Cargando turnos...</div>
      ) : pendingTickets?.length === 0 ? (
        <div className="attendant-tickets-list__empty">No hay turnos pendientes</div>
      ) : (
        <CustomTable title="Últimos Turnos Pendientes" columns={columns} data={pendingTickets} loading={loading} />
      )}
    </div>
  );
};
