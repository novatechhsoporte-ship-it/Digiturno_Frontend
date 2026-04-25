import React from "react";
import "./DashboardHeader.scss";

export const DashboardHeader = () => {
  return (
    <header className="andon-dashboard-header">
      <div className="andon-dashboard-header__title-group">
        <h1 className="andon-dashboard-header__greeting">Centro de Gestión Operativa</h1>
        <p className="andon-dashboard-header__subtitle">Métricas de rendimiento y flujo de atención en sala</p>
      </div>
    </header>
  );
};
