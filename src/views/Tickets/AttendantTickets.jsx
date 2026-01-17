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
    handleRecallTicket,

    // State
    canCallNext,
    isCallingNext,
    isAbandoning,
    isCompleting,
    isRecalling,

    // Modals
    showCompleteConfirm,
    showAbandonConfirm,
    setShowCompleteConfirm,
    setShowAbandonConfirm,
    confirmCompleteTicket,
    confirmAbandonTicket,
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
          onRecallTicket={handleRecallTicket}
          isCompleting={isCompleting}
          isAbandoning={isAbandoning}
          isRecalling={isRecalling}
          showCompleteConfirm={showCompleteConfirm}
          showAbandonConfirm={showAbandonConfirm}
          setShowCompleteConfirm={setShowCompleteConfirm}
          setShowAbandonConfirm={setShowAbandonConfirm}
          confirmCompleteTicket={confirmCompleteTicket}
          confirmAbandonTicket={confirmAbandonTicket}
        />
      </div>

      <AttendantTicketsList pendingTickets={pendingTickets} loading={loading} onAbandonTicket={handleAbandonTicket} />
    </section>
  );
};
