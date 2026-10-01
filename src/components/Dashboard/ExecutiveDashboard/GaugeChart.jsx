import React from "react";

/**
 * Clean, non-overlapping semi-circular gauge chart in SVG
 */
export const GaugeChart = ({
  value = 0,
  target = 90,
  title = "Tacómetro",
  subtitle = "Índice de desempeño",
  color = "#0066ff",
  badgeText = "",
  theme = "light",
}) => {
  const clampValue = Math.min(Math.max(Number(value) || 0, 0), 100);
  const radius = 75;
  const strokeWidth = 14;
  const cx = 120;
  const cy = 95;
  const circumference = Math.PI * radius; // ~235.6
  const strokeDashoffset = circumference - (clampValue / 100) * circumference;

  const isDark = theme === "dark";

  return (
    <div className={`gauge-card gauge-card--${theme}`}>
      <div className="gauge-card__header">
        <div className="gauge-card__title-group">
          <span className="gauge-card__dot" style={{ backgroundColor: color }} />
          <h4 className="gauge-card__title">{title}</h4>
        </div>
        <span className="gauge-card__meta">Meta: {target}%</span>
      </div>

      <div className="gauge-card__body">
        <svg viewBox="0 0 240 135" className="gauge-card__svg">
          <defs>
            <linearGradient id={`gaugeGrad-${title.replace(/[^a-zA-Z0-9]/g, "")}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={isDark ? "#1e293b" : "#e2e8f0"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Filled Arc */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={`url(#gaugeGrad-${title.replace(/[^a-zA-Z0-9]/g, "")})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
          />

          {/* Value Text in Center */}
          <text x={cx} y={cy - 12} textAnchor="middle" className="gauge-card__value-text">
            {clampValue}%
          </text>

          {/* Sub badge text below value */}
          {badgeText && (
            <text x={cx} y={cy + 12} textAnchor="middle" className="gauge-card__badge-text" fill={color}>
              {badgeText}
            </text>
          )}

          {/* Base min/max labels below arc */}
          <text x={cx - radius + 10} y={cy + 24} textAnchor="start" className="gauge-card__minmax">
            0%
          </text>
          <text x={cx + radius - 10} y={cy + 24} textAnchor="end" className="gauge-card__minmax">
            100%
          </text>
        </svg>
      </div>

      <div className="gauge-card__footer">{subtitle}</div>
    </div>
  );
};
