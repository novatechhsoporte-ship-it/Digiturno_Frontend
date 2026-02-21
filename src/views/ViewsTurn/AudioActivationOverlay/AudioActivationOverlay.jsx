import "./AudioActivationOverlay.scss";

export const AudioActivationOverlay = ({ onActivate }) => {
  return (
    <div className="audio-overlay">
      <div className="audio-overlay__card">
        <div className="audio-overlay__icon">🔊</div>
        <h2 className="audio-overlay__title">Activar sonido</h2>
        <p className="audio-overlay__text">Presione OK para habilitar el audio de los turnos</p>
        <button className="audio-overlay__button" onClick={onActivate}>
          Activar audio
        </button>
      </div>
    </div>
  );
};
