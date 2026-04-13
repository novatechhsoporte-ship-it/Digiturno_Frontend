import React, { useState, useEffect } from "react";
import "./Header.scss";

export const Header = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (date) => {
    const formatted = date.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  return (
    <header className="header">
      <div className="header__logo">
        <div className="logo-container">
          <img src="/brand/novatechhheader.svg" alt="NovaTech Logo" />
        </div>
      </div>

      <div className="header__center">PANEL DE ATENCIÓN</div>

      <div className="header__right">
        <div className="separator" />
        <div className="time-wrap">
          <span className="clock">{formatTime(time)}</span>
          <span className="date">{formatDate(time)}</span>
        </div>
      </div>
    </header>
  );
};
