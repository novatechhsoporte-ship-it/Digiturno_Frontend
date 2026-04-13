import React from "react";
import "./BottomBar.scss";

export const BottomBar = () => {
  return (
    <footer className="bottom-bar">
      <div className="bottom-bar__left">
        <i className="ri-volume-up-line icon" />
        <div className="audio-visual">
          <span />
          <span />
          <span />
        </div>
        <span className="text">Sistema de Audio Activo</span>
      </div>

      <div className="bottom-bar__center">Por favor espere a ser llamado por el sistema de turnos</div>

      <div className="bottom-bar__right">
        <div className="status-dot" />
        <span className="text">EN LÍNEA</span>
      </div>
    </footer>
  );
};
