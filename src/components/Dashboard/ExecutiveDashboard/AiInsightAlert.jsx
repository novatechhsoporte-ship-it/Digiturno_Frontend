import React from "react";
import { CustomIcon } from "@/components/common";

export const AiInsightAlert = ({ summary = {}, theme = "light" }) => {
  const total = summary.total || 0;
  const avgWaiting = summary.avgWaiting || 0;
  const slaRate = summary.slaRate || 100;

  const isWarning = avgWaiting > 15 || slaRate < 85;

  return (
    <div className={`ai-insight-card ai-insight-card--${theme}`}>
      <div className="ai-insight-card__left">
        <div className="ai-insight-card__icon-badge">
          <CustomIcon name="mdi:lightning-bolt" size="md" />
        </div>
        <div className="ai-insight-card__content">
          <div className="ai-insight-card__header-row">
            <h4 className="ai-insight-card__title">
              {isWarning
                ? "RECOMENDACIÓN EJECUTIVA DE CAPACIDAD (ALERTA DE SLA)"
                : "DIAGNÓSTICO OPERATIVO EN TIEMPO REAL"}
            </h4>
            <span className="ai-insight-card__tag">🤖 IA Generativa Digiturno</span>
          </div>
          <p className="ai-insight-card__text">
            {total === 0
              ? "Monitoreo en tiempo real activo. No se registran congestiones ni alertas de SLA en el filtro de fechas seleccionado."
              : isWarning
              ? `El tiempo promedio de espera actual es de ${avgWaiting} min (Cumplimiento SLA en ${slaRate}%). Se sugiere revisar la distribución de asesores para optimizar los tiempos en sala.`
              : `Operación estable. El cumplimiento global de SLA se encuentra en ${slaRate}% con un tiempo promedio de espera de ${avgWaiting} min.`}
          </p>
        </div>
      </div>
    </div>
  );
};
