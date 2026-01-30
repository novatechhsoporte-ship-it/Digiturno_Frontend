import "./ViewCurrentTurn.scss";

const capitalizeWords = (text = "") => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export const ViewCurrentTurn = ({ currentLogoSrc, currentTicket }) => {
  console.log("currentTicket :>> ", currentTicket);
  return (
    <section className="views-turn__right">
      <div className="views-turn__current-wrap">
        <img className="views-turn__current-logo" src={currentLogoSrc} alt="Logo" />

        {currentTicket ? (
          <div className="views-turn__current">
            <p className="views-turn__current-label">Turno Actual</p>
            <p className="views-turn__current-number">{capitalizeWords(currentTicket.ticketNumber)}</p>
            <p className="views-turn__current-module">{capitalizeWords(currentTicket.moduleId?.name ?? "Sin módulo")}</p>
            {currentTicket.moduleId?.description && (
              <p className="views-turn__current-description">{capitalizeWords(currentTicket.moduleId.description)}</p>
            )}
          </div>
        ) : (
          /* ESTADO VACÍO */
          <div className="views-turn__current views-turn__current--empty">
            <div className="views-turn__empty-content">
              <p className="views-turn__current-label">Estado del Servicio</p>
              <h2 className="views-turn__empty-title">¡Bienvenidos!</h2>
              <p className="views-turn__empty-text">
                Iniciaremos el llamado de turnos en breve. <br />
                Por favor, espere su turno.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
