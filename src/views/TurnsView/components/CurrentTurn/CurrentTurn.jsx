import { CustomIcon } from "@components/common/CustomIcon/CustomIcon";
import "./CurrentTurn.scss";

export const CurrentTurn = ({ turn, isAnimating }) => {
  if (!turn) {
    return (
      <section className="current-turn">
        <div className="current-turn__card current-turn__card--empty">
          <div className="corner corner--tl" />
          <div className="corner corner--tr" />
          <div className="corner corner--bl" />
          <div className="corner corner--br" />

          <div className="current-turn__header">
            <span className="header-label">ESTADO DEL SERVICIO</span>
            <div className="header-line" />
          </div>

          <div className="empty-state">
            <i className="ri- Govt-line welcome-icon" />
            <h2 className="welcome-title">¡Bienvenidos!</h2>
            <p className="welcome-text">
              Iniciaremos el llamado de turnos en breve. <br />
              Por favor, espere su turno en la sala.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="current-turn">
      <div className="current-turn__card">
        {/* Bronze Corners */}
        <div className="corner corner--tl" />
        <div className="corner corner--tr" />
        <div className="corner corner--bl" />
        <div className="corner corner--br" />

        <div className="current-turn__header">
          <span className="header-label">TURNO ACTUAL</span>
          <div className="header-line" />
        </div>

        <div key={turn._id} className={`number ${isAnimating ? "number--animating" : "number--pulse"}`}>
          {turn.ticketNumber.toUpperCase()}
        </div>

        <div className="separator" />

        <div className="detail-row detail-row--service">
          <CustomIcon name="ic:round-folder-special" size="xl" className="icon" />

          <div className="info">
            <span className="label">SERVICIO</span>
            <span className="value">{turn.moduleId?.name || turn.moduleName || "General"}</span>
          </div>
        </div>

        <div className="detail-row detail-row--attendant">
          <CustomIcon name="ic:round-support-agent" size="xl" className="icon" />
          <div className="info">
            <span className="label">ASESOR</span>
            <span className="value">{turn.moduleId?.description || turn.description || "Asesor"}</span>
          </div>
        </div>

        <div className="module-badge module-badge--user">
          <div className="info">
            <span className="label">USUARIO</span>
            <span className="value">{turn.customerId?.fullName || turn.customerName || turn.fullName || "Cliente"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
