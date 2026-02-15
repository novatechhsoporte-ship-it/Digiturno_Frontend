import { CustomTable } from "@components/common";
import "./TicketsTable.scss";

export const TicketsTable = ({ pendingTickets, loading, ticketColumns, ticketActions }) => {
  const columnsWithRender = ticketColumns.map((col) => {
    if (col.key === "customer") {
      return {
        ...col,
        render: (ticket) => {
          const value = col.accessor(ticket);
          return (
            <div className="customer-info">
              <span className="customer-info__name" title={value}>
                {value}
              </span>
            </div>
          );
        },
      };
    }

    if (col.key === "status") {
      return {
        ...col,
        render: (ticket) => {
          const value = col.accessor(ticket);
          return (
            <span className={`status-badge status-badge--${value}`}>
              {value === "pending" && "Pendiente"}
              {value === "in_progress" && "En Proceso"}
              {value === "completed" && "Completado"}
              {value === "abandoned" && "Abandonado"}
            </span>
          );
        },
      };
    }

    if (col.key === "ticketNumber") {
      return {
        ...col,
        render: (ticket) => {
          const value = col.accessor(ticket);
          return <span className="ticket-number">{value}</span>;
        },
      };
    }

    return {
      ...col,
      render: (ticket) => col.accessor(ticket),
    };
  });

  // if (!selectedTenant) {
  //   return (
  //     <div className="tickets-table">
  //       <h2 className="tickets-table__title">Últimos 10 Turnos Pendientes</h2>
  //       <div className="tickets-table__empty">
  //         {isSuperAdmin ? "Seleccione una notaría para ver los turnos" : "No hay notaría asignada"}
  //       </div>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div className="tickets-table">
        <h2 className="tickets-table__title">Últimos 10 Turnos Pendientes</h2>
        <div className="tickets-table__loading">Cargando turnos...</div>
      </div>
    );
  }

  if (pendingTickets.length === 0) {
    return (
      <div className="tickets-table">
        <h2 className="tickets-table__title">Últimos 10 Turnos Pendientes</h2>
        <div className="tickets-table__empty">No hay turnos pendientes</div>
      </div>
    );
  }

  return (
    <div className="tickets-table">
      <h2 className="tickets-table__title">Últimos 10 Turnos Pendientes</h2>
      <CustomTable columns={columnsWithRender} data={pendingTickets} actions={ticketActions} loading={loading} />
    </div>
  );
};
