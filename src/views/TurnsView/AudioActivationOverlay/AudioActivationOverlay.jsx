import "./AudioActivationOverlay.scss";

export const AudioActivationOverlay = ({ onActivate }) => {
  return (
    <div className="audio-activation-overlay">
      <div className="ambient-glow ambient-glow--1" />
      <div className="ambient-glow ambient-glow--2" />

      <div className="audio-activation-overlay__card">
        <div className="icon-wrapper">
          <i className="ri-volume-up-line main-icon" />
          <div className="icon-pulse" />
        </div>

        <h2 className="title">Activación de Audio Requerida</h2>

        <p className="description">
          Para escuchar el llamado de los turnos, por favor active el sistema de audio de su navegador.
        </p>

        <button className="activate-button" onClick={onActivate}>
          <span>Activar Audio</span>
          <i className="ri-arrow-right-line" />
        </button>

        <p className="footer-note">Haciendo clic acepta la reproducción de sonido en esta pestaña.</p>
      </div>
    </div>
  );
};
