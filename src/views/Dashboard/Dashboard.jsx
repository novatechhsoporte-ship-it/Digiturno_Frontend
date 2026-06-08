import React, { useState, useEffect } from "react";
import { useDashboard } from "@/hooks/Dashboard/useDashboard";
import { CustomIcon } from "@/components/common";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader/DashboardHeader";
import { SummaryCards } from "@/components/Dashboard/SummaryCards/SummaryCards";
import { ModuleTable } from "@/components/Dashboard/ModuleTable/ModuleTable";
import { DashboardReports } from "@/components/Dashboard/DashboardReports/DashboardReports";

import "./Dashboard.scss";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("live");
  const { stats, modules, isLoading, isError, refetch } = useDashboard();

  // Ticker forces a re-render each minute so running timers update visually in components
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTicker((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const today = stats?.today || {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    abandoned: 0,
  };

  const renderLiveContent = () => {
    if (isLoading) {
      return (
        <div className="andon-dashboard__loading">
          <div className="andon-dashboard__spinner" />
          <p>Cargando tablero informativo…</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="andon-dashboard__error">
          <CustomIcon name="mdi:alert-circle-outline" size="xl" />
          <p>No se pudo cargar la información del tablero.</p>
          <button className="andon-retry-btn" onClick={refetch}>
            <CustomIcon name="mdi:refresh" size="sm" /> Reintentar
          </button>
        </div>
      );
    }

    return (
      <>
        <SummaryCards today={today} />
        <ModuleTable modules={modules} />

        {/* Empty State IF no modules defined */}
        {modules.length === 0 && (
          <div className="andon-empty">
            <CustomIcon name="mdi:tray-alert" size="xl" />
            <p>No hay módulos configurados para visualización.</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="andon-dashboard">
      <DashboardHeader />

      {/* Tabs Navigation */}
      <div className="andon-tabs">
        <button className={`tab-btn ${activeTab === "live" ? "active" : ""}`} onClick={() => setActiveTab("live")}>
          <CustomIcon name="mdi:pulse" size="sm" />
          <span>Monitoreo en Vivo</span>
        </button>
        <button className={`tab-btn ${activeTab === "reports" ? "active" : ""}`} onClick={() => setActiveTab("reports")}>
          <CustomIcon name="mdi:chart-bar" size="sm" />
          <span>Reportes y Estadísticas</span>
        </button>
      </div>

      {activeTab === "live" ? renderLiveContent() : <DashboardReports />}
    </div>
  );
};
