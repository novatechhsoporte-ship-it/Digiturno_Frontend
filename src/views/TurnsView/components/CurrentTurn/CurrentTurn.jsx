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

        <div className="detail-row">
          <CustomIcon name="ic:round-folder-special" size="lg" className="icon" />

          <div className="info">
            <span className="label">SERVICIO</span>
            <span className="value">{turn.moduleId?.name}</span>
          </div>
        </div>

        <div className="detail-row">
          <CustomIcon name="ic:round-spatial-audio" size="lg" className="icon" />
          <div className="info">
            <span className="label">USUARIO</span>
            <span className="value">{turn.customerId?.fullName}</span>
          </div>
        </div>

        <div className="module-badge">
          <div className="info">
            <span className="value">{turn.moduleId?.description}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
