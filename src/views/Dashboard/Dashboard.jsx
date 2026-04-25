import React, { useState, useEffect } from "react";
import { useDashboard } from "@/hooks/Dashboard/useDashboard";
import { CustomIcon } from "@/components/common";
import { DashboardHeader } from "@/components/Dashboard/DashboardHeader/DashboardHeader";
import { SummaryCards } from "@/components/Dashboard/SummaryCards/SummaryCards";
import { ModuleTable } from "@/components/Dashboard/ModuleTable/ModuleTable";

import "./Dashboard.scss";

export const Dashboard = () => {
  const { stats, modules, isLoading, isError, refetch } = useDashboard();

  // Ticker forces a re-render each minute so running timers update visually in components
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTicker((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Loading State ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="andon-dashboard">
        <div className="andon-dashboard__loading">
          <div className="andon-dashboard__spinner" />
          <p>Cargando tablero informativo…</p>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="andon-dashboard">
        <div className="andon-dashboard__error">
          <CustomIcon name="mdi:alert-circle-outline" size="xl" />
          <p>No se pudo cargar la información del tablero.</p>
          <button className="andon-retry-btn" onClick={refetch}>
            <CustomIcon name="mdi:refresh" size="sm" /> Reintentar
          </button>
        </div>
      </div>
    );
  }

  // ── Data Prep ──────────────────────────────────────────────────────────────
  const today = stats?.today || {
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    abandoned: 0,
  };

  return (
    <div className="andon-dashboard">
      <DashboardHeader />

      <SummaryCards today={today} />

      <ModuleTable modules={modules} />

      {/* Empty State IF no modules defined */}
      {modules.length === 0 && (
        <div className="andon-empty">
          <CustomIcon name="mdi:tray-alert" size="xl" />
          <p>No hay módulos configurados para visualización.</p>
        </div>
      )}
    </div>
  );
};
