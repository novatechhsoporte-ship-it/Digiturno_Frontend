import { useAttendantTickets } from "@hooks/";
import { AttendantTicketsHeader, AttendantTicketsList, CurrentTicketCard } from "@components/tickets";
import { useTicketSocket } from "@hooks/Tickets/useTicketSocket";

import "./AttendantTickets.scss";

export const AttendantTickets = () => {
  const {
    // Data
    pendingTickets,
    currentTicket,
    loading,
    serviceTimer,

    // Actions
    handleCallNextTicket,
    handleAbandonTicket,
    handleCompleteTicket,

    // State
    canCallNext,
    isCallingNext,
    isAbandoning,
    isCompleting,

    // Refetch
    refetchPendingTickets,
    refetchCurrentTicket,
  } = useAttendantTickets();
  useTicketSocket();

  return (
    <section className="attendant-tickets">
      <AttendantTicketsHeader
        canCallNext={canCallNext}
        handleCallNextTicket={handleCallNextTicket}
        isCallingNext={isCallingNext}
        totalPending={pendingTickets}
      />

      <div className="attendant-tickets__right">
        <CurrentTicketCard
          currentTicket={currentTicket}
          serviceTimer={serviceTimer}
          onCompleteTicket={handleCompleteTicket}
          onAbandonTicket={handleAbandonTicket}
          isCompleting={isCompleting}
          isAbandoning={isAbandoning}
        />
      </div>

      <AttendantTicketsList pendingTickets={pendingTickets} loading={loading} onAbandonTicket={handleAbandonTicket} />
    </section>
  );
};

