import React from "react";
import { useTurnosPublicos } from "@hooks/";
import "./TurnosPublicos.scss";

export const TurnosPublicos = () => {
  const { currentShift, nextShifts, calledShifts } = useTurnosPublicos();

  const renderNextShift = (shift) => (
    <div key={shift.number} className="turnos-publicos__next-item">
      {shift.number}
    </div>
  );

  const renderCalledShift = (shift) => (
    <div key={`${shift.number}-${shift.module}`} className="turnos-publicos__called-item">
      <div className="turnos-publicos__called-number">{shift.number}</div>
      <div className="turnos-publicos__called-module">{shift.module}</div>
    </div>
  );

  return (
    <section className="turnos-publicos">
      <header className="turnos-publicos__header">
        <div className="turnos-publicos__current">
          <div className="turnos-publicos__eyebrow">Turno Actual</div>
          <div className="turnos-publicos__current-number">{currentShift.number}</div>
        </div>

        <div className="turnos-publicos__module">
          <div className="turnos-publicos__module-label">Módulo</div>
          <div className="turnos-publicos__module-value">{currentShift.module}</div>
        </div>
      </header>

      <div className="turnos-publicos__grid">
        <section className="turnos-publicos__panel">
          <div className="turnos-publicos__panel-title">Siguientes</div>
          <div className="turnos-publicos__next-grid">{nextShifts.map(renderNextShift)}</div>
        </section>

        <section className="turnos-publicos__panel">
          <div className="turnos-publicos__panel-title">Llamados</div>
          <div className="turnos-publicos__called-list">{calledShifts.map(renderCalledShift)}</div>
        </section>
      </div>
    </section>
  );
};