import React, { useState } from "react";
import { CustomIcon } from "@/components/common";
import { GaugeChart } from "./GaugeChart";
import { HourlyTrendChart } from "./HourlyTrendChart";
import { ServiceVolumeChart } from "./ServiceVolumeChart";
import { AttendantPerformanceTable } from "./AttendantPerformanceTable";
import { AiInsightAlert } from "./AiInsightAlert";
import "./ExecutiveDashboard.scss";

export const ExecutiveDashboard = ({
  summary = {},
  hourlyDistribution = [],
  byService = [],
  byAttendant = [],
  tenants = [],
  services = [],
  startDate = "",
  setStartDate = () => {},
  endDate = "",
  setEndDate = () => {},
  serviceTypeId = "",
  setServiceTypeId = () => {},
  attendantId = "",
  setAttendantId = () => {},
}) => {
  // DEFAULT TO LIGHT MODE AS REQUESTED BY USER
  const [theme, setTheme] = useState("light");
  const [selectedSede, setSelectedSede] = useState("");
  const [timeWindow, setTimeWindow] = useState("custom");

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleTimeWindowChange = (e) => {
    const val = e.target.value;
    setTimeWindow(val);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    if (val === "today") {
      setStartDate(todayStr);
      setEndDate(todayStr);
    } else if (val === "week") {
      const past = new Date();
      past.setDate(today.getDate() - 7);
      setStartDate(past.toISOString().split("T")[0]);
      setEndDate(todayStr);
    } else if (val === "month") {
      const past = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(past.toISOString().split("T")[0]);
      setEndDate(todayStr);
    } else if (val === "historical") {
      setStartDate("2024-01-01");
      setEndDate(todayStr);
    }
  };

  const resetFilters = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    setSelectedSede("");
    if (setServiceTypeId) setServiceTypeId("");
    if (setAttendantId) setAttendantId("");
    if (setStartDate) setStartDate(todayStr);
    if (setEndDate) setEndDate(todayStr);
    setTimeWindow("today");
  };

  // Strictly real data from summary prop
  const totalTurns = summary.total || 0;
  const tmeVal = summary.avgWaiting || 0;
  const tmoVal = summary.avgService || 0;
  const slaVal = summary.slaRate || 0;
  const csatVal = summary.csatPercent || 0;
  const csatScore = summary.csatScore || 0;
  const abandonmentRate = summary.abandonmentRate || 0;
  const completedTurns = summary.completed || 0;
  const occupationVal = totalTurns > 0 ? Math.min(Math.round((completedTurns / totalTurns) * 100), 100) : 0;

  return (
    <div className={`executive-dashboard executive-dashboard--${theme}`}>
      {/* ─── Top Control Bar: Segmenters + Date Pickers + Dark/Light Theme Switch ──────────── */}
      <div className="executive-toolbar">
        <div className="executive-toolbar__title-group">
          <span className="executive-toolbar__badge">Tablero Ejecutivo</span>
          <h2 className="executive-toolbar__title">SLAs & Desempeño Operativo</h2>
        </div>

        <div className="executive-toolbar__controls">
          {tenants.length > 0 && (
            <div className="segmenter-item">
              <span className="segmenter-label">SEDE:</span>
              <select
                value={selectedSede}
                onChange={(e) => setSelectedSede(e.target.value)}
                className="segmenter-select"
              >
                <option value="">Todas las Sedes (Consolidado)</option>
                {tenants.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="segmenter-item">
            <span className="segmenter-label">TRÁMITE:</span>
            <select
              value={serviceTypeId}
              onChange={(e) => setServiceTypeId(e.target.value)}
              className="segmenter-select"
            >
              <option value="">Todos los Servicios</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="segmenter-item">
            <span className="segmenter-label">RANGO:</span>
            <select value={timeWindow} onChange={handleTimeWindowChange} className="segmenter-select">
              <option value="today">Jornada Hoy (En Vivo)</option>
              <option value="week">Últimos 7 Días</option>
              <option value="month">Este Mes</option>
              <option value="historical">Todo el Histórico</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          {/* Date Pickers for Start Date and End Date */}
          <div className="segmenter-item segmenter-item--date">
            <span className="segmenter-label">DESDE:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setTimeWindow("custom");
                setStartDate(e.target.value);
              }}
              className="segmenter-date-input"
            />
          </div>

          <div className="segmenter-item segmenter-item--date">
            <span className="segmenter-label">HASTA:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setTimeWindow("custom");
                setEndDate(e.target.value);
              }}
              className="segmenter-date-input"
            />
          </div>

          <button onClick={resetFilters} className="executive-btn executive-btn--reset" title="Restablecer Filtros">
            <CustomIcon name="mdi:refresh" size="xs" /> Restablecer
          </button>

          <div className="global-efficiency-badge">
            <span className="pulse-dot" />
            <span>Eficiencia Global: {slaVal}%</span>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className={`theme-toggle-btn theme-toggle-btn--${theme}`}
            title="Cambiar Modo Claro / Oscuro"
          >
            <CustomIcon name={isDark ? "mdi:weather-sunny" : "mdi:weather-night"} size="sm" />
            <span>{isDark ? "Modo Claro" : "Modo Oscuro"}</span>
          </button>
        </div>
      </div>

      {/* ─── Top 6 KPI Metric Cards ─────────────────────────────────────────── */}
      <section className="executive-kpis-grid">
        <div className="kpi-card">
          <div className="kpi-card__header">
            <span className="kpi-card__label">TME (Espera)</span>
            <CustomIcon name="mdi:clock-outline" size="sm" className="kpi-card__icon" />
          </div>
          <div className="kpi-card__body">
            <span className="kpi-card__value">{tmeVal} <small>min</small></span>
          </div>
          <div className="kpi-card__footer">
            <span className="target">Meta: ≤15m</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__header">
            <span className="kpi-card__label">TMO (Atención)</span>
            <CustomIcon name="mdi:timer-sand" size="sm" className="kpi-card__icon" />
          </div>
          <div className="kpi-card__body">
            <span className="kpi-card__value">{tmoVal} <small>min</small></span>
          </div>
          <div className="kpi-card__footer">
            <span className="target">Target: 08.0m</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__header">
            <span className="kpi-card__label">Cumplimiento SLA</span>
            <CustomIcon name="mdi:shield-check-outline" size="sm" className="kpi-card__icon" />
          </div>
          <div className="kpi-card__body">
            <span className="kpi-card__value">{slaVal}%</span>
          </div>
          <div className="kpi-card__footer">
            <span className="target">Obj: 90%</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__header">
            <span className="kpi-card__label">CSAT Ciudadano</span>
            <CustomIcon name="mdi:star-face" size="sm" className="kpi-card__icon" />
          </div>
          <div className="kpi-card__body">
            <span className="kpi-card__value">
              {csatVal}% {csatScore > 0 && <small className="stars">{csatScore}★</small>}
            </span>
          </div>
          <div className="kpi-card__footer">
            <span className="target">Índice positivo</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__header">
            <span className="kpi-card__label">Turnos Atendidos</span>
            <CustomIcon name="mdi:ticket-confirmation-outline" size="sm" className="kpi-card__icon" />
          </div>
          <div className="kpi-card__body">
            <span className="kpi-card__value">{completedTurns}</span>
          </div>
          <div className="kpi-card__footer">
            <span className="target">De {totalTurns} emitidos</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card__header">
            <span className="kpi-card__label">Tasa de Abandono</span>
            <CustomIcon name="mdi:account-minus-outline" size="sm" className="kpi-card__icon" />
          </div>
          <div className="kpi-card__body">
            <span className="kpi-card__value">{abandonmentRate}%</span>
          </div>
          <div className="kpi-card__footer">
            <span className="target">Límite: &lt;5%</span>
          </div>
        </div>
      </section>

      {/* ─── 3 Tacómetros Grid (Semi-Donas / Gauges) ────────────────────────── */}
      <section className="gauges-grid">
        <GaugeChart
          value={csatVal}
          target={90}
          title="Tacómetro 1: Satisfacción CSAT"
          subtitle="Índice de recomendación en salas de espera"
          color="#06b6d4"
          badgeText={csatVal > 0 ? "Objetivo Cumplido" : "Sin Registro"}
          theme={theme}
        />
        <GaugeChart
          value={slaVal}
          target={85}
          title="Tacómetro 2: Cumplimiento de SLA"
          subtitle="Turnos atendidos en menos de 15 minutos"
          color="#2563eb"
          badgeText={slaVal >= 85 ? "Nivel Óptimo SLA" : totalTurns > 0 ? "En Seguimiento" : "Sin Datos"}
          theme={theme}
        />
        <GaugeChart
          value={occupationVal}
          target={80}
          title="Tacómetro 3: Ocupación de Asesores"
          subtitle="Tiempo efectivo de atención vs pausas"
          color="#a855f7"
          badgeText={occupationVal > 0 ? "Carga Operativa" : "Sin Actividad"}
          theme={theme}
        />
      </section>

      {/* ─── Middle Visualizations Grid (Hourly Combo Chart + Service Volume) ── */}
      <section className="middle-charts-grid">
        <HourlyTrendChart data={hourlyDistribution} theme={theme} />
        <ServiceVolumeChart data={byService} theme={theme} />
      </section>

      {/* ─── Matriz de Rendimiento de Funcionarios & Módulos ───────────────── */}
      <section className="matrix-section">
        <AttendantPerformanceTable attendants={byAttendant} theme={theme} />
      </section>

      {/* ─── AI Executive Recommendation Alert Banner ───────────────────────── */}
      <section className="ai-section">
        <AiInsightAlert summary={summary} theme={theme} />
      </section>
    </div>
  );
};
