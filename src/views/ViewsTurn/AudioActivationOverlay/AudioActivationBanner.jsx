import "./AudioActivationBanner.scss";

export const AudioActivationBanner = ({ onActivate }) => {
  return (
    <button className="audio-banner" onClick={onActivate}>
      🔊 Si no escucha audio, presione OK para activar sonido
    </button>
  );
};
