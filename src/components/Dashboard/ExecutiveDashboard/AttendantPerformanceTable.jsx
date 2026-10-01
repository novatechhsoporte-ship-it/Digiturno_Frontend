import React from "react";
import { CustomIcon } from "@/components/common";

export const AttendantPerformanceTable = ({ attendants = [], theme = "light" }) => {
  const hasData = attendants && attendants.length > 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Atendiendo":
        return <span className="live-status live-status--atendiendo"><span className="dot" /> Atendiendo</span>;
      case "Libre":
        return <span className="live-status live-status--libre"><span className="dot" /> Libre</span>;
      case "Pausa":
        return <span className="live-status live-status--pausa"><span className="dot" /> Pausa</span>;
      default:
        return <span className="live-status live-status--libre"><span className="dot" /> {status || "Libre"}</span>;
    }
  };

  const getSlaBadge = (slaPercent) => {
    if (slaPercent >= 90) {
      return <span className="sla-badge sla-badge--success">🟢 {slaPercent}%+</span>;
    } else if (slaPercent >= 80) {
      return <span className="sla-badge sla-badge--warning">🟡 {slaPercent}%</span>;
    } else {
      return <span className="sla-badge sla-badge--danger">🔴 {slaPercent}% (Lento)</span>;
    }
  };

  return (
    <div className={`attendant-matrix-card attendant-matrix-card--${theme}`}>
      <div className="attendant-matrix-card__header">
        <div>
          <h3 className="attendant-matrix-card__title">
            📋 Matriz de Rendimiento de Funcionarios & Módulos
          </h3>
          <p className="attendant-matrix-card__subtitle">
            Rendimiento operativo por funcionario y módulo asignado
          </p>
        </div>
      </div>

      <div className="attendant-matrix-card__table-wrapper">
        {hasData ? (
          <table className="attendant-matrix-table">
            <thead>
              <tr>
                <th>FUNCIONARIO / ASESOR</th>
                <th>VENTANILLA & COLA</th>
                <th>ESTADO VIVO</th>
                <th>TURNOS</th>
                <th>TMO (ATENCIÓN)</th>
                <th>CALIFICACIÓN CSAT (DATA BAR)</th>
                <th>SEMÁFORO SLA</th>
              </tr>
            </thead>
            <tbody>
              {attendants.map((row) => (
                <tr key={row.id || row.fullName}>
                  <td>
                    <div className="attendant-name-cell">
                      <strong className="name">{row.fullName}</strong>
                      <span className="code">{row.roleCode || `ID: ${row.id}`}</span>
                    </div>
                  </td>
                  <td>
                    <div className="module-queue-cell">
                      <strong className="mod">{row.moduleName || "Sin Ventanilla"}</strong>
                    </div>
                  </td>
                  <td>{getStatusBadge(row.liveStatus)}</td>
                  <td className="turns-cell">
                    <strong>{row.turnsCount || 0}</strong>
                  </td>
                  <td>
                    <span className={`tmo-value ${row.slaPercent < 80 ? "tmo-value--danger" : ""}`}>
                      {row.avgTmo || "-"}
                    </span>
                  </td>
                  <td>
                    <div className="csat-databar-cell">
                      <span className="score">
                        {row.csatScore || 5.0} <CustomIcon name="mdi:star" size="xs" className="star-icon" />
                      </span>
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${
                            row.csatPercent < 85 ? "bar-fill--danger" : row.csatPercent < 90 ? "bar-fill--warning" : "bar-fill--success"
                          }`}
                          style={{ width: `${row.csatPercent || 100}%` }}
                        />
                      </div>
                      <span className="perc">{row.csatPercent || 100}%</span>
                    </div>
                  </td>
                  <td>{getSlaBadge(row.slaPercent || 100)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="table-empty-state">
            <CustomIcon name="mdi:account-search-outline" size="xl" />
            <p>No hay registro de actividad de funcionarios para el filtro actual.</p>
          </div>
        )}
      </div>
    </div>
  );
};
