import { CustomIcon } from "@/components/common";
import "./SummaryCards.scss";

export const SummaryCards = ({ today }) => {
  return (
    <section className="andon-summary">
      <div className="andon-card andon-card--primary">
        <div className="andon-card__icon">
          <CustomIcon name="mdi:ticket-confirmation" size="xl" />
        </div>
        <div className="andon-card__content">
          <h3 className="andon-card__value">{today.total}</h3>
          <p className="andon-card__label">Total del Día</p>
        </div>
      </div>

      <div className="andon-card andon-card--success">
        <div className="andon-card__icon">
          <CustomIcon name="mdi:check-all" size="xl" />
        </div>
        <div className="andon-card__content">
          <h3 className="andon-card__value">{today.completed}</h3>
          <p className="andon-card__label">Atendidos</p>
        </div>
      </div>

      <div className="andon-card andon-card--info">
        <div className="andon-card__icon">
          <CustomIcon name="mdi:account-clock" size="xl" />
        </div>
        <div className="andon-card__content">
          <h3 className="andon-card__value">{today.inProgress}</h3>
          <p className="andon-card__label">En Atención</p>
        </div>
      </div>

      <div className="andon-card andon-card--warning">
        <div className="andon-card__icon">
          <CustomIcon name="mdi:human-queue" size="xl" />
        </div>
        <div className="andon-card__content">
          <h3 className="andon-card__value">{today.pending}</h3>
          <p className="andon-card__label">Pendientes (Sala)</p>
        </div>
      </div>

      <div className="andon-card andon-card--danger">
        <div className="andon-card__icon">
          <CustomIcon name="mdi:account-off" size="xl" />
        </div>
        <div className="andon-card__content">
          <h3 className="andon-card__value">{today.abandoned}</h3>
          <p className="andon-card__label">No Presentados</p>
        </div>
      </div>
    </section>
  );
};
