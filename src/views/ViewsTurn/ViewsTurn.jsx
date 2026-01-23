import React from "react";
import { useTurnosPublicos } from "@hooks/";
import "./ViewsTurn.scss";

export const ViewsTurn = () => {
  const { currentShift, nextShifts, calledShifts } = useTurnosPublicos();

  const activeShifts = nextShifts.slice(0, 3);
  const recentCalledShifts = calledShifts.slice(0, 3);

  const leftLogoSrc = `${import.meta.env.BASE_URL}brand/N14.svg`;
  const rightLogoSrc = `${import.meta.env.BASE_URL}brand/novatechh.svg`;

  return (
    <section className="views-turn">
      <header className="views-turn__header">
        <img className="views-turn__header-logo views-turn__header-logo--left" src={leftLogoSrc} alt="N14" />
        <img className="views-turn__header-logo views-turn__header-logo--right" src={rightLogoSrc} alt="Novatech" />
      </header>
      <div className="views-turn__grid">
        <section className="views-turn__left">
          <div className="views-turn__left-body">
            <div className="views-turn__panel">
              <div className="views-turn__panel-title">Turnos en curso</div>

              <div className="views-turn__list">
                {activeShifts.map((s) => (
                  <div key={s.number} className="views-turn__list-item">
                    <div className="views-turn__list-number">{s.number}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="views-turn__panel">
              <div className="views-turn__panel-title">Llamados</div>
              <div className="views-turn__called">
                {recentCalledShifts.map((s) => (
                  <div key={`${s.number}-${s.module}`} className="views-turn__called-item">
                    <div className="views-turn__called-number">{s.number}</div>
                    <div className="views-turn__called-module">{s.module}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="views-turn__right">
          <div className="views-turn__current">
            <div className="views-turn__current-label">Turno actual</div>
            <div className="views-turn__current-number">{currentShift.number}</div>
            <div className="views-turn__current-module">{currentShift.module}</div>
          </div>
        </section>
      </div>
    </section>
  );
};
