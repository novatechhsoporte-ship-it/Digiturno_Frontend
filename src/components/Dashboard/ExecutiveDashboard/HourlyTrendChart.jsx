import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CustomIcon } from "@/components/common";

/**
 * Custom Tooltip for Hovering on Hourly Franjas
 */
const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    const isDark = theme === "dark";
    return (
      <div className={`hourly-tooltip ${isDark ? "hourly-tooltip--dark" : "hourly-tooltip--light"}`}>
        <p className="hourly-tooltip__time">⏰ Franja Horaria: <strong>{label}</strong></p>
        <div className="hourly-tooltip__row">
          <span className="dot dot--tme" />
          <span>TME Espera (min):</span>
          <strong>{payload.find((p) => p.dataKey === "tmeEspera")?.value || 0} min</strong>
        </div>
        <div className="hourly-tooltip__row">
          <span className="dot dot--emitidos" />
          <span>Turnos Emitidos (Demanda):</span>
          <strong>{payload.find((p) => p.dataKey === "emitidos")?.value || 0}</strong>
        </div>
        <div className="hourly-tooltip__row">
          <span className="dot dot--atendidos" />
          <span>Turnos Atendidos (Capacidad):</span>
          <strong>{payload.find((p) => p.dataKey === "atendidos")?.value || 0}</strong>
        </div>
      </div>
    );
  }
  return null;
};

export const HourlyTrendChart = ({ data = [], theme = "light" }) => {
  const isDark = theme === "dark";
  const hasData = data && data.length > 0 && data.some((d) => d.emitidos > 0 || d.atendidos > 0 || d.tmeEspera > 0);

  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className={`executive-chart-card executive-chart-card--${theme}`}>
      <div className="executive-chart-card__header">
        <div>
          <h3 className="executive-chart-card__title">
            📈 Gráfico de Tendencia: Curva Horaria de Afluencia vs Tiempo de Espera
          </h3>
          <p className="executive-chart-card__subtitle">
            Relación directa entre demanda recibida, capacidad atendida y curva de tiempo de espera
          </p>
        </div>
        <span className="executive-chart-card__tag">Jornada Operativa</span>
      </div>

      <div className="executive-chart-card__body">
        {hasData ? (
          <ResponsiveContainer width="100%" height={290}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="hour" stroke={textColor} fontSize={12} tickLine={false} />

              <YAxis
                yAxisId="left"
                orientation="left"
                stroke={textColor}
                fontSize={11}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#ef4444"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                unit="m"
              />

              <Tooltip content={<CustomTooltip theme={theme} />} />
              <Legend
                verticalAlign="top"
                align="left"
                iconType="circle"
                wrapperStyle={{ paddingBottom: "12px", fontSize: "12px" }}
              />

              <Bar
                yAxisId="left"
                dataKey="emitidos"
                name="Emitidos (Demanda)"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />

              <Bar
                yAxisId="left"
                dataKey="atendidos"
                name="Atendidos (Capacidad)"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="tmeEspera"
                name="TME Espera Promedio (min)"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ef4444", stroke: "#ffffff", strokeWidth: 2 }}
                activeDot={{ r: 7 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty-state">
            <CustomIcon name="mdi:chart-timeline-variant-shimmer" size="xl" />
            <p>No se registran turnos en las franjas horarias del filtro seleccionado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
