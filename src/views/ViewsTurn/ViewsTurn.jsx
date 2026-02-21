import { useDisplayTickets } from "@hooks/Display/useDisplayTickets";
import { ViewCurrentTurn } from "@components/ViewTurns/ViewCurrentTurn/ViewCurrentTurn";
import { ViewItemCallTickets } from "@components/ViewTurns/ViewItemCallTickets";
import { AudioActivationBanner } from "./AudioActivationOverlay/AudioActivationBanner";
import { AudioActivationOverlay } from "./AudioActivationOverlay/AudioActivationOverlay";
import { useAudioActivation } from "@config/audio/useAudioActivation";
import "./ViewsTurn.scss";

const headerLogoSrc = `${import.meta.env.BASE_URL}brand/novatechhheader.svg`;
const currentLogoSrc = `${import.meta.env.BASE_URL}brand/Fusa.svg`;

export const ViewsTurn = () => {
  const { currentTicket, nextPendingTickets, isInitialLoading } = useDisplayTickets();
  const { isUnlocked, isChecking, unlockAudio } = useAudioActivation();

  if (isInitialLoading) {
    return (
      <div className="views-turn">
        <div className="views-turn__loading">
          <div className="views-turn__loading-spinner"></div>
          <p>Cargando turnos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isUnlocked && <AudioActivationOverlay onActivate={unlockAudio} />}

      <AudioActivationBanner onActivate={unlockAudio} />
      <section className="views-turn">
        <header className="views-turn__header">
          <img className="views-turn__header-logo views-turn__header-logo--left" src={headerLogoSrc} alt="Novatech" />
        </header>
        <div className="views-turn__grid">
          <section className="views-turn__left">
            <div className="views-turn__left-body">
              <ViewItemCallTickets title="Próximos Turnos" description="No hay turnos pendientes" tickets={nextPendingTickets} />
            </div>
          </section>

          <ViewCurrentTurn currentLogoSrc={currentLogoSrc} currentTicket={currentTicket} />
        </div>
      </section>
    </>
  );
};
