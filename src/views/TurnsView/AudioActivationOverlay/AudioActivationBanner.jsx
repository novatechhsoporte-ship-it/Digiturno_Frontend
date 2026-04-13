import "./AudioActivationBanner.scss";

export const AudioActivationBanner = ({ onActivate }) => {
  return (
    <button className="audio-banner" onClick={onActivate}>
      🔊 If no audio, press OK to activate sound
    </button>
  );
};
