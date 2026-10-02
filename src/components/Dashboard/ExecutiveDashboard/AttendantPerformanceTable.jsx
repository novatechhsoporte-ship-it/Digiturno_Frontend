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
                <th>TURNOS ATENDIDOS</th>
                <th>PENDIENTES</th>
                <th>TMO (ATENCIÓN)</th>
                <th>CALIFICACIÓN CSAT (DATA BAR)</th>
                <th>SEMÁFORO SLA</th>
              </tr>
            </thead>
            <tbody>
              {attendants.map((row) => {
                const tmoNum = parseFloat(row.avgTmo) || 0;
                const slaPerc = row.slaPercent !== undefined ? row.slaPercent : 100;

                // Fallback CSAT calculation if missing or default
                let csatPercent = row.csatPercent !== undefined ? row.csatPercent : 100;
                let csatScore = row.csatScore !== undefined ? row.csatScore : 5.0;

                if (row.csatPercent === 100 && tmoNum > 15) {
                  if (tmoNum <= 15) {
                    csatPercent = 100;
                  } else if (tmoNum <= 25) {
                    const excess = tmoNum - 15;
                    csatPercent = Math.max(70, Math.round(100 - (excess / 10) * 30));
                  } else {
                    const excess25 = tmoNum - 25;
                    csatPercent = Math.max(10, Math.round(70 - Math.min(60, (excess25 / 30) * 50)));
                  }
                  if (slaPerc < 80 && csatPercent > slaPerc) {
                    csatPercent = Math.max(10, Math.round((csatPercent + slaPerc) / 2));
                  }
                  csatScore = parseFloat(((csatPercent / 100) * 5).toFixed(1));
                }

                // TMO Status Class
                let tmoClass = "tmo-value--success";
                if (tmoNum > 25 || slaPerc < 70) {
                  tmoClass = "tmo-value--danger";
                } else if (tmoNum > 15 || slaPerc < 90) {
                  tmoClass = "tmo-value--warning";
                }

                // CSAT Color Classes
                let barFillClass = "bar-fill--success";
                let starClass = "star-icon--success";
                if (csatPercent < 70) {
                  barFillClass = "bar-fill--danger";
                  starClass = "star-icon--danger";
                } else if (csatPercent < 90) {
                  barFillClass = "bar-fill--warning";
                  starClass = "star-icon--warning";
                }

                return (
                  <tr key={row.id || row.fullName}>
                    <td>
                      <div className="attendant-name-cell">
                        <strong className="name">{row.fullName}</strong>
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
                    <td className="turns-cell">
                      <strong style={{ color: row.pendingCount > 0 ? "#f59e0b" : "inherit" }}>
                        {row.pendingCount || 0}
                      </strong>
                    </td>
                    <td>
                      <span className={`tmo-value ${tmoClass}`}>
                        {row.avgTmo || "-"}
                      </span>
                    </td>
                    <td>
                      <div className="csat-databar-cell">
                        <span className="score">
                          {csatScore} <CustomIcon name="mdi:star" size="xs" className={`star-icon ${starClass}`} />
                        </span>
                        <div className="bar-track">
                          <div
                            className={`bar-fill ${barFillClass}`}
                            style={{ width: `${csatPercent}%` }}
                          />
                        </div>
                        <span className="perc">{csatPercent}%</span>
                      </div>
                    </td>
                    <td>{getSlaBadge(slaPerc)}</td>
                  </tr>
                );
              })}
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
