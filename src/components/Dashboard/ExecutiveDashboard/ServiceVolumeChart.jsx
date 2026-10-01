import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CustomIcon } from "@/components/common";

const COLORS = ["#2563eb", "#f97316", "#10b981", "#a855f7", "#ec4899", "#06b6d4"];

export const ServiceVolumeChart = ({ data = [], theme = "light" }) => {
  const isDark = theme === "dark";
  const hasData = data && data.length > 0 && data.some((d) => d.count > 0);

  const chartData = (data || []).map((d, idx) => ({
    ...d,
    color: COLORS[idx % COLORS.length],
  }));

  const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0";
  const textColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className={`executive-chart-card executive-chart-card--${theme}`}>
      <div className="executive-chart-card__header">
        <div>
          <h3 className="executive-chart-card__title">📊 Gráfico de Barras: Volumen & SLA por Servicio</h3>
          <p className="executive-chart-card__subtitle">Distribución del volumen de trámites demandados</p>
        </div>
        <span className="executive-chart-card__tag">Comparativa</span>
      </div>

      <div className="executive-chart-card__body">
        {hasData ? (
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={textColor} fontSize={12} tickLine={false} />
              <YAxis stroke={textColor} fontSize={11} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1e293b" : "#ffffff",
                  borderColor: isDark ? "#334155" : "#cbd5e1",
                  borderRadius: "8px",
                  color: isDark ? "#f8fafc" : "#0f172a",
                }}
              />
              <Bar dataKey="count" name="Turnos Solicitados" radius={[6, 6, 0, 0]} maxBarSize={55}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty-state">
            <CustomIcon name="mdi:chart-bar-off" size="xl" />
            <p>No hay volumen de trámites para el filtro seleccionado.</p>
          </div>
        )}
      </div>
    </div>
  );
};
