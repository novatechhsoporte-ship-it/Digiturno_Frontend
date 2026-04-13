import { CustomIcon } from "@components/common/CustomIcon/CustomIcon";
import "./UpcomingTurns.scss";

export const UpcomingTurns = ({ turns = [], newestId = null }) => {
  return (
    <section className="upcoming-turns">
      <header className="upcoming-turns__header">
        <CustomIcon name="mdi:menu" size="lg" className="icon" />
        <h2 className="title">SIGUIENTES EN ATENCIÓN</h2>
      </header>

      <div className="upcoming-turns__divider" />

      <div className="upcoming-turns__list">
        {turns.length > 0 ? (
          turns.map((turn, index) => (
            <div
              key={turn._id || turn.id}
              className={`upcoming-turns__card ${turn._id === newestId ? "upcoming-turns__card--newest" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="side-icon-container">
                <CustomIcon name="mdi:ticket-confirmation-outline" size="lg" className="icon" />
              </div>

              <div className="card-content">
                <div className="row">
                  <div className="ticket-id">
                    <span>{turn.ticketNumber.toUpperCase()} </span>
                  </div>
                  <span className="badge">EN ESPERA</span>
                </div>

                <div className="row-info">
                  <span className="turn-label">TURNO</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="upcoming-turns__empty">No hay turnos pendientes</div>
        )}
      </div>
    </section>
  );
};
