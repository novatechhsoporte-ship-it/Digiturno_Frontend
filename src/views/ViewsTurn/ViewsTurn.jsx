import React from "react";
import { useTurnosPublicos } from "@hooks/";
import "./ViewsTurn.scss";

export const ViewsTurn = () => {
  const { currentShift, nextShifts, calledShifts } = useTurnosPublicos();

  const activeShifts = nextShifts.slice(0, 3);
  const recentCalledShifts = calledShifts.slice(0, 3);

  const headerLogoSrc = `${import.meta.env.BASE_URL}brand/novatechhheader.svg`;
  const currentLogoSrc = `${import.meta.env.BASE_URL}brand/Fusa.svg`;

  return (
    <section className="views-turn">
      <header className="views-turn__header">
        <img className="views-turn__header-logo views-turn__header-logo--left" src={headerLogoSrc} alt="Novatech" />
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
                    <div className="views-turn__called-module">
                      {s.module}
                      {s.location ? ` · ${s.location}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="views-turn__right">
          <div className="views-turn__current-wrap">
            <img className="views-turn__current-logo" src={currentLogoSrc} alt="N14" />
            <div className="views-turn__current">
              <div className="views-turn__current-label">Turno actual</div>
              <div className="views-turn__current-number">{currentShift.number}</div>
              <div className="views-turn__current-module">{currentShift.module}</div>
              {currentShift.location ? <div className="views-turn__current-location">{currentShift.location}</div> : null}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
